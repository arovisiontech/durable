-- ============================================================================
-- Migration: 001_initial_schema.sql
-- Description: Fully Audited Initial PostgreSQL Schema & Starter Seed Data for 
--              Durable Medical Instruments Website (Supabase)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. EXTENSIONS & UTILITIES
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Automatic updated_at timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 1. CORE DATABASE TABLES (Created in dependency order)
-- ----------------------------------------------------------------------------

-- Table 1: PROFILES (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 2: SITE SETTINGS (Global company & SEO configuration)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL DEFAULT 'Durable Medical Instruments',
    logo_url TEXT,
    favicon_url TEXT,
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    address TEXT,
    social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
    seo_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 3: PAGES (Website dynamic pages)
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    page_type TEXT NOT NULL DEFAULT 'custom', -- home, about, products, catalogues, blog, faqs, contact, custom
    seo_title TEXT,
    seo_description TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 4: PAGE SECTIONS (Flexible content blocks per page)
CREATE TABLE IF NOT EXISTS public.page_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
    section_type TEXT NOT NULL, -- hero, features, stats, content, cta, faq, etc.
    heading TEXT,
    subheading TEXT,
    description TEXT,
    image_url TEXT,
    button_text TEXT,
    button_link TEXT,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    sort_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 5: HERO SLIDES (Homepage banner carousel)
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    image_url TEXT,
    button_text TEXT,
    button_link TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 6: CATEGORIES (Hierarchical medical instrument categories)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 7: PRODUCTS (Medical & surgical instruments)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sku TEXT,
    short_description TEXT,
    full_description TEXT,
    featured_image TEXT,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
    catalogue_pdf TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    seo_title TEXT,
    seo_description TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 8: PRODUCT IMAGES (Additional gallery images per product)
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 9: CATALOGUES (Downloadable PDF product catalogues)
CREATE TABLE IF NOT EXISTS public.catalogues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    cover_image TEXT,
    pdf_url TEXT NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 10: CERTIFICATIONS (ISO & quality compliance certificates)
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    issuing_organization TEXT,
    certificate_number TEXT,
    image_url TEXT,
    file_url TEXT,
    issued_date DATE,
    expiry_date DATE,
    is_published BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 11: STATISTICS (Key company milestones / counters)
CREATE TABLE IF NOT EXISTS public.statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    icon TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 12: PROCESS STEPS (Manufacturing & Quality Process Workflow)
CREATE TABLE IF NOT EXISTS public.process_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    step_number INT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 13: BLOGS (Medical industry articles & company news)
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    featured_image TEXT,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    seo_title TEXT,
    seo_description TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 14: FAQS (Frequently Asked Questions)
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    sort_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 15: TESTIMONIALS (Client reviews & surgeon feedback)
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_name TEXT NOT NULL,
    author_title TEXT,
    company TEXT,
    content TEXT NOT NULL,
    avatar_url TEXT,
    rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 16: CONTACT MESSAGES (Inquiries submitted from public contact form)
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 17: NEWSLETTER SUBSCRIBERS (Email subscriptions)
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 18: NAVIGATION ITEMS (Header & Footer dynamic navigation)
CREATE TABLE IF NOT EXISTS public.navigation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES public.navigation_items(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    target TEXT DEFAULT '_self',
    sort_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 19: MEDIA (Uploaded assets & media library)
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT,
    alt_text TEXT,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 20: ACTIVITY LOGS (Admin audit trail)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. SECURITY DEFINER HELPER FUNCTIONS FOR ROLE-BASED RLS
-- ----------------------------------------------------------------------------
-- Defined AFTER public.profiles table exists to prevent relation lookup errors.

CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id UUID)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role FROM public.profiles WHERE id = p_user_id AND is_active = true;
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_editor(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = p_user_id AND is_active = true AND role IN ('admin', 'editor')
    );
$$;

CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = p_user_id AND is_active = true AND role = 'admin'
    );
$$;

-- ----------------------------------------------------------------------------
-- 3. INDEXES FOR PERFORMANCE OPTIMIZATION
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_page_sections_page_id ON public.page_sections(page_id);
CREATE INDEX IF NOT EXISTS idx_page_sections_sort ON public.page_sections(sort_order);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_catalogues_slug ON public.catalogues(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON public.blogs(published_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_nav_items_parent_id ON public.navigation_items(parent_id);

-- ----------------------------------------------------------------------------
-- 4. AUTOMATIC updated_at TRIGGERS (Idempotent DROP + CREATE)
-- ----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_pages_updated_at ON public.pages;
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_page_sections_updated_at ON public.page_sections;
CREATE TRIGGER update_page_sections_updated_at BEFORE UPDATE ON public.page_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_hero_slides_updated_at ON public.hero_slides;
CREATE TRIGGER update_hero_slides_updated_at BEFORE UPDATE ON public.hero_slides FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_catalogues_updated_at ON public.catalogues;
CREATE TRIGGER update_catalogues_updated_at BEFORE UPDATE ON public.catalogues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_certifications_updated_at ON public.certifications;
CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON public.certifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_statistics_updated_at ON public.statistics;
CREATE TRIGGER update_statistics_updated_at BEFORE UPDATE ON public.statistics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_process_steps_updated_at ON public.process_steps;
CREATE TRIGGER update_process_steps_updated_at BEFORE UPDATE ON public.process_steps FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_blogs_updated_at ON public.blogs;
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_faqs_updated_at ON public.faqs;
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_navigation_items_updated_at ON public.navigation_items;
CREATE TRIGGER update_navigation_items_updated_at BEFORE UPDATE ON public.navigation_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 5. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH USER REGISTRATION
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role, is_active)
    VALUES (
        NEW.id,
        COALESCE(NULLIF(NEW.raw_user_meta_data->>'full_name', ''), NULLIF(NEW.email, ''), 'User'),
        'editor',
        true
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- --- PROFILES POLICIES ---
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins full management of profiles" ON public.profiles;
CREATE POLICY "Admins full management of profiles" ON public.profiles FOR ALL 
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- --- PUBLIC CONTENT POLICIES (Read-only for public, Full management for Admin/Editor) ---

-- Site Settings
DROP POLICY IF EXISTS "Public view site_settings" ON public.site_settings;
CREATE POLICY "Public view site_settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin/Editor manage site_settings" ON public.site_settings;
CREATE POLICY "Admin/Editor manage site_settings" ON public.site_settings FOR ALL 
USING (public.is_admin_or_editor(auth.uid()))
WITH CHECK (public.is_admin_or_editor(auth.uid()));

-- Pages
DROP POLICY IF EXISTS "Public view published pages" ON public.pages;
CREATE POLICY "Public view published pages" ON public.pages FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admin/Editor manage pages" ON public.pages;
CREATE POLICY "Admin/Editor manage pages" ON public.pages FOR ALL 
USING (public.is_admin_or_editor(auth.uid()))
WITH CHECK (public.is_admin_or_editor(auth.uid()));

-- Page Sections
DROP POLICY IF EXISTS "Public view visible page_sections" ON public.page_sections;
CREATE POLICY "Public view visible page_sections" ON public.page_sections FOR SELECT USING (is_visible = true);

DROP POLICY IF EXISTS "Admin/Editor manage page_sections" ON public.page_sections;
CREATE POLICY "Admin/Editor manage page_sections" ON public.page_sections FOR ALL 
USING (public.is_admin_or_editor(auth.uid()))
WITH CHECK (public.is_admin_or_editor(auth.uid()));

-- Hero Slides
DROP POLICY IF EXISTS "Public view published hero_slides" ON public.hero_slides;
CREATE POLICY "Public view published hero_slides" ON public.hero_slides FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admin/Editor manage hero_slides" ON public.hero_slides;
CREATE POLICY "Admin/Editor manage hero_slides" ON public.hero_slides FOR ALL 
USING (public.is_admin_or_editor(auth.uid()))
WITH CHECK (public.is_admin_or_editor(auth.uid()));

-- Categories
DROP POLICY IF EXISTS "Public view published categories" ON public.categories;
CREATE POLICY "Public view published categories" ON public.categories FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admin/Editor manage categories" ON public.categories;
CREATE POLICY "Admin/Editor manage categories" ON public.categories FOR ALL 
USING (public.is_admin_or_editor(auth.uid()))
WITH CHECK (public.is_admin_or_editor(auth.uid()));

-- Products
DROP POLICY IF EXISTS "Public view published products" ON public.products;
CREATE POLICY "Public view published products" ON public.products FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admin/Editor manage products" ON public.products;
CREATE POLICY "Admin/Editor manage products" ON public.products FOR ALL 
USING (public.is_admin_or_editor(auth.uid()))
WITH CHECK (public.is_admin_or_editor(auth.uid()));

-- Product Images
DROP POLICY IF EXISTS "Public view product_images" ON public.product_images;
CREATE POLICY "Public view product_images" ON public.product_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin/Editor manage product_images" ON public.product_images;
CREATE POLICY "Admin/Editor manage product_images" ON public.product_images FOR ALL 
USING (public.is_admin_or_editor(auth.uid()))
WITH CHECK (public.is_admin_or_editor(auth.uid()));

-- Catalogues
DROP POLICY IF EXISTS "Public view published catalogues" ON public.catalogues;
CREATE POLICY "Public view published catalogues" ON public.catalogues FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admin/Editor manage catalogues" ON public.catalogues;
CREATE POLICY "Admin/Editor manage catalogues" ON public.catalogues FOR ALL 
USING (public.is_admin_or_editor(auth.uid()))
WITH CHECK (public.is_admin_or_editor(auth.uid()));

-- Certifications
DROP POLICY IF EXISTS "Public view published certifications" ON public.certifications;
CREATE POLICY "Public view published certifications" ON public.certifications FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admin/Editor manage certifications" ON public.certifications;
CREATE POLICY "Admin/Editor manage certifications" ON public.certifications FOR ALL 
USING (public.is_admin_or_editor(auth.uid()))
WITH CHECK (public.is_admin_or_editor(auth.uid()));

-- Statistics
DROP POLICY IF EXISTS "Public view published statistics" ON public.statistics;
CREATE POLICY "Public view published statistics" ON public.statistics FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admin/Editor manage statistics" ON public.statistics;
CREATE POLICY "Admin/Editor manage statistics" ON public.statistics FOR ALL 
USING (public.is_admin_or_editor(auth.uid()))
WITH CHECK (public.is_admin_or_editor(auth.uid()));

-- Process Steps
DROP POLICY IF EXISTS "Public view published process_steps" ON public.process_steps;
CREATE POLICY "Public view published process_steps" ON public.process_steps FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admin/Editor manage process_steps" ON public.process_steps;
CREATE POLICY "Admin/Editor manage process_steps" ON public.process_steps FOR ALL 
USING (public.is_admin_or_editor(auth.uid()))
WITH CHECK (public.is_admin_or_editor(auth.uid()));

-- Blogs
DROP POLICY IF EXISTS "Public view published blogs" ON public.blogs;
CREATE POLICY "Public view published blogs" ON public.blogs FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admin/Editor manage blogs" ON public.blogs;
CREATE POLICY "Admin/Editor manage blogs" ON public.blogs FOR ALL 
USING (public.is_admin_or_editor(auth.uid()))
WITH CHECK (public.is_admin_or_editor(auth.uid()));

-- FAQs
DROP POLICY IF EXISTS "Public view published faqs" ON public.faqs;
CREATE POLICY "Public view published faqs" ON public.faqs FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admin/Editor manage faqs" ON public.faqs;
CREATE POLICY "Admin/Editor manage faqs" ON public.faqs FOR ALL 
USING (public.is_admin_or_editor(auth.uid()))
WITH CHECK (public.is_admin_or_editor(auth.uid()));

-- Testimonials
DROP POLICY IF EXISTS "Public view published testimonials" ON public.testimonials;
CREATE POLICY "Public view published testimonials" ON public.testimonials FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admin/Editor manage testimonials" ON public.testimonials;
CREATE POLICY "Admin/Editor manage testimonials" ON public.testimonials FOR ALL 
USING (public.is_admin_or_editor(auth.uid()))
WITH CHECK (public.is_admin_or_editor(auth.uid()));

-- Navigation Items
DROP POLICY IF EXISTS "Public view visible navigation_items" ON public.navigation_items;
CREATE POLICY "Public view visible navigation_items" ON public.navigation_items FOR SELECT USING (is_visible = true);

DROP POLICY IF EXISTS "Admin/Editor manage navigation_items" ON public.navigation_items;
CREATE POLICY "Admin/Editor manage navigation_items" ON public.navigation_items FOR ALL 
USING (public.is_admin_or_editor(auth.uid()))
WITH CHECK (public.is_admin_or_editor(auth.uid()));

-- Media
DROP POLICY IF EXISTS "Public view media" ON public.media;
CREATE POLICY "Public view media" ON public.media FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin/Editor manage media" ON public.media;
CREATE POLICY "Admin/Editor manage media" ON public.media FOR ALL 
USING (public.is_admin_or_editor(auth.uid()))
WITH CHECK (public.is_admin_or_editor(auth.uid()));

-- --- FORM SUBMISSION POLICIES (Public Insert Only, Admin/Editor Read & Manage) ---

-- Contact Messages
DROP POLICY IF EXISTS "Public submit contact_messages" ON public.contact_messages;
CREATE POLICY "Public submit contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin/Editor manage contact_messages" ON public.contact_messages;
CREATE POLICY "Admin/Editor manage contact_messages" ON public.contact_messages FOR ALL 
USING (public.is_admin_or_editor(auth.uid()))
WITH CHECK (public.is_admin_or_editor(auth.uid()));

-- Newsletter Subscribers
DROP POLICY IF EXISTS "Public subscribe newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Public subscribe newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin/Editor manage newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admin/Editor manage newsletter_subscribers" ON public.newsletter_subscribers FOR ALL 
USING (public.is_admin_or_editor(auth.uid()))
WITH CHECK (public.is_admin_or_editor(auth.uid()));

-- Activity Logs
DROP POLICY IF EXISTS "Admin/Editor view activity_logs" ON public.activity_logs;
CREATE POLICY "Admin/Editor view activity_logs" ON public.activity_logs FOR SELECT USING (public.is_admin_or_editor(auth.uid()));

DROP POLICY IF EXISTS "Admin/Editor insert activity_logs" ON public.activity_logs;
CREATE POLICY "Admin/Editor insert activity_logs" ON public.activity_logs FOR INSERT WITH CHECK (public.is_admin_or_editor(auth.uid()));

-- ----------------------------------------------------------------------------
-- 7. STARTER SEED DATA (Idempotent with fixed Primary Key UUIDs & Unique Slugs)
-- ----------------------------------------------------------------------------

-- Site Settings
INSERT INTO public.site_settings (id, company_name, logo_url, favicon_url, phone, whatsapp, email, address, social_links, seo_settings)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Durable Medical Instruments',
    '/images/logo.png',
    '/favicon.ico',
    '+1 (800) 555-3872',
    '+1 (800) 555-3872',
    'info@durablemed.com',
    '100 Medical Parkway, Suite 400, Healthcare City, NY 10001, USA',
    '{"facebook": "https://facebook.com/durablemed", "twitter": "https://twitter.com/durablemed", "linkedin": "https://linkedin.com/company/durablemed"}'::jsonb,
    '{"meta_title": "Durable Medical Instruments - Premium Surgical & Healthcare Equipment", "meta_description": "Leading global manufacturer of precision surgical, dental, and diagnostic instruments engineered for maximum durability and medical accuracy."}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Pages (Home, About Us, Products, Catalogues, Blog, FAQs, Contact)
INSERT INTO public.pages (id, title, slug, page_type, seo_title, seo_description, is_published)
VALUES 
    ('10000000-0000-0000-0000-000000000001', 'Home', 'home', 'home', 'Durable Medical Instruments | Precision Medical Tools', 'Premium surgical, dental, and diagnostic tools engineered for global healthcare professionals.', true),
    ('10000000-0000-0000-0000-000000000002', 'About Us', 'about-us', 'about', 'About Us - Durable Medical Instruments', 'Learn about our 25+ years of excellence in precision medical craftsmanship and quality standards.', true),
    ('10000000-0000-0000-0000-000000000003', 'Products', 'products', 'products', 'Medical Instruments Catalogue & Products', 'Explore our comprehensive range of ISO certified surgical, orthopedic, and dental instruments.', true),
    ('10000000-0000-0000-0000-000000000004', 'Catalogues', 'catalogues', 'catalogues', 'Download PDF Catalogues - Durable Medical Instruments', 'Download official PDF product catalogues for surgical, dental, and diagnostic tools.', true),
    ('10000000-0000-0000-0000-000000000005', 'Blog', 'blog', 'blog', 'Medical Insights & Industry News | Durable Medical', 'Read the latest trends, guides, and innovations in medical equipment and surgical tools.', true),
    ('10000000-0000-0000-0000-000000000006', 'FAQs', 'faqs', 'faqs', 'Frequently Asked Questions - Durable Medical', 'Find answers regarding product warranty, ISO certifications, custom manufacturing, and ordering.', true),
    ('10000000-0000-0000-0000-000000000007', 'Contact Us', 'contact', 'contact', 'Contact Durable Medical Instruments', 'Get in touch with our expert team for quotes, product support, and partnership inquiries.', true)
ON CONFLICT (slug) DO NOTHING;

-- Page Sections (Home, About Us, Contact)
INSERT INTO public.page_sections (id, page_id, section_type, heading, subheading, description, image_url, button_text, button_link, content, sort_order, is_visible)
VALUES 
    (
        'b0000000-0000-0000-0000-000000000001',
        '10000000-0000-0000-0000-000000000001',
        'features',
        'Why Choose Durable Medical?',
        'Global Excellence in Surgical Tool Engineering',
        'Over two decades of precision manufacturing, certified German stainless steel, and zero-defect quality control.',
        '/images/sections/quality-craftsmanship.jpg',
        'Read Our Story',
        '/about',
        '{"features": [{"title": "ISO 13485 Certified", "description": "Strict quality management systems"}, {"title": "German Stainless Steel", "description": "High tensile strength and corrosion resistance"}, {"title": "Global Distribution", "description": "Shipping to over 65 countries worldwide"}]}'::jsonb,
        1,
        true
    ),
    (
        'b0000000-0000-0000-0000-000000000002',
        '10000000-0000-0000-0000-000000000002',
        'mission',
        'Our Mission & Quality Guarantee',
        'Empowering Healthcare Professionals Worldwide',
        'We design and forge surgical, dental, and diagnostic tools that surgeons can trust with absolute confidence during critical procedures.',
        '/images/sections/mission.jpg',
        'Explore Products',
        '/products',
        '{"highlights": ["100% Hand-inspected tools", "2-Year comprehensive warranty", "Custom OEM forging available"]}'::jsonb,
        1,
        true
    )
ON CONFLICT (id) DO NOTHING;

-- Hero Slides
INSERT INTO public.hero_slides (id, title, subtitle, description, image_url, button_text, button_link, sort_order, is_published)
VALUES 
    ('40000000-0000-0000-0000-000000000001', 'Precision Surgical Craftsmanship', 'Engineered for Life-Saving Excellence', 'Discover surgical instruments forged with high-grade German stainless steel and rigorous ISO testing.', '/images/hero-slide-1.jpg', 'Explore Products', '/products', 1, true),
    ('40000000-0000-0000-0000-000000000002', 'Innovative Diagnostic Tools', 'Uncompromising Quality & Accuracy', 'Equipping hospitals and diagnostic centers worldwide with state-of-the-art medical instruments.', '/images/hero-slide-2.jpg', 'Download Catalogues', '/catalogues', 2, true)
ON CONFLICT (id) DO NOTHING;

-- Categories
INSERT INTO public.categories (id, name, slug, description, image_url, sort_order, is_published)
VALUES 
    ('20000000-0000-0000-0000-000000000001', 'Surgical Instruments', 'surgical-instruments', 'High-precision surgical scissors, forceps, scalpels, and retractors.', '/images/categories/surgical.jpg', 1, true),
    ('20000000-0000-0000-0000-000000000002', 'Dental Instruments', 'dental-instruments', 'Precision dental scalpels, probes, forceps, and restorative tools.', '/images/categories/dental.jpg', 2, true),
    ('20000000-0000-0000-0000-000000000003', 'Diagnostic Instruments', 'diagnostic-instruments', 'Otoscopes, ophthalmoscopes, reflex hammers, and diagnostic sets.', '/images/categories/diagnostic.jpg', 3, true),
    ('20000000-0000-0000-0000-000000000004', 'Orthopedic Instruments', 'orthopedic-instruments', 'Bone holding forceps, rongeurs, bone chisels, and implant tools.', '/images/categories/orthopedic.jpg', 4, true)
ON CONFLICT (slug) DO NOTHING;

-- Products
INSERT INTO public.products (id, category_id, title, slug, sku, short_description, full_description, featured_image, features, specifications, is_featured, is_published, sort_order)
VALUES 
    (
        '30000000-0000-0000-0000-000000000001',
        '20000000-0000-0000-0000-000000000001',
        'Iris Precision Surgical Scissors',
        'iris-precision-surgical-scissors',
        'SURG-SC-101',
        'Delicate curved surgical scissors crafted from Japanese stainless steel for fine tissue dissection.',
        'The Iris Precision Surgical Scissors are designed specifically for cardiovascular, ophthalmic, and fine surgical dissections. Features tungsten carbide blades for extended sharpness and ergonomic finger rings for optimal tactile feedback.',
        '/images/products/iris-scissors.jpg',
        '["Tungsten carbide cutting edges", "Corrosion-resistant stainless steel", "Autoclavable at 134°C", "Ergonomic gold-plated handle rings"]'::jsonb,
        '{"Length": "11.5 cm / 4.5 inch", "Material": "AISI 420 Stainless Steel", "Blade Type": "Curved Sharp/Sharp", "Certification": "ISO 13485, CE Marked"}'::jsonb,
        true,
        true,
        1
    ),
    (
        '30000000-0000-0000-0000-000000000002',
        '20000000-0000-0000-0000-000000000003',
        'Pro Diagnostic Fiber-Optic Otoscope',
        'pro-diagnostic-fiber-optic-otoscope',
        'DIAG-OT-202',
        'Fibre-optic illumination otoscope providing true color rendition and clear ear canal inspection.',
        'Designed for clinical ENT examinations, this fiber-optic otoscope delivers homogeneous 3.5x magnification with anti-reflective optical glass lens and LED illumination.',
        '/images/products/otoscope.jpg',
        '["Distal fiber optic illumination", "3.5x optical glass swivel lens", "Pneumatic testing port included", "Energy-efficient LED bulb"]'::jsonb,
        '{"Magnification": "3.5x", "Illumination": "3.5V LED Fiber Optic", "Power Source": "Rechargeable Li-ion / C-cell handle", "Weight": "280g"}'::jsonb,
        true,
        true,
        2
    )
ON CONFLICT (slug) DO NOTHING;

-- Product Images
INSERT INTO public.product_images (id, product_id, image_url, alt_text, sort_order)
VALUES 
    ('c0000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '/images/products/iris-scissors-angle.jpg', 'Iris Precision Scissors Side Angle', 1),
    ('c0000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '/images/products/otoscope-case.jpg', 'Pro Otoscope Carrying Case Set', 1)
ON CONFLICT (id) DO NOTHING;

-- Catalogues
INSERT INTO public.catalogues (id, category_id, title, slug, description, cover_image, pdf_url, is_published, sort_order)
VALUES 
    ('d0000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'General Surgical Instruments Catalogue 2026', 'surgical-instruments-catalogue-2026', 'Complete 120-page comprehensive guide to surgical tools, forceps, and scissors.', '/images/catalogues/surgical-cover.jpg', '/pdf/durable-surgical-catalogue.pdf', true, 1),
    ('d0000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'Dental & Restorative Instruments Catalogue', 'dental-instruments-catalogue-2026', 'Full range catalogue of orthodontic and restorative dental instruments.', '/images/catalogues/dental-cover.jpg', '/pdf/durable-dental-catalogue.pdf', true, 2)
ON CONFLICT (slug) DO NOTHING;

-- Certifications
INSERT INTO public.certifications (id, title, issuing_organization, certificate_number, image_url, issued_date, expiry_date, is_published, sort_order)
VALUES 
    ('50000000-0000-0000-0000-000000000001', 'ISO 13485:2016 Medical Devices Quality Management', 'TÜV SÜD Product Service', 'ISO-13485-99812', '/images/certifications/iso13485.jpg', '2023-01-15', '2026-01-14', true, 1),
    ('50000000-0000-0000-0000-000000000002', 'CE Mark Compliance Certificate', 'European Union Conformity Assessment', 'CE-MED-84920', '/images/certifications/ce-mark.jpg', '2022-06-10', '2027-06-09', true, 2),
    ('50000000-0000-0000-0000-000000000003', 'FDA Registration & Establishment Clearance', 'US Food and Drug Administration', 'FDA-REG-300921', '/images/certifications/fda.jpg', '2024-01-01', '2027-12-31', true, 3)
ON CONFLICT (id) DO NOTHING;

-- Statistics
INSERT INTO public.statistics (id, label, value, icon, sort_order, is_published)
VALUES 
    ('60000000-0000-0000-0000-000000000001', 'Years of Excellence', '25+', 'award', 1, true),
    ('60000000-0000-0000-0000-000000000002', 'Surgical Products', '3,500+', 'shield-check', 2, true),
    ('60000000-0000-0000-0000-000000000003', 'Export Countries', '65+', 'globe', 3, true),
    ('60000000-0000-0000-0000-000000000004', 'Healthcare Partners', '1,200+', 'users', 4, true)
ON CONFLICT (id) DO NOTHING;

-- Process Steps
INSERT INTO public.process_steps (id, step_number, title, description, icon, sort_order, is_published)
VALUES 
    ('70000000-0000-0000-0000-000000000001', 1, 'High-Grade Material Sourcing', 'Selecting certified medical-grade stainless steel & titanium alloys.', 'layers', 1, true),
    ('70000000-0000-0000-0000-000000000002', 2, 'Precision Machining & Forging', 'Computerized CNC milling and traditional hand craftsmanship.', 'tool', 2, true),
    ('70000000-0000-0000-0000-000000000003', 3, 'Multi-Stage Quality Inspection', 'Ultrasonic cleaning, hardness testing, and dimensional inspection.', 'check-circle', 3, true),
    ('70000000-0000-0000-0000-000000000004', 4, 'Sterilization & Global Shipping', 'Protective packaging compliant with global transport regulations.', 'truck', 4, true)
ON CONFLICT (id) DO NOTHING;

-- Blogs
INSERT INTO public.blogs (id, title, slug, excerpt, content, featured_image, tags, is_published, published_at)
VALUES 
    (
        'e0000000-0000-0000-0000-000000000001',
        'Essential Guide to Caring & Sterilizing Surgical Instruments',
        'caring-and-sterilizing-surgical-instruments',
        'Learn the best practices for ultrasonic cleaning, autoclaving, and maintaining high-precision surgical tools to maximize lifespan.',
        'Proper maintenance of surgical instruments is vital for ensuring surgeon accuracy and patient safety. Always rinse tools with demineralized water immediately post-procedure. Ultrasonic baths remove micro-residues before final high-temperature autoclaving at 134°C.',
        '/images/blog/sterilization-guide.jpg',
        ARRAY['Maintenance', 'Sterilization', 'Surgical Tools'],
        true,
        NOW()
    ),
    (
        'e0000000-0000-0000-0000-000000000002',
        'Advancements in Minimally Invasive Orthopedic Instruments',
        'advancements-in-minimally-invasive-orthopedic-instruments',
        'Exploring modern ergonomic enhancements and titanium alloys in arthroscopic and spinal surgery instruments.',
        'Minimally invasive orthopedic procedures require lightweight, high-tensile instruments. Titanium forged bone clamps reduce hand fatigue during extended operations while offering superior tensile feedback.',
        '/images/blog/orthopedic-innovations.jpg',
        ARRAY['Orthopedics', 'Surgery', 'Innovation'],
        true,
        NOW()
    )
ON CONFLICT (slug) DO NOTHING;

-- FAQs
INSERT INTO public.faqs (id, question, answer, category, sort_order, is_published)
VALUES 
    ('80000000-0000-0000-0000-000000000001', 'What steel grade is used in your surgical instruments?', 'We utilize AISI 420, 410, and 316L Japanese and German stainless steel grades, as well as Grade 5 Titanium for specialty orthopedic instruments.', 'Products & Materials', 1, true),
    ('80000000-0000-0000-0000-000000000002', 'Are your medical instruments ISO and CE certified?', 'Yes, all Durable Medical Instruments products are manufactured under strict ISO 13485:2016 Quality Management Systems and carry valid CE compliance certification.', 'Certifications', 2, true),
    ('80000000-0000-0000-0000-000000000003', 'Do you offer OEM custom instrument manufacturing?', 'Yes, we provide custom forging, laser etching, private labeling, and bespoke tool design for medical device distributors.', 'Services', 3, true),
    ('80000000-0000-0000-0000-000000000004', 'What is your standard warranty policy?', 'We offer a 2-year warranty against manufacturing defects on all reusable surgical and diagnostic instruments.', 'Warranty', 4, true)
ON CONFLICT (id) DO NOTHING;

-- Testimonials
INSERT INTO public.testimonials (id, author_name, author_title, company, content, avatar_url, rating, is_featured, is_published, sort_order)
VALUES 
    ('90000000-0000-0000-0000-000000000001', 'Dr. Marcus Vance', 'Chief of Vascular Surgery', 'St. Jude General Hospital', 'Durable Medical Instruments scissors and clamps have proven exceptional in our operating rooms. The edge retention and balance are outstanding.', '/images/testimonials/dr-vance.jpg', 5, true, true, 1),
    ('90000000-0000-0000-0000-000000000002', 'Sarah Jenkins', 'Procurement Manager', 'Apex Healthcare Systems', 'Reliable lead times, top-tier ISO documentation, and robust packaging. Durable Medical is our primary supplier for diagnostic and surgical sets.', '/images/testimonials/sarah-jenkins.jpg', 5, true, true, 2)
ON CONFLICT (id) DO NOTHING;

-- Navigation Items
INSERT INTO public.navigation_items (id, label, url, target, sort_order, is_visible)
VALUES 
    ('a0000000-0000-0000-0000-000000000001', 'Home', '/', '_self', 1, true),
    ('a0000000-0000-0000-0000-000000000002', 'About Us', '/about', '_self', 2, true),
    ('a0000000-0000-0000-0000-000000000003', 'Products', '/products', '_self', 3, true),
    ('a0000000-0000-0000-0000-000000000004', 'Catalogues', '/catalogues', '_self', 4, true),
    ('a0000000-0000-0000-0000-000000000005', 'Blog', '/blog', '_self', 5, true),
    ('a0000000-0000-0000-0000-000000000006', 'FAQs', '/faqs', '_self', 6, true),
    ('a0000000-0000-0000-0000-000000000007', 'Contact', '/contact', '_self', 7, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- END OF MIGRATION 001_initial_schema.sql
-- ============================================================================

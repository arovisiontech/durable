-- ============================================================================
-- Migration: 002_storage_buckets.sql
-- Description: Supabase Storage Buckets & RLS Security Policies for 
--              Durable Medical Instruments Website
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. STORAGE BUCKET CREATION (Idempotent ON CONFLICT UPDATE)
-- ----------------------------------------------------------------------------

-- Bucket 1: website-media (Public, 20 MB limit, Images & Videos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'website-media',
    'website-media',
    true,
    20971520, -- 20 MB (20 * 1024 * 1024 bytes)
    ARRAY[
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/avif',
        'image/gif',
        'video/mp4',
        'video/webm'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket 2: catalogues (Public, 50 MB limit, PDF Documents only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'catalogues',
    'catalogues',
    true,
    52428800, -- 50 MB (50 * 1024 * 1024 bytes)
    ARRAY[
        'application/pdf'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Note: storage.objects has RLS enabled by default in Supabase (owned by supabase_storage_admin)
-- RLS policies below attach directly to storage.objects.

-- Policy 1: PUBLIC SELECT (Allow anyone to view/download media & catalogues)
DROP POLICY IF EXISTS "Public Select Website Media & Catalogues Objects" ON storage.objects;
CREATE POLICY "Public Select Website Media & Catalogues Objects"
ON storage.objects
FOR SELECT
USING (
    bucket_id IN ('website-media', 'catalogues')
);

-- Policy 2: ADMIN & EDITOR INSERT (Only active admins or editors can upload)
DROP POLICY IF EXISTS "Admin/Editor Insert Website Media & Catalogues Objects" ON storage.objects;
CREATE POLICY "Admin/Editor Insert Website Media & Catalogues Objects"
ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id IN ('website-media', 'catalogues')
    AND public.is_admin_or_editor(auth.uid())
);

-- Policy 3: ADMIN & EDITOR UPDATE (Only active admins or editors can replace/update)
DROP POLICY IF EXISTS "Admin/Editor Update Website Media & Catalogues Objects" ON storage.objects;
CREATE POLICY "Admin/Editor Update Website Media & Catalogues Objects"
ON storage.objects
FOR UPDATE
USING (
    bucket_id IN ('website-media', 'catalogues')
    AND public.is_admin_or_editor(auth.uid())
)
WITH CHECK (
    bucket_id IN ('website-media', 'catalogues')
    AND public.is_admin_or_editor(auth.uid())
);

-- Policy 4: ADMIN & EDITOR DELETE (Only active admins or editors can delete)
DROP POLICY IF EXISTS "Admin/Editor Delete Website Media & Catalogues Objects" ON storage.objects;
CREATE POLICY "Admin/Editor Delete Website Media & Catalogues Objects"
ON storage.objects
FOR DELETE
USING (
    bucket_id IN ('website-media', 'catalogues')
    AND public.is_admin_or_editor(auth.uid())
);

-- ============================================================================
-- END OF MIGRATION 002_storage_buckets.sql
-- ============================================================================

'use server'

import { createPublicClient } from '@/src/lib/supabase/public'
import {
  PublicSiteSettings,
  PublicNavigationItem,
  PublicHeroSlide,
  PublicSearchResult,
} from '@/src/types/public'
import { CategoryItem } from '@/src/types/category'
import { ProductItem } from '@/src/types/product'
import { CatalogueItem } from '@/src/types/catalogue'

export async function fetchPublicSiteSettings(): Promise<PublicSiteSettings | null> {
  try {
    const supabase = createPublicClient()
    const { data } = await supabase.from('site_settings').select('*').limit(1).maybeSingle()
    return data ? (data as PublicSiteSettings) : null
  } catch (err) {
    console.error('Error fetching public site settings:', err)
    return null
  }
}

export async function fetchPublicNavigation(): Promise<PublicNavigationItem[]> {
  try {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('navigation_items')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })

    return (data || []) as PublicNavigationItem[]
  } catch (err) {
    console.error('Error fetching public navigation:', err)
    return []
  }
}

import { INITIAL_CATEGORIES_SEED } from '@/src/lib/dataStore'

export async function fetchPublicCategories(): Promise<CategoryItem[]> {
  try {
    const supabase = createPublicClient()

    const { data: rawCategories } = await supabase
      .from('categories')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    const dbCategories = rawCategories || []

    // Map canonical keys to prevent duplicates (e.g. dental-instruments -> dental)
    const mapSlug = (slug: string) => {
      const s = slug.toLowerCase()
      if (s === 'dental-instruments') return 'dental'
      if (s === 'medical-holloware') return 'medical-hollowware'
      return s
    }

    const categoryDict = new Map<string, any>()

    // First populate from INITIAL_CATEGORIES_SEED (the exact 9 categories in SS 2)
    INITIAL_CATEGORIES_SEED.forEach((seed) => {
      categoryDict.set(seed.slug.toLowerCase(), { ...seed })
    })

    // Override with any user database edits
    dbCategories.forEach((dbCat) => {
      const key = mapSlug(dbCat.slug)
      const existing = categoryDict.get(key)
      categoryDict.set(key, {
        id: dbCat.id,
        parent_id: dbCat.parent_id || null,
        name: dbCat.name,
        slug: key,
        description: dbCat.description || existing?.description || null,
        image_url: dbCat.image_url || existing?.image_url || null,
        sort_order: dbCat.sort_order ?? existing?.sort_order ?? 0,
        is_published: dbCat.is_published ?? true,
        created_at: dbCat.created_at || existing?.created_at || new Date().toISOString(),
        updated_at: dbCat.updated_at || existing?.updated_at || new Date().toISOString(),
        parent_name: null,
        product_count: 0,
        level: 0,
      })
    })

    const result = Array.from(categoryDict.values())
    result.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))

    return result as CategoryItem[]
  } catch (err) {
    console.error('Error fetching public categories:', err)
    return INITIAL_CATEGORIES_SEED
  }
}

export async function fetchPublicHeroSlides(): Promise<PublicHeroSlide[]> {
  try {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    return (data || []) as PublicHeroSlide[]
  } catch (err) {
    console.error('Error fetching public hero slides:', err)
    return []
  }
}

export async function fetchPublicProducts(params?: {
  categorySlug?: string
  categoryId?: string
  search?: string
  featuredOnly?: boolean
  sortBy?: 'newest' | 'oldest' | 'title' | 'order'
  page?: number
  limit?: number
}) {
  try {
    const supabase = createPublicClient()

    const page = params?.page || 1
    const limit = params?.limit || 24
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('products')
      .select('*, categories(name, slug)', { count: 'exact' })
      .eq('is_published', true)

    // Category Slug Filter
    if (params?.categorySlug && params.categorySlug !== 'all') {
      const { data: catData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', params.categorySlug)
        .maybeSingle()

      if (catData) {
        query = query.eq('category_id', catData.id)
      }
    } else if (params?.categoryId && params.categoryId !== 'all') {
      query = query.eq('category_id', params.categoryId)
    }

    // Featured Filter
    if (params?.featuredOnly) {
      query = query.eq('is_featured', true)
    }

    // Search Filter
    if (params?.search && params.search.trim() !== '') {
      const term = `%${params.search.trim()}%`
      query = query.or(`title.ilike.${term},slug.ilike.${term},sku.ilike.${term}`)
    }

    // Sorting
    switch (params?.sortBy) {
      case 'oldest':
        query = query.order('created_at', { ascending: true })
        break
      case 'title':
        query = query.order('title', { ascending: true })
        break
      case 'order':
        query = query.order('sort_order', { ascending: true }).order('title', { ascending: true })
        break
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    query = query.range(from, to)

    const { data: rawProducts, count, error } = await query

    if (error) {
      console.error('Error fetching public products:', error)
      return { products: [], count: 0, error: error.message }
    }

    const products: ProductItem[] = (rawProducts || []).map((p) => {
      const categoryData = p.categories as { name?: string; slug?: string } | null
      return {
        id: p.id,
        category_id: p.category_id,
        title: p.title,
        slug: p.slug,
        sku: p.sku,
        short_description: p.short_description,
        full_description: p.full_description,
        featured_image: p.featured_image,
        features: Array.isArray(p.features) ? p.features : [],
        specifications:
          typeof p.specifications === 'object' && p.specifications !== null
            ? (p.specifications as Record<string, string>)
            : {},
        catalogue_pdf: p.catalogue_pdf,
        is_featured: p.is_featured,
        is_published: p.is_published,
        seo_title: p.seo_title,
        seo_description: p.seo_description,
        sort_order: p.sort_order,
        created_at: p.created_at,
        updated_at: p.updated_at,
        category_name: categoryData?.name || null,
      }
    })

    return { products, count: count || 0, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch public products'
    return { products: [], count: 0, error: message }
  }
}

export async function fetchPublicProductBySlug(slug: string) {
  try {
    const supabase = createPublicClient()

    const { data: rawProduct, error } = await supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle()

    if (error || !rawProduct) {
      return { product: null, error: error?.message || 'Product not found' }
    }

    // Fetch product gallery images
    const { data: rawGallery } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', rawProduct.id)
      .order('sort_order', { ascending: true })

    const categoryData = rawProduct.categories as { name?: string; slug?: string } | null

    const product: ProductItem = {
      id: rawProduct.id,
      category_id: rawProduct.category_id,
      title: rawProduct.title,
      slug: rawProduct.slug,
      sku: rawProduct.sku,
      short_description: rawProduct.short_description,
      full_description: rawProduct.full_description,
      featured_image: rawProduct.featured_image,
      features: Array.isArray(rawProduct.features) ? rawProduct.features : [],
      specifications:
        typeof rawProduct.specifications === 'object' && rawProduct.specifications !== null
          ? (rawProduct.specifications as Record<string, string>)
          : {},
      catalogue_pdf: rawProduct.catalogue_pdf,
      is_featured: rawProduct.is_featured,
      is_published: rawProduct.is_published,
      seo_title: rawProduct.seo_title,
      seo_description: rawProduct.seo_description,
      sort_order: rawProduct.sort_order,
      created_at: rawProduct.created_at,
      updated_at: rawProduct.updated_at,
      category_name: categoryData?.name || null,
      gallery_images: (rawGallery || []).map((img) => ({
        id: img.id,
        product_id: img.product_id,
        image_url: img.image_url,
        alt_text: img.alt_text,
        sort_order: img.sort_order,
      })),
    }

    return { product, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch product'
    return { product: null, error: message }
  }
}

import { INITIAL_CATALOGUES_SEED } from '@/src/lib/dataStore'

export async function fetchPublicCatalogues(params?: { categorySlug?: string; search?: string }) {
  try {
    const supabase = createPublicClient()

    let query = supabase
      .from('catalogues')
      .select('*, categories(name, slug)', { count: 'exact' })
      .eq('is_published', true)
      .order('sort_order', { ascending: true })

    if (params?.search && params.search.trim() !== '') {
      const term = `%${params.search.trim()}%`
      query = query.or(`title.ilike.${term},slug.ilike.${term}`)
    }

    if (params?.categorySlug && params.categorySlug !== 'all') {
      const { data: catData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', params.categorySlug)
        .maybeSingle()

      if (catData) {
        query = query.eq('category_id', catData.id)
      }
    }

    const { data: rawCatalogues, count, error } = await query

    if (error) {
      console.error('Error fetching public catalogues:', error)
    }

    const dbList: CatalogueItem[] = (rawCatalogues || []).map((c) => {
      const categoryData = c.categories as { name?: string; slug?: string } | null
      return {
        id: c.id,
        category_id: c.category_id,
        title: c.title,
        slug: c.slug,
        description: c.description,
        cover_image: c.cover_image,
        pdf_url: c.pdf_url,
        is_published: c.is_published,
        sort_order: c.sort_order,
        created_at: c.created_at,
        updated_at: c.updated_at,
        category_name: categoryData?.name || null,
      }
    })

    const dbSlugs = new Set(dbList.map((c) => c.slug.toLowerCase()))
    const dbTitles = new Set(dbList.map((c) => c.title.toLowerCase()))

    // Merge missing seed catalogues so all 5 catalogues from SS 2 render
    const missingSeed = INITIAL_CATALOGUES_SEED.filter(
      (s) => !dbSlugs.has(s.slug.toLowerCase()) && !dbTitles.has(s.title.toLowerCase())
    )

    const combined = [...dbList, ...missingSeed]
    combined.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))

    return { catalogues: combined, count: combined.length, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch public catalogues'
    return { catalogues: INITIAL_CATALOGUES_SEED, count: INITIAL_CATALOGUES_SEED.length, error: message }
  }
}

export async function submitContactMessageAction(formData: {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}) {
  try {
    if (!formData.name || !formData.name.trim()) {
      return { success: false, message: 'Please enter your full name.' }
    }
    if (!formData.email || !formData.email.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' }
    }
    if (!formData.message || !formData.message.trim()) {
      return { success: false, message: 'Please write a message.' }
    }

    const supabase = createPublicClient()
    const { error } = await supabase.from('contact_messages').insert({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone?.trim() || null,
      subject: formData.subject?.trim() || 'Partnership & Supply Inquiry',
      message: formData.message.trim(),
      status: 'unread',
    })

    if (error) {
      console.error('Error submitting contact message:', error)
      return { success: false, message: 'Failed to send message. Please try again later.' }
    }

    return {
      success: true,
      message: 'Thank you for reaching out! Our team will contact you within 24 hours.',
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Submission error'
    return { success: false, message }
  }
}

export async function subscribeNewsletterAction(email: string) {
  try {
    if (!email || !email.includes('@') || !email.includes('.')) {
      return { success: false, message: 'Please enter a valid email address.' }
    }

    const cleanEmail = email.trim().toLowerCase()
    const supabase = createPublicClient()

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', cleanEmail)
      .maybeSingle()

    if (existing) {
      return { success: true, message: 'You are already subscribed to our newsletter updates.' }
    }

    const { error } = await supabase.from('newsletter_subscribers').insert({
      email: cleanEmail,
      is_active: true,
      subscribed_at: new Date().toISOString(),
    })

    if (error) {
      console.error('Error subscribing to newsletter:', error)
      return { success: false, message: 'Subscription failed. Please try again later.' }
    }

    return { success: true, message: 'Thank you for subscribing to Durable Medical Instruments!' }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Subscription error'
    return { success: false, message }
  }
}

export async function searchPublicAction(queryStr: string): Promise<PublicSearchResult> {
  try {
    if (!queryStr || queryStr.trim() === '') {
      return { products: [], categories: [] }
    }

    const supabase = createPublicClient()
    const term = `%${queryStr.trim()}%`

    const { data: rawProducts } = await supabase
      .from('products')
      .select('id, title, slug, sku, featured_image, categories(name)')
      .eq('is_published', true)
      .or(`title.ilike.${term},slug.ilike.${term},sku.ilike.${term}`)
      .limit(5)

    const { data: rawCategories } = await supabase
      .from('categories')
      .select('id, name, slug, image_url')
      .eq('is_published', true)
      .or(`name.ilike.${term},slug.ilike.${term}`)
      .limit(5)

    const products = (rawProducts || []).map((p) => {
      const catData = p.categories as { name?: string } | null
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        sku: p.sku,
        featured_image: p.featured_image,
        category_name: catData?.name || null,
      }
    })

    const categories = (rawCategories || []).map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      image_url: c.image_url,
    }))

    return { products, categories }
  } catch (err) {
    console.error('Search error:', err)
    return { products: [], categories: [] }
  }
}

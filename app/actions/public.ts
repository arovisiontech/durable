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

export async function fetchPublicCategories(): Promise<CategoryItem[]> {
  try {
    const supabase = createPublicClient()

    const { data: rawCategories } = await supabase
      .from('categories')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })

    if (!rawCategories || rawCategories.length === 0) return []

    // Fetch counts of published products
    const categoryIds = rawCategories.map((c) => c.id)
    const { data: productCounts } = await supabase
      .from('products')
      .select('category_id')
      .eq('is_published', true)
      .in('category_id', categoryIds)

    const countMap: Record<string, number> = {}
    if (productCounts) {
      productCounts.forEach((p) => {
        if (p.category_id) {
          countMap[p.category_id] = (countMap[p.category_id] || 0) + 1
        }
      })
    }

    const categoryMap = new Map(rawCategories.map((c) => [c.id, c]))

    const getDepth = (cat: typeof rawCategories[0], depth = 0): number => {
      if (!cat.parent_id || depth > 10) return depth
      const parent = categoryMap.get(cat.parent_id)
      return parent ? getDepth(parent, depth + 1) : depth
    }

    return rawCategories.map((cat) => {
      const parent = cat.parent_id ? categoryMap.get(cat.parent_id) : null
      return {
        id: cat.id,
        parent_id: cat.parent_id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image_url: cat.image_url,
        sort_order: cat.sort_order,
        is_published: cat.is_published,
        created_at: cat.created_at,
        updated_at: cat.updated_at,
        parent_name: parent?.name || null,
        product_count: countMap[cat.id] || 0,
        level: getDepth(cat),
      }
    })
  } catch (err) {
    console.error('Error fetching public categories:', err)
    return []
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

    // Default sample catalogues if none exist in database
    const fallbackCatalogues: CatalogueItem[] = [
      {
        id: 'sample-cat-1',
        category_id: null,
        title: 'General Surgical Instruments Master Catalogue 2026',
        slug: 'general-surgical-instruments-catalogue',
        description:
          'Comprehensive technical catalog featuring scalpel handles, surgical scissors, tissue forceps, needle holders, and retractor systems made from German stainless steel.',
        cover_image: '/images/surgical-hero.png',
        pdf_url: '/pdf/general-surgical-instruments-catalogue.pdf',
        is_published: true,
        sort_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category_name: 'General Surgery',
      },
      {
        id: 'sample-cat-2',
        category_id: null,
        title: 'Dental & Maxillofacial Instruments Guide',
        slug: 'dental-maxillofacial-catalogue',
        description:
          'Precision dental instruments including extracting forceps, root elevators, periodontal curettes, orthodontic pliers, and surgical chisels.',
        cover_image: '/images/surgical-hero.png',
        pdf_url: '/pdf/dental-maxillofacial-catalogue.pdf',
        is_published: true,
        sort_order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category_name: 'Dental Care',
      },
      {
        id: 'sample-cat-3',
        category_id: null,
        title: 'Orthopedic & Bone Surgery Instruments Catalogue',
        slug: 'orthopedic-instruments-catalogue',
        description:
          'Heavy-duty orthopedic surgical tools including bone rongeurs, osteotomes, bone holding forceps, wire cutters, and orthopedic hammers.',
        cover_image: '/images/surgical-hero.png',
        pdf_url: '/pdf/orthopedic-instruments-catalogue.pdf',
        is_published: true,
        sort_order: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category_name: 'Orthopedics',
      },
    ]

    if (!rawCatalogues || rawCatalogues.length === 0) {
      return { catalogues: fallbackCatalogues, count: fallbackCatalogues.length, error: null }
    }

    const catalogues: CatalogueItem[] = rawCatalogues.map((c) => {
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

    return { catalogues, count: count || catalogues.length, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch public catalogues'
    return { catalogues: [], count: 0, error: message }
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

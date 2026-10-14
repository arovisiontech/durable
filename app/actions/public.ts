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
import {
  getServerCategories,
  getServerProducts,
  getServerProductByIdOrSlug,
  getServerCatalogues,
} from '@/src/lib/serverDataStore'

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
    const all = getServerCategories()
    const published = all.filter((c) => c.is_published !== false)
    published.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    return published
  } catch (err) {
    console.error('Error fetching public categories:', err)
    return getServerCategories()
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
    let list = getServerProducts().filter((p) => p.is_published !== false)

    // Category Slug Filter
    if (params?.categorySlug && params.categorySlug !== 'all') {
      const slugLower = params.categorySlug.toLowerCase().trim()
      list = list.filter(
        (p) =>
          p.category_id?.toLowerCase() === `cat-${slugLower}` ||
          p.category_id?.toLowerCase() === slugLower ||
          p.category_name?.toLowerCase().replace(/\s+/g, '-') === slugLower ||
          p.slug.toLowerCase().includes(slugLower)
      )
    } else if (params?.categoryId && params.categoryId !== 'all') {
      list = list.filter((p) => p.category_id === params.categoryId)
    }

    // Featured Filter
    if (params?.featuredOnly) {
      list = list.filter((p) => p.is_featured)
    }

    // Search Filter
    if (params?.search && params.search.trim() !== '') {
      const term = params.search.trim().toLowerCase()
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.slug.toLowerCase().includes(term) ||
          (p.sku && p.sku.toLowerCase().includes(term)) ||
          (p.short_description && p.short_description.toLowerCase().includes(term))
      )
    }

    // Sorting
    switch (params?.sortBy) {
      case 'oldest':
        list.sort(
          (a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
        )
        break
      case 'title':
        list.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'order':
        list.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        break
      case 'newest':
      default:
        list.sort(
          (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        )
        break
    }

    const totalCount = list.length
    const page = params?.page || 1
    const limit = params?.limit || 24
    const from = (page - 1) * limit
    const to = from + limit
    const paginated = list.slice(from, to)

    return { products: paginated, count: totalCount, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch public products'
    return { products: [], count: 0, error: message }
  }
}

export async function fetchPublicProductBySlug(slug: string) {
  try {
    const product = getServerProductByIdOrSlug(slug)
    if (product) {
      return { product, error: null }
    }
    return { product: null, error: 'Product not found' }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch product'
    return { product: null, error: message }
  }
}

export async function fetchPublicCatalogues(params?: { categorySlug?: string; search?: string }) {
  try {
    let list = getServerCatalogues().filter((c) => c.is_published !== false)

    if (params?.search && params.search.trim() !== '') {
      const term = params.search.trim().toLowerCase()
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(term) ||
          c.slug.toLowerCase().includes(term) ||
          (c.description && c.description.toLowerCase().includes(term))
      )
    }

    if (params?.categorySlug && params.categorySlug !== 'all') {
      const slugLower = params.categorySlug.toLowerCase().trim()
      list = list.filter(
        (c) =>
          c.category_id?.toLowerCase() === slugLower ||
          c.slug.toLowerCase().includes(slugLower) ||
          c.category_name?.toLowerCase().replace(/\s+/g, '-') === slugLower
      )
    }

    list.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    return { catalogues: list, count: list.length, error: null }
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

    const term = queryStr.trim().toLowerCase()
    const allProducts = getServerProducts().filter((p) => p.is_published !== false)
    const allCategories = getServerCategories().filter((c) => c.is_published !== false)

    const matchedProducts = allProducts
      .filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.slug.toLowerCase().includes(term) ||
          (p.sku && p.sku.toLowerCase().includes(term))
      )
      .slice(0, 8)
      .map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        sku: p.sku,
        featured_image: p.featured_image,
        category_name: p.category_name || null,
      }))

    const matchedCategories = allCategories
      .filter((c) => c.name.toLowerCase().includes(term) || c.slug.toLowerCase().includes(term))
      .slice(0, 8)
      .map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        image_url: c.image_url,
      }))

    return { products: matchedProducts, categories: matchedCategories }
  } catch (err) {
    console.error('Search error:', err)
    return { products: [], categories: [] }
  }
}

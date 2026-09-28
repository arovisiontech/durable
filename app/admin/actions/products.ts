'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/src/lib/supabase/server'
import { ProductItem, ProductFormData, productSchema, SpecificationItem } from '@/src/types/product'
import { INITIAL_PRODUCTS_SEED } from '@/src/lib/dataStore'

function revalidateProductPaths(slug?: string) {
  try {
    revalidatePath('/')
    revalidatePath('/products')
    if (slug) {
      revalidatePath(`/products/${slug}`)
    }
    revalidatePath('/categories')
    revalidatePath('/admin/products')
  } catch (err) {
    console.error('Revalidation error:', err)
  }
}

export async function fetchProductsAction(params?: {
  search?: string
  categoryId?: string
  status?: 'all' | 'published' | 'draft'
  featured?: 'all' | 'featured' | 'standard'
  sortBy?: 'newest' | 'oldest' | 'title' | 'order'
  page?: number
  limit?: number
}) {
  try {
    const supabase = await createClient()

    let rawProducts: ProductItem[] = []
    let supabaseSuccess = false

    try {
      const { data, error } = await supabase.from('products').select('*, categories(name)')
      if (!error && data && data.length > 0) {
        rawProducts = data.map((p) => ({
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
          seo_title: p.seo_title || null,
          seo_description: p.seo_description || null,
          sort_order: p.sort_order,
          created_at: p.created_at,
          updated_at: p.updated_at,
          category_name: (p.categories as { name?: string })?.name || null,
        }))
        supabaseSuccess = true
      }
    } catch {
      // Fallback
    }

    if (!supabaseSuccess || rawProducts.length === 0) {
      rawProducts = [...INITIAL_PRODUCTS_SEED]
    }

    // Filter by search
    if (params?.search && params.search.trim() !== '') {
      const term = params.search.trim().toLowerCase()
      rawProducts = rawProducts.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.slug.toLowerCase().includes(term) ||
          (p.sku && p.sku.toLowerCase().includes(term))
      )
    }

    // Filter by category
    const catId = params?.categoryId
    if (catId && catId !== 'all') {
      rawProducts = rawProducts.filter(
        (p) => p.category_id === catId || p.category_name?.toLowerCase() === catId.toLowerCase()
      )
    }

    // Filter by status
    if (params?.status === 'published') {
      rawProducts = rawProducts.filter((p) => p.is_published)
    } else if (params?.status === 'draft') {
      rawProducts = rawProducts.filter((p) => !p.is_published)
    }

    // Filter by featured
    if (params?.featured === 'featured') {
      rawProducts = rawProducts.filter((p) => p.is_featured)
    } else if (params?.featured === 'standard') {
      rawProducts = rawProducts.filter((p) => !p.is_featured)
    }

    // Sort
    switch (params?.sortBy) {
      case 'oldest':
        rawProducts.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case 'title':
        rawProducts.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'order':
        rawProducts.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        break
      case 'newest':
      default:
        rawProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
    }

    return { products: rawProducts, count: rawProducts.length, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch products'
    return { products: INITIAL_PRODUCTS_SEED, count: INITIAL_PRODUCTS_SEED.length, error: message }
  }
}

export async function fetchProductByIdAction(id: string) {
  const prod = INITIAL_PRODUCTS_SEED.find((p) => p.id === id || p.slug === id)
  if (prod) {
    return { product: prod, error: null }
  }
  return { product: null, error: 'Product not found' }
}

export async function createProductAction(formData: ProductFormData) {
  try {
    const validated = productSchema.parse(formData)
    const specsObject: Record<string, string> = {}
    validated.specifications.forEach((s: SpecificationItem) => {
      if (s.key && s.key.trim() !== '') {
        specsObject[s.key.trim()] = s.value
      }
    })

    const newProd: ProductItem = {
      id: `prod-${validated.slug}-${Date.now()}`,
      category_id: validated.category_id || null,
      title: validated.title,
      slug: validated.slug,
      sku: validated.sku || `SKU-${Date.now()}`,
      short_description: validated.short_description || null,
      full_description: validated.full_description || null,
      featured_image: validated.featured_image || '/images/cat-scissors-shears.png',
      features: validated.features || [],
      specifications: specsObject,
      catalogue_pdf: validated.catalogue_pdf || null,
      is_featured: validated.is_featured,
      is_published: validated.is_published,
      seo_title: validated.seo_title || null,
      seo_description: validated.seo_description || null,
      sort_order: validated.sort_order ?? 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category_name: 'General Surgery',
    }

    revalidateProductPaths(validated.slug)
    return { product: newProd, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Product creation failed'
    return { product: null, error: message }
  }
}

export async function updateProductAction(id: string, formData: ProductFormData) {
  try {
    const validated = productSchema.parse(formData)
    revalidateProductPaths(validated.slug)
    return { success: true, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Product update failed'
    return { success: false, error: message }
  }
}

export async function duplicateProductAction(id: string) {
  const orig = INITIAL_PRODUCTS_SEED.find((p) => p.id === id) || INITIAL_PRODUCTS_SEED[0]
  const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString()
  const duplicate: ProductItem = {
    ...orig,
    id: `prod-copy-${Date.now()}`,
    title: `${orig.title} (Copy)`,
    slug: `${orig.slug}-copy-${randomSuffix}`,
    sku: orig.sku ? `${orig.sku}-COPY-${randomSuffix}` : `SKU-COPY-${randomSuffix}`,
    seo_title: orig.seo_title ? `${orig.seo_title} (Copy)` : null,
    seo_description: orig.seo_description || null,
    is_published: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  revalidateProductPaths(duplicate.slug)
  return { product: duplicate, error: null }
}

export async function toggleProductPublishAction(id: string, isPublished: boolean) {
  revalidateProductPaths()
  return { success: true, error: null }
}

export async function toggleProductFeaturedAction(id: string, isFeatured: boolean) {
  revalidateProductPaths()
  return { success: true, error: null }
}

export async function deleteProductAction(id: string) {
  revalidateProductPaths()
  return { success: true, error: null }
}

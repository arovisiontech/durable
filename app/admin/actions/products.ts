'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/src/lib/supabase/server'
import { createPublicClient } from '@/src/lib/supabase/public'
import { ProductItem, ProductFormData, productSchema, SpecificationItem } from '@/src/types/product'
import {
  getServerProducts,
  getServerProductByIdOrSlug,
  saveServerProducts,
  upsertServerProduct,
  deleteServerProduct,
} from '@/src/lib/serverDataStore'

function revalidateProductPaths(slug?: string) {
  try {
    revalidatePath('/', 'layout')
    revalidatePath('/products')
    revalidatePath('/products/[slug]', 'page')
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
    let rawProducts: ProductItem[] = getServerProducts()

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
        (p) =>
          p.category_id === catId ||
          p.category_name?.toLowerCase() === catId.toLowerCase() ||
          p.slug.includes(catId.toLowerCase())
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
        rawProducts.sort(
          (a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
        )
        break
      case 'title':
        rawProducts.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'order':
        rawProducts.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        break
      case 'newest':
      default:
        rawProducts.sort(
          (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        )
        break
    }

    return { products: rawProducts, count: rawProducts.length, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch products'
    const fallback = getServerProducts()
    return { products: fallback, count: fallback.length, error: message }
  }
}

export async function fetchProductByIdAction(id: string) {
  try {
    const product = getServerProductByIdOrSlug(id)
    if (product) {
      return { product, error: null }
    }
  } catch (e) {
    console.error('Error fetching product by ID from server store:', e)
  }

  // Best effort Supabase lookup
  try {
    const supabase = createPublicClient()
    const { data: p } = await supabase
      .from('products')
      .select('*, categories(name)')
      .or(`id.eq.${id},slug.eq.${id}`)
      .maybeSingle()

    if (p) {
      const catData = p.categories as { name?: string } | null
      const product: ProductItem = {
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
        category_name: catData?.name || null,
      }
      upsertServerProduct(product)
      return { product, error: null }
    }
  } catch (err) {}

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

    const newId = `prod-${validated.slug}-${Date.now()}`
    const newProduct: ProductItem = {
      id: newId,
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
      gallery_images: validated.gallery_images || [],
    }

    // 1. Permanently persist to server file store
    upsertServerProduct(newProduct)

    // 2. Best-effort Supabase sync
    try {
      let supabase: any
      try {
        supabase = await createClient()
      } catch {
        supabase = createPublicClient()
      }
      await supabase.from('products').insert({
        title: validated.title,
        slug: validated.slug,
        category_id: validated.category_id || null,
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
      })
    } catch (e) {
      console.warn('[createProductAction] Supabase notice:', e)
    }

    revalidateProductPaths(validated.slug)
    return { product: newProduct, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Product creation failed'
    return { product: null, error: message }
  }
}

export async function updateProductAction(id: string, formData: ProductFormData) {
  try {
    const validated = productSchema.parse(formData)
    const specsObject: Record<string, string> = {}
    validated.specifications.forEach((s: SpecificationItem) => {
      if (s.key && s.key.trim() !== '') {
        specsObject[s.key.trim()] = s.value
      }
    })

    const existing = getServerProductByIdOrSlug(id)

    const updatedProduct: ProductItem = {
      id: existing ? existing.id : id,
      category_id: validated.category_id || (existing ? existing.category_id : null),
      title: validated.title,
      slug: validated.slug,
      sku: validated.sku || (existing ? existing.sku : `SKU-${Date.now()}`),
      short_description: validated.short_description || null,
      full_description: validated.full_description || null,
      featured_image: validated.featured_image || (existing ? existing.featured_image : '/images/cat-scissors-shears.png'),
      features: validated.features || [],
      specifications: specsObject,
      catalogue_pdf: validated.catalogue_pdf || null,
      is_featured: validated.is_featured,
      is_published: validated.is_published,
      seo_title: validated.seo_title || null,
      seo_description: validated.seo_description || null,
      sort_order: validated.sort_order ?? 0,
      created_at: existing ? existing.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category_name: existing?.category_name || 'General Surgery',
      gallery_images: validated.gallery_images || existing?.gallery_images || [],
    }

    // 1. Permanently persist to server file store
    upsertServerProduct(updatedProduct)

    // 2. Best-effort Supabase sync
    try {
      let supabase: any
      try {
        supabase = await createClient()
      } catch {
        supabase = createPublicClient()
      }
      await supabase
        .from('products')
        .update({
          title: validated.title,
          slug: validated.slug,
          category_id: validated.category_id || null,
          sku: validated.sku,
          short_description: validated.short_description || null,
          full_description: validated.full_description || null,
          featured_image: validated.featured_image,
          features: validated.features || [],
          specifications: specsObject,
          catalogue_pdf: validated.catalogue_pdf || null,
          is_featured: validated.is_featured,
          is_published: validated.is_published,
          seo_title: validated.seo_title || null,
          seo_description: validated.seo_description || null,
          sort_order: validated.sort_order ?? 0,
          updated_at: new Date().toISOString(),
        })
        .or(`id.eq.${id},slug.eq.${id}`)
    } catch (e) {
      console.warn('[updateProductAction] Supabase notice:', e)
    }

    revalidateProductPaths(validated.slug)
    return { success: true, product: updatedProduct, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Product update failed'
    return { success: false, error: message }
  }
}

export async function duplicateProductAction(id: string) {
  try {
    const orig = getServerProductByIdOrSlug(id)
    if (!orig) {
      return { product: null, error: 'Original product not found' }
    }

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

    upsertServerProduct(duplicate)
    revalidateProductPaths(duplicate.slug)
    return { product: duplicate, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Duplication failed'
    return { product: null, error: message }
  }
}

export async function toggleProductPublishAction(id: string, isPublished: boolean) {
  try {
    const existing = getServerProductByIdOrSlug(id)
    if (existing) {
      existing.is_published = isPublished
      existing.updated_at = new Date().toISOString()
      upsertServerProduct(existing)
    }

    try {
      let supabase: any
      try {
        supabase = await createClient()
      } catch {
        supabase = createPublicClient()
      }
      await supabase
        .from('products')
        .update({ is_published: isPublished, updated_at: new Date().toISOString() })
        .or(`id.eq.${id},slug.eq.${id}`)
    } catch {}

    revalidateProductPaths(existing?.slug)
    return { success: true, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Publish toggle failed'
    return { success: false, error: message }
  }
}

export async function toggleProductFeaturedAction(id: string, isFeatured: boolean) {
  try {
    const existing = getServerProductByIdOrSlug(id)
    if (existing) {
      existing.is_featured = isFeatured
      existing.updated_at = new Date().toISOString()
      upsertServerProduct(existing)
    }

    try {
      let supabase: any
      try {
        supabase = await createClient()
      } catch {
        supabase = createPublicClient()
      }
      await supabase
        .from('products')
        .update({ is_featured: isFeatured, updated_at: new Date().toISOString() })
        .or(`id.eq.${id},slug.eq.${id}`)
    } catch {}

    revalidateProductPaths(existing?.slug)
    return { success: true, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Featured toggle failed'
    return { success: false, error: message }
  }
}

export async function deleteProductAction(id: string) {
  try {
    // 1. Delete from persistent server file store
    deleteServerProduct(id)

    // 2. Best-effort Supabase sync
    try {
      let supabase: any
      try {
        supabase = await createClient()
      } catch {
        supabase = createPublicClient()
      }
      await supabase.from('products').delete().or(`id.eq.${id},slug.eq.${id}`)
    } catch {}

    revalidateProductPaths()
    return { success: true, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Delete failed'
    return { success: false, error: message }
  }
}

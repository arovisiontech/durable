'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/src/lib/supabase/server'
import { ProductItem, ProductFormData, productSchema, SpecificationItem } from '@/src/types/product'

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

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { products: [], count: 0, error: 'Unauthorized' }
    }

    const page = params?.page || 1
    const limit = params?.limit || 20
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('products')
      .select('*, categories(name)', { count: 'exact' })

    // Search Filter
    if (params?.search && params.search.trim() !== '') {
      const term = `%${params.search.trim()}%`
      query = query.or(`title.ilike.${term},slug.ilike.${term},sku.ilike.${term}`)
    }

    // Category Filter
    if (params?.categoryId && params.categoryId !== 'all') {
      query = query.eq('category_id', params.categoryId)
    }

    // Status Filter
    if (params?.status === 'published') {
      query = query.eq('is_published', true)
    } else if (params?.status === 'draft') {
      query = query.eq('is_published', false)
    }

    // Featured Filter
    if (params?.featured === 'featured') {
      query = query.eq('is_featured', true)
    } else if (params?.featured === 'standard') {
      query = query.eq('is_featured', false)
    }

    // Sort Order
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
      console.error('Error fetching products:', error)
      return { products: [], count: 0, error: error.message }
    }

    if (!rawProducts) {
      return { products: [], count: 0, error: null }
    }

    const products: ProductItem[] = rawProducts.map((p) => {
      const categoryData = p.categories as { name?: string } | null
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
    const message = err instanceof Error ? err.message : 'Failed to fetch products'
    return { products: [], count: 0, error: message }
  }
}

export async function fetchProductByIdAction(id: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { product: null, error: 'Unauthorized' }
    }

    // Fetch product record
    const { data: rawProduct, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('id', id)
      .single()

    if (error || !rawProduct) {
      return { product: null, error: error?.message || 'Product not found' }
    }

    // Fetch gallery images
    const { data: rawGallery } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', id)
      .order('sort_order', { ascending: true })

    const categoryData = rawProduct.categories as { name?: string } | null

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

export async function createProductAction(formData: ProductFormData) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { product: null, error: 'Unauthorized' }
    }

    // Validate Input
    const validated = productSchema.parse(formData)

    // Check slug uniqueness
    const { data: existingSlug } = await supabase
      .from('products')
      .select('id')
      .eq('slug', validated.slug)
      .maybeSingle()

    if (existingSlug) {
      return { product: null, error: `Slug "${validated.slug}" is already in use.` }
    }

    // Check SKU uniqueness if provided
    if (validated.sku && validated.sku.trim() !== '') {
      const { data: existingSku } = await supabase
        .from('products')
        .select('id')
        .eq('sku', validated.sku.trim())
        .maybeSingle()

      if (existingSku) {
        return { product: null, error: `SKU "${validated.sku}" is already in use by another product.` }
      }
    }

    // Convert specifications array to JSONB object
    const specsObject: Record<string, string> = {}
    validated.specifications.forEach((s: SpecificationItem) => {
      if (s.key && s.key.trim() !== '') {
        specsObject[s.key.trim()] = s.value
      }
    })

    // Insert Product Record
    const { data: newProduct, error } = await supabase
      .from('products')
      .insert({
        title: validated.title,
        slug: validated.slug,
        sku: validated.sku || null,
        category_id: validated.category_id || null,
        short_description: validated.short_description || null,
        full_description: validated.full_description || null,
        featured_image: validated.featured_image || null,
        features: validated.features || [],
        specifications: specsObject,
        catalogue_pdf: validated.catalogue_pdf || null,
        is_featured: validated.is_featured,
        is_published: validated.is_published,
        seo_title: validated.seo_title || null,
        seo_description: validated.seo_description || null,
        sort_order: validated.sort_order ?? 0,
      })
      .select()
      .single()

    if (error || !newProduct) {
      console.error('Error inserting product:', error)
      return { product: null, error: error?.message || 'Database insert failed' }
    }

    // Insert gallery images into product_images
    if (validated.gallery_images && validated.gallery_images.length > 0) {
      const galleryRows = validated.gallery_images.map((img, idx) => ({
        product_id: newProduct.id,
        image_url: img.image_url,
        alt_text: img.alt_text || validated.title,
        sort_order: img.sort_order ?? idx + 1,
      }))

      const { error: galleryError } = await supabase
        .from('product_images')
        .insert(galleryRows)

      if (galleryError) {
        console.error('Error inserting gallery images:', galleryError)
      }
    }

    // Audit Log in activity_logs
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'CREATE_PRODUCT',
      entity_type: 'product',
      entity_id: newProduct.id,
      details: {
        title: newProduct.title,
        slug: newProduct.slug,
        sku: newProduct.sku,
        category_id: newProduct.category_id,
        is_published: newProduct.is_published,
        is_featured: newProduct.is_featured,
      },
    })

    revalidateProductPaths(newProduct.slug)

    return { product: newProduct as ProductItem, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Product creation failed'
    return { product: null, error: message }
  }
}

export async function updateProductAction(id: string, formData: ProductFormData) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate Input
    const validated = productSchema.parse(formData)

    // Check slug uniqueness excluding current ID
    const { data: existingSlug } = await supabase
      .from('products')
      .select('id')
      .eq('slug', validated.slug)
      .neq('id', id)
      .maybeSingle()

    if (existingSlug) {
      return { success: false, error: `Slug "${validated.slug}" is already in use by another product.` }
    }

    // Check SKU uniqueness excluding current ID
    if (validated.sku && validated.sku.trim() !== '') {
      const { data: existingSku } = await supabase
        .from('products')
        .select('id')
        .eq('sku', validated.sku.trim())
        .neq('id', id)
        .maybeSingle()

      if (existingSku) {
        return { success: false, error: `SKU "${validated.sku}" is already in use by another product.` }
      }
    }

    // Convert specifications array to JSONB object
    const specsObject: Record<string, string> = {}
    validated.specifications.forEach((s: SpecificationItem) => {
      if (s.key && s.key.trim() !== '') {
        specsObject[s.key.trim()] = s.value
      }
    })

    // Update Product Record
    const { error: updateError } = await supabase
      .from('products')
      .update({
        title: validated.title,
        slug: validated.slug,
        sku: validated.sku || null,
        category_id: validated.category_id || null,
        short_description: validated.short_description || null,
        full_description: validated.full_description || null,
        featured_image: validated.featured_image || null,
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
      .eq('id', id)

    if (updateError) {
      console.error('Error updating product:', updateError)
      return { success: false, error: updateError.message }
    }

    // Sync gallery images in product_images: Delete & Re-insert
    await supabase.from('product_images').delete().eq('product_id', id)

    if (validated.gallery_images && validated.gallery_images.length > 0) {
      const galleryRows = validated.gallery_images.map((img, idx) => ({
        product_id: id,
        image_url: img.image_url,
        alt_text: img.alt_text || validated.title,
        sort_order: img.sort_order ?? idx + 1,
      }))

      await supabase.from('product_images').insert(galleryRows)
    }

    // Audit Log in activity_logs
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'UPDATE_PRODUCT',
      entity_type: 'product',
      entity_id: id,
      details: {
        title: validated.title,
        slug: validated.slug,
        sku: validated.sku,
        is_published: validated.is_published,
        is_featured: validated.is_featured,
      },
    })

    revalidateProductPaths(validated.slug)

    return { success: true, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Product update failed'
    return { success: false, error: message }
  }
}

export async function duplicateProductAction(id: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { product: null, error: 'Unauthorized' }
    }

    // Fetch original product
    const { data: orig, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !orig) {
      return { product: null, error: 'Original product not found' }
    }

    // Fetch original gallery images
    const { data: origGallery } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', id)

    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString()
    const duplicateTitle = `${orig.title} (Copy)`
    const duplicateSlug = `${orig.slug}-copy-${randomSuffix}`
    const duplicateSku = orig.sku ? `${orig.sku}-COPY-${randomSuffix}` : `SKU-COPY-${randomSuffix}`

    // Insert duplicated product (saved as draft is_published = false)
    const { data: dupProduct, error: dupError } = await supabase
      .from('products')
      .insert({
        title: duplicateTitle,
        slug: duplicateSlug,
        sku: duplicateSku,
        category_id: orig.category_id,
        short_description: orig.short_description,
        full_description: orig.full_description,
        featured_image: orig.featured_image,
        features: orig.features || [],
        specifications: orig.specifications || {},
        catalogue_pdf: orig.catalogue_pdf,
        is_featured: orig.is_featured,
        is_published: false, // Save duplicate as draft
        seo_title: orig.seo_title ? `${orig.seo_title} (Copy)` : null,
        seo_description: orig.seo_description,
        sort_order: (orig.sort_order || 0) + 1,
      })
      .select()
      .single()

    if (dupError || !dupProduct) {
      return { product: null, error: dupError?.message || 'Duplication failed' }
    }

    // Duplicate gallery rows
    if (origGallery && origGallery.length > 0) {
      const dupGalleryRows = origGallery.map((img) => ({
        product_id: dupProduct.id,
        image_url: img.image_url,
        alt_text: img.alt_text,
        sort_order: img.sort_order,
      }))

      await supabase.from('product_images').insert(dupGalleryRows)
    }

    // Audit Log in activity_logs
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'DUPLICATE_PRODUCT',
      entity_type: 'product',
      entity_id: dupProduct.id,
      details: {
        original_id: id,
        title: dupProduct.title,
        slug: dupProduct.slug,
        sku: dupProduct.sku,
      },
    })

    revalidateProductPaths(dupProduct.slug)

    return { product: dupProduct as ProductItem, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Duplication failed'
    return { product: null, error: message }
  }
}

export async function toggleProductPublishAction(id: string, isPublished: boolean) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('products')
      .update({
        is_published: isPublished,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    // Audit Log in activity_logs
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'PRODUCT_STATUS_CHANGE',
      entity_type: 'product',
      entity_id: id,
      details: { is_published: isPublished },
    })

    revalidateProductPaths()

    return { success: true, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Status toggle failed'
    return { success: false, error: message }
  }
}

export async function toggleProductFeaturedAction(id: string, isFeatured: boolean) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('products')
      .update({
        is_featured: isFeatured,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    // Audit Log in activity_logs
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'PRODUCT_FEATURED_CHANGE',
      entity_type: 'product',
      entity_id: id,
      details: { is_featured: isFeatured },
    })

    revalidateProductPaths()

    return { success: true, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Featured toggle failed'
    return { success: false, error: message }
  }
}

export async function deleteProductAction(id: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Get product title for audit log
    const { data: prodData } = await supabase
      .from('products')
      .select('title')
      .eq('id', id)
      .single()

    // 1. Delete gallery records in product_images
    await supabase.from('product_images').delete().eq('product_id', id)

    // 2. Delete product record in products
    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    // Audit Log in activity_logs
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'DELETE_PRODUCT',
      entity_type: 'product',
      entity_id: id,
      details: { title: prodData?.title || id },
    })

    revalidateProductPaths()

    return { success: true, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Delete failed'
    return { success: false, error: message }
  }
}

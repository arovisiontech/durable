'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/src/lib/supabase/server'
import { CatalogueItem, CatalogueFormData, catalogueSchema } from '@/src/types/catalogue'

function revalidateCataloguePaths(slug?: string) {
  try {
    revalidatePath('/')
    revalidatePath('/catalogues')
    if (slug) {
      revalidatePath(`/catalogues/${slug}`)
    }
    revalidatePath('/admin/catalogues')
  } catch (err) {
    console.error('Revalidation error:', err)
  }
}

// Helper to extract storage path from public URL
function extractStoragePathFromUrl(url: string, bucketName = 'catalogues'): string | null {
  if (!url) return null
  try {
    if (url.includes(`/object/public/${bucketName}/`)) {
      return url.split(`/object/public/${bucketName}/`)[1] || null
    }
    if (url.includes(`/${bucketName}/`)) {
      const parts = url.split(`/${bucketName}/`)
      return parts[parts.length - 1] || null
    }
    return null
  } catch {
    return null
  }
}

export async function fetchCataloguesAction(params?: {
  search?: string
  categoryId?: string
  status?: 'all' | 'published' | 'draft'
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
      return { catalogues: [], count: 0, error: 'Unauthorized' }
    }

    const page = params?.page || 1
    const limit = params?.limit || 20
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('catalogues')
      .select('*, categories(name)', { count: 'exact' })

    // Search Filter
    if (params?.search && params.search.trim() !== '') {
      const term = `%${params.search.trim()}%`
      query = query.or(`title.ilike.${term},slug.ilike.${term}`)
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

    const { data: rawCatalogues, count, error } = await query

    if (error) {
      console.error('Error fetching catalogues:', error)
      return { catalogues: [], count: 0, error: error.message }
    }

    if (!rawCatalogues) {
      return { catalogues: [], count: 0, error: null }
    }

    const catalogues: CatalogueItem[] = rawCatalogues.map((c) => {
      const categoryData = c.categories as { name?: string } | null
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

    return { catalogues, count: count || 0, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch catalogues'
    return { catalogues: [], count: 0, error: message }
  }
}

export async function createCatalogueAction(
  formData: CatalogueFormData,
  newlyUploadedStoragePath?: string
) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { catalogue: null, error: 'Unauthorized' }
    }

    // Validate Input
    const validated = catalogueSchema.parse(formData)

    // Check slug uniqueness
    const { data: existingSlug } = await supabase
      .from('catalogues')
      .select('id')
      .eq('slug', validated.slug)
      .maybeSingle()

    if (existingSlug) {
      // Orphan PDF cleanup if upload happened during form session
      if (newlyUploadedStoragePath) {
        await supabase.storage.from('catalogues').remove([newlyUploadedStoragePath])
      }
      return { catalogue: null, error: `Slug "${validated.slug}" is already in use.` }
    }

    // Insert Record into catalogues
    const { data: newCatalogue, error } = await supabase
      .from('catalogues')
      .insert({
        title: validated.title,
        slug: validated.slug,
        category_id: validated.category_id || null,
        description: validated.description || null,
        cover_image: validated.cover_image || null,
        pdf_url: validated.pdf_url,
        is_published: validated.is_published,
        sort_order: validated.sort_order ?? 0,
      })
      .select()
      .single()

    if (error || !newCatalogue) {
      console.error('Error creating catalogue:', error)
      // Orphan cleanup if database insertion fails
      if (newlyUploadedStoragePath) {
        await supabase.storage.from('catalogues').remove([newlyUploadedStoragePath])
      }
      return { catalogue: null, error: error?.message || 'Database creation failed' }
    }

    // Audit Log in activity_logs
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'CREATE_CATALOGUE',
      entity_type: 'catalogue',
      entity_id: newCatalogue.id,
      details: {
        title: newCatalogue.title,
        slug: newCatalogue.slug,
        pdf_url: newCatalogue.pdf_url,
        is_published: newCatalogue.is_published,
      },
    })

    revalidateCataloguePaths(newCatalogue.slug)

    return { catalogue: newCatalogue as CatalogueItem, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Catalogue creation failed'
    if (newlyUploadedStoragePath) {
      const supabase = await createClient()
      await supabase.storage.from('catalogues').remove([newlyUploadedStoragePath])
    }
    return { catalogue: null, error: message }
  }
}

export async function updateCatalogueAction(
  id: string,
  formData: CatalogueFormData,
  oldPdfStoragePathToDelete?: string
) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate Input
    const validated = catalogueSchema.parse(formData)

    // Check slug uniqueness excluding current ID
    const { data: existingSlug } = await supabase
      .from('catalogues')
      .select('id')
      .eq('slug', validated.slug)
      .neq('id', id)
      .maybeSingle()

    if (existingSlug) {
      return { success: false, error: `Slug "${validated.slug}" is already in use by another catalogue.` }
    }

    // Update Record in catalogues
    const { error: updateError } = await supabase
      .from('catalogues')
      .update({
        title: validated.title,
        slug: validated.slug,
        category_id: validated.category_id || null,
        description: validated.description || null,
        cover_image: validated.cover_image || null,
        pdf_url: validated.pdf_url,
        is_published: validated.is_published,
        sort_order: validated.sort_order ?? 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) {
      console.error('Error updating catalogue:', updateError)
      return { success: false, error: updateError.message }
    }

    // Delete old replaced PDF file from storage bucket AFTER database update succeeds
    if (oldPdfStoragePathToDelete) {
      const { error: storageDelErr } = await supabase.storage
        .from('catalogues')
        .remove([oldPdfStoragePathToDelete])

      if (storageDelErr) {
        console.warn('Warning: Could not remove old replaced PDF from storage:', storageDelErr.message)
      }
    }

    // Audit Log in activity_logs
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'UPDATE_CATALOGUE',
      entity_type: 'catalogue',
      entity_id: id,
      details: {
        title: validated.title,
        slug: validated.slug,
        pdf_url: validated.pdf_url,
        is_published: validated.is_published,
      },
    })

    revalidateCataloguePaths(validated.slug)

    return { success: true, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Catalogue update failed'
    return { success: false, error: message }
  }
}

export async function toggleCatalogueStatusAction(id: string, isPublished: boolean) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('catalogues')
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
      action: 'CATALOGUE_STATUS_CHANGE',
      entity_type: 'catalogue',
      entity_id: id,
      details: { is_published: isPublished },
    })

    revalidateCataloguePaths()

    return { success: true, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Status toggle failed'
    return { success: false, error: message }
  }
}

export async function deleteCatalogueAction(id: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Fetch catalogue details
    const { data: catalogue, error: fetchErr } = await supabase
      .from('catalogues')
      .select('title, pdf_url')
      .eq('id', id)
      .single()

    if (fetchErr || !catalogue) {
      return { success: false, error: 'Catalogue not found' }
    }

    // Extract storage path from pdf_url
    const storagePath = extractStoragePathFromUrl(catalogue.pdf_url, 'catalogues')

    // 1. Delete PDF file from storage bucket FIRST if it exists in Supabase storage
    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from('catalogues')
        .remove([storagePath])

      if (storageError) {
        console.error('Storage deletion error:', storageError)
        return {
          success: false,
          error: `Storage deletion failed: ${storageError.message}. Database record was preserved.`,
        }
      }
    }

    // 2. Delete database record in catalogues
    const { error: dbError } = await supabase
      .from('catalogues')
      .delete()
      .eq('id', id)

    if (dbError) {
      console.error('Database deletion error:', dbError)
      return { success: false, error: dbError.message }
    }

    // Audit Log in activity_logs
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'DELETE_CATALOGUE',
      entity_type: 'catalogue',
      entity_id: id,
      details: { title: catalogue.title },
    })

    revalidateCataloguePaths()

    return { success: true, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Delete failed'
    return { success: false, error: message }
  }
}

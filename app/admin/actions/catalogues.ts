'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/src/lib/supabase/server'
import { CatalogueItem, CatalogueFormData, catalogueSchema } from '@/src/types/catalogue'
import { INITIAL_CATALOGUES_SEED } from '@/src/lib/dataStore'

function revalidateCataloguePaths(slug?: string) {
  try {
    revalidatePath('/', 'layout')
    revalidatePath('/catalogues')
    revalidatePath('/catalog')
    if (slug) {
      revalidatePath(`/catalogues/${slug}`)
      revalidatePath(`/catalog/${slug}`)
    }
    revalidatePath('/admin/catalogues')
  } catch (err) {
    console.error('Revalidation error:', err)
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

    let rawCatalogues: CatalogueItem[] = []
    let supabaseSuccess = false

    try {
      const { data, error } = await supabase.from('catalogues').select('*, categories(name)')
      if (!error && data && data.length > 0) {
        rawCatalogues = data.map((c) => ({
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
          category_name: (c.categories as { name?: string })?.name || null,
        }))
        supabaseSuccess = true
      }
    } catch (e) {
      console.error('Error fetching catalogues from Supabase:', e)
    }

    if (!supabaseSuccess || rawCatalogues.length === 0) {
      rawCatalogues = [...INITIAL_CATALOGUES_SEED]
    }

    // Apply Search
    if (params?.search && params.search.trim() !== '') {
      const term = params.search.trim().toLowerCase()
      rawCatalogues = rawCatalogues.filter(
        (c) => c.title.toLowerCase().includes(term) || c.slug.toLowerCase().includes(term)
      )
    }

    // Apply Category Filter
    if (params?.categoryId && params.categoryId !== 'all') {
      rawCatalogues = rawCatalogues.filter((c) => c.category_id === params.categoryId)
    }

    // Apply Status Filter
    if (params?.status === 'published') {
      rawCatalogues = rawCatalogues.filter((c) => c.is_published)
    } else if (params?.status === 'draft') {
      rawCatalogues = rawCatalogues.filter((c) => !c.is_published)
    }

    // Apply Sorting
    switch (params?.sortBy) {
      case 'oldest':
        rawCatalogues.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime())
        break
      case 'title':
        rawCatalogues.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'order':
        rawCatalogues.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        break
      case 'newest':
      default:
        rawCatalogues.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        break
    }

    return { catalogues: rawCatalogues, count: rawCatalogues.length, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch catalogues'
    return { catalogues: INITIAL_CATALOGUES_SEED, count: INITIAL_CATALOGUES_SEED.length, error: message }
  }
}

export async function createCatalogueAction(
  formData: CatalogueFormData,
  newlyUploadedStoragePath?: string
) {
  try {
    const validated = catalogueSchema.parse(formData)
    const supabase = await createClient()

    const insertPayload = {
      title: validated.title,
      slug: validated.slug,
      category_id: validated.category_id || null,
      description: validated.description || null,
      cover_image: validated.cover_image || '/images/blog-instruments-tray.png',
      pdf_url: validated.pdf_url,
      is_published: validated.is_published,
      sort_order: validated.sort_order ?? 0,
    }

    const { data, error } = await supabase.from('catalogues').insert(insertPayload).select().single()

    if (error) {
      console.error('Supabase catalogue creation error:', error)
      return { catalogue: null, error: error.message }
    }

    revalidateCataloguePaths(validated.slug)
    return { catalogue: data as CatalogueItem, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Catalogue creation failed'
    return { catalogue: null, error: message }
  }
}

export async function updateCatalogueAction(
  id: string,
  formData: CatalogueFormData,
  oldPdfStoragePathToDelete?: string
) {
  try {
    const validated = catalogueSchema.parse(formData)
    const supabase = await createClient()

    const updatePayload = {
      title: validated.title,
      slug: validated.slug,
      category_id: validated.category_id || null,
      description: validated.description || null,
      cover_image: validated.cover_image || '/images/blog-instruments-tray.png',
      pdf_url: validated.pdf_url,
      is_published: validated.is_published,
      sort_order: validated.sort_order ?? 0,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('catalogues').update(updatePayload).eq('id', id)

    if (error) {
      console.error('Supabase catalogue update error:', error)
      return { success: false, error: error.message }
    }

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
    const { error } = await supabase
      .from('catalogues')
      .update({ is_published: isPublished, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }
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
    const { error } = await supabase.from('catalogues').delete().eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }
    revalidateCataloguePaths()
    return { success: true, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Delete failed'
    return { success: false, error: message }
  }
}

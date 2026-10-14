'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/src/lib/supabase/server'
import { createPublicClient } from '@/src/lib/supabase/public'
import { CatalogueItem, CatalogueFormData, catalogueSchema } from '@/src/types/catalogue'
import {
  getServerCatalogues,
  upsertServerCatalogue,
  deleteServerCatalogue,
} from '@/src/lib/serverDataStore'

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
    let rawCatalogues: CatalogueItem[] = getServerCatalogues()

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
        rawCatalogues.sort(
          (a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
        )
        break
      case 'title':
        rawCatalogues.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'order':
        rawCatalogues.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        break
      case 'newest':
      default:
        rawCatalogues.sort(
          (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        )
        break
    }

    return { catalogues: rawCatalogues, count: rawCatalogues.length, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch catalogues'
    const fallback = getServerCatalogues()
    return { catalogues: fallback, count: fallback.length, error: message }
  }
}

export async function createCatalogueAction(
  formData: CatalogueFormData,
  newlyUploadedStoragePath?: string
) {
  try {
    const validated = catalogueSchema.parse(formData)
    const newId = `cat-pdf-${Date.now()}`

    const newCatalogue: CatalogueItem = {
      id: newId,
      title: validated.title,
      slug: validated.slug,
      category_id: validated.category_id || null,
      description: validated.description || null,
      cover_image: validated.cover_image || '/images/blog-instruments-tray.png',
      pdf_url: validated.pdf_url,
      is_published: validated.is_published,
      sort_order: validated.sort_order ?? 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category_name: 'General Surgery',
    }

    // 1. Permanently persist to server file store
    upsertServerCatalogue(newCatalogue)

    // 2. Best-effort Supabase sync
    try {
      let supabase: any
      try {
        supabase = await createClient()
      } catch {
        supabase = createPublicClient()
      }
      await supabase.from('catalogues').insert({
        title: validated.title,
        slug: validated.slug,
        category_id: validated.category_id || null,
        description: validated.description || null,
        cover_image: validated.cover_image || '/images/blog-instruments-tray.png',
        pdf_url: validated.pdf_url,
        is_published: validated.is_published,
        sort_order: validated.sort_order ?? 0,
      })
    } catch (e) {
      console.warn('[createCatalogueAction] Supabase notice:', e)
    }

    revalidateCataloguePaths(validated.slug)
    return { catalogue: newCatalogue, error: null }
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
    const existing = getServerCatalogues().find((c) => c.id === id || c.slug === id)

    const updatedCatalogue: CatalogueItem = {
      id: existing ? existing.id : id,
      title: validated.title,
      slug: validated.slug,
      category_id: validated.category_id || null,
      description: validated.description || null,
      cover_image: validated.cover_image || (existing ? existing.cover_image : '/images/blog-instruments-tray.png'),
      pdf_url: validated.pdf_url || (existing ? existing.pdf_url : ''),
      is_published: validated.is_published,
      sort_order: validated.sort_order ?? (existing ? existing.sort_order : 0),
      created_at: existing ? existing.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category_name: existing?.category_name || 'General Surgery',
    }

    // 1. Permanently persist to server file store
    upsertServerCatalogue(updatedCatalogue)

    // 2. Best-effort Supabase sync
    try {
      let supabase: any
      try {
        supabase = await createClient()
      } catch {
        supabase = createPublicClient()
      }
      await supabase
        .from('catalogues')
        .update({
          title: validated.title,
          slug: validated.slug,
          category_id: validated.category_id || null,
          description: validated.description || null,
          cover_image: validated.cover_image,
          pdf_url: validated.pdf_url,
          is_published: validated.is_published,
          sort_order: validated.sort_order ?? 0,
          updated_at: new Date().toISOString(),
        })
        .or(`id.eq.${id},slug.eq.${id}`)
    } catch (e) {
      console.warn('[updateCatalogueAction] Supabase notice:', e)
    }

    revalidateCataloguePaths(validated.slug)
    return { success: true, catalogue: updatedCatalogue, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Catalogue update failed'
    return { success: false, error: message }
  }
}

export async function toggleCatalogueStatusAction(id: string, isPublished: boolean) {
  try {
    const existing = getServerCatalogues().find((c) => c.id === id || c.slug === id)
    if (existing) {
      existing.is_published = isPublished
      existing.updated_at = new Date().toISOString()
      upsertServerCatalogue(existing)
    }

    try {
      let supabase: any
      try {
        supabase = await createClient()
      } catch {
        supabase = createPublicClient()
      }
      await supabase
        .from('catalogues')
        .update({ is_published: isPublished, updated_at: new Date().toISOString() })
        .or(`id.eq.${id},slug.eq.${id}`)
    } catch {}

    revalidateCataloguePaths(existing?.slug)
    return { success: true, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Status toggle failed'
    return { success: false, error: message }
  }
}

export async function deleteCatalogueAction(id: string) {
  try {
    // 1. Permanently delete from server file store
    deleteServerCatalogue(id)

    // 2. Best-effort Supabase sync
    try {
      let supabase: any
      try {
        supabase = await createClient()
      } catch {
        supabase = createPublicClient()
      }
      await supabase.from('catalogues').delete().or(`id.eq.${id},slug.eq.${id}`)
    } catch {}

    revalidateCataloguePaths()
    return { success: true, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Delete failed'
    return { success: false, error: message }
  }
}

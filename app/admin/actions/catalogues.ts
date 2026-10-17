'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/src/lib/supabase/server'
import { createPublicClient } from '@/src/lib/supabase/public'
import { CatalogueItem, CatalogueFormData, catalogueSchema } from '@/src/types/catalogue'
import {
  getServerCatalogues,
  upsertServerCatalogue,
  deleteServerCatalogue,
  setServerData,
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

async function getSupabaseClient() {
  try {
    return await createClient()
  } catch {
    return createPublicClient()
  }
}

async function getCloudCatalogues(): Promise<CatalogueItem[]> {
  try {
    const supabase = await getSupabaseClient()
    const { data: pageSec } = await supabase
      .from('page_sections')
      .select('content')
      .eq('heading', 'durable_catalogues')
      .order('updated_at', { ascending: false })
      .limit(1)

    if (pageSec && pageSec.length > 0 && pageSec[0]?.content) {
      const parsed = pageSec[0].content.data !== undefined ? pageSec[0].content.data : pageSec[0].content
      if (Array.isArray(parsed) && parsed.length > 0) {
        return (parsed as CatalogueItem[]).filter((c: any) => {
          if (c.id && typeof c.id === 'string' && c.id.startsWith('cat-sub-')) return false
          if (c.slug && typeof c.slug === 'string' && c.slug.includes('section-')) return false
          if (c.title && typeof c.title === 'string' && c.title.includes('(Section ')) return false
          return true
        })
      }
    }
  } catch (err) {
    console.warn('[getCloudCatalogues] notice:', err)
  }
  return getServerCatalogues().filter((c: any) => {
    if (c.id && typeof c.id === 'string' && c.id.startsWith('cat-sub-')) return false
    if (c.slug && typeof c.slug === 'string' && c.slug.includes('section-')) return false
    if (c.title && typeof c.title === 'string' && c.title.includes('(Section ')) return false
    return true
  })
}

async function saveCloudCatalogues(items: CatalogueItem[]) {
  try {
    const supabase = await getSupabaseClient()
    const nowIso = new Date().toISOString()
    const { data: updateData, error } = await supabase
      .from('page_sections')
      .update({
        content: { data: items },
        updated_at: nowIso,
      })
      .eq('heading', 'durable_catalogues')
      .select()

    if (!error && (!updateData || updateData.length === 0)) {
      await supabase.from('page_sections').insert({
        page_id: '10000000-0000-0000-0000-000000000001',
        section_type: 'custom_sync',
        heading: 'durable_catalogues',
        content: { data: items },
        sort_order: 0,
        is_visible: true,
        updated_at: nowIso,
      })
    }
  } catch (err) {
    console.warn('[saveCloudCatalogues] notice:', err)
  }

  try {
    setServerData('durable_catalogues', items)
  } catch {}
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
    let rawCatalogues: CatalogueItem[] = await getCloudCatalogues()

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

    // 1. Sync to Supabase page_sections for persistent cloud visibility
    const currentList = await getCloudCatalogues()
    const updatedList = [newCatalogue, ...currentList.filter(c => c.id !== newCatalogue.id && c.slug !== newCatalogue.slug)]
    await saveCloudCatalogues(updatedList)

    // 2. Permanently persist to server file store
    upsertServerCatalogue(newCatalogue)

    // 3. Best-effort Supabase table sync
    try {
      const supabase = await getSupabaseClient()
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

    // 1. Sync to Supabase page_sections
    const currentList = await getCloudCatalogues()
    const updatedList = currentList.map((c) => (c.id === id || c.slug === id ? updatedCatalogue : c))
    await saveCloudCatalogues(updatedList)

    // 2. Permanently persist to server file store
    upsertServerCatalogue(updatedCatalogue)

    // 3. Best-effort Supabase table sync
    try {
      const supabase = await getSupabaseClient()
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

    const currentList = await getCloudCatalogues()
    const updatedList = currentList.map((c) =>
      c.id === id || c.slug === id ? { ...c, is_published: isPublished, updated_at: new Date().toISOString() } : c
    )
    await saveCloudCatalogues(updatedList)

    try {
      const supabase = await getSupabaseClient()
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
    // 1. Sync to Supabase page_sections
    const currentList = await getCloudCatalogues()
    const updatedList = currentList.filter((c) => c.id !== id && c.slug !== id)
    await saveCloudCatalogues(updatedList)

    // 2. Permanently delete from server file store
    deleteServerCatalogue(id)

    // 3. Best-effort Supabase table sync
    try {
      const supabase = await getSupabaseClient()
      await supabase.from('catalogues').delete().or(`id.eq.${id},slug.eq.${id}`)
    } catch {}

    revalidateCataloguePaths()
    return { success: true, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Delete failed'
    return { success: false, error: message }
  }
}

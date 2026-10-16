'use server'

import { revalidatePath } from 'next/cache'
import { createClient as createServerClient } from '@/src/lib/supabase/server'
import { SubcategoryPdfItem } from '@/src/lib/dataStore'
import {
  getServerSubcategoryPdfs,
  saveServerSubcategoryPdfs,
  setServerData,
} from '@/src/lib/serverDataStore'

export async function fetchSubcategoriesAction(): Promise<{
  subcategories: SubcategoryPdfItem[]
  error: string | null
}> {
  try {
    // 1. Try Supabase cloud page_sections first
    try {
      const supabase = await createServerClient()
      const { data, error } = await supabase
        .from('page_sections')
        .select('content, updated_at')
        .eq('heading', 'durable_subcategories_pdf')
        .order('updated_at', { ascending: false })
        .limit(1)

      if (!error && data && data.length > 0 && data[0]?.content) {
        const val = data[0].content.data !== undefined ? data[0].content.data : data[0].content
        if (Array.isArray(val) && val.length > 0) {
          return { subcategories: val, error: null }
        }
      }
    } catch (sbErr) {
      console.warn('[fetchSubcategoriesAction] Supabase read notice:', sbErr)
    }

    // 2. Fallback to server file store
    const local = getServerSubcategoryPdfs()
    return { subcategories: local, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch subcategories'
    return { subcategories: getServerSubcategoryPdfs(), error: message }
  }
}

export async function saveSubcategoriesAction(items: SubcategoryPdfItem[]): Promise<{
  success: boolean
  error: string | null
}> {
  try {
    // 1. Save to server persistent memory and file store
    try {
      saveServerSubcategoryPdfs(items)
      setServerData('durable_subcategories_pdf', items)
    } catch (fsErr) {
      console.warn('[saveSubcategoriesAction] Server store write notice:', fsErr)
    }

    // 2. Direct cloud update to Supabase page_sections using authenticated server client
    try {
      const supabase = await createServerClient()
      const nowIso = new Date().toISOString()

      const { data: updateData, error: updateErr } = await supabase
        .from('page_sections')
        .update({
          content: { data: items },
          updated_at: nowIso,
        })
        .eq('heading', 'durable_subcategories_pdf')
        .select()

      if (!updateErr && (!updateData || updateData.length === 0)) {
        await supabase.from('page_sections').insert({
          page_id: '10000000-0000-0000-0000-000000000001',
          section_type: 'custom_sync',
          heading: 'durable_subcategories_pdf',
          content: { data: items },
          sort_order: 0,
          is_visible: true,
          updated_at: nowIso,
        })
      }
    } catch (sbErr) {
      console.warn('[saveSubcategoriesAction] Supabase update notice:', sbErr)
    }

    // 3. Revalidate paths for immediate live view
    try {
      revalidatePath('/', 'layout')
      revalidatePath('/category/[slug]', 'page')
      revalidatePath('/admin/subcategories')
    } catch (revErr) {
      console.warn('[saveSubcategoriesAction] Revalidation notice:', revErr)
    }

    return { success: true, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save subcategories'
    return { success: false, error: message }
  }
}

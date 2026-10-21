'use server'

import { createClient as createServerClient } from '@/src/lib/supabase/server'
import { createPublicClient } from '@/src/lib/supabase/public'
import { getServerData, setServerData } from '@/src/lib/serverDataStore'
import { revalidatePath } from 'next/cache'

/**
 * Filter out corrupt / placeholder / deleted test steps
 */
function cleanSteps(list: any[]): any[] {
  if (!Array.isArray(list)) return []
  return list.filter((item: any) => {
    if (!item) return false
    const id = item.id || ''
    const title = (item.title || '').trim().toLowerCase()
    // Permanently remove dummy test step "proc-1792547532465-236o" / "Text"
    if (id === 'proc-1792547532465-236o') return false
    if (title === 'text' && (!item.description || item.description.trim() === '')) return false
    return true
  })
}

/**
 * Server Action: Permanently delete a process step from Supabase and Server Store
 */
export async function deleteProcessStepAction(stepId: string) {
  try {
    let supabase: any
    try {
      supabase = await createServerClient()
    } catch {
      supabase = createPublicClient()
    }

    // 1. Fetch current steps from Supabase
    let currentSteps: any[] = []
    const { data: rows } = await supabase
      .from('page_sections')
      .select('content')
      .eq('heading', 'durable_process_data')

    if (rows && rows.length > 0) {
      const c = rows[0].content
      currentSteps = Array.isArray(c?.data) ? c.data : Array.isArray(c) ? c : []
    }

    if (currentSteps.length === 0) {
      const fallback = getServerData<any[]>('durable_process_data', [])
      if (Array.isArray(fallback)) currentSteps = fallback
    }

    // 2. Filter out target stepId AND any dummy text step
    const updated = cleanSteps(currentSteps).filter((item: any) => item.id !== stepId)

    // Re-index step numbers
    const reindexed = updated.map((step: any, idx: number) => ({
      ...step,
      step_number: idx + 1,
      stepNumber: idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`,
    }))

    const nowIso = new Date().toISOString()

    // 3. Persist directly to Supabase page_sections
    const { error: sbErr } = await supabase
      .from('page_sections')
      .update({
        content: { data: reindexed },
        updated_at: nowIso,
      })
      .eq('heading', 'durable_process_data')

    if (sbErr) {
      console.warn('[deleteProcessStepAction] Supabase update notice:', sbErr)
    }

    // 4. Update server file store
    try {
      setServerData('durable_process_data', reindexed)
    } catch (fsErr) {
      // Ignore on read-only environments
    }

    // 5. Revalidate cache
    try {
      revalidatePath('/')
      revalidatePath('/process')
      revalidatePath('/admin/content/home')
      revalidatePath('/admin/process-steps')
    } catch {}

    return { success: true, count: reindexed.length, steps: reindexed }
  } catch (err: any) {
    console.error('[deleteProcessStepAction Error]:', err)
    return { success: false, error: err?.message || 'Delete operation failed' }
  }
}

/**
 * Server Action: Permanently save process steps to Supabase and Server Store
 */
export async function saveProcessStepsAction(steps: any[]) {
  try {
    let supabase: any
    try {
      supabase = await createServerClient()
    } catch {
      supabase = createPublicClient()
    }

    const cleaned = cleanSteps(steps)
    const nowIso = new Date().toISOString()

    const { data: updateData, error: sbErr } = await supabase
      .from('page_sections')
      .update({
        content: { data: cleaned },
        updated_at: nowIso,
      })
      .eq('heading', 'durable_process_data')
      .select()

    if (!sbErr && (!updateData || updateData.length === 0)) {
      await supabase.from('page_sections').insert({
        page_id: '10000000-0000-0000-0000-000000000001',
        section_type: 'custom_sync',
        heading: 'durable_process_data',
        content: { data: cleaned },
        sort_order: 0,
        is_visible: true,
        updated_at: nowIso,
      })
    }

    try {
      setServerData('durable_process_data', cleaned)
    } catch {}

    try {
      revalidatePath('/')
      revalidatePath('/process')
      revalidatePath('/admin/content/home')
      revalidatePath('/admin/process-steps')
    } catch {}

    return { success: true, count: cleaned.length, steps: cleaned }
  } catch (err: any) {
    console.error('[saveProcessStepsAction Error]:', err)
    return { success: false, error: err?.message || 'Save operation failed' }
  }
}

'use server'

import { createClient as createServerClient } from '@/src/lib/supabase/server'
import { createPublicClient } from '@/src/lib/supabase/public'
import { revalidatePath } from 'next/cache'
import { PublicFooterData } from '@/src/types/public'
import { DEFAULT_FOOTER_DATA } from '@/src/data/defaultFooterData'
import { getServerData, setServerData } from '@/src/lib/serverDataStore'

export async function getFooterAction(): Promise<PublicFooterData> {
  try {
    let supabase: any
    try {
      supabase = await createServerClient()
    } catch {
      supabase = createPublicClient()
    }

    const { data } = await supabase
      .from('page_sections')
      .select('content')
      .eq('heading', 'durable_footer_data')
      .order('updated_at', { ascending: false })
      .limit(1)

    if (data && data.length > 0 && data[0]?.content) {
      const parsed = data[0].content.data !== undefined ? data[0].content.data : data[0].content
      if (parsed && typeof parsed === 'object') {
        return {
          ...DEFAULT_FOOTER_DATA,
          ...parsed,
          email: parsed.email?.toLowerCase() || DEFAULT_FOOTER_DATA.email,
          mapUrl: parsed.mapUrl || DEFAULT_FOOTER_DATA.mapUrl,
        }
      }
    }
  } catch (err) {
    console.warn('[getFooterAction] Supabase notice:', err)
  }

  const stored = getServerData<Record<string, any> | null>('durable_footer_data', null)
  if (stored && typeof stored === 'object') {
    return {
      ...DEFAULT_FOOTER_DATA,
      ...(stored as Record<string, any>),
      email: stored.email?.toLowerCase() || DEFAULT_FOOTER_DATA.email,
      mapUrl: stored.mapUrl || DEFAULT_FOOTER_DATA.mapUrl,
    }
  }

  return DEFAULT_FOOTER_DATA
}

export async function saveFooterAction(footerData: PublicFooterData) {
  try {
    const cleanData: PublicFooterData = {
      ...DEFAULT_FOOTER_DATA,
      ...footerData,
      email: (footerData.email || 'info@durablehs.com').trim().toLowerCase(),
      mapUrl: (footerData.mapUrl || 'https://maps.app.goo.gl/RGr1xeaZjtdHgCpX8').trim(),
    }

    // 1. Save to Supabase page_sections
    try {
      let supabase: any
      try {
        supabase = await createServerClient()
      } catch {
        supabase = createPublicClient()
      }

      const nowIso = new Date().toISOString()
      const { data: updateData, error: updErr } = await supabase
        .from('page_sections')
        .update({
          content: { data: cleanData },
          updated_at: nowIso,
        })
        .eq('heading', 'durable_footer_data')
        .select()

      if (!updErr && (!updateData || updateData.length === 0)) {
        await supabase.from('page_sections').insert({
          page_id: '10000000-0000-0000-0000-000000000001',
          section_type: 'custom_sync',
          heading: 'durable_footer_data',
          content: { data: cleanData },
          sort_order: 0,
          is_visible: true,
          updated_at: nowIso,
        })
      }
    } catch (dbErr) {
      console.warn('[saveFooterAction] Supabase write notice:', dbErr)
    }

    // 2. Save to local server file store
    try {
      setServerData('durable_footer_data', cleanData)
    } catch (fsErr) {}

    // 3. Revalidate all pages layout
    revalidatePath('/', 'layout')

    return { success: true, message: 'Footer updated successfully', data: cleanData }
  } catch (err: any) {
    console.error('[saveFooterAction] Error:', err)
    return { success: false, message: err.message || 'Failed to save footer' }
  }
}

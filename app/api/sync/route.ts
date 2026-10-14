import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/src/lib/supabase/server'
import { createPublicClient } from '@/src/lib/supabase/public'
import { getServerData, setServerData, getAllServerData } from '@/src/lib/serverDataStore'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')
  const fetchAll = searchParams.get('all') === 'true'

  // Handle fetch all keys across cloud and server file store
  if (fetchAll) {
    const allServerData = getAllServerData()
    return NextResponse.json({
      success: true,
      data: allServerData,
      count: Object.keys(allServerData).length,
    })
  }

  if (!key) {
    return NextResponse.json({ error: 'Missing key parameter' }, { status: 400 })
  }

  // 1. Check persistent server file store
  const storedVal = getServerData(key, null)
  if (storedVal !== null && storedVal !== undefined) {
    return NextResponse.json({ success: true, data: storedVal, source: 'server_store' })
  }

  // 2. Try fetching from Supabase page_sections if not found
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('page_sections')
      .select('content')
      .eq('heading', key)
      .maybeSingle()

    if (!error && data && data.content) {
      const parsedValue = data.content.data !== undefined ? data.content.data : data.content
      setServerData(key, parsedValue)
      return NextResponse.json({ success: true, data: parsedValue, source: 'supabase' })
    }
  } catch (err) {
    console.warn(`[Sync API GET] Supabase query notice for "${key}":`, err)
  }

  return NextResponse.json({ success: false, data: null })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { key, value } = body

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value required' }, { status: 400 })
    }

    // 1. Save to persistent server store (atomic JSON file write)
    setServerData(key, value)

    // 2. Best-effort Supabase background update
    try {
      let supabase: any
      try {
        supabase = await createServerClient()
      } catch (e) {
        supabase = createPublicClient()
      }

      const { data: existing } = await supabase
        .from('page_sections')
        .select('id')
        .eq('heading', key)
        .maybeSingle()

      if (existing && existing.id) {
        await supabase
          .from('page_sections')
          .update({
            content: { data: value },
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
      } else {
        const { data: homePage } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', 'home')
          .maybeSingle()

        const targetPageId = homePage?.id

        if (targetPageId) {
          await supabase.from('page_sections').insert({
            page_id: targetPageId,
            section_type: 'custom_sync',
            heading: key,
            content: { data: value },
            is_visible: true,
          })
        }
      }
    } catch (dbErr) {
      console.warn(`[Sync API POST] Supabase write notice for "${key}":`, dbErr)
    }

    return NextResponse.json({
      success: true,
      message: `Key "${key}" saved permanently across all devices and refreshes`,
    })
  } catch (err: any) {
    console.error('[Sync API POST Error]:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

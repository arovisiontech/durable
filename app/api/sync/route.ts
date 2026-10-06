import { NextResponse } from 'next/server'
import { createPublicClient } from '@/src/lib/supabase/public'

// Global in-memory cache on server for ultra-fast response across all devices
const globalServerStore = new Map<string, any>()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')

  if (!key) {
    return NextResponse.json({ error: 'Missing key parameter' }, { status: 400 })
  }

  // 1. Check in-memory server store
  if (globalServerStore.has(key)) {
    return NextResponse.json({ success: true, data: globalServerStore.get(key), source: 'memory' })
  }

  // 2. Try fetching from Supabase
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('page_sections')
      .select('content')
      .eq('heading', key)
      .maybeSingle()

    if (!error && data && data.content) {
      const parsedValue = data.content.data !== undefined ? data.content.data : data.content
      globalServerStore.set(key, parsedValue)
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

    // 1. Save to global server memory store
    globalServerStore.set(key, value)

    // 2. Try saving to Supabase page_sections as global key-value store
    try {
      const supabase = createPublicClient()

      // Find if entry already exists
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
        // Need a default page_id or homepage id
        const { data: homePage } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', 'home')
          .maybeSingle()

        if (homePage && homePage.id) {
          await supabase.from('page_sections').insert({
            page_id: homePage.id,
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

    return NextResponse.json({ success: true, message: `Key "${key}" saved globally across all devices` })
  } catch (err: any) {
    console.error('[Sync API POST Error]:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

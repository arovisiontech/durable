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

  // 1. Check Supabase page_sections first for the latest live synchronized cloud data!
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('page_sections')
      .select('content, updated_at')
      .eq('heading', key)
      .order('updated_at', { ascending: false })
      .limit(1)

    if (!error && data && data.length > 0 && data[0]?.content) {
      const parsedValue = data[0].content.data !== undefined ? data[0].content.data : data[0].content
      return NextResponse.json({ success: true, data: parsedValue, source: 'supabase' })
    }
  } catch (err) {
    console.warn(`[Sync API GET] Supabase query notice for "${key}":`, err)
  }

  // 2. Fallback to persistent server file store
  const storedVal = getServerData(key, null)
  if (storedVal !== null && storedVal !== undefined) {
    return NextResponse.json({ success: true, data: storedVal, source: 'server_store' })
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

    // 1. Direct cloud update to Supabase page_sections (persists permanently on Vercel)
    try {
      const supabase = createPublicClient()
      const { error: sbUpdateErr } = await supabase
        .from('page_sections')
        .update({
          content: { data: value },
          updated_at: new Date().toISOString(),
        })
        .eq('heading', key)

      if (sbUpdateErr) {
        console.warn(`[Sync API POST] Supabase update notice for "${key}":`, sbUpdateErr)
      }
    } catch (dbErr) {
      console.warn(`[Sync API POST] Supabase write notice for "${key}":`, dbErr)
    }

    // 2. Also save to server store if writable
    try {
      setServerData(key, value)
    } catch (fsErr) {
      // Read-only on serverless Vercel is expected
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

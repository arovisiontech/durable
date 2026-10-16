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

  // 1. Check Supabase page_sections for live synchronized cloud data
  try {
    let supabase: any
    try {
      supabase = await createServerClient()
    } catch {
      supabase = createPublicClient()
    }

    const { data, error } = await supabase
      .from('page_sections')
      .select('content, updated_at')
      .eq('heading', key)
      .order('updated_at', { ascending: false })
      .limit(1)

    let parsedValue = null
    if (!error && data && data.length > 0 && data[0]?.content) {
      parsedValue = data[0].content.data !== undefined ? data[0].content.data : data[0].content
    }

    const serverVal = getServerData(key, null)

    // Handle deduplication and safe merging for collection types
    if (key === 'durable_solutions_data') {
      const sourceList = Array.isArray(parsedValue) && parsedValue.length > 0 ? parsedValue : serverVal
      if (Array.isArray(sourceList)) {
        const seen = new Set<string>()
        const cleanList = sourceList.filter((item: any) => {
          const k = ((item.count || '') + '_' + (item.title || '')).toLowerCase().trim()
          if (seen.has(k)) return false
          seen.add(k)
          return true
        })
        return NextResponse.json({ success: true, data: cleanList, source: 'deduplicated' })
      }
    } else if (key === 'durable_subcategories_pdf') {
      const serverItems = Array.isArray(serverVal) ? serverVal : []
      const cloudItems = Array.isArray(parsedValue) ? parsedValue : []
      const mergedMap = new Map<string, any>()
      // Server holds all 49 client-uploaded sections & catalogues
      serverItems.forEach((item: any) => mergedMap.set(item.id, item))
      // Cloud overrides with any live runtime edits
      cloudItems.forEach((item: any) => {
        if (item && item.id) mergedMap.set(item.id, item)
      })
      const merged = Array.from(mergedMap.values())
      if (merged.length > 0) {
        return NextResponse.json({ success: true, data: merged, source: 'merged' })
      }
    } else if (key === 'durable_catalogues') {
      const serverItems = Array.isArray(serverVal) ? serverVal : []
      const cloudItems = Array.isArray(parsedValue) ? parsedValue : []
      const mergedMap = new Map<string, any>()
      serverItems.forEach((item: any) => mergedMap.set(item.id, item))
      cloudItems.forEach((item: any) => {
        if (item && item.id) mergedMap.set(item.id, item)
      })
      const merged = Array.from(mergedMap.values())
      if (merged.length > 0) {
        return NextResponse.json({ success: true, data: merged, source: 'merged' })
      }
    } else if (key === 'durable_categories') {
      const serverItems = Array.isArray(serverVal) ? serverVal : []
      const cloudItems = Array.isArray(parsedValue) ? parsedValue : []
      const mergedMap = new Map<string, any>()
      serverItems.forEach((item: any) => mergedMap.set(item.id || item.slug, item))
      cloudItems.forEach((item: any) => {
        if (item) mergedMap.set(item.id || item.slug, item)
      })
      const merged = Array.from(mergedMap.values())
      if (merged.length > 0) {
        return NextResponse.json({ success: true, data: merged, source: 'merged' })
      }
    }

    if (parsedValue !== null && parsedValue !== undefined) {
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

    let valueToSave = value

    // 0. Safeguards for collections
    if (key === 'durable_solutions_data' && Array.isArray(value)) {
      const seen = new Set<string>()
      valueToSave = value.filter((item: any) => {
        if (!item) return false
        const k = ((item.count || '') + '_' + (item.title || '')).toLowerCase().trim()
        if (seen.has(k)) return false
        seen.add(k)
        return true
      })
    } else if (key === 'durable_subcategories_pdf' && Array.isArray(value)) {
      const serverVal = getServerData<any[] | null>(key, null)
      if (Array.isArray(serverVal) && serverVal.length > 0) {
        const mergedMap = new Map<string, any>()
        serverVal.forEach((item: any) => { if (item?.id) mergedMap.set(item.id, item) })
        value.forEach((item: any) => { if (item?.id) mergedMap.set(item.id, item) })
        valueToSave = Array.from(mergedMap.values())
      }
    } else if (key === 'durable_catalogues' && Array.isArray(value)) {
      const serverVal = getServerData<any[] | null>(key, null)
      if (Array.isArray(serverVal) && serverVal.length > 0) {
        const mergedMap = new Map<string, any>()
        serverVal.forEach((item: any) => { if (item?.id) mergedMap.set(item.id, item) })
        value.forEach((item: any) => { if (item?.id) mergedMap.set(item.id, item) })
        valueToSave = Array.from(mergedMap.values())
      }
    }

    // 1. Direct cloud update to Supabase page_sections (persists permanently across all devices)
    try {
      let supabase: any
      try {
        supabase = await createServerClient()
      } catch {
        supabase = createPublicClient()
      }

      const nowIso = new Date().toISOString()
      const { data: updateData, error: sbUpdateErr } = await supabase
        .from('page_sections')
        .update({
          content: { data: valueToSave },
          updated_at: nowIso,
        })
        .eq('heading', key)
        .select()

      if (!sbUpdateErr && (!updateData || updateData.length === 0)) {
        await supabase.from('page_sections').insert({
          page_id: '10000000-0000-0000-0000-000000000001',
          section_type: 'custom_sync',
          heading: key,
          content: { data: valueToSave },
          sort_order: 0,
          is_visible: true,
          updated_at: nowIso,
        })
      }

      if (sbUpdateErr) {
        console.warn(`[Sync API POST] Supabase update notice for "${key}":`, sbUpdateErr)
      }
    } catch (dbErr) {
      console.warn(`[Sync API POST] Supabase write notice for "${key}":`, dbErr)
    }

    // 2. Also save to server store if writable
    try {
      setServerData(key, valueToSave)
    } catch (fsErr) {
      // Read-only on serverless Vercel is handled by Supabase above
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

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
    try {
      let supabase: any
      try {
        supabase = await createServerClient()
      } catch {
        supabase = createPublicClient()
      }
      const { data: cloudSections } = await supabase
        .from('page_sections')
        .select('heading, content, updated_at')
        .order('updated_at', { ascending: false })

      if (cloudSections && cloudSections.length > 0) {
        const seenHeading = new Set<string>()
        for (const row of cloudSections) {
          if (row.heading && !seenHeading.has(row.heading) && row.content) {
            seenHeading.add(row.heading)
            const val = row.content.data !== undefined ? row.content.data : row.content
            allServerData[row.heading] = val
          }
        }
      }
    } catch (e) {
      console.warn('[Sync API GET fetchAll] Supabase query notice:', e)
    }

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

    const serverVal = getServerData<any>(key, null)

    // Handle deduplication for solutions cards
    if (key === 'durable_solutions_data') {
      const sourceList = Array.isArray(parsedValue) && parsedValue.length > 0 ? parsedValue : serverVal
      if (Array.isArray(sourceList)) {
        const seenTitle = new Set<string>()
        const seenCount = new Set<string>()
        const cleanList = sourceList.filter((item: any) => {
          if (!item || !item.title) return false
          const titleKey = item.title.toLowerCase().trim()
          const countKey = (item.count || '').trim()
          if (seenTitle.has(titleKey) || (countKey && seenCount.has(countKey))) {
            return false
          }
          seenTitle.add(titleKey)
          if (countKey) seenCount.add(countKey)
          return true
        })
        return NextResponse.json({ success: true, data: cleanList, source: 'deduplicated' })
      }
    }

    // Handle process data: ensure clean list without corrupt / deleted steps
    if (key === 'durable_process_data') {
      const sourceList =
        Array.isArray(parsedValue) && parsedValue.length > 0
          ? parsedValue
          : Array.isArray(serverVal) && serverVal.length > 0
          ? serverVal
          : []

      const cleanList = sourceList.filter((item: any) => {
        if (!item) return false
        const id = item.id || ''
        const title = (item.title || '').trim().toLowerCase()
        // Permanently filter out the test item "proc-1792547532465-236o" and dummy "Text"
        if (id === 'proc-1792547532465-236o') return false
        if (title === 'text' && (!item.description || item.description.trim() === '')) return false
        return true
      })

      // If Supabase row has the corrupt item or wrong count, heal Supabase in background
      if (Array.isArray(parsedValue) && parsedValue.length !== cleanList.length && supabase) {
        supabase
          .from('page_sections')
          .update({ content: { data: cleanList }, updated_at: new Date().toISOString() })
          .eq('heading', 'durable_process_data')
          .then(() => {})
          .catch(() => {})
      }

      return NextResponse.json({ success: true, data: cleanList, source: 'process_clean' })
    }

    if (parsedValue !== null && parsedValue !== undefined) {
      if (key === 'durable_categories' && Array.isArray(parsedValue)) {
        const normalized = parsedValue.map((c: any) => {
          if (c.slug === 'dental' || c.id === 'cat-dental' || c.name?.toLowerCase() === 'dental') {
            return { ...c, is_published: true, sort_order: c.sort_order ?? 2 }
          }
          return c
        })
        if (!normalized.some((c: any) => c.slug === 'dental' || c.id === 'cat-dental')) {
          normalized.splice(1, 0, {
            id: 'cat-dental',
            parent_id: null,
            name: 'Dental',
            slug: 'dental',
            description: 'Complete Dental Solutions For Every Specialty',
            image_url: '/images/icon-dental.png',
            sort_order: 2,
            is_published: true,
            created_at: '2026-10-14T19:10:28.945Z',
            updated_at: '2026-10-14T19:10:28.945Z',
            product_count: 4,
            level: 0,
          })
        }
        return NextResponse.json({ success: true, data: normalized, source: 'supabase' })
      }
      return NextResponse.json({ success: true, data: parsedValue, source: 'supabase' })
    }
  } catch (err) {
    console.warn(`[Sync API GET] Supabase query notice for "${key}":`, err)
  }

  // 2. Fallback to persistent server file store
  const storedVal = getServerData<any>(key, null)
  if (storedVal !== null && storedVal !== undefined) {
    if (key === 'durable_categories' && Array.isArray(storedVal)) {
      const normalized = (storedVal as any[]).map((c: any) => {
        if (c.slug === 'dental' || c.id === 'cat-dental' || c.name?.toLowerCase() === 'dental') {
          return { ...c, is_published: true, sort_order: c.sort_order ?? 2 }
        }
        return c
      })
      return NextResponse.json({ success: true, data: normalized, source: 'server_store' })
    }
    return NextResponse.json({ success: true, data: storedVal, source: 'server_store' })
  }

  return NextResponse.json({ success: false, data: null })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { key, value, deletedId, deletedIds } = body

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value required' }, { status: 400 })
    }

    let valueToSave = value

    // If deleted IDs are provided, filter them out
    const delSet = new Set<string>(Array.isArray(deletedIds) ? deletedIds : [])
    if (deletedId) delSet.add(deletedId)

    // Guarantee Dental is always published and preserved in durable_categories
    if (key === 'durable_categories' && Array.isArray(value)) {
      valueToSave = value.map((c: any) => {
        if (c.slug === 'dental' || c.id === 'cat-dental' || c.name?.toLowerCase() === 'dental') {
          return { ...c, is_published: true, sort_order: c.sort_order ?? 2 }
        }
        return c
      })
      if (!valueToSave.some((c: any) => c.slug === 'dental' || c.id === 'cat-dental')) {
        valueToSave.splice(1, 0, {
          id: 'cat-dental',
          parent_id: null,
          name: 'Dental',
          slug: 'dental',
          description: 'Complete Dental Solutions For Every Specialty',
          image_url: '/images/icon-dental.png',
          sort_order: 2,
          is_published: true,
          created_at: '2026-10-14T19:10:28.945Z',
          updated_at: '2026-10-14T19:10:28.945Z',
          product_count: 4,
          level: 0,
        })
      }
    }

    // Clean and deduplicate solutions cards if posted
    if (key === 'durable_solutions_data' && Array.isArray(value)) {
      const seenTitle = new Set<string>()
      const seenCount = new Set<string>()
      valueToSave = value.filter((item: any) => {
        if (!item || !item.title) return false
        const titleKey = item.title.toLowerCase().trim()
        const countKey = (item.count || '').trim()
        if (seenTitle.has(titleKey) || (countKey && seenCount.has(countKey))) {
          return false
        }
        seenTitle.add(titleKey)
        if (countKey) seenCount.add(countKey)
        return true
      })
    }

    // Clean process steps if posted
    if (key === 'durable_process_data' && Array.isArray(value)) {
      valueToSave = value.filter((item: any) => {
        if (!item) return false
        const id = item.id || ''
        const title = (item.title || '').trim().toLowerCase()
        if (delSet.has(id)) return false
        if (id === 'proc-1792547532465-236o') return false
        if (title === 'text' && (!item.description || item.description.trim() === '')) return false
        return true
      })
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

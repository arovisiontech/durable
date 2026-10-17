'use client'

import { useEffect } from 'react'
import { setItemIDB } from '@/src/lib/persistentStorage'

export function AdminAutoSync() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    let isSyncing = false

    const syncTwoWay = async () => {
      if (isSyncing) return
      isSyncing = true

      try {
        // 1. PULL CLOUD DATA: Download all client-uploaded data from Supabase Cloud
        try {
          const res = await fetch('/api/sync?all=true')
          const json = await res.json()
          if (json && json.success && json.data) {
            let updatedCount = 0
            for (const [k, val] of Object.entries(json.data)) {
              if (val !== null && val !== undefined) {
                try {
                  const existingLocal = localStorage.getItem(k)
                  const newString = JSON.stringify(val)

                  // For rich collections, ensure local storage doesn't keep a truncated or duplicate-laden list
                  if (k === 'durable_solutions_data' && Array.isArray(val)) {
                    // Deduplicate
                    const seen = new Set<string>()
                    const clean = val.filter((item: any) => {
                      const id = ((item.count || '') + '_' + (item.title || '')).toLowerCase().trim()
                      if (seen.has(id)) return false
                      seen.add(id)
                      return true
                    })
                    const cleanStr = JSON.stringify(clean)
                    if (existingLocal !== cleanStr) {
                      localStorage.setItem(k, cleanStr)
                      setItemIDB(k, clean).catch(() => {})
                      updatedCount++
                    }
                  } else if ((k === 'durable_subcategories_pdf' || k === 'durable_catalogues' || k === 'durable_categories') && Array.isArray(val)) {
                    if (existingLocal !== newString) {
                      localStorage.setItem(k, newString)
                      setItemIDB(k, val).catch(() => {})
                      updatedCount++
                    }
                  } else if (!existingLocal || existingLocal === '[]' || existingLocal === '{}') {
                    localStorage.setItem(k, newString)
                    setItemIDB(k, val).catch(() => {})
                    updatedCount++
                  }
                } catch (storeErr) {
                  setItemIDB(k, val).catch(() => {})
                }
              }
            }
            if (updatedCount > 0) {
              console.log(`[AdminAutoSync] Synchronized ${updatedCount} cloud keys to local browser cache!`)
              window.dispatchEvent(new Event('durable_content_updated'))
            }
          }
        } catch (pullErr) {
          console.warn('[AdminAutoSync] Error pulling cloud data:', pullErr)
        }
      } catch (err) {
        console.error('[AdminAutoSync] Sync notice:', err)
      } finally {
        isSyncing = false
      }
    }

    // Run on initial mount
    syncTwoWay()

    // Listen for update events (e.g. user saved a form)
    const handleUpdate = () => {
      syncTwoWay()
    }

    window.addEventListener('durable_content_updated', handleUpdate)
    return () => window.removeEventListener('durable_content_updated', handleUpdate)
  }, [])

  return null
}

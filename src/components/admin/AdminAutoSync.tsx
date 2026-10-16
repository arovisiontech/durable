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
                  // Only populate if local key is completely missing or empty, preserving client edits
                  if (!existingLocal || existingLocal === '[]' || existingLocal === '{}') {
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

        // 2. PUSH LOCAL DATA: Upload any locally created keys to Supabase Cloud
        const keysToSync: string[] = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.startsWith('durable_')) {
            keysToSync.push(key)
          }
        }

        for (const key of keysToSync) {
          try {
            const raw = localStorage.getItem(key)
            if (!raw) continue
            const value = JSON.parse(raw)

            await fetch('/api/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ key, value }),
            })
          } catch (itemErr) {
            // Silently continue
          }
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

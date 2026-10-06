'use client'

import { useEffect } from 'react'

export function AdminAutoSync() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const syncAllLocalDataToCloud = async () => {
      try {
        const keysToSync: string[] = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.startsWith('durable_')) {
            keysToSync.push(key)
          }
        }

        if (keysToSync.length === 0) return

        console.log(`[AdminAutoSync] Found ${keysToSync.length} client keys in LocalStorage to push to Cloud...`)

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
            console.warn(`[AdminAutoSync] Error syncing key "${key}":`, itemErr)
          }
        }

        console.log('[AdminAutoSync] Cross-device cloud sync completed successfully!')
      } catch (err) {
        console.error('[AdminAutoSync] Auto-sync notice:', err)
      }
    }

    // Run auto-sync on mount
    syncAllLocalDataToCloud()

    // Also listen for any local updates and sync immediately
    const handleUpdate = () => {
      syncAllLocalDataToCloud()
    }

    window.addEventListener('durable_content_updated', handleUpdate)
    return () => window.removeEventListener('durable_content_updated', handleUpdate)
  }, [])

  return null
}

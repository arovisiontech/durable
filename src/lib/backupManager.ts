'use client'

import { getItemIDB, setItemIDB } from '@/src/lib/persistentStorage'

export const CONTENT_STORAGE_KEYS = [
  'durable_subcategories_pdf',
  'durable_categories',
  'durable_products',
  'durable_catalogues',
  'durable_hero_slides',
  'durable_about_data',
  'durable_stats_data',
  'durable_solutions_data',
  'durable_quality_trust_data',
  'durable_pillars_data',
  'durable_precision_data',
  'durable_process_data',
  'durable_video_data',
  'durable_cert_logos',
  'durable_custom_home_blocks',
  'durable_blogs',
  'durable_about_hero_data',
  'durable_history_data',
  'durable_history_cards',
  'durable_journey_data',
  'durable_custom_about_blocks',
]

/**
 * Export all website content keys into a single JSON file for cross-device transfer
 */
export async function exportFullBackupJSON(): Promise<void> {
  if (typeof window === 'undefined') return

  const backupData: Record<string, any> = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    data: {},
  }

  for (const key of CONTENT_STORAGE_KEYS) {
    try {
      // Check IDB first, fallback to LocalStorage
      const idbVal = await getItemIDB(key)
      if (idbVal !== null && idbVal !== undefined) {
        backupData.data[key] = idbVal
      } else {
        const lsVal = localStorage.getItem(key)
        if (lsVal) {
          backupData.data[key] = JSON.parse(lsVal)
        }
      }
    } catch (e) {
      console.warn(`Failed to export key "${key}":`, e)
    }
  }

  const jsonString = JSON.stringify(backupData, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `durable_site_content_backup_${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}

/**
 * Import a JSON backup file and restore all keys into IndexedDB and LocalStorage
 */
export async function importFullBackupJSON(jsonFile: File): Promise<number> {
  if (typeof window === 'undefined') return 0

  const text = await jsonFile.text()
  const parsed = JSON.parse(text)

  const contentMap = parsed.data || parsed
  let restoredCount = 0

  for (const [key, value] of Object.entries(contentMap)) {
    if (value !== undefined && value !== null) {
      try {
        await setItemIDB(key, value)
        try {
          localStorage.setItem(key, JSON.stringify(value))
        } catch (lsErr) {
          // Ignore LS quota exceeded
        }
        restoredCount++
      } catch (e) {
        console.error(`Failed to restore key "${key}":`, e)
      }
    }
  }

  window.dispatchEvent(new Event('durable_content_updated'))
  return restoredCount
}

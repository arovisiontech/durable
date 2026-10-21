'use client'

/**
 * Robust Dual Storage Engine (IndexedDB + LocalStorage)
 * Handles large binary uploads, base64 images, and massive PDFs (1000+ pages)
 * preventing QuotaExceededError crashes in browser LocalStorage.
 * Includes Tombstone Tracking for deleted items to prevent resurrecting deleted records.
 */

const DB_NAME = 'durable_app_db'
const DB_VERSION = 1
const STORE_NAME = 'durable_store'
const DELETED_IDS_PREFIX = 'durable_deleted_ids_'

// Helper to open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject('IndexedDB not supported in server environment')
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/**
 * Async Set Item to IndexedDB
 */
export async function setItemIDB<T>(key: string, value: T): Promise<void> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const req = store.put(value, key)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  } catch (e) {
    console.warn(`[persistentStorage] IDB save error for key "${key}":`, e)
  }
}

/**
 * Async Get Item from IndexedDB
 */
export async function getItemIDB<T>(key: string): Promise<T | null> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const req = store.get(key)
      req.onsuccess = () => resolve(req.result !== undefined ? (req.result as T) : null)
      req.onerror = () => reject(req.error)
    })
  } catch (e) {
    return null
  }
}

/**
 * Tombstone Tracking: Get set of deleted item IDs for a given key
 */
export function getDeletedIds(key: string): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(`${DELETED_IDS_PREFIX}${key}`)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return new Set(parsed)
    }
  } catch {}
  return new Set()
}

/**
 * Tombstone Tracking: Record a deleted item ID to prevent resurrection
 */
export function recordDeletedId(key: string, id: string): void {
  if (typeof window === 'undefined' || !id) return
  try {
    const set = getDeletedIds(key)
    set.add(id)
    localStorage.setItem(`${DELETED_IDS_PREFIX}${key}`, JSON.stringify(Array.from(set)))
  } catch {}
}

/**
 * Tombstone Tracking: Clear a deleted item ID (e.g. if re-created)
 */
export function clearDeletedId(key: string, id: string): void {
  if (typeof window === 'undefined' || !id) return
  try {
    const set = getDeletedIds(key)
    if (set.delete(id)) {
      localStorage.setItem(`${DELETED_IDS_PREFIX}${key}`, JSON.stringify(Array.from(set)))
    }
  } catch {}
}

/**
 * Filters out deleted items and dummy placeholder items
 */
export function filterDeletedItems<T>(key: string, items: T[]): T[] {
  if (!Array.isArray(items)) return items
  const deleted = getDeletedIds(key)

  return items.filter((item: any) => {
    if (!item) return false
    const itemId = item.id
    if (itemId && deleted.has(itemId)) return false

    // Built-in safeguard for durable_process_data:
    // Permanently filter out the test item "proc-1792547532465-236o" and dummy "Text"
    if (key === 'durable_process_data') {
      if (itemId === 'proc-1792547532465-236o') return false
      const titleLower = (item.title || '').trim().toLowerCase()
      if (titleLower === 'text' && (!item.description || item.description.trim() === '')) {
        return false
      }
    }
    return true
  })
}

/**
 * Synchronous LocalStorage Get with Try-Catch and Deleted IDs Filter
 */
export function getLocalStorageSync<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const item = localStorage.getItem(key)
    if (item) {
      const parsed = JSON.parse(item)
      if (parsed !== null && parsed !== undefined) {
        if (Array.isArray(parsed)) {
          return filterDeletedItems(key, parsed) as unknown as T
        }
        return parsed
      }
    }
  } catch (e) {
    console.warn(`[persistentStorage] LocalStorage read error for key "${key}":`, e)
  }
  return defaultValue
}

/**
 * Safe Unified Save Function:
 * Saves to IndexedDB (no quota limit) AND LocalStorage (with fallback if QuotaExceededError occurs)
 * Dispatches 'durable_content_updated' window event for live client UI sync.
 */
export function savePersistentData<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return

  const cleanValue = Array.isArray(value) ? filterDeletedItems(key, value) : value

  // 1. Save to IndexedDB (asynchronously in background, unlimited capacity)
  setItemIDB(key, cleanValue).catch((err) => {
    console.error(`[persistentStorage] Failed to store "${key}" in IndexedDB:`, err)
  })

  // 2. Try saving to LocalStorage
  try {
    localStorage.setItem(key, JSON.stringify(cleanValue))
  } catch (e: any) {
    console.warn(
      `[persistentStorage] LocalStorage quota exceeded for key "${key}". Preserving in IndexedDB.`,
      e
    )
  }

  // 3. Sync to Cloud API globally across all devices with keepalive
  fetch('/api/sync', {
    method: 'POST',
    keepalive: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      key,
      value: cleanValue,
      deletedIds: Array.from(getDeletedIds(key)),
    }),
  }).catch((err) => {
    console.warn(`[persistentStorage] Cloud sync POST notice for "${key}":`, err)
  })

  // 4. Dispatch global live update event
  window.dispatchEvent(new Event('durable_content_updated'))
}

/**
 * Async Awaitable Save Function:
 * Guarantees that cloud sync network request completes before returning.
 */
export async function savePersistentDataAsync<T>(
  key: string,
  value: T,
  deletedId?: string
): Promise<boolean> {
  if (typeof window === 'undefined') return true

  if (deletedId) {
    recordDeletedId(key, deletedId)
  }

  const cleanValue = Array.isArray(value) ? filterDeletedItems(key, value) : value

  // 1. Save to LocalStorage immediately
  try {
    localStorage.setItem(key, JSON.stringify(cleanValue))
  } catch (e) {}

  // 2. Save to IndexedDB
  await setItemIDB(key, cleanValue).catch(() => {})

  // 3. Await Cloud POST with keepalive
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key,
        value: cleanValue,
        deletedId,
        deletedIds: Array.from(getDeletedIds(key)),
      }),
    })
    const data = await res.json()
    window.dispatchEvent(new Event('durable_content_updated'))
    return data?.success ?? true
  } catch (err) {
    window.dispatchEvent(new Event('durable_content_updated'))
    return false
  }
}

/**
 * Unified Load Function (Fast LocalStorage Sync read + IDB Async + Cloud API Sync)
 */
export function loadPersistentData<T>(
  key: string,
  defaultValue: T,
  onLoaded: (data: T) => void
): T {
  const syncData = getLocalStorageSync<T>(key, defaultValue)

  if (typeof window !== 'undefined') {
    let currentBestData: T =
      syncData !== defaultValue && syncData !== null && syncData !== undefined
        ? syncData
        : defaultValue

    // 1. Load from IndexedDB
    getItemIDB<T>(key)
      .then((idbData) => {
        if (idbData !== null && idbData !== undefined) {
          const cleanIdb = Array.isArray(idbData) ? (filterDeletedItems(key, idbData) as unknown as T) : idbData
          currentBestData = cleanIdb
          onLoaded(cleanIdb)
        } else if (syncData !== defaultValue && syncData !== null && syncData !== undefined) {
          onLoaded(syncData)
        }
      })
      .catch(() => {
        if (syncData !== defaultValue && syncData !== null && syncData !== undefined) {
          onLoaded(syncData)
        }
      })

    // 2. Fetch latest saved data from Cloud DB (/api/sync) automatically across all devices
    fetch(`/api/sync?key=${encodeURIComponent(key)}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData && resData.success && resData.data !== null && resData.data !== undefined) {
          let cloudData = resData.data
          if (Array.isArray(cloudData)) {
            cloudData = filterDeletedItems(key, cloudData)
          }

          // If cloud had items that were deleted locally, heal the cloud in background
          if (
            Array.isArray(resData.data) &&
            Array.isArray(cloudData) &&
            cloudData.length < resData.data.length
          ) {
            fetch('/api/sync', {
              method: 'POST',
              keepalive: true,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                key,
                value: cloudData,
                deletedIds: Array.from(getDeletedIds(key)),
              }),
            }).catch(() => {})
          }

          currentBestData = cloudData
          onLoaded(cloudData)

          // Update local IDB & LocalStorage with latest filtered cloud data
          setItemIDB(key, cloudData).catch(() => {})
          try {
            localStorage.setItem(key, JSON.stringify(cloudData))
          } catch (e) {}
        }
      })
      .catch((err) => {
        console.warn(`[persistentStorage] Cloud sync GET notice for "${key}":`, err)
      })
  }

  return syncData
}

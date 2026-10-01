'use client'

/**
 * Robust Dual Storage Engine (IndexedDB + LocalStorage)
 * Handles large binary uploads, base64 images, and massive PDFs (1000+ pages)
 * preventing QuotaExceededError crashes in browser LocalStorage.
 */

const DB_NAME = 'durable_app_db'
const DB_VERSION = 1
const STORE_NAME = 'durable_store'

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
 * Synchronous LocalStorage Get with Try-Catch
 */
export function getLocalStorageSync<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const item = localStorage.getItem(key)
    if (item) {
      const parsed = JSON.parse(item)
      if (parsed !== null && parsed !== undefined) return parsed
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

  // 1. Save to IndexedDB (asynchronously in background, unlimited capacity)
  setItemIDB(key, value).catch((err) => {
    console.error(`[persistentStorage] Failed to store "${key}" in IndexedDB:`, err)
  })

  // 2. Try saving to LocalStorage
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e: any) {
    console.warn(
      `[persistentStorage] LocalStorage quota exceeded for key "${key}". Preserving in IndexedDB.`,
      e
    )
    // If LocalStorage quota exceeded due to large base64 image or PDF, clear light key or trim
    try {
      // Clean up orphaned cache keys if necessary
      const lightValue = JSON.stringify(value, (k, v) => {
        if (typeof v === 'string' && v.startsWith('data:') && v.length > 50000) {
          // Truncate long base64 in localstorage preview, IndexedDB retains 100% full quality!
          return v.slice(0, 500) + '...[IDB_FULL_BLOB]'
        }
        return v
      })
      localStorage.setItem(key, lightValue)
    } catch (innerErr) {
      // Ignored: IndexedDB holds the authoritative full data!
    }
  }

  // 3. Dispatch global live update event
  window.dispatchEvent(new Event('durable_content_updated'))
}

/**
 * Unified Load Function (Fast LocalStorage Sync read + IDB Async fallback sync)
 */
export function loadPersistentData<T>(
  key: string,
  defaultValue: T,
  onLoaded: (data: T) => void
): T {
  const syncData = getLocalStorageSync<T>(key, defaultValue)

  if (typeof window !== 'undefined') {
    getItemIDB<T>(key)
      .then((idbData) => {
        if (idbData !== null && idbData !== undefined) {
          onLoaded(idbData)
        } else if (syncData !== defaultValue) {
          onLoaded(syncData)
        }
      })
      .catch(() => {
        onLoaded(syncData)
      })
  }

  return syncData
}

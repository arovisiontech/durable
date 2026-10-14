import fs from 'fs'
import path from 'path'
import { ProductItem } from '@/src/types/product'
import { CategoryItem } from '@/src/types/category'
import { CatalogueItem } from '@/src/types/catalogue'
import {
  INITIAL_CATEGORIES_SEED,
  INITIAL_PRODUCTS_SEED,
  INITIAL_CATALOGUES_SEED,
  INITIAL_SUBCATEGORY_PDF_SEED,
  SubcategoryPdfItem,
} from '@/src/lib/dataStore'

const DATA_DIR = path.join(process.cwd(), 'src', 'data')
const DATA_FILE = path.join(DATA_DIR, 'persistent_data.json')

interface StoreShape {
  durable_categories: CategoryItem[]
  durable_products: ProductItem[]
  durable_catalogues: CatalogueItem[]
  durable_subcategories_pdf: SubcategoryPdfItem[]
  [key: string]: any
}

// In-memory cache for ultra-fast access
let memoryStore: StoreShape | null = null

function ensureInitialized(): StoreShape {
  if (memoryStore) return memoryStore

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }

    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8')
      if (content.trim()) {
        const parsed = JSON.parse(content)
        memoryStore = {
          durable_categories: Array.isArray(parsed.durable_categories)
            ? parsed.durable_categories
            : [...INITIAL_CATEGORIES_SEED],
          durable_products: Array.isArray(parsed.durable_products)
            ? parsed.durable_products
            : [...INITIAL_PRODUCTS_SEED],
          durable_catalogues: Array.isArray(parsed.durable_catalogues)
            ? parsed.durable_catalogues
            : [...INITIAL_CATALOGUES_SEED],
          durable_subcategories_pdf: Array.isArray(parsed.durable_subcategories_pdf)
            ? parsed.durable_subcategories_pdf
            : [...INITIAL_SUBCATEGORY_PDF_SEED],
          ...parsed,
        }
        return memoryStore!
      }
    }
  } catch (err) {
    console.warn('[serverDataStore] Read initialization warning:', err)
  }

  // Fallback initial store with exact seed data
  memoryStore = {
    durable_categories: [...INITIAL_CATEGORIES_SEED],
    durable_products: [...INITIAL_PRODUCTS_SEED],
    durable_catalogues: [...INITIAL_CATALOGUES_SEED],
    durable_subcategories_pdf: [...INITIAL_SUBCATEGORY_PDF_SEED],
  }

  persistToFile(memoryStore)
  return memoryStore
}

function persistToFile(store: StoreShape): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    const tempFile = `${DATA_FILE}.tmp`
    fs.writeFileSync(tempFile, JSON.stringify(store, null, 2), 'utf-8')
    fs.renameSync(tempFile, DATA_FILE)
  } catch (err) {
    console.error('[serverDataStore] Failed to write data file:', err)
  }
}

// Generic Key-Value Getters and Setters
export function getServerData<T>(key: string, defaultValue: T): T {
  const store = ensureInitialized()
  if (store[key] !== undefined && store[key] !== null) {
    return store[key] as T
  }
  return defaultValue
}

export function setServerData<T>(key: string, value: T): void {
  const store = ensureInitialized()
  store[key] = value
  persistToFile(store)
}

export function getAllServerData(): Record<string, any> {
  return ensureInitialized()
}

// -------------------------------------------------------------
// Specialized Entities CRUD with Guaranteed Persistence
// -------------------------------------------------------------

// 1. PRODUCTS
export function getServerProducts(): ProductItem[] {
  const store = ensureInitialized()
  return store.durable_products || []
}

export function saveServerProducts(products: ProductItem[]): void {
  const store = ensureInitialized()
  store.durable_products = products
  persistToFile(store)
}

export function getServerProductByIdOrSlug(idOrSlug: string): ProductItem | null {
  const products = getServerProducts()
  const lower = idOrSlug.toLowerCase().trim()
  return (
    products.find(
      (p) =>
        p.id === idOrSlug ||
        p.slug.toLowerCase() === lower ||
        p.id.toLowerCase() === lower
    ) || null
  )
}

export function upsertServerProduct(product: ProductItem): ProductItem {
  const products = getServerProducts()
  const index = products.findIndex(
    (p) => p.id === product.id || (product.slug && p.slug === product.slug)
  )

  if (index >= 0) {
    products[index] = {
      ...products[index],
      ...product,
      updated_at: new Date().toISOString(),
    }
  } else {
    products.push({
      ...product,
      created_at: product.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  }

  saveServerProducts(products)
  return product
}

export function deleteServerProduct(id: string): boolean {
  const products = getServerProducts()
  const filtered = products.filter((p) => p.id !== id && p.slug !== id)
  if (filtered.length !== products.length) {
    saveServerProducts(filtered)
    return true
  }
  return false
}

// 2. CATEGORIES
export function getServerCategories(): CategoryItem[] {
  const store = ensureInitialized()
  return store.durable_categories || []
}

export function saveServerCategories(categories: CategoryItem[]): void {
  const store = ensureInitialized()
  store.durable_categories = categories
  persistToFile(store)
}

export function upsertServerCategory(category: CategoryItem): CategoryItem {
  const categories = getServerCategories()
  const index = categories.findIndex(
    (c) => c.id === category.id || (category.slug && c.slug === category.slug)
  )

  if (index >= 0) {
    categories[index] = {
      ...categories[index],
      ...category,
      updated_at: new Date().toISOString(),
    }
  } else {
    categories.push({
      ...category,
      created_at: category.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  }

  saveServerCategories(categories)
  return category
}

export function deleteServerCategory(id: string): boolean {
  const categories = getServerCategories()
  const filtered = categories.filter((c) => c.id !== id && c.slug !== id)
  if (filtered.length !== categories.length) {
    saveServerCategories(filtered)
    return true
  }
  return false
}

// 3. CATALOGUES
export function getServerCatalogues(): CatalogueItem[] {
  const store = ensureInitialized()
  return store.durable_catalogues || []
}

export function saveServerCatalogues(catalogues: CatalogueItem[]): void {
  const store = ensureInitialized()
  store.durable_catalogues = catalogues
  persistToFile(store)
}

export function upsertServerCatalogue(catalogue: CatalogueItem): CatalogueItem {
  const catalogues = getServerCatalogues()
  const index = catalogues.findIndex(
    (c) => c.id === catalogue.id || (catalogue.slug && c.slug === catalogue.slug)
  )

  if (index >= 0) {
    catalogues[index] = {
      ...catalogues[index],
      ...catalogue,
      updated_at: new Date().toISOString(),
    }
  } else {
    catalogues.push({
      ...catalogue,
      created_at: catalogue.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  }

  saveServerCatalogues(catalogues)
  return catalogue
}

export function deleteServerCatalogue(id: string): boolean {
  const catalogues = getServerCatalogues()
  const filtered = catalogues.filter((c) => c.id !== id && c.slug !== id)
  if (filtered.length !== catalogues.length) {
    saveServerCatalogues(filtered)
    return true
  }
  return false
}

// 4. SUBCATEGORY PDFS
export function getServerSubcategoryPdfs(): SubcategoryPdfItem[] {
  const store = ensureInitialized()
  return store.durable_subcategories_pdf || []
}

export function saveServerSubcategoryPdfs(items: SubcategoryPdfItem[]): void {
  const store = ensureInitialized()
  store.durable_subcategories_pdf = items
  persistToFile(store)
}

export function upsertServerSubcategoryPdf(item: SubcategoryPdfItem): SubcategoryPdfItem {
  const items = getServerSubcategoryPdfs()
  const index = items.findIndex((s) => s.id === item.id)

  if (index >= 0) {
    items[index] = { ...items[index], ...item }
  } else {
    items.push(item)
  }

  saveServerSubcategoryPdfs(items)
  return item
}

export function deleteServerSubcategoryPdf(id: string): boolean {
  const items = getServerSubcategoryPdfs()
  const filtered = items.filter((s) => s.id !== id)
  if (filtered.length !== items.length) {
    saveServerSubcategoryPdfs(filtered)
    return true
  }
  return false
}

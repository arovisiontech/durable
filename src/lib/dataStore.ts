import { CATEGORIES_DATA } from '@/src/data/categoriesData'
import { ProductItem } from '@/src/types/product'
import { CategoryItem } from '@/src/types/category'
import { CatalogueItem } from '@/src/types/catalogue'

export type { ProductItem, CategoryItem, CatalogueItem }

// Initial Default Categories Seed
export const INITIAL_CATEGORIES_SEED: CategoryItem[] = [
  {
    id: 'cat-gen-surg',
    parent_id: null,
    name: 'General Surgery',
    slug: 'general-surgery',
    description: 'General surgical tools including scissors, forceps, retractors, scalpel handles, and clamps.',
    image_url: '/images/cat-scissors-shears.png',
    sort_order: 1,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_count: 6,
    level: 0,
  },
  {
    id: 'cat-dental',
    parent_id: null,
    name: 'Dental & Restorative',
    slug: 'dental',
    description: 'Ergonomic restorative, periodontal, extraction, and orthodontic dental instruments.',
    image_url: '/images/icon-dental.png',
    sort_order: 2,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_count: 4,
    level: 0,
  },
  {
    id: 'cat-extraction',
    parent_id: 'cat-dental',
    name: 'Extraction & Oral Surgery',
    slug: 'extraction-oral-surgery',
    description: 'Extracting forceps, root elevators, luxators, and bone chisels.',
    image_url: '/images/dental-clinic-banner.png',
    sort_order: 3,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parent_name: 'Dental & Restorative',
    product_count: 3,
    level: 1,
  },
  {
    id: 'cat-bone-surg',
    parent_id: 'cat-dental',
    name: 'Dental Bone Surgery',
    slug: 'dental-bone-surgery',
    description: 'Osteotomes, gouges, chisels, bone rongeurs, and surgical mallets.',
    image_url: '/images/blog-instruments-tray.png',
    sort_order: 4,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parent_name: 'Dental & Restorative',
    product_count: 2,
    level: 1,
  },
  {
    id: 'cat-perio',
    parent_id: 'cat-dental',
    name: 'Periodontics & Cleaning',
    slug: 'periodontics-cleaning',
    description: 'Scalers, Gracey curettes, periodontal probes, and amalgam carvers.',
    image_url: '/images/icon-dental.png',
    sort_order: 5,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parent_name: 'Dental & Restorative',
    product_count: 2,
    level: 1,
  },
  {
    id: 'cat-endo',
    parent_id: 'cat-dental',
    name: 'Endodontics & Root Canal',
    slug: 'endodontics',
    description: 'Root canal spreaders, pluggers, impression trays, and matrix bands.',
    image_url: '/images/surgical-tray-durable.png',
    sort_order: 6,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parent_name: 'Dental & Restorative',
    product_count: 2,
    level: 1,
  },
  {
    id: 'cat-diag',
    parent_id: 'cat-dental',
    name: 'Diagnostic & Examination',
    slug: 'diagnostic',
    description: 'Mouth mirrors, rhodium mirrors, explorers, and locking tweezers.',
    image_url: '/images/blog-instruments-tray.png',
    sort_order: 7,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parent_name: 'Dental & Restorative',
    product_count: 2,
    level: 1,
  },
  {
    id: 'cat-ortho',
    parent_id: null,
    name: 'Bone & Orthopedic Instruments',
    slug: 'orthopedic-instruments',
    description: 'Bone chisels, osteotomes, mallets, rongeurs, and bone holding forceps.',
    image_url: '/images/cat-forceps-clamps.png',
    sort_order: 8,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_count: 2,
    level: 0,
  },
  {
    id: 'cat-hollowware',
    parent_id: null,
    name: 'Medical Hollowware',
    slug: 'medical-hollowware',
    description: 'Storage trays, kidney basins, gallipots, and autoclave boxes.',
    image_url: '/images/surgical-tray-durable.png',
    sort_order: 9,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_count: 2,
    level: 0,
  },
  {
    id: 'cat-ophthalmic',
    parent_id: null,
    name: 'Ophthalmic Micro-Surgery',
    slug: 'ophthalmic',
    description: 'Micro-forceps, eye speculums, corneal scissors, and micro cassettes.',
    image_url: '/images/blog-instruments-tray.png',
    sort_order: 10,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_count: 1,
    level: 0,
  },
  {
    id: 'cat-furniture',
    parent_id: null,
    name: 'Hospital Furniture',
    slug: 'hospital-furniture',
    description: 'Hospital beds, MAYO instrument trolleys, IV poles, and examination tables.',
    image_url: '/images/icon-hospital-furniture.png',
    sort_order: 11,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_count: 1,
    level: 0,
  },
  {
    id: 'cat-single-use',
    parent_id: null,
    name: 'Single Use Sterile Instruments',
    slug: 'single-use-instruments',
    description: 'Pre-sterilized single-use disposable surgical packs and suture removal kits.',
    image_url: '/images/icon-single-use-instruments.png',
    sort_order: 12,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_count: 1,
    level: 0,
  },
]

// Extract Initial Products Seed from CATEGORIES_DATA
export const INITIAL_PRODUCTS_SEED: ProductItem[] = Object.values(CATEGORIES_DATA).flatMap((cat, catIdx) => {
  return cat.products.map((p, pIdx) => {
    const specsMap: Record<string, string> = {}
    if (p.specs) {
      const parts = p.specs.split(',')
      parts.forEach((pt, i) => {
        specsMap[`Spec ${i + 1}`] = pt.trim()
      })
    }

    return {
      id: p.id,
      category_id: `cat-${cat.slug}`,
      title: p.title,
      slug: `${p.id}-${p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      sku: p.sku || `SKU-${p.id.toUpperCase()}`,
      short_description: p.description,
      full_description: `${p.description} Manufactured to precision standards using German and Japanese stainless steel. Certified ISO 13485 & CE compliant.`,
      featured_image: p.image,
      features: [
        'Crafted from Japanese AISI 420 Stainless Steel',
        'ISO 13485:2016 and CE Compliant',
        'Precision Heat Treated & Nitric Passivated',
        'Autoclavable at 134°C / 273°F',
      ],
      specifications: specsMap,
      catalogue_pdf: '/pdf/general-surgical-instruments-catalogue.pdf',
      is_featured: pIdx % 2 === 0,
      is_published: true,
      seo_title: `${p.title} - Durable Hospital Supplies`,
      seo_description: p.description,
      sort_order: catIdx * 10 + pIdx + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category_name: p.categoryName || cat.title,
      gallery_images: [
        { id: `img-1-${p.id}`, product_id: p.id, image_url: p.image, alt_text: p.title, sort_order: 1 },
      ],
    }
  })
})

// Initial Catalogues Seed
export const INITIAL_CATALOGUES_SEED: CatalogueItem[] = [
  {
    id: 'cat-pdf-1',
    category_id: 'cat-gen-surg',
    title: 'General Surgical Instruments Catalogue 2026',
    slug: 'general-surgical-instruments-catalogue',
    description: 'Comprehensive catalogue of dissection scissors, hemostatic forceps, retractors, and scalpel handles.',
    cover_image: '/images/blog-instruments-tray.png',
    pdf_url: '/pdf/general-surgical-instruments-catalogue.pdf',
    is_published: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'General Surgery',
  },
  {
    id: 'cat-pdf-2',
    category_id: 'cat-dental',
    title: 'Dental & Restorative Instruments Catalogue',
    slug: 'dental-restorative-catalogue',
    description: 'Full range catalogue of ergonomic restorative, periodontal, extraction, and orthodontic instruments.',
    cover_image: '/images/dental-clinic-banner.png',
    pdf_url: '/pdf/dental-restorative-catalogue.pdf',
    is_published: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Dental & Restorative',
  },
  {
    id: 'cat-pdf-3',
    category_id: 'cat-ortho',
    title: 'Orthopedic & Bone Surgery Catalogue',
    slug: 'orthopedic-bone-surgery-catalogue',
    description: 'Bone chisels, osteotomes, mallets, rongeurs, gouges, and bone holding forceps catalogue.',
    cover_image: '/images/cat-forceps-clamps.png',
    pdf_url: '/pdf/orthopedic-catalogue.pdf',
    is_published: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Bone & Orthopedic Instruments',
  },
  {
    id: 'cat-pdf-4',
    category_id: 'cat-hollowware',
    title: 'Gynecology, ENT & Ophthalmic Catalogue',
    slug: 'gynecology-ent-catalogue',
    description: 'Complete range of ENT speculums, ear curettes, vaginal speculums, and micro-scissors.',
    cover_image: '/images/cat-retractors.png',
    pdf_url: '/pdf/gynecology-ent-catalogue.pdf',
    is_published: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Medical Hollowware',
  },
  {
    id: 'cat-pdf-5',
    category_id: 'cat-single-use',
    title: 'Custom Procedure Kits & Single Use Sterile Packs',
    slug: 'custom-procedure-kits-catalogue',
    description: 'Pre-sterilized single-use disposable surgical packs, suture removal kits, and laparoscopic sets.',
    cover_image: '/images/surgical-tray-durable.png',
    pdf_url: '/pdf/custom-kits-catalogue.pdf',
    is_published: true,
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Single Use Sterile Instruments',
  },
]

// CLIENT-SIDE LOCAL STORAGE DATA ACCESSORS & SYNC HELPERS

export function getStoredCategories(): CategoryItem[] {
  if (typeof window === 'undefined') return INITIAL_CATEGORIES_SEED
  try {
    const raw = localStorage.getItem('durable_categories')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    console.error('Failed to parse categories from localStorage:', e)
  }
  return INITIAL_CATEGORIES_SEED
}

export function saveStoredCategories(categories: CategoryItem[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('durable_categories', JSON.stringify(categories))
    window.dispatchEvent(new Event('durable_content_updated'))
  } catch (e) {
    console.error('Failed to save categories to localStorage:', e)
  }
}

export function getStoredProducts(): ProductItem[] {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS_SEED
  try {
    const raw = localStorage.getItem('durable_products')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    } else {
      localStorage.setItem('durable_products', JSON.stringify(INITIAL_PRODUCTS_SEED))
      return INITIAL_PRODUCTS_SEED
    }
  } catch (e) {
    console.error('Failed to parse products from localStorage:', e)
  }
  return INITIAL_PRODUCTS_SEED
}

export function saveStoredProducts(products: ProductItem[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('durable_products', JSON.stringify(products))
    window.dispatchEvent(new Event('durable_content_updated'))
  } catch (e) {
    console.error('Failed to save products to localStorage:', e)
  }
}

export function getStoredCatalogues(): CatalogueItem[] {
  if (typeof window === 'undefined') return INITIAL_CATALOGUES_SEED
  try {
    const raw = localStorage.getItem('durable_catalogues')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    console.error('Failed to parse catalogues from localStorage:', e)
  }
  return INITIAL_CATALOGUES_SEED
}

export function saveStoredCatalogues(catalogues: CatalogueItem[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('durable_catalogues', JSON.stringify(catalogues))
    window.dispatchEvent(new Event('durable_content_updated'))
  } catch (e) {
    console.error('Failed to save catalogues to localStorage:', e)
  }
}

export interface SubcategoryPdfItem {
  id: string
  categorySlug: string
  categoryName: string
  title: string
  image: string
  pdfUrl: string
  accessCode: string
  description?: string
  sortOrder?: number
  isPublished?: boolean
}

export const INITIAL_SUBCATEGORY_PDF_SEED: SubcategoryPdfItem[] = [
  // GENERAL SURGERY SUBCATEGORIES (SS 2)
  {
    id: 'sub-gen-1',
    categorySlug: 'general-surgery',
    categoryName: 'General Surgery',
    title: 'Anesthesia',
    image: '/images/blog-surgeon-scalpel.png',
    pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    description: 'Experience Future of Anesthesia Instruments with ENDO Tech',
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: 'sub-gen-2',
    categorySlug: 'general-surgery',
    categoryName: 'General Surgery',
    title: 'Diagnostic',
    image: '/images/blog-instruments-tray.png',
    pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    description: 'Experience Future of Diagnostic Instruments with ENDO Tech',
    sortOrder: 2,
    isPublished: true,
  },
  {
    id: 'sub-gen-3',
    categorySlug: 'general-surgery',
    categoryName: 'General Surgery',
    title: 'Scissors',
    image: '/images/cat-scissors-shears.png',
    pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    description: 'Experience Future of Scissors with ENDO Tech',
    sortOrder: 3,
    isPublished: true,
  },
  {
    id: 'sub-gen-4',
    categorySlug: 'general-surgery',
    categoryName: 'General Surgery',
    title: 'Dissecting Forcep',
    image: '/images/cat-forceps-clamps.png',
    pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    description: 'Experience Future of Dissecting Forcep with ENDO Tech',
    sortOrder: 4,
    isPublished: true,
  },
  {
    id: 'sub-gen-5',
    categorySlug: 'general-surgery',
    categoryName: 'General Surgery',
    title: 'Hemostatic Clamps',
    image: '/images/surgical-tray-durable.png',
    pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    description: 'Hemostatic locking clamps and vascular forceps.',
    sortOrder: 5,
    isPublished: true,
  },

  // DENTAL SUBCATEGORIES
  {
    id: 'sub-dent-1',
    categorySlug: 'dental',
    categoryName: 'Dental',
    title: 'Extraction & Oral Surgery',
    image: '/images/dental-clinic-banner.png',
    pdfUrl: '/pdf/dental-maxillofacial-catalogue.pdf',
    accessCode: '12345',
    description: 'Extracting forceps in English & American patterns, root elevators, and luxators.',
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: 'sub-dent-2',
    categorySlug: 'dental',
    categoryName: 'Dental',
    title: 'Dental Bone Surgery',
    image: '/images/blog-instruments-tray.png',
    pdfUrl: '/pdf/dental-maxillofacial-catalogue.pdf',
    accessCode: '12345',
    description: 'Osteotomes, gouges, chisels, bone rongeurs, and surgical mallets.',
    sortOrder: 2,
    isPublished: true,
  },
  {
    id: 'sub-dent-3',
    categorySlug: 'dental',
    categoryName: 'Dental',
    title: 'Periodontics & Cleaning',
    image: '/images/icon-dental.png',
    pdfUrl: '/pdf/dental-maxillofacial-catalogue.pdf',
    accessCode: '12345',
    description: 'Scalers, Gracey curettes, periodontal probes, and amalgam carvers.',
    sortOrder: 3,
    isPublished: true,
  },

  // MEDICAL HOLLOWWARE SUBCATEGORIES
  {
    id: 'sub-hol-1',
    categorySlug: 'medical-hollowware',
    categoryName: 'Medical Hollowware',
    title: 'Sterilization Trays & Containers',
    image: '/images/surgical-tray-durable.png',
    pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    description: 'Seamless 304 stainless steel sterilization trays, lids, and container baskets.',
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: 'sub-hol-2',
    categorySlug: 'medical-hollowware',
    categoryName: 'Medical Hollowware',
    title: 'Kidney Dishes & Gallipots',
    image: '/images/cat-retractors.png',
    pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    description: 'Kidney basins, procedure bowls, and gallipots for surgical suites.',
    sortOrder: 2,
    isPublished: true,
  },

  // OPHTHALMIC SUBCATEGORIES
  {
    id: 'sub-oph-1',
    categorySlug: 'ophthalmic',
    categoryName: 'Ophthalmic',
    title: 'Corneal Scissors & Speculums',
    image: '/images/blog-surgeon-scalpel.png',
    pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    description: 'Ultra-delicate micro-scissors, eye speculums, and eye speculum blades.',
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: 'sub-oph-2',
    categorySlug: 'ophthalmic',
    categoryName: 'Ophthalmic',
    title: 'Cataract Micro-Forceps',
    image: '/images/blog-instruments-tray.png',
    pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    description: 'Micro-forceps with 0.12mm teeth and tying platforms.',
    sortOrder: 2,
    isPublished: true,
  },

  // HOSPITAL FURNITURE SUBCATEGORIES
  {
    id: 'sub-fur-1',
    categorySlug: 'hospital-furniture',
    categoryName: 'Hospital Furniture',
    title: 'MAYO Instrument Trolleys',
    image: '/images/about-surgical-instruments.png',
    pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    description: 'Hydraulic height-adjustable MAYO instrument stands with anti-static casters.',
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: 'sub-fur-2',
    categorySlug: 'hospital-furniture',
    categoryName: 'Hospital Furniture',
    title: 'Examination & Ward Beds',
    image: '/images/icon-hospital-furniture.png',
    pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    description: 'Heavy duty hospital ward beds and clinical examination couches.',
    sortOrder: 2,
    isPublished: true,
  },

  // SINGLE USE INSTRUMENTS SUBCATEGORIES
  {
    id: 'sub-sgl-1',
    categorySlug: 'single-use-instruments',
    categoryName: 'Single Use Instruments',
    title: 'Sterile Procedure Packs',
    image: '/images/process-hand-filing.png',
    pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    description: 'Pre-sterilized single use disposable surgical procedure packs.',
    sortOrder: 1,
    isPublished: true,
  },
]

export function getStoredSubcategoryPdfs(): SubcategoryPdfItem[] {
  if (typeof window === 'undefined') return INITIAL_SUBCATEGORY_PDF_SEED
  try {
    const raw = localStorage.getItem('durable_subcategories_pdf')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    console.error('Failed to parse subcategory PDFs from localStorage:', e)
  }
  return INITIAL_SUBCATEGORY_PDF_SEED
}

export function saveStoredSubcategoryPdfs(items: SubcategoryPdfItem[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('durable_subcategories_pdf', JSON.stringify(items))
    window.dispatchEvent(new Event('durable_content_updated'))
  } catch (e) {
    console.error('Failed to save subcategory PDFs to localStorage:', e)
  }
}


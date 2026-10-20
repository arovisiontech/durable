import { CATEGORIES_DATA } from '@/src/data/categoriesData'
import { ProductItem } from '@/src/types/product'
import { CategoryItem } from '@/src/types/category'
import { CatalogueItem } from '@/src/types/catalogue'
import persistentData from '@/src/data/persistent_data.json'

export type { ProductItem, CategoryItem, CatalogueItem }

// Initial Default Categories Seed (Matching exact 9 Categories in SS 2)
export const INITIAL_CATEGORIES_SEED: CategoryItem[] =
  Array.isArray((persistentData as any)?.durable_categories) && (persistentData as any).durable_categories.length > 0
    ? (persistentData as any).durable_categories
    : [
  {
    id: 'cat-gen-surg',
    parent_id: null,
    name: 'General Surgery',
    slug: 'general-surgery',
    description: 'Precision Instruments For All Surgical Discipline',
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
    name: 'Dental',
    slug: 'dental',
    description: 'Complete Dental Solutions For Every Specialty',
    image_url: '/images/icon-dental.png',
    sort_order: 2,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_count: 4,
    level: 0,
  },
  {
    id: 'cat-hollowware',
    parent_id: null,
    name: 'Medical Hollowware',
    slug: 'medical-hollowware',
    description: 'Instrument Storage & Sterilization Solutions',
    image_url: '/images/cat-handles-blades.png',
    sort_order: 3,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_count: 2,
    level: 0,
  },
  {
    id: 'cat-ophthalmic',
    parent_id: null,
    name: 'Ophthalmic',
    slug: 'ophthalmic',
    description: 'Complete Ophthalmic Instrument Range',
    image_url: '/images/cat-scissors-shears.png',
    sort_order: 4,
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
    description: 'Functional Solutions For Hospitals',
    image_url: '/images/icon-hospital-furniture.png',
    sort_order: 5,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_count: 1,
    level: 0,
  },
  {
    id: 'cat-single-use',
    parent_id: null,
    name: 'Single Use Instruments',
    slug: 'single-use-instruments',
    description: 'Reliable Single-Use Solutions',
    image_url: '/images/icon-single-use-instruments.png',
    sort_order: 6,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_count: 1,
    level: 0,
  },
  {
    id: 'cat-veterinary',
    parent_id: null,
    name: 'Veterinary-Instruments',
    slug: 'veterinary-instruments',
    description: 'Efficiency in veterinary procedures and animal healthcare.',
    image_url: '/images/cat-scissors-shears.png',
    sort_order: 7,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_count: 2,
    level: 0,
  },
  {
    id: 'cat-plastic-surgery',
    parent_id: null,
    name: 'Plastic Surgery',
    slug: 'plastic-surgery',
    description: 'Reliable performance in delicate plastic and reconstructive procedures.',
    image_url: '/images/cat-retractors.png',
    sort_order: 8,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_count: 2,
    level: 0,
  },
  {
    id: 'cat-special-surgical',
    parent_id: null,
    name: 'Special Surgical Instruments',
    slug: 'special-surgical-instruments',
    description: 'Specialized, precision-engineered instruments designed for demanding surgical procedures, offering excellent control, accuracy.',
    image_url: '/images/cat-handles-blades.png',
    sort_order: 9,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_count: 2,
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
export const INITIAL_CATALOGUES_SEED: CatalogueItem[] =
  Array.isArray((persistentData as any)?.durable_catalogues) && (persistentData as any).durable_catalogues.length > 0
    ? (persistentData as any).durable_catalogues
    : [
  {
    id: 'de7eebac-44e4-421e-9d25-bc80220ec6bd',
    category_id: null,
    title: 'General Surgery',
    slug: 'general-surgery',
    description: 'Technical specifications and product sizing guide.',
    cover_image: 'https://usxgwauwqhasrzaxcvyg.supabase.co/storage/v1/object/public/website-media/uploads/2026-10/1791542413711-whatsapp-image-2026-10-09-at-2-45-57-pm.jpeg',
    pdf_url: 'https://usxgwauwqhasrzaxcvyg.supabase.co/storage/v1/object/public/catalogues/5c36c424-4669-4aff-a735-66ba3344ac6f-HOSPITAL_FURNITURE_DURABLE.pdf',
    is_published: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'General Surgery',
  },
  {
    id: '729429af-e823-49d5-8c5f-b911499cd5c5',
    category_id: null,
    title: 'Durable Implant Catalogue',
    slug: 'durable-implant-catalogue',
    description: 'Explore our comprehensive range of high-quality <b>implant instruments</b>, designed to support precision, reliability, and consistent performance in surgical procedures. Manufactured with a focus on quality <b>craftsmanship</b>, durability, and attention to detail, our instruments meet the needs of healthcare professionals, hospitals, and medical distributors worldwide.',
    cover_image: 'https://usxgwauwqhasrzaxcvyg.supabase.co/storage/v1/object/public/website-media/uploads/2026-10/1791556633742-durable-implant-catalogue.jpg',
    pdf_url: 'https://usxgwauwqhasrzaxcvyg.supabase.co/storage/v1/object/public/catalogues/aafa12c2-e3c6-44fc-9e49-55923cb7dcc3-durable_implant_catalogue.pdf',
    is_published: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Implants',
  },
  {
    id: '948729d7-2291-46b5-b8c9-5e36e66d41ee',
    category_id: null,
    title: 'Dental Instruments',
    slug: 'dental-instruments',
    description: '<p class="isSelectedEnd">Explore our comprehensive range of high-quality <b>dental instruments</b>, designed for <i>precision, durability, and reliable performance</i> in dental procedures. Manufactured with a focus on quality craftsmanship and attention to detail, our instruments serve the needs of <b>dental professionals, clinics, hospitals</b>, and distributors worldwide.</p><p><b>Download our Dental Instruments Catalogue PDF to discover our product range and specifications.</b></p>',
    cover_image: 'https://usxgwauwqhasrzaxcvyg.supabase.co/storage/v1/object/public/website-media/uploads/2026-10/1791556496551-dental-durable.jpg',
    pdf_url: 'https://usxgwauwqhasrzaxcvyg.supabase.co/storage/v1/object/public/catalogues/f67ed3e4-ad9c-4214-93bf-214522669b3f-DENTAL_DURABLE.pdf',
    is_published: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'Dental Instruments',
  },
  {
    id: '0e500c4d-750c-40b1-8031-fb62c8599d57',
    category_id: null,
    title: 'Durable Laryngoscope ENT Catalogue',
    slug: 'durable-laryngoscope-ent-catalogue',
    description: '<p class="isSelectedEnd">Discover our comprehensive range of high-quality<b> laryngoscope and ENT instruments</b>, designed to support precision, reliability, and consistent performance in <b>diagnostic</b> and<b> surgical</b> procedures. Manufactured with a focus on quality craftsmanship, durability, and precision engineering, our instruments serve the needs of <b>healthcare professionals, hospitals, clinics</b>, and medical distributors worldwide.</p><p><b>Download our Laryngoscope &amp; ENT Instruments Catalogue PDF to explore our product range and specifications.</b></p>',
    cover_image: 'https://usxgwauwqhasrzaxcvyg.supabase.co/storage/v1/object/public/website-media/uploads/2026-10/1791556932007-durable-laryngoscope-ent-devices-catalogue.jpg',
    pdf_url: 'https://usxgwauwqhasrzaxcvyg.supabase.co/storage/v1/object/public/catalogues/6e42bee1-a2b3-4b7c-9ec9-c2d4c5ec7804-durable_laryngoscope_ent_devices_catalogue.pdf',
    is_published: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'ENT & Laryngoscope',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000002',
    category_id: null,
    title: 'General Surgery',
    slug: 'hospital-furniture',
    description: '<p class="isSelectedEnd">Explore our comprehensive range of high-quality <b>general surgery instruments</b>, engineered for precision, durability, and reliable performance in surgical procedures. Crafted with a focus on<b> quality, functionality</b>, and<b> precision engineering</b>, our instruments meet the needs of surgeons, hospitals, healthcare professionals, and medical distributors worldwide.</p><p><b>Download our General Surgery Instruments Catalogue PDF to discover our product range and specifications.</b></p>',
    cover_image: 'https://usxgwauwqhasrzaxcvyg.supabase.co/storage/v1/object/public/website-media/uploads/2026-10/1791556439664-surgical-durable.jpg',
    pdf_url: 'https://usxgwauwqhasrzaxcvyg.supabase.co/storage/v1/object/public/catalogues/7e4b0a5c-dc17-4a0c-aa09-25a4e3cbb9c3-surgical_durable.pdf',
    is_published: true,
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_name: 'General Surgery',
  },
]

// CLIENT-SIDE LOCAL STORAGE DATA ACCESSORS & SYNC HELPERS

import {
  savePersistentData,
  getLocalStorageSync,
} from '@/src/lib/persistentStorage'

export function getStoredCategories(): CategoryItem[] {
  if (typeof window === 'undefined') return INITIAL_CATEGORIES_SEED
  try {
    const data = getLocalStorageSync<CategoryItem[]>('durable_categories', INITIAL_CATEGORIES_SEED)
    if (Array.isArray(data) && data.length > 0) {
      const normalized = data.map((c: any) => {
        if (c.slug === 'dental' || c.id === 'cat-dental' || c.name?.toLowerCase() === 'dental') {
          return { ...c, is_published: true, sort_order: c.sort_order ?? 2 }
        }
        return c
      })
      if (!normalized.some((c: any) => c.slug === 'dental' || c.id === 'cat-dental')) {
        normalized.splice(1, 0, INITIAL_CATEGORIES_SEED[1])
      }
      return normalized
    }
  } catch (e) {
    console.error('Failed to parse categories:', e)
  }
  return INITIAL_CATEGORIES_SEED
}

export function saveStoredCategories(categories: CategoryItem[]): void {
  savePersistentData('durable_categories', categories)
}

export function getStoredProducts(): ProductItem[] {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS_SEED
  try {
    const data = getLocalStorageSync<ProductItem[]>('durable_products', INITIAL_PRODUCTS_SEED)
    if (Array.isArray(data) && data.length > 0) return data
  } catch (e) {
    console.error('Failed to parse products:', e)
  }
  return INITIAL_PRODUCTS_SEED
}

export function saveStoredProducts(products: ProductItem[]): void {
  savePersistentData('durable_products', products)
}

export function getStoredCatalogues(): CatalogueItem[] {
  if (typeof window === 'undefined') return INITIAL_CATALOGUES_SEED
  try {
    const data = getLocalStorageSync<CatalogueItem[]>('durable_catalogues', INITIAL_CATALOGUES_SEED)
    if (Array.isArray(data) && data.length > 0) return data
  } catch (e) {
    console.error('Failed to parse catalogues:', e)
  }
  return INITIAL_CATALOGUES_SEED
}

export function saveStoredCatalogues(catalogues: CatalogueItem[]): void {
  savePersistentData('durable_catalogues', catalogues)
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

export const INITIAL_SUBCATEGORY_PDF_SEED: SubcategoryPdfItem[] =
  Array.isArray((persistentData as any)?.durable_subcategories_pdf) && (persistentData as any).durable_subcategories_pdf.length > 0
    ? (persistentData as any).durable_subcategories_pdf
    : [
  // 1. General Surgery
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

  // 2. Dental
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

  // 3. Medical Hollowware
  {
    id: 'sub-hollow-1',
    categorySlug: 'medical-hollowware',
    categoryName: 'Medical Hollowware',
    title: 'Sterilizing Trays & Baskets',
    image: '/images/surgical-tray-durable.png',
    pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    description: 'Heavy-duty stainless steel perforated sterilization trays and wire mesh baskets.',
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: 'sub-hollow-2',
    categorySlug: 'medical-hollowware',
    categoryName: 'Medical Hollowware',
    title: 'Kidney Dishes & Gallipots',
    image: '/images/cat-handles-blades.png',
    pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    description: 'Seamless stainless steel kidney dishes, lotion bowls, and gallipots.',
    sortOrder: 2,
    isPublished: true,
  },

  // 4. Ophthalmic
  {
    id: 'sub-oph-1',
    categorySlug: 'ophthalmic',
    categoryName: 'Ophthalmic',
    title: 'Micro Ophthalmic Scissors',
    image: '/images/cat-scissors-shears.png',
    pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    description: 'Castroviejo and Vannas micro scissors engineered for ultra-fine corneal dissection.',
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: 'sub-oph-2',
    categorySlug: 'ophthalmic',
    categoryName: 'Ophthalmic',
    title: 'Eye Speculums & Cannulas',
    image: '/images/blog-surgeon-scalpel.png',
    pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    description: 'Barraquer wire speculums and ophthalmic anterior chamber irrigating cannulas.',
    sortOrder: 2,
    isPublished: true,
  },

  // 5. Hospital Furniture
  {
    id: 'sub-furn-1',
    categorySlug: 'hospital-furniture',
    categoryName: 'Hospital Furniture',
    title: 'Examination & Operating Tables',
    image: '/images/icon-hospital-furniture.png',
    pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    description: 'Hydraulic and electric surgical operation tables and adjustable hospital exam beds.',
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: 'sub-furn-2',
    categorySlug: 'hospital-furniture',
    categoryName: 'Hospital Furniture',
    title: 'Mayo Instrument Trolleys & Stands',
    image: '/images/about-surgical-instruments.png',
    pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    description: 'Stainless steel mobile Mayo stands and instrument transport trolleys.',
    sortOrder: 2,
    isPublished: true,
  },

  // 6. Single Use Instruments
  {
    id: 'sub-sgl-1',
    categorySlug: 'single-use-instruments',
    categoryName: 'Single Use Instruments',
    title: 'Disposable Sterile Scalpels',
    image: '/images/icon-single-use-instruments.png',
    pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    description: 'Individually gamma-sterilized precision surgical scalpel blades and safety handles.',
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: 'sub-sgl-2',
    categorySlug: 'single-use-instruments',
    categoryName: 'Single Use Instruments',
    title: 'Single-Use Suture Removal Packs',
    image: '/images/process-hand-filing.png',
    pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    description: 'Pre-packaged sterile disposable stitch cutters and dissecting forceps.',
    sortOrder: 2,
    isPublished: true,
  },

  // 7. Veterinary-Instruments
  {
    id: 'sub-vet-1',
    categorySlug: 'veterinary-instruments',
    categoryName: 'Veterinary-Instruments',
    title: 'Veterinary General Surgery Sets',
    image: '/images/cat-scissors-shears.png',
    pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    description: 'Specialized surgical instrument sets tailored for canine, feline, and equine procedures.',
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: 'sub-vet-2',
    categorySlug: 'veterinary-instruments',
    categoryName: 'Veterinary-Instruments',
    title: 'Veterinary Orthopedic Instruments',
    image: '/images/surgical-tray-durable.png',
    pdfUrl: '/pdf/orthopedic-instruments-catalogue.pdf',
    accessCode: '12345',
    description: 'Bone plating sets, pin cutters, and veterinary orthopedic wire twisters.',
    sortOrder: 2,
    isPublished: true,
  },

  // 8. Plastic Surgery
  {
    id: 'sub-pls-1',
    categorySlug: 'plastic-surgery',
    categoryName: 'Plastic Surgery',
    title: 'Rhinoplasty & Facial Retractors',
    image: '/images/cat-retractors.png',
    pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    description: 'Aufricht nasal retractors, Converse fiber-optic retractors, and fine skin hooks.',
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: 'sub-pls-2',
    categorySlug: 'plastic-surgery',
    categoryName: 'Plastic Surgery',
    title: 'Micro Needle Holders & Calipers',
    image: '/images/cat-forceps-clamps.png',
    pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    description: 'Tungsten carbide micro Castro needle holders and Castroviejo caliper markers.',
    sortOrder: 2,
    isPublished: true,
  },

  // 9. Special Surgical Instruments
  {
    id: 'sub-spc-1',
    categorySlug: 'special-surgical-instruments',
    categoryName: 'Special Surgical Instruments',
    title: 'Cardiovascular & Vascular Clamps',
    image: '/images/cat-handles-blades.png',
    pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    description: 'DeBakey atraumatic peripheral vascular clamps and cardiovascular bulldog clamps.',
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: 'sub-spc-2',
    categorySlug: 'special-surgical-instruments',
    categoryName: 'Special Surgical Instruments',
    title: 'Neurosurgical Rongeurs & Micro Elevators',
    image: '/images/blog-instruments-tray.png',
    pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    description: 'Kerrison punch rongeurs and microsurgical cranial nerve dissectors.',
    sortOrder: 2,
    isPublished: true,
  },
]

export function getStoredSubcategoryPdfs(): SubcategoryPdfItem[] {
  if (typeof window === 'undefined') return INITIAL_SUBCATEGORY_PDF_SEED
  try {
    const data = getLocalStorageSync<SubcategoryPdfItem[]>('durable_subcategories_pdf', INITIAL_SUBCATEGORY_PDF_SEED)
    if (Array.isArray(data) && data.length > 0) return data
  } catch (e) {
    console.error('Failed to parse subcategory PDFs:', e)
  }
  return INITIAL_SUBCATEGORY_PDF_SEED
}

export function saveStoredSubcategoryPdfs(items: SubcategoryPdfItem[]): void {
  savePersistentData('durable_subcategories_pdf', items)
}

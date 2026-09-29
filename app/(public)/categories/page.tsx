'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { CategoryHeroBanner } from '@/src/components/public/CategoryHeroBanner'
import { ShieldCheck, ArrowRight, CheckCircle2, FileText, Search } from 'lucide-react'

const DEFAULT_CATEGORIES_HERO = {
  title: 'ALL PRODUCT CATEGORIES &',
  highlight: 'INSTRUMENT CLASSIFICATIONS',
  badgeText: 'EXPLORE OUR PRODUCT RANGE',
  description:
    'Discover our comprehensive classifications of surgical, dental, orthopedic, hollowware, and hospital supply instruments built for healthcare professionals worldwide.',
  bgImage: '/images/products-hero-banner.png',
}

const DEFAULT_CATEGORIES_PRODUCTS = [
  {
    id: 'cat-prod-1',
    categorySlug: 'general-surgery',
    categoryName: 'GENERAL SURGERY',
    sku: 'SURG-SC-101',
    title: 'Precision SuperCut Dissection Scissors',
    description:
      'Gold-handle micro-serrated tungsten carbide dissection scissors with razor sharpness for general and plastic surgery.',
    specs: 'Japanese Stainless Steel 420 | Autoclavable 134°C',
    image: '/images/about-surgical-instruments.png',
  },
  {
    id: 'cat-prod-2',
    categorySlug: 'general-surgery',
    categoryName: 'GENERAL SURGERY',
    sku: 'SURG-SC-102',
    title: 'Mayo Dissecting Curved Scissors',
    description:
      'Heavy-duty curved Mayo scissors designed for cutting tough fascial tissue and surgical drapes in major surgical procedures.',
    specs: 'AISI 420 Stainless Steel | Satin Anti-Reflective Finish',
    image: '/images/process-hand-filing.png',
  },
  {
    id: 'cat-prod-3',
    categorySlug: 'general-surgery',
    categoryName: 'GENERAL SURGERY',
    sku: 'SURG-FC-201',
    title: 'Adson Tissue Forceps (1x2 Teeth)',
    description:
      'Delicate micro-toothed Adson forceps with wide thumb grips for secure skin handling without tissue trauma.',
    specs: 'Fine 1x2 Micro-Teeth | 12.5 cm Length',
    image: '/images/precision-healthcare-banner.png',
  },
  {
    id: 'cat-prod-4',
    categorySlug: 'dental',
    categoryName: 'DENTAL',
    sku: 'DENT-EX-301',
    title: 'Anatomical Extraction Forceps Set (English Pattern)',
    description:
      'Ergonomic German stainless steel extraction forceps tailored for upper/lower jaw molars, premolars, and roots.',
    specs: 'Anatomical Knurled Handles | Corrosion Resistant',
    image: '/images/dental-clinic-banner.png',
  },
  {
    id: 'cat-prod-5',
    categorySlug: 'dental',
    categoryName: 'DENTAL',
    sku: 'DENT-EL-302',
    title: 'Root Elevator Bein / Luxator Set',
    description:
      'Precision sharp-edged root elevators for gentle periodontal ligament atraumatic dental tooth extractions.',
    specs: 'Hollow Stainless Steel Handle | 3mm, 4mm, 5mm Blades',
    image: '/images/surgical-tray-durable.png',
  },
  {
    id: 'cat-prod-6',
    categorySlug: 'medical-hollowware',
    categoryName: 'MEDICAL HOLLOWWARE',
    sku: 'HOL-TY-401',
    title: 'Autoclavable Kidney Tray & Instrument Box',
    description:
      'Seamless deep-drawn AISI 304 non-magnetic stainless steel kidney dishes and covered sterilization trays.',
    specs: 'AISI 304 Stainless Steel | Mirror Polished Internal Surface',
    image: '/images/surgical-tray-durable.png',
  },
]

export default function PublicCategoriesPage() {
  const [heroData, setHeroData] = useState(DEFAULT_CATEGORIES_HERO)
  const [productsList, setProductsList] = useState(DEFAULT_CATEGORIES_PRODUCTS)
  const [selectedCategory, setSelectedCategory] = useState<string>('general-surgery')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const loadData = () => {
    try {
      const savedHero = localStorage.getItem('durable_categories_hero')
      if (savedHero) setHeroData(JSON.parse(savedHero))

      const savedProds = localStorage.getItem('durable_categories_products')
      if (savedProds) setProductsList(JSON.parse(savedProds))
    } catch (e) {
      console.error('Error loading categories page data:', e)
    }
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('durable_content_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('durable_content_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  const categoryPills = [
    { slug: 'general-surgery', name: 'General Surgery' },
    { slug: 'dental', name: 'Dental' },
    { slug: 'medical-hollowware', name: 'Medical Hollowware' },
    { slug: 'ophthalmic', name: 'Ophthalmic' },
    { slug: 'hospital-furniture', name: 'Hospital Furniture' },
    { slug: 'single-use-instruments', name: 'Single Use Instruments' },
  ]

  const filteredProducts = useMemo(() => {
    return productsList.filter((prod) => {
      const matchesCategory =
        selectedCategory === 'all' || prod.categorySlug === selectedCategory
      const matchesSearch =
        searchQuery.trim() === '' ||
        prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.categoryName.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [productsList, selectedCategory, searchQuery])

  const currentCategoryName = useMemo(() => {
    if (selectedCategory === 'all') return 'All Instrument'
    const found = categoryPills.find((c) => c.slug === selectedCategory)
    return found ? found.name.toUpperCase() : selectedCategory.toUpperCase()
  }, [selectedCategory])

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen pb-16 space-y-10">
      {/* 1. Category Hero Banner */}
      <CategoryHeroBanner
        title={heroData.title}
        highlight={heroData.highlight}
        badgeText={heroData.badgeText}
        description={heroData.description}
      />

      <div className="max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* 2. Category Navigation Pills Bar (Matching SS 2) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-thin">
            {categoryPills.map((cat) => {
              const isActive = selectedCategory === cat.slug
              return (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#0B1B3D] text-white shadow-md scale-102'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {cat.name}
                </button>
              )
            })}
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#0B1B3D] text-white shadow-md'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              All Categories
            </button>
          </div>

          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search category SKUs..."
              className="w-full text-xs pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 font-semibold text-slate-900"
            />
          </div>
        </div>

        {/* 3. Category Products Header (Matching SS 2) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-[#0B1B3D]">
              Featured {currentCategoryName} Range
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Showing {filteredProducts.length} verified surgical specifications & ordering SKUs
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>ISO 13485 & CE MDR Certified</span>
          </div>
        </div>

        {/* 4. Products Grid (Matching SS 2 layout) */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <h3 className="text-base font-bold text-slate-800">No products found in this category</h3>
            <p className="text-xs text-slate-500">Try selecting another category pill or clearing your search term.</p>
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSearchQuery('')
              }}
              className="px-4 py-2 bg-[#0B1B3D] text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Product Image Area */}
                  <div className="relative bg-slate-50 border-b border-slate-100 aspect-[4/3] flex items-center justify-center p-6 overflow-hidden">
                    {/* SKU Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 bg-[#0B1B3D] text-white text-[10px] font-mono font-bold rounded-md shadow-xs">
                        {product.sku}
                      </span>
                    </div>

                    {/* Category Name Tag */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-2.5 py-1 bg-white/90 backdrop-blur-xs text-slate-700 text-[10px] font-black uppercase tracking-wider rounded-md border border-slate-200 shadow-xs">
                        {product.categoryName}
                      </span>
                    </div>

                    {/* Product Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image || '/images/about-surgical-instruments.png'}
                      alt={product.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-base font-extrabold text-[#0B1B3D] group-hover:text-[#E31B23] transition-colors leading-snug">
                      {product.title}
                    </h3>

                    <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                      {product.description}
                    </p>

                    {/* Specs Box */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E31B23] shrink-0" />
                      <span className="line-clamp-1">{product.specs}</span>
                    </div>
                  </div>
                </div>

                {/* Action Footer Button */}
                <div className="p-6 pt-0">
                  <Link
                    href="/contact"
                    className="w-full py-2.5 px-4 bg-[#0B1B3D] group-hover:bg-[#E31B23] text-white text-xs font-extrabold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Request Technical Quote</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. Bottom OEM & Bulk Procurement Banner */}
        <div className="bg-[#0B1B3D] text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left z-10">
            <span className="text-[10px] font-bold tracking-widest text-[#E31B23] uppercase">
              CUSTOM CONTRACT MANUFACTURING
            </span>
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
              Need Custom OEM Sizing for {currentCategoryName}?
            </h3>
            <p className="text-xs text-slate-300 max-w-xl font-medium leading-relaxed">
              We specialize in custom jaw serrations, titanium color coatings, laser marking, and customized procedure packaging for healthcare brands worldwide.
            </p>
          </div>

          <Link
            href="/contact"
            className="z-10 px-6 py-3.5 bg-[#E31B23] hover:bg-red-700 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-lg shrink-0 flex items-center gap-2"
          >
            <span>DISCUSS OEM CONTRACT</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  )
}

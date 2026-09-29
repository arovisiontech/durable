'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FolderTree,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  ArrowLeft,
  Upload,
  Search,
  ShieldCheck,
} from 'lucide-react'

const DEFAULT_HERO = {
  title: 'ALL PRODUCT CATEGORIES &',
  highlight: 'INSTRUMENT CLASSIFICATIONS',
  badgeText: 'EXPLORE OUR PRODUCT RANGE',
  description:
    'Discover our comprehensive classifications of surgical, dental, orthopedic, hollowware, and hospital supply instruments built for healthcare professionals worldwide.',
  bgImage: '/images/products-hero-banner.png',
}

const DEFAULT_PRODUCTS = [
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

export default function AdminCategoriesContentPage() {
  const [heroData, setHeroData] = useState(DEFAULT_HERO)
  const [productsList, setProductsList] = useState(DEFAULT_PRODUCTS)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedHero = localStorage.getItem('durable_categories_hero')
      if (savedHero) setHeroData(JSON.parse(savedHero))

      const savedProds = localStorage.getItem('durable_categories_products')
      if (savedProds) setProductsList(JSON.parse(savedProds))
    } catch (e) {
      console.error('Error reading categories content from localStorage:', e)
    }
  }, [])

  // Save changes handler
  const handleSaveAll = () => {
    try {
      localStorage.setItem('durable_categories_hero', JSON.stringify(heroData))
      localStorage.setItem('durable_categories_products', JSON.stringify(productsList))

      // Trigger custom window event so open website tabs update live
      window.dispatchEvent(new Event('durable_content_updated'))

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 4000)
    } catch (e) {
      console.error('Error saving categories content:', e)
      alert('Failed to save changes. Please try again.')
    }
  }

  // File upload helper
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setter(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // CRUD Helpers for Products
  const updateProductItem = (index: number, field: string, value: any) => {
    const updated = [...productsList]
    updated[index] = { ...updated[index], [field]: value }
    setProductsList(updated)
  }

  const addCategoryProduct = () => {
    const newId = `cat-prod-${Date.now()}`
    setProductsList([
      {
        id: newId,
        categorySlug: selectedCategory === 'all' ? 'general-surgery' : selectedCategory,
        categoryName: selectedCategory === 'all' ? 'GENERAL SURGERY' : selectedCategory.toUpperCase().replace('-', ' '),
        sku: 'SURG-SKU-500',
        title: 'New Precision Surgical Instrument SKU',
        description: 'High-grade German stainless steel surgical tool engineered for operating room precision.',
        specs: 'AISI 420 Stainless Steel | Autoclavable 134°C',
        image: '/images/about-surgical-instruments.png',
      },
      ...productsList,
    ])
  }

  const deleteCategoryProduct = (index: number) => {
    if (confirm('Are you sure you want to delete this category product card?')) {
      setProductsList(productsList.filter((_, i) => i !== index))
    }
  }

  // Filtered Products for search inside Admin
  const filteredProducts = productsList.filter((prod) => {
    const matchesCat = selectedCategory === 'all' || prod.categorySlug === selectedCategory
    const matchesSearch =
      searchTerm.trim() === '' ||
      prod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 bg-[#090F1E] text-slate-100 min-h-screen">
      {/* Top Header Card */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[#E31B23] text-xs font-black uppercase tracking-wider">
              Website Content Module
            </span>
            <span className="text-xs text-slate-400 font-mono">/admin/content/categories</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <FolderTree className="w-8 h-8 text-[#E31B23]" />
            <span>Categories Page Content Manager</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Manage Category Hero Banner, Category Filter Pills, and all Featured Category Product SKUs with live browser refresh persistence.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <button
            onClick={handleSaveAll}
            className="px-6 py-2.5 rounded-xl bg-[#E31B23] hover:bg-red-700 text-white text-xs font-black tracking-wider uppercase transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>✓ All Category Changes Saved Successfully! Your website categories page has been updated live.</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: CATEGORY HERO BANNER SETTINGS */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-red-600/20 text-[#E31B23] font-black flex items-center justify-center text-sm border border-red-500/30">
              1
            </span>
            <h2 className="text-xl font-bold text-white">Categories Hero Banner Settings</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">`/categories` Banner</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Hero Pill Badge Text
            </label>
            <input
              type="text"
              value={heroData.badgeText}
              onChange={(e) => setHeroData({ ...heroData, badgeText: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Primary Title Line
            </label>
            <input
              type="text"
              value={heroData.title}
              onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Title Highlight Line (Red Accent)
            </label>
            <input
              type="text"
              value={heroData.highlight}
              onChange={(e) => setHeroData({ ...heroData, highlight: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-[#E31B23] focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Hero Subtitle / Description
            </label>
            <textarea
              rows={3}
              value={heroData.description}
              onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl p-4 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="md:col-span-2 space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#E31B23]" />
              <span>Hero Background Image URL</span>
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="text"
                value={heroData.bgImage}
                onChange={(e) => setHeroData({ ...heroData, bgImage: e.target.value })}
                className="flex-1 w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
                placeholder="/images/products-hero-banner.png"
              />
              <label className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 border border-slate-700 shrink-0">
                <Upload className="w-4 h-4 text-[#E31B23]" />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, (url) => setHeroData({ ...heroData, bgImage: url }))}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2: CATEGORY PRODUCTS RANGE MANAGER (CRUD) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-red-600/20 text-[#E31B23] font-black flex items-center justify-center text-sm border border-red-500/30">
              2
            </span>
            <div>
              <h2 className="text-xl font-bold text-white">
                Category Product SKUs Manager ({productsList.length})
              </h2>
              <p className="text-xs text-slate-400">Add, edit, delete, or update category items displayed on `/categories` and `/category/[slug]`.</p>
            </div>
          </div>

          <button
            onClick={addCategoryProduct}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category Product SKU</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#141E36] p-4 rounded-2xl border border-slate-700/80">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search product SKUs or titles..."
              className="w-full bg-[#0D1527] border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto bg-[#0D1527] border border-slate-700 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-red-500"
          >
            <option value="all">All Categories</option>
            <option value="general-surgery">General Surgery</option>
            <option value="dental">Dental</option>
            <option value="medical-hollowware">Medical Hollowware</option>
            <option value="ophthalmic">Ophthalmic</option>
            <option value="hospital-furniture">Hospital Furniture</option>
            <option value="single-use-instruments">Single Use Instruments</option>
          </select>
        </div>

        {/* Products Cards List */}
        <div className="space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center bg-[#141E36] rounded-2xl border border-slate-700 text-slate-400 text-xs font-medium">
              No category products found matching your search.
            </div>
          ) : (
            filteredProducts.map((prod) => {
              const actualIndex = productsList.findIndex((p) => p.id === prod.id)

              return (
                <div
                  key={prod.id}
                  className="bg-[#141E36] border border-slate-700/80 rounded-2xl p-6 space-y-6 relative group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700/60 pb-3 gap-3">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-[#E31B23] text-[11px] font-mono font-bold">
                        {prod.sku}
                      </span>
                      <h3 className="text-sm font-bold text-white truncate max-w-md">{prod.title}</h3>
                    </div>

                    <button
                      onClick={() => deleteCategoryProduct(actualIndex)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        SKU Code
                      </label>
                      <input
                        type="text"
                        value={prod.sku}
                        onChange={(e) => updateProductItem(actualIndex, 'sku', e.target.value)}
                        className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Category Group Name
                      </label>
                      <input
                        type="text"
                        value={prod.categoryName}
                        onChange={(e) => updateProductItem(actualIndex, 'categoryName', e.target.value)}
                        className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Category Slug
                      </label>
                      <select
                        value={prod.categorySlug}
                        onChange={(e) => updateProductItem(actualIndex, 'categorySlug', e.target.value)}
                        className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="general-surgery">general-surgery</option>
                        <option value="dental">dental</option>
                        <option value="medical-hollowware">medical-hollowware</option>
                        <option value="ophthalmic">ophthalmic</option>
                        <option value="hospital-furniture">hospital-furniture</option>
                        <option value="single-use-instruments">single-use-instruments</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Product Title
                      </label>
                      <input
                        type="text"
                        value={prod.title}
                        onChange={(e) => updateProductItem(actualIndex, 'title', e.target.value)}
                        className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Technical Specs
                      </label>
                      <input
                        type="text"
                        value={prod.specs}
                        onChange={(e) => updateProductItem(actualIndex, 'specs', e.target.value)}
                        className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="md:col-span-3 space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Detailed Description
                      </label>
                      <textarea
                        rows={2}
                        value={prod.description}
                        onChange={(e) => updateProductItem(actualIndex, 'description', e.target.value)}
                        className="w-full bg-[#0D1527] border border-slate-700 rounded-xl p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="md:col-span-3 space-y-2">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Product Image URL
                      </label>
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <input
                          type="text"
                          value={prod.image}
                          onChange={(e) => updateProductItem(actualIndex, 'image', e.target.value)}
                          className="flex-1 w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                        />
                        <label className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 border border-slate-700 shrink-0">
                          <Upload className="w-4 h-4 text-[#E31B23]" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageUpload(e, (url) => updateProductItem(actualIndex, 'image', url))
                            }
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Bottom Save Action Bar */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={handleSaveAll}
            className="px-8 py-3.5 rounded-xl bg-[#E31B23] hover:bg-red-700 text-white text-xs font-black tracking-wider uppercase transition-all shadow-xl shadow-red-600/30 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-5 h-5" />
            <span>Save All Category Page Changes</span>
          </button>
        </div>
      </div>
    </div>
  )
}

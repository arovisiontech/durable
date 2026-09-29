'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Save,
  CheckCircle2,
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  Package,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  X,
  FileText,
  Image as ImageIcon,
} from 'lucide-react'
import { AdminMediaUploadPlaceholder } from '@/src/components/admin/AdminMediaUploadPlaceholder'

export interface SubCategoryPill {
  id: string
  title: string
  icon: string
  query: string
}

export interface ProductRangeCard {
  id: string
  number: string
  title: string
  description: string
  sku_count: string
  image_url: string
  slug: string
}

export interface DentalFieldCard {
  id: string
  number: string
  title: string
  description: string
  slug: string
}

export interface CustomProductBlock {
  id: string
  title: string
  subheading?: string
  description: string
  image_url?: string
}

export default function AdminContentProductsPage() {
  const [isSaved, setIsSaved] = useState(false)
  const [saveMessage, setSaveMessage] = useState('Products Page content updated and published live!')

  // 1. HERO BANNER STATE
  const [heroForm, setHeroForm] = useState({
    badge: 'OUR PRODUCT CATEGORIES',
    categoryTitle: 'GENERAL',
    categoryHighlight: 'SURGERY',
    description:
      'Durable Hospital Supplies Is A Trusted Manufacturer And Exporter Of Premium Surgical Instruments, Serving Healthcare Professionals, Distributors, And OEM Brands In More Than 15 Countries.',
    bgImage: '/images/products-hero-banner.png',
  })

  // 1B. SUB-CATEGORY QUICK FILTER PILLS BAR
  const [subcatPills, setSubcatPills] = useState<SubCategoryPill[]>([
    { id: 'sc-1', title: 'Scissors & Shears', icon: '/images/cat-scissors-shears.png', query: 'scissors' },
    { id: 'sc-2', title: 'Retractors', icon: '/images/cat-retractors.png', query: 'retractors' },
    { id: 'sc-3', title: 'Forceps & Clamps', icon: '/images/cat-forceps-clamps.png', query: 'forceps' },
    { id: 'sc-4', title: 'Handles & Blades', icon: '/images/cat-handles-blades.png', query: 'scalpel' },
  ])

  // 2. EXPLORE OUR PRODUCT RANGE STATE (6 Category Range Cards)
  const [exploreRangeForm, setExploreRangeForm] = useState({
    badge: 'EXPLORE OUR PRODUCT RANGE',
    title: 'Explore Product Categories',
    description: 'Discover our comprehensive classifications of surgical, dental, orthopedic, hollowware, and hospital supply instruments.',
    buttonText: 'VIEW ALL PRODUCT CATEGORIES',
    buttonLink: '/categories',
  })

  const [exploreCards, setExploreCards] = useState<ProductRangeCard[]>([
    { id: 'pr-1', number: '01', title: 'General Surgery', description: 'General surgical tools including scissors, forceps, retractors, scalpel handles, and clamps.', sku_count: '6+ SKUs', image_url: '/images/cat-scissors-shears.png', slug: 'general-surgery' },
    { id: 'pr-2', number: '02', title: 'Dental & Restorative', description: 'Ergonomic restorative, periodontal, extraction, and orthodontic dental instruments.', sku_count: '4+ SKUs', image_url: '/images/cat-retractors.png', slug: 'dental' },
    { id: 'pr-3', number: '03', title: 'Medical Hollowware', description: 'Storage trays, kidney basins, gallipots, sterilization boxes, and autoclave bowls.', sku_count: '4+ SKUs', image_url: '/images/surgical-tray-durable.png', slug: 'medical-hollowware' },
    { id: 'pr-4', number: '04', title: 'Bone & Orthopedic Instruments', description: 'Bone chisels, osteotomes, mallets, rongeurs, gouges, and bone holding forceps.', sku_count: '3+ SKUs', image_url: '/images/cat-forceps-clamps.png', slug: 'orthopedic-instruments' },
    { id: 'pr-5', number: '05', title: 'Ophthalmic Micro-Surgery', description: 'Micro-forceps, eye speculums, corneal scissors, and micro cassettes.', sku_count: '2+ SKUs', image_url: '/images/blog-instruments-tray.png', slug: 'ophthalmic' },
    { id: 'pr-6', number: '06', title: 'Hospital Furniture & Single Use', description: 'Hospital beds, MAYO instrument trolleys, IV poles, and sterile single use procedure kits.', sku_count: '2+ SKUs', image_url: '/images/icon-hospital-furniture.png', slug: 'hospital-furniture' },
  ])

  // 3. DENTAL CLINIC WIDE BANNER STATE
  const [dentalBannerUrl, setDentalBannerUrl] = useState('/images/dental-clinic-banner.png')

  // 4. COVERING ALL MAJOR FIELDS STATE (6 Dental Field Cards)
  const [dentalFieldsHeader, setDentalFieldsHeader] = useState({
    badge: 'COVERING ALL MAJOR FIELDS',
    titlePrimary: 'EXPLORE OUR ',
    titleHighlight: 'DENTAL INSTRUMENTS',
    titleEnd: ' CATEGORIES',
  })

  const [dentalFieldCards, setDentalFieldCards] = useState<DentalFieldCard[]>([
    { id: 'df-1', number: '01', title: 'Extraction & Oral Surgery', description: 'Extracting Forceps In Various Patterns (English And American, Upper And Lower Jaw, Anatomically Shaped Handles, Delicate Touch), Root Elevators, Root Fragment Elevators, And Luxators.', slug: 'extraction-oral-surgery' },
    { id: 'df-2', number: '02', title: 'Dental Bone Surgery', description: 'Osteotomes, Gouges, Chisels, Bone Rongeurs, Bone Curettes, Periosteal Elevators, Mallets, And Related Bone Instruments.', slug: 'dental-bone-surgery' },
    { id: 'df-3', number: '03', title: 'Periodontics & Cleaning', description: 'A Large Scaler Range (Supragingival And Subgingival), Cure, And Periodontal Probes. Restorative & Filling: Filling Instruments Composite Instruments, Amalgam Instruments, Wax/Porcelain/Carvers, And Spatulas.', slug: 'periodontics-cleaning' },
    { id: 'df-4', number: '04', title: 'Endodontics', description: 'Root Canal Instruments. Impression Trays (Ehricke\'s, Partial Trays), Matrix Bands, And Retainers', slug: 'endodontics' },
    { id: 'df-5', number: '05', title: 'Diagnostic', description: 'Mouth Mirrors, Explorers, Probes And Cotton Applicators Sickle Probe, Intraoral Mirror, Periadontal Probe, Dental Tweezers / College Cotton Pliers, Articulating Paper Forceps, Endodontic Locking Tweezers', slug: 'diagnostic' },
    { id: 'df-6', number: '06', title: 'Discipline Specific Instruments', description: 'Needle Holders (Including Micro Needle Holders), Scissors (Dissecting, Gum, Delicate), Artery/Hemostatic Forceps, Dressing And Tissue Forceps (Including Micro), Retractors, Gags, Skin Hooks/Hooklets, Scalpels, Suction Cannulas,', slug: 'discipline-specific-dental' },
  ])

  // 5. CUSTOM PRODUCT BLOCKS STATE
  const [customBlocks, setCustomBlocks] = useState<CustomProductBlock[]>([])

  // Modal Control States
  const [activeModal, setActiveModal] = useState<'subcat' | 'explore' | 'dentalField' | 'custom' | null>(null)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)

  const [subcatModalForm, setSubcatModalForm] = useState({ title: '', icon: '/images/cat-scissors-shears.png', query: '' })
  const [exploreModalForm, setExploreModalForm] = useState({ number: '01', title: '', description: '', sku_count: '5+ SKUs', image_url: '/images/cat-scissors-shears.png', slug: 'general-surgery' })
  const [dentalFieldModalForm, setDentalFieldModalForm] = useState({ number: '01', title: '', description: '', slug: 'extraction-oral-surgery' })
  const [customModalForm, setCustomModalForm] = useState({ title: '', subheading: '', description: '', image_url: '' })

  // SYNC FROM LOCALSTORAGE ON MOUNT
  useEffect(() => {
    try {
      const savedHero = localStorage.getItem('durable_products_hero_data')
      if (savedHero) {
        const parsed = JSON.parse(savedHero)
        if (parsed && typeof parsed === 'object') setHeroForm((prev) => ({ ...prev, ...parsed }))
      }

      const savedSubcats = localStorage.getItem('durable_subcategories_bar')
      if (savedSubcats) {
        const parsed = JSON.parse(savedSubcats)
        if (Array.isArray(parsed) && parsed.length > 0) setSubcatPills(parsed)
      }

      const savedExploreHeader = localStorage.getItem('durable_explore_range_data')
      if (savedExploreHeader) {
        const parsed = JSON.parse(savedExploreHeader)
        if (parsed && typeof parsed === 'object') setExploreRangeForm((prev) => ({ ...prev, ...parsed }))
      }

      const savedExploreCards = localStorage.getItem('durable_explore_range_cards')
      if (savedExploreCards) {
        const parsed = JSON.parse(savedExploreCards)
        if (Array.isArray(parsed) && parsed.length > 0) setExploreCards(parsed)
      }

      const savedBanner = localStorage.getItem('durable_dental_clinic_banner')
      if (savedBanner) setDentalBannerUrl(savedBanner)

      const savedDentalHeader = localStorage.getItem('durable_dental_fields_data')
      if (savedDentalHeader) {
        const parsed = JSON.parse(savedDentalHeader)
        if (parsed && typeof parsed === 'object') setDentalFieldsHeader((prev) => ({ ...prev, ...parsed }))
      }

      const savedDentalCards = localStorage.getItem('durable_dental_fields_cards')
      if (savedDentalCards) {
        const parsed = JSON.parse(savedDentalCards)
        if (Array.isArray(parsed) && parsed.length > 0) setDentalFieldCards(parsed)
      }

      const savedCustom = localStorage.getItem('durable_custom_products_blocks')
      if (savedCustom) {
        const parsed = JSON.parse(savedCustom)
        if (Array.isArray(parsed)) setCustomBlocks(parsed)
      }
    } catch (e) {
      console.error('LocalStorage Products mount read error:', e)
    }
  }, [])

  // SAVE ALL TO LOCALSTORAGE & EMIT EVENT
  const saveAllToStorage = () => {
    try {
      localStorage.setItem('durable_products_hero_data', JSON.stringify(heroForm))
      localStorage.setItem('durable_subcategories_bar', JSON.stringify(subcatPills))
      localStorage.setItem('durable_explore_range_data', JSON.stringify(exploreRangeForm))
      localStorage.setItem('durable_explore_range_cards', JSON.stringify(exploreCards))
      localStorage.setItem('durable_dental_clinic_banner', dentalBannerUrl)
      localStorage.setItem('durable_dental_fields_data', JSON.stringify(dentalFieldsHeader))
      localStorage.setItem('durable_dental_fields_cards', JSON.stringify(dentalFieldCards))
      localStorage.setItem('durable_custom_products_blocks', JSON.stringify(customBlocks))

      window.dispatchEvent(new Event('durable_content_updated'))

      setIsSaved(true)
      setSaveMessage('Products Page content updated and published live!')
      setTimeout(() => setIsSaved(false), 4000)
    } catch (e) {
      console.error('LocalStorage write error:', e)
    }
  }

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    saveAllToStorage()
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span>Website Content</span>
            <span>•</span>
            <span className="text-[#E31B23]">Products Showcase Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3D] tracking-tight">
            Products Page Content Manager
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage all sections of the Products page dynamically (Hero Banner, Quick-Filter Pills, Explore Range, Wide Clinic Banner, Dental Fields & Custom Blocks).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <button
            onClick={handleSaveAll}
            className="px-5 py-2.5 text-xs font-extrabold text-white bg-[#E31B23] hover:bg-red-700 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold shadow-xs animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* ALL STACKED SECTIONS */}
      <div className="space-y-8">

        {/* SECTION 1: PRODUCTS HERO BANNER & SUB-CATEGORIES BAR */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">1. Products Hero Banner Settings</h2>
              <p className="text-xs text-slate-500">Edit hero title, badge, description, background image, and subcategory filter pills bar.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Pill Badge Text</label>
              <input
                type="text"
                value={heroForm.badge}
                onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Category Title (White Line 1)</label>
              <input
                type="text"
                value={heroForm.categoryTitle}
                onChange={(e) => setHeroForm({ ...heroForm, categoryTitle: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-[#E31B23] uppercase">Category Highlight (Red Line 2)</label>
              <input
                type="text"
                value={heroForm.categoryHighlight}
                onChange={(e) => setHeroForm({ ...heroForm, categoryHighlight: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#E31B23] focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Description Paragraph</label>
              <textarea
                rows={3}
                value={heroForm.description}
                onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Hero Background Banner Image</label>
              <AdminMediaUploadPlaceholder
                value={heroForm.bgImage}
                onChange={(url) => setHeroForm({ ...heroForm, bgImage: url })}
                label="Choose or Upload Hero Background Image"
              />
            </div>
          </div>

          {/* Sub-Category Quick Filter Pills Bar Editor */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-extrabold text-slate-800 uppercase">Sub-Category Quick Filter Pills Bar (4 Items)</h3>
                <p className="text-[11px] text-slate-500">Scissors & Shears, Retractors, Forceps & Clamps, Handles & Blades</p>
              </div>
              <button
                onClick={() => {
                  setEditingItemId(null)
                  setSubcatModalForm({ title: '', icon: '/images/cat-scissors-shears.png', query: '' })
                  setActiveModal('subcat')
                }}
                className="px-3 py-1 bg-[#0B1B3D] text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Pill Item</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {subcatPills.map((pill) => (
                <div key={pill.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={pill.icon} alt={pill.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-extrabold text-[#0B1B3D] truncate">{pill.title}</h4>
                      <p className="text-[10px] text-slate-400 truncate">search={pill.query || pill.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        setEditingItemId(pill.id)
                        setSubcatModalForm({ title: pill.title, icon: pill.icon, query: pill.query })
                        setActiveModal('subcat')
                      }}
                      className="p-1 text-slate-600 hover:bg-slate-200 rounded cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        const updated = subcatPills.filter((p) => p.id !== pill.id)
                        setSubcatPills(updated)
                        saveAllToStorage()
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2: EXPLORE OUR PRODUCT RANGE */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#0B1B3D]">2. EXPLORE OUR PRODUCT RANGE (6 Product Category Cards Grid)</h2>
                <p className="text-xs text-slate-500">Manage all 6 product range category cards (General Surgery, Dental, Extraction, Bone Surgery, Periodontics, Endodontics).</p>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingItemId(null)
                setExploreModalForm({ number: `0${exploreCards.length + 1}`, title: '', description: '', sku_count: '5+ SKUs', image_url: '/images/cat-scissors-shears.png', slug: 'new-category' })
                setActiveModal('explore')
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-[#0B1B3D] hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Section Badge Tagline</label>
              <input
                type="text"
                value={exploreRangeForm.badge}
                onChange={(e) => setExploreRangeForm({ ...exploreRangeForm, badge: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Main Title</label>
              <input
                type="text"
                value={exploreRangeForm.title}
                onChange={(e) => setExploreRangeForm({ ...exploreRangeForm, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Description Paragraph</label>
              <textarea
                rows={2}
                value={exploreRangeForm.description}
                onChange={(e) => setExploreRangeForm({ ...exploreRangeForm, description: e.target.value })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>
          </div>

          {/* 6 Category Cards List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {exploreCards.map((card) => (
              <div key={card.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black font-mono text-[#E31B23]">{card.number}</span>
                    <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full">{card.sku_count}</span>
                  </div>
                  <h3 className="text-xs font-black text-[#0B1B3D]">{card.title}</h3>
                  <p className="text-[11px] text-slate-500 line-clamp-3">{card.description}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setEditingItemId(card.id)
                      setExploreModalForm({ number: card.number, title: card.title, description: card.description, sku_count: card.sku_count, image_url: card.image_url, slug: card.slug })
                      setActiveModal('explore')
                    }}
                    className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Edit Card
                  </button>
                  <button
                    onClick={() => {
                      const updated = exploreCards.filter((c) => c.id !== card.id)
                      setExploreCards(updated)
                      saveAllToStorage()
                    }}
                    className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: DENTAL & SURGICAL CLINIC WIDE BANNER */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">3. Dental & Surgical Procedure Wide Clinic Banner</h2>
              <p className="text-xs text-slate-500">Upload replacement image for the wide dental & surgical procedure clinic showcase banner.</p>
            </div>
          </div>

          <div className="space-y-4">
            <AdminMediaUploadPlaceholder
              value={dentalBannerUrl}
              onChange={(url) => setDentalBannerUrl(url)}
              label="Choose or Upload Wide Dental Clinic Banner Image"
            />
          </div>
        </div>

        {/* SECTION 4: COVERING ALL MAJOR FIELDS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#0B1B3D]">4. COVERING ALL MAJOR FIELDS (Explore Dental Instruments Categories)</h2>
                <p className="text-xs text-slate-500">Manage all 6 dental specialty cards (Extraction, Bone Surgery, Periodontics, Endodontics, Diagnostic, Discipline Specific).</p>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingItemId(null)
                setDentalFieldModalForm({ number: `0${dentalFieldCards.length + 1}`, title: '', description: '', slug: 'dental-field' })
                setActiveModal('dentalField')
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-[#0B1B3D] hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Field Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Section Badge Tagline</label>
              <input
                type="text"
                value={dentalFieldsHeader.badge}
                onChange={(e) => setDentalFieldsHeader({ ...dentalFieldsHeader, badge: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Title Highlight (Red Word)</label>
              <input
                type="text"
                value={dentalFieldsHeader.titleHighlight}
                onChange={(e) => setDentalFieldsHeader({ ...dentalFieldsHeader, titleHighlight: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#E31B23]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {dentalFieldCards.map((card) => (
              <div key={card.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-lg font-black font-mono text-[#E31B23]">{card.number}</span>
                  <h3 className="text-xs font-black text-[#0B1B3D]">{card.title}</h3>
                  <p className="text-[11px] text-slate-500 line-clamp-3">{card.description}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setEditingItemId(card.id)
                      setDentalFieldModalForm({ number: card.number, title: card.title, description: card.description, slug: card.slug })
                      setActiveModal('dentalField')
                    }}
                    className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Edit Card
                  </button>
                  <button
                    onClick={() => {
                      const updated = dentalFieldCards.filter((c) => c.id !== card.id)
                      setDentalFieldCards(updated)
                      saveAllToStorage()
                    }}
                    className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: CUSTOM SECTIONS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#0B1B3D]">5. Additional Custom Products Sections</h2>
                <p className="text-xs text-slate-500">Add custom content blocks or promo cards to the Products page dynamically.</p>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingItemId(null)
                setCustomModalForm({ title: '', subheading: '', description: '', image_url: '' })
                setActiveModal('custom')
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-[#0B1B3D] hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Section</span>
            </button>
          </div>

          {customBlocks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customBlocks.map((block) => (
                <div key={block.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 space-y-3">
                  {block.image_url && (
                    <div className="h-36 w-full rounded-xl overflow-hidden bg-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={block.image_url} alt={block.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <span className="text-[10px] font-bold text-[#E31B23] uppercase">{block.subheading}</span>
                  <h3 className="text-base font-black text-[#0B1B3D]">{block.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3">{block.description}</p>
                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                    <button
                      onClick={() => {
                        const updated = customBlocks.filter((b) => b.id !== block.id)
                        setCustomBlocks(updated)
                        saveAllToStorage()
                      }}
                      className="px-3 py-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl space-y-2">
              <p className="text-xs font-bold text-slate-600">No extra custom sections added yet.</p>
              <p className="text-[11px] text-slate-400">Click &quot;Add Custom Section&quot; above to create more content blocks!</p>
            </div>
          )}
        </div>

      </div>

      {/* MODAL DIALOGS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-[#0B1B3D] uppercase">Configure Item Details & Image Upload</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SUBCAT PILL MODAL */}
            {activeModal === 'subcat' && (
              <div className="space-y-4">
                <AdminMediaUploadPlaceholder
                  label="Sub-Category Icon Image"
                  value={subcatModalForm.icon}
                  onChange={(url) => setSubcatModalForm({ ...subcatModalForm, icon: url })}
                  placeholderText="Upload Icon Image"
                />
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Sub-Category Title</label>
                  <input
                    type="text"
                    value={subcatModalForm.title}
                    onChange={(e) => setSubcatModalForm({ ...subcatModalForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Search Query Parameter</label>
                  <input
                    type="text"
                    value={subcatModalForm.query}
                    onChange={(e) => setSubcatModalForm({ ...subcatModalForm, query: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    placeholder="e.g. scissors"
                  />
                </div>
                <button
                  onClick={() => {
                    let updated: SubCategoryPill[] = []
                    if (editingItemId) {
                      updated = subcatPills.map((p) => (p.id === editingItemId ? { ...subcatModalForm, id: editingItemId } : p))
                    } else {
                      updated = [...subcatPills, { ...subcatModalForm, id: `sc-${Date.now()}` }]
                    }
                    setSubcatPills(updated)
                    saveAllToStorage()
                    setActiveModal(null)
                  }}
                  className="w-full py-2.5 bg-[#0B1B3D] text-white text-xs font-black rounded-xl cursor-pointer"
                >
                  Save Pill Item
                </button>
              </div>
            )}

            {/* EXPLORE CARD MODAL */}
            {activeModal === 'explore' && (
              <div className="space-y-4">
                <AdminMediaUploadPlaceholder
                  label="Category Card Image"
                  value={exploreModalForm.image_url}
                  onChange={(url) => setExploreModalForm({ ...exploreModalForm, image_url: url })}
                  placeholderText="Upload Image"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Card Number</label>
                    <input
                      type="text"
                      value={exploreModalForm.number}
                      onChange={(e) => setExploreModalForm({ ...exploreModalForm, number: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">SKU Count Label</label>
                    <input
                      type="text"
                      value={exploreModalForm.sku_count}
                      onChange={(e) => setExploreModalForm({ ...exploreModalForm, sku_count: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category Title</label>
                  <input
                    type="text"
                    value={exploreModalForm.title}
                    onChange={(e) => setExploreModalForm({ ...exploreModalForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Description</label>
                  <textarea
                    rows={3}
                    value={exploreModalForm.description}
                    onChange={(e) => setExploreModalForm({ ...exploreModalForm, description: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <button
                  onClick={() => {
                    let updated: ProductRangeCard[] = []
                    if (editingItemId) {
                      updated = exploreCards.map((c) => (c.id === editingItemId ? { ...exploreModalForm, id: editingItemId } : c))
                    } else {
                      updated = [...exploreCards, { ...exploreModalForm, id: `pr-${Date.now()}` }]
                    }
                    setExploreCards(updated)
                    saveAllToStorage()
                    setActiveModal(null)
                  }}
                  className="w-full py-2.5 bg-[#E31B23] text-white text-xs font-black rounded-xl cursor-pointer"
                >
                  Save Category Card
                </button>
              </div>
            )}

            {/* DENTAL FIELD MODAL */}
            {activeModal === 'dentalField' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Field Number</label>
                  <input
                    type="text"
                    value={dentalFieldModalForm.number}
                    onChange={(e) => setDentalFieldModalForm({ ...dentalFieldModalForm, number: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Field Title</label>
                  <input
                    type="text"
                    value={dentalFieldModalForm.title}
                    onChange={(e) => setDentalFieldModalForm({ ...dentalFieldModalForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Specifications Description</label>
                  <textarea
                    rows={4}
                    value={dentalFieldModalForm.description}
                    onChange={(e) => setDentalFieldModalForm({ ...dentalFieldModalForm, description: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <button
                  onClick={() => {
                    let updated: DentalFieldCard[] = []
                    if (editingItemId) {
                      updated = dentalFieldCards.map((c) => (c.id === editingItemId ? { ...dentalFieldModalForm, id: editingItemId } : c))
                    } else {
                      updated = [...dentalFieldCards, { ...dentalFieldModalForm, id: `df-${Date.now()}` }]
                    }
                    setDentalFieldCards(updated)
                    saveAllToStorage()
                    setActiveModal(null)
                  }}
                  className="w-full py-2.5 bg-[#0B1B3D] text-white text-xs font-black rounded-xl cursor-pointer"
                >
                  Save Field Card
                </button>
              </div>
            )}

            {/* CUSTOM BLOCK MODAL */}
            {activeModal === 'custom' && (
              <div className="space-y-4">
                <AdminMediaUploadPlaceholder
                  label="Custom Block Image"
                  value={customModalForm.image_url}
                  onChange={(url) => setCustomModalForm({ ...customModalForm, image_url: url })}
                  placeholderText="Upload Image"
                />
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Subheading / Badge</label>
                  <input
                    type="text"
                    value={customModalForm.subheading}
                    onChange={(e) => setCustomModalForm({ ...customModalForm, subheading: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Block Title</label>
                  <input
                    type="text"
                    value={customModalForm.title}
                    onChange={(e) => setCustomModalForm({ ...customModalForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Description</label>
                  <textarea
                    rows={3}
                    value={customModalForm.description}
                    onChange={(e) => setCustomModalForm({ ...customModalForm, description: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <button
                  onClick={() => {
                    const updated = [...customBlocks, { id: `block-${Date.now()}`, ...customModalForm }]
                    setCustomBlocks(updated)
                    saveAllToStorage()
                    setActiveModal(null)
                  }}
                  className="w-full py-2.5 bg-[#0B1B3D] text-white text-xs font-black rounded-xl cursor-pointer"
                >
                  Save Custom Block
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  )
}

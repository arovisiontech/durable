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
  FileText,
  ShieldCheck,
  Award,
  Globe2,
  FileUp,
  Download,
  Lock,
  Eye,
  X,
  Layers,
  Sparkles,
} from 'lucide-react'
import { AdminMediaUploadPlaceholder } from '@/src/components/admin/AdminMediaUploadPlaceholder'
import { RichTextToolbar } from '@/src/components/admin/RichTextToolbar'
import { savePersistentData, loadPersistentData } from '@/src/lib/persistentStorage'
import { INITIAL_CATALOGUES_SEED, CatalogueItem } from '@/src/lib/dataStore'
import {
  fetchCataloguesAction,
  createCatalogueAction,
  updateCatalogueAction,
  deleteCatalogueAction,
} from '@/app/admin/actions/catalogues'

export interface OverviewCard {
  id: number
  title: string
  description: string
  icon: string
}

export default function AdminCataloguesContentPage() {
  const [isSaved, setIsSaved] = useState(false)
  const [saveMessage, setSaveMessage] = useState('Catalogues page content updated and published live!')

  // 1. HERO BANNER STATE (SS 2)
  const [heroForm, setHeroForm] = useState({
    badge: 'PRECISION. QUALITY. TRUST',
    titlePrimary: 'ADVANCED MEDICAL',
    titleHighlight: 'PRODUCT SOLUTIONS.',
    description:
      'We Manufacture Premium Surgical & Dental Instruments For OEM, Private Label, And Sterile Kitting, Using High-Grade German & Japanese Stainless Steel To Meet DIN And ISO/ASTM Standards. Available In Reusable, Single-Use, And EO-Sterilized Options.',
    bgImage: '/images/precision-healthcare-banner.png',
  })

  // 2. OVERVIEW & FEATURE CARDS STATE (SS 3)
  const [overviewForm, setOverviewForm] = useState({
    tagline: 'BUILT TO PERFORM. MADE TO LAST.',
    mainTitle: 'EXPLORE OUR INSTRUMENT CATALOGS',
    p1: 'Durable Hospital Supplies Offers An Extensive Range Of Surgical, Dental, And Specialty Instruments, From Essential Items Such As Scalpels, Scissors, And Forceps To Complete Surgical Instrument Sets And Customized Trays For Hospitals, Distributors, And Healthcare Suppliers.',
    p2: 'With A Portfolio Of More Than 20,000 Surgical, Dental, And Medical Instruments Manufactured In Sialkot, Pakistan, We Serve Customers Worldwide With Precision-Engineered Solutions Across A Wide Range Of Medical Specialties. As An ISO 13485 And FDA-Certified OEM Surgical Instrument Manufacturer, We Focus On Delivering Consistent Quality, Reliability, Precision, And Cost-Effective Solutions For Hospitals, Medical Distributors, And Private-Label Healthcare Brands.',
  })

  const [overviewCards, setOverviewCards] = useState<OverviewCard[]>([
    {
      id: 1,
      title: 'Product Catalogs',
      description: 'Explore Our Comprehensive Range Of Surgical Instruments Designed For Precision And Professional Use.',
      icon: '/images/icon-cat-newspaper.png',
    },
    {
      id: 2,
      title: 'Quality Standards',
      description: 'Manufactured to DIN and ISO/ASTM Standards with strict quality control to ensure reliability and safety.',
      icon: '/images/icon-cat-checklist.png',
    },
    {
      id: 3,
      title: 'OEM / Private Label',
      description: 'Custom Manufacturing, Private Label Branding And Sterile Kitting Solutions Tailored To Your Business Needs.',
      icon: '/images/icon-cat-box.png',
    },
    {
      id: 4,
      title: 'Materials & Sterilization',
      description: 'Premium German & Japanese Stainless Steel With Options For Reusable, Single-Use And EO Sterilized Configurations.',
      icon: '/images/icon-cat-layers.png',
    },
  ])

  // 3. CATALOGUES CARDS GRID STATE (SS 4)
  const [cataloguesList, setCataloguesList] = useState<CatalogueItem[]>([])

  // Modal Dialog Control States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCatId, setEditingCatId] = useState<string | null>(null)

  const [catModalForm, setCatModalForm] = useState({
    title: '',
    slug: '',
    category_name: 'General Surgery',
    description: '',
    cover_image: '/images/catalogue-cover-yellow.png',
    pdf_url: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    is_published: true,
  })

  const loadCataloguesFromDb = async () => {
    try {
      const res = await fetchCataloguesAction()
      if (res.catalogues) {
        setCataloguesList(res.catalogues)
      }
    } catch (e) {
      console.error(e)
    }
  }

  // SYNC FROM CLOUD / STORAGE ON MOUNT
  useEffect(() => {
    loadPersistentData('durable_catalogues_hero', heroForm, (data) => {
      if (data && typeof data === 'object') setHeroForm((prev) => ({ ...prev, ...data }))
    })

    loadPersistentData('durable_catalogues_overview', overviewForm, (data) => {
      if (data && typeof data === 'object') setOverviewForm((prev) => ({ ...prev, ...data }))
    })

    loadPersistentData('durable_catalogues_overview_cards', overviewCards, (data) => {
      if (Array.isArray(data) && data.length > 0) setOverviewCards(data)
    })

    loadCataloguesFromDb()
    window.addEventListener('durable_content_updated', loadCataloguesFromDb)
    return () => window.removeEventListener('durable_content_updated', loadCataloguesFromDb)
  }, [])

  // SAVE ALL CHANGES TO CLOUD & DUAL STORAGE ENGINE
  const saveAllToStorage = (customMsg?: string) => {
    try {
      savePersistentData('durable_catalogues_hero', heroForm)
      savePersistentData('durable_catalogues_overview', overviewForm)
      savePersistentData('durable_catalogues_overview_cards', overviewCards)

      setIsSaved(true)
      setSaveMessage(customMsg || 'Catalogues page content updated and published live across all devices!')
      setTimeout(() => setIsSaved(false), 4000)
    } catch (e) {
      console.error('Storage save error:', e)
    }
  }

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    saveAllToStorage()
  }

  const handleOpenAddModal = () => {
    setEditingCatId(null)
    setCatModalForm({
      title: '',
      slug: '',
      category_name: 'General Surgery',
      description: '',
      cover_image: '/images/catalogue-cover-yellow.png',
      pdf_url: '/pdf/general-surgical-instruments-catalogue.pdf',
      accessCode: '12345',
      is_published: true,
    })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (cat: CatalogueItem) => {
    setEditingCatId(cat.id)
    setCatModalForm({
      title: cat.title,
      slug: cat.slug,
      category_name: cat.category_name || 'General Surgery',
      description: cat.description || '',
      cover_image: cat.cover_image || '/images/catalogue-cover-yellow.png',
      pdf_url: cat.pdf_url,
      accessCode: (cat as any).accessCode || '12345',
      is_published: cat.is_published,
    })
    setIsModalOpen(true)
  }

  const handleDeleteCatalogue = async (id: string) => {
    if (confirm('Are you sure you want to delete this catalogue?')) {
      const res = await deleteCatalogueAction(id)
      if (res.success) {
        setCataloguesList((prev) => prev.filter((c) => c.id !== id))
        window.dispatchEvent(new Event('durable_content_updated'))
        setIsSaved(true)
        setSaveMessage('Catalogue deleted and updated live!')
        setTimeout(() => setIsSaved(false), 4000)
      } else {
        alert(res.error || 'Failed to delete catalogue')
      }
    }
  }

  const handleSaveModalForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!catModalForm.title.trim()) return

    const slug =
      catModalForm.slug.trim() ||
      catModalForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

    const payload = {
      title: catModalForm.title,
      slug: slug,
      category_id: null,
      description: catModalForm.description,
      cover_image: catModalForm.cover_image || '/images/catalogue-cover-yellow.png',
      pdf_url: catModalForm.pdf_url,
      is_published: catModalForm.is_published,
      sort_order: 0,
    }

    if (editingCatId) {
      const res = await updateCatalogueAction(editingCatId, payload)
      if (res.error) {
        alert(`Update failed: ${res.error}`)
        return
      }
    } else {
      const res = await createCatalogueAction(payload)
      if (res.error) {
        alert(`Creation failed: ${res.error}`)
        return
      }
    }

    await loadCataloguesFromDb()
    window.dispatchEvent(new Event('durable_content_updated'))
    setIsModalOpen(false)
    setIsSaved(true)
    setSaveMessage(editingCatId ? 'Catalogue updated successfully!' : 'New PDF Catalogue added successfully!')
    setTimeout(() => setIsSaved(false), 4000)
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span>Website Content</span>
            <span>•</span>
            <span className="text-[#E31B23] font-black">Catalogues Page Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3D] tracking-tight">
            Catalogues & PDF Content Manager
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage Hero Banner, 4 Overview Cards, PDF Catalogues Grid (with 3D Yellow Covers), and Access Codes.
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

      {/* ALL SECTIONS MATCHING SS 2, SS 3, SS 4 */}
      <div className="space-y-8">

        {/* SECTION 1: HERO BANNER SETTINGS (SS 2) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">1. Catalogues Hero Banner Settings (SS 2)</h2>
              <p className="text-xs text-slate-500">Edit hero badge, main title, highlight phrase, description, and surgical background photo.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Top Badge Text</label>
              <input
                type="text"
                value={heroForm.badge}
                onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Title Primary (Dark)</label>
              <input
                type="text"
                value={heroForm.titlePrimary}
                onChange={(e) => setHeroForm({ ...heroForm, titlePrimary: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Title Highlight (Red)</label>
              <input
                type="text"
                value={heroForm.titleHighlight}
                onChange={(e) => setHeroForm({ ...heroForm, titleHighlight: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-red-600"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <RichTextToolbar
                label="Hero Description Paragraph"
                value={heroForm.description}
                onChange={(val) => setHeroForm({ ...heroForm, description: val })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Hero Surgical Handoff Photo</label>
              <AdminMediaUploadPlaceholder
                value={heroForm.bgImage}
                onChange={(url) => setHeroForm({ ...heroForm, bgImage: url })}
                label="Choose or Upload Surgical Background Image"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: CATALOGUES OVERVIEW & 4 FEATURE CARDS (SS 3) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">2. Overview &amp; 4 Feature Cards (SS 3)</h2>
              <p className="text-xs text-slate-500">Edit tagline, 4 feature cards, main section title, and introductory paragraphs.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Tagline (Centered Top)</label>
              <input
                type="text"
                value={overviewForm.tagline}
                onChange={(e) => setOverviewForm({ ...overviewForm, tagline: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-[#0B1B3D]"
              />
            </div>

            {/* 4 Feature Cards Grid */}
            <div className="space-y-3 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase block">4 Overview Feature Cards</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {overviewCards.map((card, idx) => (
                  <div key={card.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={card.icon} alt={card.title} className="w-6 h-6 object-contain" />
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => {
                          const updated = [...overviewCards]
                          updated[idx].title = e.target.value
                          setOverviewCards(updated)
                        }}
                        className="w-full text-xs font-extrabold text-[#0B1B3D] bg-white px-2 py-1 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={card.description}
                      onChange={(e) => {
                        const updated = [...overviewCards]
                        updated[idx].description = e.target.value
                        setOverviewCards(updated)
                      }}
                      className="w-full text-[11px] text-slate-600 bg-white p-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Main Section Title</label>
              <input
                type="text"
                value={overviewForm.mainTitle}
                onChange={(e) => setOverviewForm({ ...overviewForm, mainTitle: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-[#0B1B3D]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <RichTextToolbar
                label="Overview Paragraph 1"
                value={overviewForm.p1}
                onChange={(val) => setOverviewForm({ ...overviewForm, p1: val })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <RichTextToolbar
                label="Overview Paragraph 2"
                value={overviewForm.p2}
                onChange={(val) => setOverviewForm({ ...overviewForm, p2: val })}
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: 3D YELLOW COVER CATALOGUE CARDS GRID MANAGER (SS 4) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#0B1B3D]">3. Downloadable Catalogues Cards Manager (SS 4)</h2>
                <p className="text-xs text-slate-500">Manage 3D Yellow Cover cards, PDF file uploads (direct gallery/computer upload, no size limit), titles, descriptions &amp; access codes.</p>
              </div>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 text-xs font-extrabold text-white bg-[#E31B23] hover:bg-red-700 rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Catalogue PDF</span>
            </button>
          </div>

          {/* Catalog Cards Grid Display matching SS 4 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cataloguesList.map((cat, idx) => (
              <div
                key={cat.id}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 space-y-4 relative flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  {/* Yellow Book Cover Preview */}
                  <div className="w-24 h-32 rounded-xl bg-amber-400 overflow-hidden border border-amber-300 shrink-0 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cat.cover_image || '/images/catalogue-cover-yellow.png'} alt={cat.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                        {(cat as any).code || `CATALOG 0${idx + 1}`}
                      </span>
                      <span className="text-[10px] font-extrabold text-[#E31B23] bg-red-50 px-2 py-0.5 rounded-full">
                        {cat.category_name || 'General Surgery'}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-[#0B1B3D] uppercase line-clamp-2">{cat.title}</h3>
                    <p className="text-[11px] text-slate-500 font-medium line-clamp-3">{cat.description}</p>
                    
                    <div className="pt-1 flex items-center gap-2 text-[10px] font-mono text-slate-600">
                      <FileUp className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span className="truncate max-w-[200px]" title={cat.pdf_url}>
                        {cat.pdf_url ? cat.pdf_url.split('/').pop() : 'No PDF attached'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/80">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[10px] font-bold text-slate-500">Access Code:</span>
                    <span className="font-mono font-bold text-[#0B1B3D] bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {(cat as any).accessCode || '12345'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(cat)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-200 border border-slate-200 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCatalogue(cat.id)}
                      className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ADD / EDIT CATALOGUE MODAL DIALOG WITH DIRECT PDF FILE UPLOAD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-[#0B1B3D] uppercase">
                  {editingCatId ? 'Edit Catalogue & PDF Document' : 'Upload New Catalogue & PDF File'}
                </h3>
                <p className="text-xs text-slate-500">Configure title, 3D yellow cover, description, access code, and direct PDF upload.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModalForm} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-800 uppercase">Catalogue Title *</label>
                <input
                  type="text"
                  required
                  value={catModalForm.title}
                  onChange={(e) => setCatModalForm({ ...catModalForm, title: e.target.value })}
                  placeholder="e.g. HOSPITAL FURNITURE"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#E31B23]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-800 uppercase">Category Tag</label>
                  <input
                    type="text"
                    value={catModalForm.category_name}
                    onChange={(e) => setCatModalForm({ ...catModalForm, category_name: e.target.value })}
                    placeholder="e.g. General Surgery"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-800 uppercase">Access Code / Password</label>
                  <input
                    type="text"
                    value={catModalForm.accessCode}
                    onChange={(e) => setCatModalForm({ ...catModalForm, accessCode: e.target.value })}
                    placeholder="e.g. 12345"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <RichTextToolbar
                  label="Catalogue Description Paragraph"
                  value={catModalForm.description}
                  onChange={(val) => setCatModalForm({ ...catModalForm, description: val })}
                />
              </div>

              {/* Direct PDF Upload from Computer / Gallery (No file size limit!) */}
              <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <label className="text-xs font-extrabold text-slate-800 uppercase block">
                  Direct PDF Document Upload (Gallery / Computer)
                </label>
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const reader = new FileReader()
                      reader.onload = (evt) => {
                        const dataUrl = evt.target?.result as string
                        setCatModalForm((prev) => ({ ...prev, pdf_url: dataUrl }))
                      }
                      reader.readAsDataURL(file)
                    }}
                    className="text-xs text-slate-600 font-semibold file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-[#0B1B3D] file:text-white cursor-pointer"
                  />

                  <div className="space-y-1 pt-1">
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Or Enter PDF URL / Path Directly</label>
                    <input
                      type="text"
                      value={catModalForm.pdf_url}
                      onChange={(e) => setCatModalForm({ ...catModalForm, pdf_url: e.target.value })}
                      placeholder="e.g. /pdf/hospital-furniture.pdf or https://..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>
                {catModalForm.pdf_url && (
                  <p className="text-[11px] font-mono text-emerald-700 font-bold truncate">
                    Attached PDF: {catModalForm.pdf_url.startsWith('data:') ? 'PDF File Uploaded Successfully (Data Base64)' : catModalForm.pdf_url}
                  </p>
                )}
              </div>

              {/* 3D Cover Image Selection */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-800 uppercase">3D Yellow Cover Image</label>
                <AdminMediaUploadPlaceholder
                  value={catModalForm.cover_image}
                  onChange={(url) => setCatModalForm({ ...catModalForm, cover_image: url })}
                  label="Choose or Upload 3D Book Cover Image"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#E31B23] text-white text-xs font-black rounded-xl cursor-pointer shadow-md hover:bg-red-700"
                >
                  {editingCatId ? 'Update Catalogue' : 'Save & Publish Catalogue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

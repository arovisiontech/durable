'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Plus,
  Search,
  Filter,
  RefreshCw,
  FolderTree,
  Edit2,
  Trash2,
  CheckCircle2,
  Save,
  ArrowLeft,
  FileText,
  Lock,
  Sparkles,
} from 'lucide-react'
import { AdminMediaUploadPlaceholder } from '@/src/components/admin/AdminMediaUploadPlaceholder'
import {
  SubcategoryPdfItem,
  getStoredSubcategoryPdfs,
  saveStoredSubcategoryPdfs,
  getStoredCategories,
  CategoryItem,
} from '@/src/lib/dataStore'

const MAIN_CATEGORIES = [
  { slug: 'general-surgery', name: 'General Surgery' },
  { slug: 'dental', name: 'Dental' },
  { slug: 'medical-hollowware', name: 'Medical Hollowware' },
  { slug: 'ophthalmic', name: 'Ophthalmic' },
  { slug: 'hospital-furniture', name: 'Hospital Furniture' },
  { slug: 'single-use-instruments', name: 'Single Use Instruments' },
]

export function SubcategoryManager() {
  const [subcategories, setSubcategories] = useState<SubcategoryPdfItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('all')
  const [isSaved, setIsSaved] = useState(false)
  const [saveMessage, setSaveMessage] = useState('Subcategories PDF catalogs updated live!')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SubcategoryPdfItem | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    categorySlug: 'general-surgery',
    image: '/images/catalogue-cover-yellow.png',
    pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    accessCode: '12345',
    description: '',
  })

  const loadData = useCallback(() => {
    setIsLoading(true)
    const all = getStoredSubcategoryPdfs()
    setSubcategories(all)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('durable_content_updated', handleUpdate)
    return () => window.removeEventListener('durable_content_updated', handleUpdate)
  }, [loadData])

  const saveToStorage = (updatedList: SubcategoryPdfItem[], msg?: string) => {
    saveStoredSubcategoryPdfs(updatedList)
    setSubcategories(updatedList)
    setSaveMessage(msg || 'Subcategories PDF catalogs updated live!')
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 4000)
  }

  // Filtered subcategories
  const filteredItems = subcategories.filter((item) => {
    if (selectedCategorySlug !== 'all' && item.categorySlug !== selectedCategorySlug) {
      return false
    }
    if (search.trim()) {
      const s = search.toLowerCase()
      return (
        item.title.toLowerCase().includes(s) ||
        (item.description || '').toLowerCase().includes(s) ||
        item.categoryName.toLowerCase().includes(s)
      )
    }
    return true
  })

  const handleOpenAdd = (defaultCat?: string) => {
    setEditingItem(null)
    const targetCat = defaultCat && defaultCat !== 'all' ? defaultCat : selectedCategorySlug !== 'all' ? selectedCategorySlug : 'general-surgery'
    setFormData({
      title: '',
      categorySlug: targetCat,
      image: '/images/catalogue-cover-yellow.png',
      pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
      accessCode: '12345',
      description: 'Experience Future of surgical instruments with ENDO Tech',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: SubcategoryPdfItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      categorySlug: item.categorySlug,
      image: item.image || '/images/catalogue-cover-yellow.png',
      pdfUrl: item.pdfUrl || '/pdf/general-surgical-instruments-catalogue.pdf',
      accessCode: item.accessCode || '12345',
      description: item.description || '',
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this subcategory PDF catalogue?')) {
      const updated = subcategories.filter((s) => s.id !== id)
      saveToStorage(updated, 'Subcategory catalog deleted & changes saved live!')
    }
  }

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    const catObj = MAIN_CATEGORIES.find((c) => c.slug === formData.categorySlug)
    const categoryName = catObj?.name || 'General Surgery'

    let updated: SubcategoryPdfItem[]
    if (editingItem) {
      updated = subcategories.map((s) =>
        s.id === editingItem.id
          ? {
              ...s,
              title: formData.title,
              categorySlug: formData.categorySlug,
              categoryName,
              image: formData.image,
              pdfUrl: formData.pdfUrl,
              accessCode: formData.accessCode,
              description: formData.description,
            }
          : s
      )
    } else {
      const newItem: SubcategoryPdfItem = {
        id: `subcat-${Date.now()}`,
        categorySlug: formData.categorySlug,
        categoryName,
        title: formData.title,
        image: formData.image,
        pdfUrl: formData.pdfUrl,
        accessCode: formData.accessCode,
        description: formData.description,
        sortOrder: subcategories.length + 1,
        isPublished: true,
      }
      updated = [...subcategories, newItem]
    }

    saveToStorage(
      updated,
      editingItem ? `Subcategory "${formData.title}" updated successfully!` : `New Subcategory "${formData.title}" added!`
    )
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 px-4 sm:px-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Catalogues Management</span>
            <span>•</span>
            <span className="text-[#E31B23] font-black">Subcategories PDF Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1B3D] tracking-tight">
            Subcategories & PDF Catalogues Manager
          </h1>
          <p className="text-xs text-slate-500 font-medium max-w-2xl">
            Manage subcategory PDF catalogues, cover artwork, access passwords, view/download links for all 6 main categories ({subcategories.length} total subcategories). All edits persist across refreshes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin"
            className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          <button
            type="button"
            onClick={() => saveToStorage(subcategories, 'All subcategories PDF catalogs saved & live!')}
            className="px-5 py-2.5 text-xs font-black text-white bg-[#0B1B3D] hover:bg-slate-900 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenAdd()}
            className="px-5 py-2.5 text-xs font-black text-white bg-[#E31B23] hover:bg-red-700 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subcategory PDF</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 text-emerald-800 text-xs font-bold shadow-xs animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{saveMessage}</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider bg-emerald-200/80 px-2 py-0.5 rounded-md text-emerald-900 font-black">
            SAVED LIVE
          </span>
        </div>
      )}

      {/* Overview Category Tabs Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div
          onClick={() => setSelectedCategorySlug('all')}
          className={`p-3 rounded-2xl border transition-all cursor-pointer text-center space-y-1 ${
            selectedCategorySlug === 'all'
              ? 'bg-[#0B1B3D] text-white border-[#0B1B3D] shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-black uppercase tracking-wider opacity-80">ALL CATS</div>
          <div className="text-xl font-black">{subcategories.length}</div>
        </div>

        {MAIN_CATEGORIES.map((cat) => {
          const count = subcategories.filter((s) => s.categorySlug === cat.slug).length
          const isSelected = selectedCategorySlug === cat.slug
          return (
            <div
              key={cat.slug}
              onClick={() => setSelectedCategorySlug(cat.slug)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer text-center space-y-1 ${
                isSelected
                  ? 'bg-[#E31B23] text-white border-[#E31B23] shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-[9px] font-black uppercase tracking-wider truncate" title={cat.name}>
                {cat.name.split(' ')[0]}
              </div>
              <div className="text-xl font-black">{count}</div>
            </div>
          )
        })}
      </div>

      {/* Filters & Search Controls */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subcategory title or category..."
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0B1B3D] text-slate-900 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setSelectedCategorySlug('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategorySlug === 'all'
                ? 'bg-[#0B1B3D] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>

          {MAIN_CATEGORIES.map((mc) => {
            const count = subcategories.filter((s) => s.categorySlug === mc.slug).length
            const active = selectedCategorySlug === mc.slug
            return (
              <button
                key={mc.slug}
                type="button"
                onClick={() => setSelectedCategorySlug(mc.slug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  active
                    ? 'bg-[#E31B23] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{mc.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Subcategories Grid List */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black text-[#E31B23] bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {item.categoryName}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Pass: {item.accessCode || '12345'}</span>
                  </span>
                </div>

                {/* Subcategory Cover Artwork */}
                <div className="w-full aspect-[4/3] rounded-2xl bg-slate-900 overflow-hidden relative border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image || '/images/catalogue-cover-yellow.png'} alt={item.title} className="w-full h-full object-cover" />
                </div>

                {/* Title & Description */}
                <div className="space-y-1">
                  <h3 className="text-base font-black text-[#0B1B3D]">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{item.description}</p>
                </div>

                {/* PDF Link preview */}
                <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-600 truncate flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#E31B23] shrink-0" />
                  <span className="truncate">{item.pdfUrl}</span>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => window.open(item.pdfUrl, '_blank')}
                  className="px-3 py-1.5 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                >
                  View PDF
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 text-slate-700 hover:text-[#0B1B3D] bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200/60 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E31B23] flex items-center justify-center mx-auto">
            <FolderTree className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-[#0B1B3D]">No Subcategories in {selectedCategorySlug}</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
              There are currently no subcategory PDF items under this category. Click below to add a new subcategory PDF showcase card.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleOpenAdd(selectedCategorySlug)}
            className="px-5 py-2.5 text-xs font-black text-white bg-[#E31B23] hover:bg-red-700 rounded-xl shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subcategory PDF</span>
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4 text-[#E31B23]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0B1B3D]">
                    {editingItem ? 'Edit Subcategory PDF' : 'Add New Subcategory PDF'}
                  </h3>
                  <p className="text-xs text-slate-500">Configure parent category, PDF link, cover & access code.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Parent Category <span className="text-[#E31B23]">*</span>
                  </label>
                  <select
                    required
                    value={formData.categorySlug}
                    onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  >
                    {MAIN_CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Access Code / Password <span className="text-[#E31B23]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.accessCode}
                    onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
                    placeholder="e.g. 12345"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Subcategory Title <span className="text-[#E31B23]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Anesthesia / Dissecting Forcep / Scissors"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider">Description Tag</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Experience Future of Anesthesia Instruments with ENDO Tech"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <AdminMediaUploadPlaceholder
                  label="Subcategory Cover Artwork Image"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />
              </div>

              <div className="space-y-1.5">
                <AdminMediaUploadPlaceholder
                  label="Subcategory Technical PDF Catalogue File"
                  type="pdf"
                  value={formData.pdfUrl}
                  onChange={(url) => setFormData({ ...formData, pdfUrl: url })}
                  placeholderText="Click or Drag to Upload PDF Catalogue File from Device / Gallery"
                  helperText="Supports any size PDF catalogue (1000+ pages, large MBs/KBs files, fast direct upload)"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-black text-white bg-[#E31B23] hover:bg-red-700 rounded-xl shadow-md cursor-pointer"
                >
                  {editingItem ? 'Update Subcategory' : 'Save Subcategory PDF'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

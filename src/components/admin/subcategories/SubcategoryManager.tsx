'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Filter, RefreshCw, FolderTree, Edit2, Trash2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { CategoryItem, getStoredCategories, saveStoredCategories } from '@/src/lib/dataStore'

export function SubcategoryManager() {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [parentFilter, setParentFilter] = useState('all')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<CategoryItem | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parent_id: '',
    description: '',
    image_url: '/images/cat-scissors-shears.png',
    sort_order: 1,
    is_published: true,
  })

  const loadData = useCallback(() => {
    setIsLoading(true)
    const all = getStoredCategories()
    setCategories(all)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('durable_content_updated', handleUpdate)
    return () => window.removeEventListener('durable_content_updated', handleUpdate)
  }, [loadData])

  // Root categories for selection
  const rootCategories = categories.filter((c) => !c.parent_id)

  // Subcategories only
  const subcategories = categories.filter((c) => {
    if (!c.parent_id) return false
    if (parentFilter !== 'all' && c.parent_id !== parentFilter) return false
    if (search.trim()) {
      const s = search.toLowerCase()
      return c.name.toLowerCase().includes(s) || c.slug.toLowerCase().includes(s)
    }
    return true
  })

  const handleOpenAdd = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      slug: '',
      parent_id: rootCategories[0]?.id || '',
      description: '',
      image_url: '/images/cat-scissors-shears.png',
      sort_order: subcategories.length + 1,
      is_published: true,
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: CategoryItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      slug: item.slug,
      parent_id: item.parent_id || '',
      description: item.description || '',
      image_url: item.image_url || '/images/cat-scissors-shears.png',
      sort_order: item.sort_order || 1,
      is_published: item.is_published,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this subcategory?')) {
      const updated = categories.filter((c) => c.id !== id)
      saveStoredCategories(updated)
      setCategories(updated)
      toast.success('Subcategory deleted successfully')
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    const slug = formData.slug.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    if (editingItem) {
      const updated = categories.map((c) =>
        c.id === editingItem.id
          ? {
              ...c,
              name: formData.name,
              slug,
              parent_id: formData.parent_id || null,
              description: formData.description,
              image_url: formData.image_url,
              sort_order: Number(formData.sort_order),
              is_published: formData.is_published,
              updated_at: new Date().toISOString(),
            }
          : c
      )
      saveStoredCategories(updated)
      setCategories(updated)
      toast.success(`Subcategory "${formData.name}" updated successfully!`)
    } else {
      const newItem: CategoryItem = {
        id: `subcat-${slug}-${Date.now()}`,
        parent_id: formData.parent_id || null,
        name: formData.name,
        slug,
        description: formData.description || null,
        image_url: formData.image_url || null,
        sort_order: Number(formData.sort_order) || 1,
        is_published: formData.is_published,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        level: 1,
      }
      const updated = [...categories, newItem]
      saveStoredCategories(updated)
      setCategories(updated)
      toast.success(`Subcategory "${formData.name}" created successfully!`)
    }

    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Product Subcategories
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage subcategory classifications assigned under root surgical & dental categories ({subcategories.length} total).
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => loadData()}
            className="p-2.5 bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Add Subcategory
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subcategory name or slug..."
            className="w-full text-xs pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={parentFilter}
            onChange={(e) => setParentFilter(e.target.value)}
            className="bg-transparent focus:outline-none font-semibold text-slate-900 cursor-pointer"
          >
            <option value="all">All Root Categories</option>
            {rootCategories.map((rc) => (
              <option key={rc.id} value={rc.id}>
                {rc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        {subcategories.length === 0 ? (
          <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto shadow-xs">
              <FolderTree className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No subcategories found</h3>
              <p className="text-xs text-slate-500">Add subcategories under your root product categories.</p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add First Subcategory
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Subcategory / Slug</th>
                  <th className="py-3 px-4">Parent Category</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subcategories.map((item) => {
                  const parent = rootCategories.find((r) => r.id === item.parent_id)
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image_url || '/images/cat-scissors-shears.png'} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{item.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">/{item.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                        <span className="px-2.5 py-1 bg-red-50 text-red-700 font-bold rounded-lg border border-red-100">
                          {parent?.name || 'Root Level'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs truncate">
                        {item.description || '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.is_published ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.is_published ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {item.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-2 text-slate-700 hover:text-red-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-600 hover:text-red-800 bg-red-50 rounded-lg hover:bg-red-100"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900">
              {editingItem ? 'Edit Subcategory' : 'Add New Subcategory'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Parent Root Category</label>
                <select
                  value={formData.parent_id}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                >
                  {rootCategories.map((rc) => (
                    <option key={rc.id} value={rc.id}>
                      {rc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Subcategory Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Extraction Forceps"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">URL Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. extraction-forceps"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Image URL</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-extrabold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs"
                >
                  Save Subcategory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Filter, ArrowUpDown, RefreshCw, FolderTree } from 'lucide-react'
import { toast } from 'sonner'
import { CategoryItem } from '@/src/types/category'
import { fetchCategoriesAction, toggleCategoryStatusAction } from '@/app/admin/actions/categories'
import { CategoryTableRow } from './CategoryTableRow'
import { CategoryFormModal } from './CategoryFormModal'
import { CategoryDeleteDialog } from './CategoryDeleteDialog'

export function CategoryManager() {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters & Controls
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [parentFilter, setParentFilter] = useState<'all' | 'root' | 'sub'>('all')
  const [sortBy, setSortBy] = useState<'order' | 'name' | 'newest'>('order')

  // Modals
  const [showFormModal, setShowFormModal] = useState(false)
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryItem | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null)

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(handler)
  }, [search])

  const loadCategories = useCallback(async () => {
    setIsLoading(true)
    const res = await fetchCategoriesAction({
      search: debouncedSearch,
      status,
      parentFilter,
      sortBy,
    })

    setCategories(res.categories)
    setIsLoading(false)
  }, [debouncedSearch, status, parentFilter, sortBy])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const res = await toggleCategoryStatusAction(id, currentStatus)
    if (res.success) {
      toast.success(currentStatus ? 'Category published' : 'Category set to draft')
      loadCategories()
    } else {
      toast.error(res.error || 'Failed to toggle status')
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Product Categories
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage surgical instrument classifications, subcategories, display order, and hierarchy.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => loadCategories()}
            className="p-2.5 bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            title="Refresh Categories"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => {
              setCategoryToEdit(null)
              setShowFormModal(true)
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>
      </div>

      {/* Filters & Search Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search category name or slug..."
            className="w-full text-xs pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-900"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'all' | 'published' | 'draft')}
              className="bg-transparent focus:outline-none font-semibold text-slate-900 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Hierarchy Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700">
            <select
              value={parentFilter}
              onChange={(e) => setParentFilter(e.target.value as 'all' | 'root' | 'sub')}
              className="bg-transparent focus:outline-none font-semibold text-slate-900 cursor-pointer"
            >
              <option value="all">All Levels</option>
              <option value="root">Root Categories Only</option>
              <option value="sub">Subcategories Only</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'order' | 'name' | 'newest')}
              className="bg-transparent focus:outline-none font-semibold text-slate-900 cursor-pointer"
            >
              <option value="order">Sort: Order #</option>
              <option value="name">Sort: Name A-Z</option>
              <option value="newest">Sort: Newest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto shadow-xs">
              <FolderTree className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No categories found</h3>
              <p className="text-xs text-slate-500">
                No categories match your search and filter criteria.
              </p>
            </div>
            <button
              onClick={() => {
                setCategoryToEdit(null)
                setShowFormModal(true)
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Add First Category
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Category / Slug</th>
                  <th className="py-3 px-4">Parent Level</th>
                  <th className="py-3 px-4">Assigned Products</th>
                  <th className="py-3 px-4">Sort Order</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <CategoryTableRow
                    key={cat.id}
                    category={cat}
                    onEdit={(c) => {
                      setCategoryToEdit(c)
                      setShowFormModal(true)
                    }}
                    onDelete={(c) => setDeletingCategory(c)}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Category Create/Edit Form Modal */}
      <CategoryFormModal
        isOpen={showFormModal}
        categoryToEdit={categoryToEdit}
        categories={categories}
        onClose={() => {
          setShowFormModal(false)
          setCategoryToEdit(null)
        }}
        onSuccess={() => loadCategories()}
      />

      {/* Delete Confirmation Dialog */}
      <CategoryDeleteDialog
        category={deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onSuccess={() => loadCategories()}
      />
    </div>
  )
}

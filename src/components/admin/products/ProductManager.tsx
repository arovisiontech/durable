'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter, ArrowUpDown, RefreshCw, Package, Star } from 'lucide-react'
import { toast } from 'sonner'
import { ProductItem } from '@/src/types/product'
import { CategoryItem } from '@/src/types/category'
import {
  fetchProductsAction,
  duplicateProductAction,
  toggleProductPublishAction,
  toggleProductFeaturedAction,
} from '@/app/admin/actions/products'
import { fetchCategoriesAction } from '@/app/admin/actions/categories'
import { ProductTableRow } from './ProductTableRow'
import { ProductCard } from './ProductCard'
import { ProductDeleteDialog } from './ProductDeleteDialog'

export function ProductManager() {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  // Filters
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [categoryId, setCategoryId] = useState('all')
  const [status, setStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [featured, setFeatured] = useState<'all' | 'featured' | 'standard'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title' | 'order'>('newest')

  // Modals
  const [deletingProduct, setDeletingProduct] = useState<ProductItem | null>(null)

  // Search Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(handler)
  }, [search])

  // Load Categories for filter
  useEffect(() => {
    fetchCategoriesAction().then((res) => {
      setCategories(res.categories)
    })
  }, [])

  const loadProducts = useCallback(async () => {
    setIsLoading(true)
    const res = await fetchProductsAction({
      search: debouncedSearch,
      categoryId,
      status,
      featured,
      sortBy,
    })

    setProducts(res.products)
    setTotalCount(res.count)
    setIsLoading(false)
  }, [debouncedSearch, categoryId, status, featured, sortBy])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const handleDuplicate = async (product: ProductItem) => {
    const toastId = toast.loading(`Duplicating "${product.title}"...`)
    const res = await duplicateProductAction(product.id)
    toast.dismiss(toastId)

    if (res.product) {
      toast.success(`Duplicated "${product.title}" as draft`)
      loadProducts()
    } else {
      toast.error(res.error || 'Duplication failed')
    }
  }

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    const res = await toggleProductPublishAction(id, currentStatus)
    if (res.success) {
      toast.success(currentStatus ? 'Product published' : 'Product set to draft')
      loadProducts()
    } else {
      toast.error(res.error || 'Failed to toggle publish status')
    }
  }

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    const res = await toggleProductFeaturedAction(id, currentFeatured)
    if (res.success) {
      toast.success(currentFeatured ? 'Product marked as Featured' : 'Product removed from Featured')
      loadProducts()
    } else {
      toast.error(res.error || 'Failed to toggle featured status')
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Product Catalogue
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage surgical instruments, specifications, image galleries, and catalogue entries ({totalCount} total).
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => loadProducts()}
            className="p-2.5 bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            title="Refresh Products"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filters & Search Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, slug, or SKU..."
            className="w-full text-xs pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-900"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="bg-transparent focus:outline-none font-semibold text-slate-900 cursor-pointer max-w-[140px] truncate"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700">
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

          {/* Featured Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700">
            <Star className="w-3.5 h-3.5 text-amber-500" />
            <select
              value={featured}
              onChange={(e) => setFeatured(e.target.value as 'all' | 'featured' | 'standard')}
              className="bg-transparent focus:outline-none font-semibold text-slate-900 cursor-pointer"
            >
              <option value="all">All Items</option>
              <option value="featured">Featured Only</option>
              <option value="standard">Standard Only</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'title' | 'order')}
              className="bg-transparent focus:outline-none font-semibold text-slate-900 cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="title">Sort: Title A-Z</option>
              <option value="order">Sort: Order #</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {isLoading ? (
        <div className="p-8 space-y-4 bg-white border border-slate-200 rounded-2xl">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl py-16 text-center space-y-4 max-w-sm mx-auto shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto shadow-xs">
            <Package className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No products found</h3>
            <p className="text-xs text-slate-500">
              No products match your current search and filter settings.
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Create First Product
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Product / Slug</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Order</th>
                    <th className="py-3 px-4">Created Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <ProductTableRow
                      key={p.id}
                      product={p}
                      onDuplicate={handleDuplicate}
                      onDelete={(prod) => setDeletingProduct(prod)}
                      onTogglePublish={handleTogglePublish}
                      onToggleFeatured={handleToggleFeatured}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card Grid View */}
          <div className="grid md:hidden grid-cols-1 gap-4">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onDuplicate={handleDuplicate}
                onDelete={(prod) => setDeletingProduct(prod)}
                onTogglePublish={handleTogglePublish}
                onToggleFeatured={handleToggleFeatured}
              />
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <ProductDeleteDialog
        product={deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onSuccess={() => loadProducts()}
      />
    </div>
  )
}

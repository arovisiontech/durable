'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit2, Copy, Trash2, Image as ImageIcon, Star, Loader2 } from 'lucide-react'
import { ProductItem } from '@/src/types/product'

interface ProductCardProps {
  product: ProductItem
  onDuplicate: (product: ProductItem) => void
  onDelete: (product: ProductItem) => void
  onTogglePublish: (id: string, currentStatus: boolean) => void
  onToggleFeatured: (id: string, currentFeatured: boolean) => void
}

export function ProductCard({
  product,
  onDuplicate,
  onDelete,
  onTogglePublish,
  onToggleFeatured,
}: ProductCardProps) {
  const [isTogglingPublish, setIsTogglingPublish] = useState(false)
  const [isTogglingFeatured, setIsTogglingFeatured] = useState(false)

  const handlePublishToggle = async () => {
    setIsTogglingPublish(true)
    await onTogglePublish(product.id, !product.is_published)
    setIsTogglingPublish(false)
  }

  const handleFeaturedToggle = async () => {
    setIsTogglingFeatured(true)
    await onToggleFeatured(product.id, !product.is_featured)
    setIsTogglingFeatured(false)
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
      {/* Header Info */}
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
          {product.featured_image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={product.featured_image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-6 h-6 text-slate-400" />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="font-bold text-slate-900 hover:text-red-600 transition-colors text-sm line-clamp-1"
          >
            {product.title}
          </Link>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            {product.sku && (
              <span className="font-mono px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-700">
                {product.sku}
              </span>
            )}
            {product.category_name && (
              <span className="font-semibold px-2 py-0.2 rounded-full bg-red-50 text-red-700 border border-red-100">
                {product.category_name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Status Badges & Quick Toggles */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePublishToggle}
            disabled={isTogglingPublish}
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border cursor-pointer ${
              product.is_published
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {product.is_published ? 'Published' : 'Draft'}
          </button>

          <button
            onClick={handleFeaturedToggle}
            disabled={isTogglingFeatured}
            className={`p-1 rounded-lg border cursor-pointer ${
              product.is_featured
                ? 'bg-amber-50 border-amber-200 text-amber-500'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            {isTogglingFeatured ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Star className={`w-3.5 h-3.5 ${product.is_featured ? 'fill-amber-400' : ''}`} />
            )}
          </button>
        </div>

        <div className="flex items-center gap-1">
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="p-2 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onDuplicate(product)}
            className="p-2 rounded-lg bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-600 border border-slate-200"
            title="Duplicate"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="p-2 rounded-lg bg-slate-50 text-slate-700 hover:bg-red-50 hover:text-red-600 border border-slate-200"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

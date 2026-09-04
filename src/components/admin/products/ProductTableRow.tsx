'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Edit2,
  Copy,
  Trash2,
  Image as ImageIcon,
  Star,
  Loader2,
  Eye,
  X,
  Check,
} from 'lucide-react'
import { ProductItem } from '@/src/types/product'

interface ProductTableRowProps {
  product: ProductItem
  onDuplicate: (product: ProductItem) => void
  onDelete: (product: ProductItem) => void
  onTogglePublish: (id: string, currentStatus: boolean) => void
  onToggleFeatured: (id: string, currentFeatured: boolean) => void
}

export function ProductTableRow({
  product,
  onDuplicate,
  onDelete,
  onTogglePublish,
  onToggleFeatured,
}: ProductTableRowProps) {
  const [isTogglingPublish, setIsTogglingPublish] = useState(false)
  const [isTogglingFeatured, setIsTogglingFeatured] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)

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
    <>
      <tr className="hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-0 text-xs">
        {/* Product Image & Title */}
        <td className="py-3.5 px-4 font-medium text-slate-900">
          <div className="flex items-center gap-3">
            {/* Featured Image Thumbnail with Zoom View Trigger */}
            <div
              onClick={() => product.featured_image && setShowImageModal(true)}
              className={`relative group w-10 h-10 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 ${
                product.featured_image ? 'cursor-pointer' : 'bg-slate-100'
              }`}
              title="Click to view full image"
            >
              {product.featured_image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.featured_image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                </>
              ) : (
                <ImageIcon className="w-5 h-5 text-slate-400" />
              )}
            </div>

            <div className="min-w-0">
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="font-bold text-slate-900 hover:text-red-600 transition-colors truncate block"
              >
                {product.title}
              </Link>
              <p className="text-[11px] font-mono text-slate-500 truncate">
                /{product.slug}
              </p>
            </div>
          </div>
        </td>

        {/* SKU */}
        <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
          {product.sku ? (
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px]">
              {product.sku}
            </span>
          ) : (
            <span className="text-slate-400 italic text-[11px]">No SKU</span>
          )}
        </td>

        {/* Category */}
        <td className="py-3.5 px-4 text-slate-600">
          {product.category_name ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-100">
              {product.category_name}
            </span>
          ) : (
            <span className="text-slate-400 italic text-[11px]">Uncategorized</span>
          )}
        </td>

        {/* Featured Star Toggle */}
        <td className="py-3.5 px-4">
          <button
            onClick={handleFeaturedToggle}
            disabled={isTogglingFeatured}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer disabled:opacity-50 ${
              product.is_featured
                ? 'bg-amber-50 border-amber-200 text-amber-500 hover:bg-amber-100'
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-amber-500 hover:bg-amber-50'
            }`}
            title={
              product.is_featured
                ? 'Featured Product (Click to unfeature)'
                : 'Standard Product (Click to feature)'
            }
          >
            {isTogglingFeatured ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            ) : (
              <Star
                className={`w-4 h-4 ${product.is_featured ? 'fill-amber-400' : ''}`}
              />
            )}
          </button>
        </td>

        {/* Published Toggle Switch */}
        <td className="py-3.5 px-4">
          <button
            onClick={handlePublishToggle}
            disabled={isTogglingPublish}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-50 ${
              product.is_published
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
            }`}
            title="Click to toggle status"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                product.is_published ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            {product.is_published ? 'Published' : 'Draft'}
          </button>
        </td>

        {/* Sort Order */}
        <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
          #{product.sort_order}
        </td>

        {/* Created Date */}
        <td className="py-3.5 px-4 text-slate-500 text-[11px]">
          {new Date(product.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </td>

        {/* Actions */}
        <td className="py-3.5 px-4 text-right">
          <div className="flex items-center justify-end gap-1">
            {product.featured_image && (
              <button
                onClick={() => setShowImageModal(true)}
                className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                title="View High-Res Image"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            <Link
              href={`/admin/products/${product.id}/edit`}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Edit Product Details & Images"
            >
              <Edit2 className="w-4 h-4" />
            </Link>
            <button
              onClick={() => onDuplicate(product)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="Duplicate Product"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(product)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Delete Product"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      {/* Image Lightbox View Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative bg-white rounded-3xl p-6 shadow-2xl max-w-lg w-full space-y-4 text-center">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">{product.title}</h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="p-1 rounded bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full h-72 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.featured_image!}
                alt={product.title}
                className="w-full h-full object-contain p-2"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono">{product.sku}</span>
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="font-bold text-red-600 hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Image & Attributes
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

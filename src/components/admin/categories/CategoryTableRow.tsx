'use client'

import { useState } from 'react'
import {
  Edit2,
  Trash2,
  Image as ImageIcon,
  CornerDownRight,
  Package,
  Eye,
  X,
} from 'lucide-react'
import { CategoryItem } from '@/src/types/category'

interface CategoryTableRowProps {
  category: CategoryItem
  onEdit: (category: CategoryItem) => void
  onDelete: (category: CategoryItem) => void
  onToggleStatus: (id: string, currentStatus: boolean) => void
}

export function CategoryTableRow({
  category,
  onEdit,
  onDelete,
  onToggleStatus,
}: CategoryTableRowProps) {
  const [isToggling, setIsToggling] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const isSubcategory = !!category.parent_id
  const level = category.level || 0

  const handleStatusToggle = async () => {
    setIsToggling(true)
    await onToggleStatus(category.id, !category.is_published)
    setIsToggling(false)
  }

  return (
    <>
      <tr className="hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-0 text-xs">
        {/* Name & Hierarchy Tree Indentation */}
        <td className="py-3.5 px-4 font-medium text-slate-900">
          <div
            className="flex items-center gap-2.5"
            style={{ paddingLeft: `${Math.min(level, 4) * 1.5}rem` }}
          >
            {isSubcategory && (
              <CornerDownRight className="w-4 h-4 text-slate-400 shrink-0" />
            )}

            {/* Category Thumbnail with View Trigger */}
            <div
              onClick={() => category.image_url && setShowImageModal(true)}
              className={`relative group w-9 h-9 rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 ${
                category.image_url ? 'cursor-pointer' : 'bg-slate-100'
              }`}
              title="Click to view category image"
            >
              {category.image_url ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Eye className="w-3.5 h-3.5 text-white" />
                  </div>
                </>
              ) : (
                <ImageIcon className="w-4 h-4 text-slate-400" />
              )}
            </div>

            <div className="min-w-0">
              <p className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                {category.name}
                {isSubcategory && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    Sub
                  </span>
                )}
              </p>
              <p className="text-[11px] font-mono text-slate-500 truncate">
                /{category.slug}
              </p>
            </div>
          </div>
        </td>

        {/* Parent Category */}
        <td className="py-3.5 px-4 text-slate-600">
          {category.parent_name ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {category.parent_name}
            </span>
          ) : (
            <span className="text-slate-400 text-[11px] italic">Root</span>
          )}
        </td>

        {/* Product Count */}
        <td className="py-3.5 px-4">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
            <Package className="w-3 h-3 text-blue-600" />
            {category.product_count || 0}
          </span>
        </td>

        {/* Sort Order */}
        <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
          #{category.sort_order}
        </td>

        {/* Published / Draft Status Toggle */}
        <td className="py-3.5 px-4">
          <button
            onClick={handleStatusToggle}
            disabled={isToggling}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-50 ${
              category.is_published
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
            }`}
            title="Click to toggle status"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                category.is_published ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            {category.is_published ? 'Published' : 'Draft'}
          </button>
        </td>

        {/* Created Date */}
        <td className="py-3.5 px-4 text-slate-500 text-[11px]">
          {new Date(category.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </td>

        {/* Actions */}
        <td className="py-3.5 px-4 text-right">
          <div className="flex items-center justify-end gap-1.5">
            {category.image_url && (
              <button
                onClick={() => setShowImageModal(true)}
                className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                title="View Category Image"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onEdit(category)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Edit Category"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(category)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Delete Category"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      {/* Category Image Lightbox */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full space-y-4 text-center">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">{category.name}</h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="p-1 rounded bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full h-56 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.image_url!}
                alt={category.name}
                className="w-full h-full object-contain p-2"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono">/{category.slug}</span>
              <button
                onClick={() => {
                  setShowImageModal(false)
                  onEdit(category)
                }}
                className="font-bold text-red-600 hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Image & Name
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

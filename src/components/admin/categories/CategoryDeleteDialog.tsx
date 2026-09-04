'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Trash2, X, Loader2, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { CategoryItem, CategoryDeleteCheckResult } from '@/src/types/category'
import { checkCategoryDeleteSafetyAction, deleteCategoryAction } from '@/app/admin/actions/categories'

interface CategoryDeleteDialogProps {
  category: CategoryItem | null
  onClose: () => void
  onSuccess: () => void
}

export function CategoryDeleteDialog({
  category,
  onClose,
  onSuccess,
}: CategoryDeleteDialogProps) {
  const [isChecking, setIsChecking] = useState(true)
  const [safetyInfo, setSafetyInfo] = useState<CategoryDeleteCheckResult | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!category) return

    let isMounted = true
    setIsChecking(true)

    checkCategoryDeleteSafetyAction(category.id).then((res) => {
      if (isMounted) {
        setSafetyInfo(res.result)
        setIsChecking(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [category])

  if (!category) return null

  const handleDelete = async () => {
    setIsDeleting(true)
    const res = await deleteCategoryAction(category.id)
    setIsDeleting(false)

    if (res.success) {
      toast.success(`Deleted category "${category.name}"`)
      onSuccess()
      onClose()
    } else {
      toast.error(res.error || 'Failed to delete category')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Window */}
      <div className="relative bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div
            className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-xs shrink-0 ${
              safetyInfo?.canDelete === false
                ? 'bg-amber-50 text-amber-600 border-amber-200'
                : 'bg-red-50 text-red-600 border-red-100'
            }`}
          >
            {safetyInfo?.canDelete === false ? <Lock className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 leading-tight">
            Delete Category?
          </h3>
          <p className="text-xs text-slate-600">
            You are about to delete{' '}
            <strong className="text-slate-900">&quot;{category.name}&quot;</strong> ({category.slug}).
          </p>
        </div>

        {/* Safety Check Loader or Blocker Alert */}
        {isChecking ? (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            <span>Checking assigned products & subcategories...</span>
          </div>
        ) : (
          safetyInfo && (
            <div>
              {!safetyInfo.canDelete ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2 text-amber-900 text-xs">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Deletion Blocked</span>
                  </div>
                  <p className="text-amber-800 leading-relaxed">
                    {safetyInfo.message}
                  </p>
                  <div className="pt-2 flex items-center gap-2 font-semibold text-amber-950 text-[11px]">
                    <span>• Products: {safetyInfo.productCount}</span>
                    <span>• Subcategories: {safetyInfo.childCategoryCount}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-800 font-semibold">
                  ✓ Safe to delete. No products or subcategories are assigned to this category.
                </div>
              )}
            </div>
          )
        )}

        {/* Dialog Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting || isChecking || safetyInfo?.canDelete === false}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-40 transition-colors shadow-xs"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Category
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

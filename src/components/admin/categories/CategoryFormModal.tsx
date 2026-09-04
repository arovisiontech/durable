'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Save, Image as ImageIcon, Sparkles, Layers } from 'lucide-react'
import { toast } from 'sonner'
import { CategoryItem, CategoryFormData, categorySchema } from '@/src/types/category'
import { createCategoryAction, updateCategoryAction } from '@/app/admin/actions/categories'
import { CategorySelect } from '@/src/components/admin/CategorySelect'
import { MediaPicker } from '@/src/components/admin/MediaPicker'

interface CategoryFormModalProps {
  isOpen: boolean
  categoryToEdit?: CategoryItem | null
  categories: CategoryItem[]
  onClose: () => void
  onSuccess: () => void
}

export function CategoryFormModal({
  isOpen,
  categoryToEdit,
  categories,
  onClose,
  onSuccess,
}: CategoryFormModalProps) {
  const isEditing = !!categoryToEdit
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [autoSlug, setAutoSlug] = useState(!isEditing)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      parent_id: null,
      description: '',
      image_url: '',
      sort_order: 0,
      is_published: true,
    },
  })

  const nameValue = watch('name')
  const imageUrlValue = watch('image_url')
  const parentIdValue = watch('parent_id')

  // Auto-slug generator helper
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // Handle auto slug when typing category name
  useEffect(() => {
    if (autoSlug && nameValue) {
      setValue('slug', slugify(nameValue), { shouldValidate: true })
    }
  }, [nameValue, autoSlug, setValue])

  // Populate form on edit
  useEffect(() => {
    if (isOpen) {
      if (categoryToEdit) {
        reset({
          name: categoryToEdit.name,
          slug: categoryToEdit.slug,
          parent_id: categoryToEdit.parent_id,
          description: categoryToEdit.description || '',
          image_url: categoryToEdit.image_url || '',
          sort_order: categoryToEdit.sort_order,
          is_published: categoryToEdit.is_published,
        })
        setAutoSlug(false)
      } else {
        reset({
          name: '',
          slug: '',
          parent_id: null,
          description: '',
          image_url: '',
          sort_order: 0,
          is_published: true,
        })
        setAutoSlug(true)
      }
    }
  }, [isOpen, categoryToEdit, reset])

  if (!isOpen) return null

  const onSubmit = async (data: CategoryFormData) => {
    let res
    if (isEditing && categoryToEdit) {
      res = await updateCategoryAction(categoryToEdit.id, data)
    } else {
      res = await createCategoryAction(data)
    }

    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success(
        isEditing ? 'Category updated successfully' : 'Category created successfully'
      )
      onSuccess()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Form Modal Box */}
      <div className="relative bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600">
              {isEditing ? 'Edit Category' : 'Create New Category'}
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
              {isEditing ? categoryToEdit.name : 'Add Instrument Classification'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Category Name & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Category Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register('name')}
                placeholder="e.g. Surgical Scissors"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-900 font-semibold"
              />
              {errors.name && (
                <p className="text-[11px] font-semibold text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  URL Slug <span className="text-red-600">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setAutoSlug(!autoSlug)}
                  className="text-[10px] font-semibold text-red-600 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  {autoSlug ? 'Auto-generating' : 'Manual Slug'}
                </button>
              </div>
              <input
                type="text"
                {...register('slug')}
                onChange={(e) => {
                  setAutoSlug(false)
                  setValue('slug', e.target.value)
                }}
                placeholder="surgical-scissors"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-900 font-mono"
              />
              {errors.slug && (
                <p className="text-[11px] font-semibold text-red-600">{errors.slug.message}</p>
              )}
            </div>
          </div>

          {/* Parent Category Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              Parent Category (For Subcategories)
            </label>
            <CategorySelect
              value={parentIdValue}
              onChange={(val) => setValue('parent_id', val)}
              categories={categories}
              excludeId={categoryToEdit?.id}
              placeholder="None (Root Top-Level Category)"
            />
            <p className="text-[11px] text-slate-500">
              Select a parent category to create a subcategory tree.
            </p>
          </div>

          {/* Category Image */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Category Image
            </label>
            <div className="flex items-center gap-3">
              {imageUrlValue ? (
                <div className="relative w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-900 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrlValue}
                    alt="Selected Category"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setValue('image_url', '')}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-red-600 text-white hover:bg-red-700"
                    title="Remove Image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}

              <div className="space-y-1 flex-1">
                <button
                  type="button"
                  onClick={() => setShowMediaPicker(true)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 flex items-center gap-1.5"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-red-600" />
                  Select from Media Library
                </button>
                <input
                  type="text"
                  {...register('image_url')}
                  placeholder="Or enter image URL..."
                  className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Description
            </label>
            <textarea
              rows={3}
              {...register('description')}
              placeholder="Brief description of this instrument category..."
              className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-900"
            />
          </div>

          {/* Sort Order & Published Switch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Display Sort Order
              </label>
              <input
                type="number"
                {...register('sort_order', { valueAsNumber: true })}
                placeholder="0"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-900 font-semibold"
              />
              <p className="text-[11px] text-slate-500">Lower numbers appear first.</p>
            </div>

            <div className="space-y-1.5 flex flex-col justify-center">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Visibility Status
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('is_published')}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Publish Category Immediately
                </span>
              </label>
            </div>
          </div>

          {/* Footer Submit Bar */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors shadow-xs"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>

      {/* Media Picker Modal */}
      <MediaPicker
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={(media) => {
          setValue('image_url', media.public_url)
          setShowMediaPicker(false)
        }}
        filterType="image"
        title="Select Category Image"
      />
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft,
  Save,
  ImageIcon,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Sparkles,
  Eye,
  FileText,
  X,
  Layers,
  Star,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'
import { ProductItem, ProductFormData, productSchema } from '@/src/types/product'
import { CategoryItem } from '@/src/types/category'
import { createProductAction, updateProductAction } from '@/app/admin/actions/products'
import { fetchCategoriesAction } from '@/app/admin/actions/categories'
import { CategorySelect } from '@/src/components/admin/CategorySelect'
import { MediaPicker } from '@/src/components/admin/MediaPicker'

interface ProductFormProps {
  productToEdit?: ProductItem | null
}

export function ProductForm({ productToEdit }: ProductFormProps) {
  const router = useRouter()
  const isEditing = !!productToEdit

  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [autoSlug, setAutoSlug] = useState(!isEditing)
  const [showFeaturedMediaPicker, setShowFeaturedMediaPicker] = useState(false)
  const [showGalleryMediaPicker, setShowGalleryMediaPicker] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [newFeatureText, setNewFeatureText] = useState('')

  // Load categories
  useEffect(() => {
    fetchCategoriesAction().then((res) => {
      setCategories(res.categories)
    })
  }, [])

  // Map initial specifications object into key-value array for form
  const initialSpecs = productToEdit?.specifications
    ? Object.entries(productToEdit.specifications).map(([key, value]) => ({ key, value }))
    : [
        { key: 'Material', value: 'AISI 420 Stainless Steel' },
        { key: 'Certification', value: 'ISO 13485, CE Marked' },
      ]

  const initialGallery = productToEdit?.gallery_images
    ? productToEdit.gallery_images.map((img) => ({
        id: img.id,
        image_url: img.image_url,
        alt_text: img.alt_text || '',
        sort_order: img.sort_order,
      }))
    : []

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: productToEdit?.title || '',
      slug: productToEdit?.slug || '',
      sku: productToEdit?.sku || '',
      category_id: productToEdit?.category_id || null,
      short_description: productToEdit?.short_description || '',
      full_description: productToEdit?.full_description || '',
      featured_image: productToEdit?.featured_image || '',
      gallery_images: initialGallery,
      features: productToEdit?.features || [],
      specifications: initialSpecs,
      catalogue_pdf: productToEdit?.catalogue_pdf || '',
      is_featured: productToEdit?.is_featured ?? false,
      is_published: productToEdit?.is_published ?? true,
      seo_title: productToEdit?.seo_title || '',
      seo_description: productToEdit?.seo_description || '',
      sort_order: productToEdit?.sort_order ?? 0,
    },
  })

  // Field Arrays for Dynamic Specifications & Gallery Images
  const {
    fields: specFields,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({
    control,
    name: 'specifications',
  })

  const {
    fields: galleryFields,
    append: appendGallery,
    remove: removeGallery,
    move: moveGallery,
  } = useFieldArray({
    control,
    name: 'gallery_images',
  })

  const titleValue = watch('title')
  const featuredImageValue = watch('featured_image')
  const categoryIdValue = watch('category_id')
  const featuresValue = watch('features') || []
  const formValues = watch()

  // Helper slugify
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // Handle auto slug
  useEffect(() => {
    if (autoSlug && titleValue) {
      setValue('slug', slugify(titleValue), { shouldValidate: true })
    }
  }, [titleValue, autoSlug, setValue])

  const addFeatureItem = () => {
    if (!newFeatureText.trim()) return
    const updated = [...featuresValue, newFeatureText.trim()]
    setValue('features', updated, { shouldValidate: true })
    setNewFeatureText('')
  }

  const removeFeatureItem = (index: number) => {
    const updated = featuresValue.filter((_, i) => i !== index)
    setValue('features', updated, { shouldValidate: true })
  }

  const moveFeatureItem = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1
    if (newIdx < 0 || newIdx >= featuresValue.length) return
    const updated = [...featuresValue]
    const temp = updated[index]
    updated[index] = updated[newIdx]
    updated[newIdx] = temp
    setValue('features', updated, { shouldValidate: true })
  }

  const onSubmit = async (data: ProductFormData) => {
    let res
    if (isEditing && productToEdit) {
      res = await updateProductAction(productToEdit.id, data)
    } else {
      res = await createProductAction(data)
    }

    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success(
        isEditing ? 'Product updated successfully' : 'Product created successfully'
      )
      router.push('/admin/products')
      router.refresh()
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            title="Back to Products"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600">
              {isEditing ? 'Edit Catalogue Entry' : 'New Product Registration'}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
              {isEditing ? productToEdit.title : 'Create Surgical Instrument'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            Live Preview
          </button>

          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </div>

      {/* Main Form Body */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <FileText className="w-4 h-4 text-red-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Basic Product Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Product Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register('title')}
                placeholder="e.g. Iris Precision Surgical Scissors 11.5cm"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-900 font-semibold"
              />
              {errors.title && (
                <p className="text-[11px] font-semibold text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Slug */}
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
                placeholder="iris-precision-surgical-scissors"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-900 font-mono"
              />
              {errors.slug && (
                <p className="text-[11px] font-semibold text-red-600">{errors.slug.message}</p>
              )}
            </div>

            {/* SKU */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                SKU / Instrument Code
              </label>
              <input
                type="text"
                {...register('sku')}
                placeholder="e.g. SURG-SC-101"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-900 font-mono font-semibold"
              />
            </div>

            {/* Category Select */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                Product Classification Category <span className="text-red-600">*</span>
              </label>
              <CategorySelect
                value={categoryIdValue}
                onChange={(val) => setValue('category_id', val, { shouldValidate: true })}
                categories={categories}
                placeholder="Select Category..."
              />
            </div>
          </div>

          {/* Short & Full Description */}
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Short Summary Description
              </label>
              <textarea
                rows={2}
                {...register('short_description')}
                placeholder="Brief 1-2 sentence overview for product cards and search results..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Full Technical Overview & Description
              </label>
              <textarea
                rows={5}
                {...register('full_description')}
                placeholder="Comprehensive technical details, clinical applications, and ergonomic design points..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Media & Gallery Management */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-red-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Product Media & Gallery
              </h3>
            </div>
          </div>

          {/* Featured Main Image */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Main Featured Cover Image
            </label>
            <div className="flex items-center gap-3">
              {featuredImageValue ? (
                <div className="relative w-20 h-20 rounded-xl border border-slate-200 overflow-hidden bg-slate-900 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredImageValue}
                    alt="Featured Image"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setValue('featured_image', '')}
                    className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white hover:bg-red-700"
                    title="Remove Image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                  <ImageIcon className="w-7 h-7" />
                </div>
              )}

              <div className="space-y-1.5 flex-1">
                <button
                  type="button"
                  onClick={() => setShowFeaturedMediaPicker(true)}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 flex items-center gap-1.5"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-red-600" />
                  Select Main Image from Media Library
                </button>
                <input
                  type="text"
                  {...register('featured_image')}
                  placeholder="Or paste image URL..."
                  className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Additional Gallery Images */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Additional Gallery Images ({galleryFields.length})
              </label>
              <button
                type="button"
                onClick={() => setShowGalleryMediaPicker(true)}
                className="px-3 py-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Gallery Images
              </button>
            </div>

            {galleryFields.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No additional gallery images added.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {galleryFields.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <div className="w-12 h-12 rounded-lg bg-slate-200 border border-slate-300 overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image_url}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="text-[11px] font-mono text-slate-600 truncate">{item.image_url}</p>
                      <input
                        type="text"
                        {...register(`gallery_images.${idx}.alt_text` as const)}
                        placeholder="Alt text..."
                        className="w-full text-[11px] px-2 py-1 bg-white border border-slate-200 rounded text-slate-800"
                      />
                    </div>
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveGallery(idx, idx - 1)}
                        disabled={idx === 0}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveGallery(idx, idx + 1)}
                        disabled={idx === galleryFields.length - 1}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeGallery(idx)}
                        className="p-1 rounded text-red-500 hover:bg-red-50"
                        title="Remove Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Key Features & Dynamic Specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Key Features List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Key Features ({featuresValue.length})
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addFeatureItem()
                  }
                }}
                placeholder="Add feature e.g. Autoclavable at 134°C"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
              />
              <button
                type="button"
                onClick={addFeatureItem}
                className="px-3 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shrink-0"
              >
                Add
              </button>
            </div>

            <div className="space-y-2">
              {featuresValue.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium truncate">{feat}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveFeatureItem(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveFeatureItem(idx, 'down')}
                      disabled={idx === featuresValue.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFeatureItem(idx)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications Table Builder */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Technical Specifications ({specFields.length})
              </h3>
              <button
                type="button"
                onClick={() => appendSpec({ key: '', value: '' })}
                className="px-3 py-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Row
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {specFields.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    {...register(`specifications.${idx}.key` as const)}
                    placeholder="Parameter (e.g. Material)"
                    className="w-1/2 text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-900"
                  />
                  <input
                    type="text"
                    {...register(`specifications.${idx}.value` as const)}
                    placeholder="Value (e.g. Stainless Steel)"
                    className="w-1/2 text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(idx)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Catalogue PDF & Publishing Settings */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
            Publishing, Catalogue & SEO
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Catalogue PDF URL */}
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Catalogue PDF Document URL
              </label>
              <input
                type="text"
                {...register('catalogue_pdf')}
                placeholder="https://.../catalogues/surgical-scissors.pdf"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
              />
            </div>

            {/* Sort Order */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Display Sort Order
              </label>
              <input
                type="number"
                {...register('sort_order', { valueAsNumber: true })}
                placeholder="0"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold"
              />
            </div>

            {/* Switches */}
            <div className="space-y-3 flex flex-col justify-center">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('is_published')}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                />
                <span className="text-xs font-bold text-slate-900">Publish Product Immediately</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('is_featured')}
                  className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
                />
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  Mark as Featured Product
                </span>
              </label>
            </div>
          </div>

          {/* SEO Title & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                SEO Meta Title
              </label>
              <input
                type="text"
                {...register('seo_title')}
                placeholder="Iris Precision Surgical Scissors | Durable Medical"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                SEO Meta Description
              </label>
              <input
                type="text"
                {...register('seo_description')}
                placeholder="High precision surgical scissors manufactured with premium stainless steel..."
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Bottom Submit Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving Product...' : isEditing ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </form>

      {/* Featured Media Picker */}
      <MediaPicker
        isOpen={showFeaturedMediaPicker}
        onClose={() => setShowFeaturedMediaPicker(false)}
        onSelect={(media) => {
          setValue('featured_image', media.public_url)
          setShowFeaturedMediaPicker(false)
        }}
        filterType="image"
        title="Select Featured Product Image"
      />

      {/* Gallery Media Picker */}
      <MediaPicker
        isOpen={showGalleryMediaPicker}
        onClose={() => setShowGalleryMediaPicker(false)}
        onSelect={(media) => {
          appendGallery({
            image_url: media.public_url,
            alt_text: media.alt_text || formValues.title || '',
            sort_order: galleryFields.length + 1,
          })
          setShowGalleryMediaPicker(false)
        }}
        filterType="image"
        title="Select Gallery Image"
      />

      {/* Live Preview Drawer / Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setShowPreviewModal(false)}
          />
          <div className="relative bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-2xl w-full p-6 space-y-6 z-10 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                Visitor Card Preview
              </span>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Visitor Product Card Preview */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-44 h-44 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                {formValues.featured_image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={formValues.featured_image}
                    alt={formValues.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-10 h-10 text-slate-300" />
                )}
              </div>
              <div className="space-y-2 flex-1">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-red-100 text-red-700">
                  {categories.find((c) => c.id === formValues.category_id)?.name || 'Product'}
                </span>
                <h4 className="text-lg font-bold text-slate-900 leading-snug">
                  {formValues.title || 'Untitled Product'}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {formValues.short_description || 'No short description provided.'}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-mono font-semibold text-slate-500">
                  <span>SKU: {formValues.sku || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

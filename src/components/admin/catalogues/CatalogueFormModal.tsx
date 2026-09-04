'use client'

import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Save, Image as ImageIcon, Sparkles, FileText, Upload, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/src/lib/supabase/client'
import { CatalogueItem, CatalogueFormData, catalogueSchema } from '@/src/types/catalogue'
import { CategoryItem } from '@/src/types/category'
import { createCatalogueAction, updateCatalogueAction } from '@/app/admin/actions/catalogues'
import { CategorySelect } from '@/src/components/admin/CategorySelect'
import { MediaPicker } from '@/src/components/admin/MediaPicker'

interface CatalogueFormModalProps {
  isOpen: boolean
  catalogueToEdit?: CatalogueItem | null
  categories: CategoryItem[]
  onClose: () => void
  onSuccess: () => void
}

export function CatalogueFormModal({
  isOpen,
  catalogueToEdit,
  categories,
  onClose,
  onSuccess,
}: CatalogueFormModalProps) {
  const isEditing = !!catalogueToEdit
  const [autoSlug, setAutoSlug] = useState(!isEditing)
  const [showMediaPicker, setShowMediaPicker] = useState(false)

  // PDF Upload State
  const pdfInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingPdf, setIsUploadingPdf] = useState(false)
  const [pdfUploadProgress, setPdfUploadProgress] = useState(0)
  const [pdfInfo, setPdfInfo] = useState<{
    url: string
    filename: string
    sizeText?: string
    storagePath?: string
  } | null>(null)
  const [newlyUploadedStoragePath, setNewlyUploadedStoragePath] = useState<string | undefined>()
  const [oldStoragePathToDelete, setOldStoragePathToDelete] = useState<string | undefined>()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CatalogueFormData>({
    resolver: zodResolver(catalogueSchema),
    defaultValues: {
      title: '',
      slug: '',
      category_id: null,
      description: '',
      cover_image: '',
      pdf_url: '',
      sort_order: 0,
      is_published: true,
    },
  })

  const titleValue = watch('title')
  const coverImageValue = watch('cover_image')
  const categoryIdValue = watch('category_id')

  // Auto-slug helper
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

  // Populate form on open
  useEffect(() => {
    if (isOpen) {
      if (catalogueToEdit) {
        reset({
          title: catalogueToEdit.title,
          slug: catalogueToEdit.slug,
          category_id: catalogueToEdit.category_id,
          description: catalogueToEdit.description || '',
          cover_image: catalogueToEdit.cover_image || '',
          pdf_url: catalogueToEdit.pdf_url,
          sort_order: catalogueToEdit.sort_order,
          is_published: catalogueToEdit.is_published,
        })
        setAutoSlug(false)
        setPdfInfo({
          url: catalogueToEdit.pdf_url,
          filename: catalogueToEdit.pdf_url.split('/').pop() || 'Catalogue.pdf',
        })
        setNewlyUploadedStoragePath(undefined)
        setOldStoragePathToDelete(undefined)
      } else {
        reset({
          title: '',
          slug: '',
          category_id: null,
          description: '',
          cover_image: '',
          pdf_url: '',
          sort_order: 0,
          is_published: true,
        })
        setAutoSlug(true)
        setPdfInfo(null)
        setNewlyUploadedStoragePath(undefined)
        setOldStoragePathToDelete(undefined)
      }
    }
  }, [isOpen, catalogueToEdit, reset])

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // Handle PDF File Selection & Upload directly to 'catalogues' bucket
  const handlePdfFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = '' // Reset input

    // Validate application/pdf
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      toast.error('Only PDF documents (.pdf) are allowed.')
      return
    }

    // Validate Max 50 MB
    const MAX_SIZE = 50 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      toast.error(`PDF file size exceeds 50 MB limit (${formatFileSize(file.size)}).`)
      return
    }

    try {
      setIsUploadingPdf(true)
      setPdfUploadProgress(10)

      const supabase = createClient()
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const storagePath = `${crypto.randomUUID()}-${sanitizedName}`

      setPdfUploadProgress(40)

      const { data, error } = await supabase.storage
        .from('catalogues')
        .upload(storagePath, file, {
          contentType: 'application/pdf',
          upsert: false,
        })

      if (error || !data) {
        throw new Error(error?.message || 'PDF upload failed')
      }

      setPdfUploadProgress(90)

      const {
        data: { publicUrl },
      } = supabase.storage.from('catalogues').getPublicUrl(data.path)

      setPdfUploadProgress(100)

      // If replacing an existing PDF during edit, mark old path to delete after save
      if (isEditing && pdfInfo?.url && pdfInfo.url !== publicUrl) {
        if (pdfInfo.url.includes('/catalogues/')) {
          const oldPath = pdfInfo.url.split('/catalogues/').pop()
          if (oldPath) setOldStoragePathToDelete(oldPath)
        }
      }

      setPdfInfo({
        url: publicUrl,
        filename: file.name,
        sizeText: formatFileSize(file.size),
        storagePath: data.path,
      })

      setNewlyUploadedStoragePath(data.path)
      setValue('pdf_url', publicUrl, { shouldValidate: true })

      toast.success('PDF document uploaded successfully!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'PDF upload failed'
      toast.error(msg)
    } finally {
      setIsUploadingPdf(false)
      setPdfUploadProgress(0)
    }
  }

  if (!isOpen) return null

  const onSubmit = async (data: CatalogueFormData) => {
    let res
    if (isEditing && catalogueToEdit) {
      res = await updateCatalogueAction(catalogueToEdit.id, data, oldStoragePathToDelete)
    } else {
      res = await createCatalogueAction(data, newlyUploadedStoragePath)
    }

    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success(
        isEditing ? 'Catalogue updated successfully' : 'Catalogue created successfully'
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
              {isEditing ? 'Edit Catalogue' : 'Create Catalogue Entry'}
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
              {isEditing ? catalogueToEdit.title : 'Add Product Catalogue PDF'}
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
          {/* Title & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Catalogue Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register('title')}
                placeholder="e.g. Surgical Instruments Catalogue 2026"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-900 font-semibold"
              />
              {errors.title && (
                <p className="text-[11px] font-semibold text-red-600">{errors.title.message}</p>
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
                placeholder="surgical-instruments-catalogue-2026"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-900 font-mono"
              />
              {errors.slug && (
                <p className="text-[11px] font-semibold text-red-600">{errors.slug.message}</p>
              )}
            </div>
          </div>

          {/* Optional Category Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Associated Category (Optional)
            </label>
            <CategorySelect
              value={categoryIdValue}
              onChange={(val) => setValue('category_id', val)}
              categories={categories}
              placeholder="General / All Categories"
            />
          </div>

          {/* PDF Document Upload Area */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block flex items-center justify-between">
              <span>PDF Document File (Max 50 MB) <span className="text-red-600">*</span></span>
              {pdfInfo && (
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> PDF Attached
                </span>
              )}
            </label>

            {/* Hidden Input */}
            <input
              type="file"
              ref={pdfInputRef}
              accept="application/pdf,.pdf"
              onChange={handlePdfFileSelect}
              onClick={(e) => e.stopPropagation()}
              className="hidden"
            />

            {pdfInfo ? (
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-xs truncate">{pdfInfo.filename}</p>
                    <p className="text-[11px] font-mono text-slate-500 truncate">
                      {pdfInfo.sizeText ? `${pdfInfo.sizeText} • ` : ''}
                      <a
                        href={pdfInfo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:underline"
                      >
                        Preview PDF
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => pdfInputRef.current?.click()}
                    disabled={isUploadingPdf}
                    className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Replace PDF
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => pdfInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-red-500 bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-6 text-center cursor-pointer transition-colors space-y-2"
              >
                {isUploadingPdf ? (
                  <div className="space-y-2">
                    <Loader2 className="w-8 h-8 text-red-600 animate-spin mx-auto" />
                    <p className="text-xs font-bold text-slate-800">
                      Uploading PDF to catalogues storage bucket ({pdfUploadProgress}%)...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-red-600 flex items-center justify-center mx-auto shadow-2xs">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Click to select or drag PDF file here
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Supports PDF files up to 50 MB
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
            {errors.pdf_url && (
              <p className="text-[11px] font-semibold text-red-600">{errors.pdf_url.message}</p>
            )}
          </div>

          {/* Cover Image Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Catalogue Cover Image
            </label>
            <div className="flex items-center gap-3">
              {coverImageValue ? (
                <div className="relative w-16 h-20 rounded-xl border border-slate-200 overflow-hidden bg-slate-900 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImageValue}
                    alt="Catalogue Cover"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setValue('cover_image', '')}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-red-600 text-white hover:bg-red-700"
                    title="Remove Cover"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-20 rounded-xl bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
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
                  Select Cover from Media Library
                </button>
                <input
                  type="text"
                  {...register('cover_image')}
                  placeholder="Or enter cover image URL..."
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
              placeholder="Brief summary of catalogue contents, covered instruments, and target specialties..."
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
                  Publish Catalogue Immediately
                </span>
              </label>
            </div>
          </div>

          {/* Footer Submit Bar */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || isUploadingPdf}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploadingPdf}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors shadow-xs"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Catalogue' : 'Save Catalogue'}
            </button>
          </div>
        </form>
      </div>

      {/* Media Picker Modal */}
      <MediaPicker
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={(media) => {
          setValue('cover_image', media.public_url)
          setShowMediaPicker(false)
        }}
        filterType="image"
        title="Select Catalogue Cover Image"
      />
    </div>
  )
}

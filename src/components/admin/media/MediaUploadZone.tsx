'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, X, CheckCircle2, AlertCircle, FileText, Image as ImageIcon, Video as VideoIcon, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/src/lib/supabase/client'
import { createMediaRecordAction } from '@/app/admin/actions/media'
import { MediaUploadItem } from '@/src/types/media'

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'video/mp4',
  'video/webm',
]

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20 MB

interface MediaUploadZoneProps {
  onUploadSuccess: () => void
  onClose?: () => void
}

export function MediaUploadZone({ onUploadSuccess, onClose }: MediaUploadZoneProps) {
  const [items, setItems] = useState<MediaUploadItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cleanup Object URLs on unmount
  useEffect(() => {
    return () => {
      items.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
      })
    }
  }, [items])

  const sanitizeFilename = (filename: string) => {
    const parts = filename.split('.')
    const ext = parts.length > 1 ? parts.pop() : ''
    const base = parts.join('.')
    const cleanBase = base
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    return ext ? `${cleanBase}.${ext.toLowerCase()}` : cleanBase
  }

  const handleFiles = (selectedFiles: FileList | File[]) => {
    const newItems: MediaUploadItem[] = []

    Array.from(selectedFiles).forEach((file) => {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        toast.error(`Unsupported format: ${file.name}`, {
          description: 'Supported: JPG, PNG, WebP, AVIF, GIF, MP4, WebM',
        })
        return
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File exceeds 20 MB limit: ${file.name}`, {
          description: `Size: ${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        })
        return
      }

      const previewUrl = file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : undefined

      newItems.push({
        id: crypto.randomUUID(),
        file,
        altText: file.name.split('.')[0].replace(/[-_]/g, ' '),
        progress: 0,
        status: 'pending',
        previewUrl,
      })
    })

    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems])
      toast.info(`Added ${newItems.length} file(s) to upload queue`)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const removeItem = (id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id)
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl)
      return prev.filter((i) => i.id !== id)
    })
  }

  const updateAltText = (id: string, altText: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, altText } : i))
    )
  }

  const uploadAllFiles = async () => {
    const pendingItems = items.filter((i) => i.status !== 'success')
    if (pendingItems.length === 0) return

    setIsUploading(true)
    const supabase = createClient()
    let successCount = 0
    let failureCount = 0

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.status === 'success') continue

      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, status: 'uploading', progress: 15 } : it))
      )

      try {
        const sanitized = sanitizeFilename(item.file.name)
        const uniquePath = `media/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${sanitized}`

        // Upload to Supabase Storage website-media bucket
        const { error: storageError } = await supabase.storage
          .from('website-media')
          .upload(uniquePath, item.file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (storageError) {
          throw new Error(storageError.message)
        }

        setItems((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, progress: 65 } : it))
        )

        // Create Database Record via Server Action
        const recordRes = await createMediaRecordAction({
          filename: item.file.name,
          file_path: uniquePath,
          file_type: item.file.type,
          file_size: item.file.size,
          alt_text: item.altText,
        })

        if (recordRes.error || !recordRes.media) {
          throw new Error(recordRes.error || 'Database record creation failed')
        }

        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id ? { ...it, status: 'success', progress: 100 } : it
          )
        )
        successCount++
      } catch (err: unknown) {
        failureCount++
        const errMsg = err instanceof Error ? err.message : 'Upload failed'
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id ? { ...it, status: 'error', error: errMsg } : it
          )
        )
      }
    }

    setIsUploading(false)

    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} file(s)`)
      onUploadSuccess()
    }
    if (failureCount > 0) {
      toast.error(`Failed to upload ${failureCount} file(s)`)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ALLOWED_MIME_TYPES.join(',')}
        className="hidden"
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files)
          }
          e.target.value = ''
        }}
      />

      {/* Upload Drop Zone Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-red-500 bg-red-50/60 scale-[0.99]'
            : 'border-slate-300 hover:border-red-500 hover:bg-slate-50/70'
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto mb-3 shadow-xs">
          <Upload className="w-7 h-7" />
        </div>

        <h3 className="text-base font-bold text-slate-900">
          Click to browse or Drag & Drop medical files here
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Supports JPG, PNG, WebP, AVIF, GIF, MP4, WebM (Max 20 MB per file)
        </p>
      </div>

      {/* Selected Files Queue Previews */}
      {items.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Selected Files ({items.length})
            </h4>
            <button
              onClick={() => {
                items.forEach((i) => {
                  if (i.previewUrl) URL.revokeObjectURL(i.previewUrl)
                })
                setItems([])
              }}
              disabled={isUploading}
              className="text-xs font-semibold text-slate-500 hover:text-red-600 disabled:opacity-50 transition-colors"
            >
              Clear all
            </button>
          </div>

          {/* Cards Queue */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-start gap-3 relative shadow-2xs"
              >
                {/* File Thumbnail Preview */}
                <div className="w-16 h-16 rounded-xl bg-slate-900 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200">
                  {item.previewUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={item.previewUrl}
                      alt={item.file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : item.file.type.startsWith('video/') ? (
                    <VideoIcon className="w-6 h-6 text-purple-400" />
                  ) : (
                    <FileText className="w-6 h-6 text-slate-400" />
                  )}
                </div>

                {/* File Information & Alt Field */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div>
                    <p className="text-xs font-bold text-slate-900 truncate" title={item.file.name}>
                      {item.file.name}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                      <span className="font-semibold uppercase text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded">
                        {item.file.type.split('/')[1]}
                      </span>
                      <span>{formatFileSize(item.file.size)}</span>
                    </div>
                  </div>

                  {/* Editable Alt Text */}
                  <input
                    type="text"
                    value={item.altText}
                    onChange={(e) => updateAltText(item.id, e.target.value)}
                    placeholder="Alt description for SEO..."
                    disabled={isUploading || item.status === 'success'}
                    className="w-full text-xs px-2.5 py-1 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-800"
                  />

                  {/* Progress / Status */}
                  {item.status === 'uploading' && (
                    <div className="space-y-1">
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-red-600 h-1.5 rounded-full transition-all duration-200"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        Uploading to Supabase Storage... {item.progress}%
                      </span>
                    </div>
                  )}

                  {item.status === 'error' && (
                    <p className="text-[11px] text-red-600 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {item.error || 'Upload failed'}
                    </p>
                  )}

                  {item.status === 'success' && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded successfully
                    </span>
                  )}
                </div>

                {/* Remove File Button */}
                {item.status === 'pending' && (
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={isUploading}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors shrink-0"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium">
              {items.filter((i) => i.status === 'pending').length} file(s) ready to upload
            </span>

            <div className="flex items-center gap-3">
              {onClose && (
                <button
                  onClick={onClose}
                  disabled={isUploading}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              )}

              <button
                onClick={uploadAllFiles}
                disabled={isUploading || items.every((i) => i.status === 'success')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors shadow-xs"
              >
                <Upload className="w-4 h-4" />
                {isUploading ? 'Uploading...' : 'Upload All Files'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/src/lib/supabase/client'
import { createMediaRecordAction, fetchMediaItemsAction } from '@/app/admin/actions/media'
import { MediaItem } from '@/src/types/media'

// Explicit lucide-react icons import
import {
  Upload as UploadIcon,
  Image as ImgIcon,
  FileText as PdfIcon,
  Video as VidIcon,
  X as CloseIcon,
  CheckCircle2 as CheckIcon,
  AlertCircle as ErrorIcon,
  FolderOpen as LibraryIcon,
  Trash2 as RemoveIcon,
  RefreshCw as SpinnerIcon,
  Link2 as LinkIcon,
} from 'lucide-react'

interface AdminMediaUploadPlaceholderProps {
  label?: string
  value?: string | null
  onChange: (url: string) => void
  accept?: string
  type?: 'image' | 'pdf' | 'video' | 'any'
  mediaType?: 'image' | 'pdf' | 'video' | 'document' | 'any'
  aspectRatio?: string
  placeholderText?: string
  previewHeight?: string
  className?: string
  helperText?: string
}

export function AdminMediaUploadPlaceholder({
  label,
  value,
  onChange,
  accept,
  type,
  mediaType,
  aspectRatio,
  placeholderText,
  previewHeight = 'h-36',
  className = '',
  helperText,
}: AdminMediaUploadPlaceholderProps) {
  // Normalize effective type
  const effectiveType = mediaType === 'document' ? 'pdf' : (mediaType || type || 'image')
  const effectiveAccept = accept || (effectiveType === 'pdf' ? '.pdf,application/pdf' : 'image/*,video/*')
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const [libraryMedia, setLibraryMedia] = useState<MediaItem[]>([])
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false)
  const [showManualUrl, setShowManualUrl] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    setIsUploading(true)
    setProgress(10)
    setUploadError(null)

    try {
      const supabase = createClient()
      const sanitizedName = sanitizeFilename(file.name)
      const datePrefix = new Date().toISOString().slice(0, 7) // e.g. 2026-09
      const filePath = `uploads/${datePrefix}/${Date.now()}-${sanitizedName}`

      setProgress(30)

      // Upload file directly to Supabase storage bucket
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('website-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        })

      setProgress(70)

      if (uploadErr) {
        // Fallback to Base64 Data URL if storage fails or RLS policy restricts
        console.warn('Storage upload error, using fallback reader:', uploadErr)
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result as string
          onChange(result)
          setIsUploading(false)
          setProgress(100)
        }
        reader.readAsDataURL(file)
        return
      }

      // Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from('website-media')
        .getPublicUrl(uploadData.path)

      const finalUrl = publicUrlData.publicUrl

      // Register media record in database table
      await createMediaRecordAction({
        filename: file.name,
        file_path: uploadData.path,
        file_type: file.type || (type === 'pdf' ? 'application/pdf' : 'image/png'),
        file_size: file.size,
        alt_text: file.name.split('.')[0],
      })

      setProgress(100)
      onChange(finalUrl)
      setIsUploading(false)
    } catch (err: any) {
      console.error('File upload failed:', err)
      setUploadError(err?.message || 'Upload failed. Please try again.')
      setIsUploading(false)
    }
  }

  const handleOpenLibrary = async () => {
    setIsLibraryOpen(true)
    setIsLoadingLibrary(true)
    try {
      const res = await fetchMediaItemsAction({
        type: type === 'pdf' ? 'all' : (type as any),
        pageSize: 40,
      })
      setLibraryMedia(res.media || [])
    } catch (err) {
      console.error('Failed to load media library:', err)
    } finally {
      setIsLoadingLibrary(false)
    }
  }

  const isPdf = effectiveType === 'pdf' || (value && (value.endsWith('.pdf') || value.includes('/pdf/')))
  const isVideo = effectiveType === 'video' || (value && (value.endsWith('.mp4') || value.endsWith('.webm')))

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            {label}
          </label>
          <button
            type="button"
            onClick={() => setShowManualUrl(!showManualUrl)}
            className="text-[10px] font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showManualUrl ? 'Hide Direct URL' : 'Paste External URL'}</span>
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={effectiveAccept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Value Preview State */}
      {value && value.trim() !== '' ? (
        <div className="relative group border border-slate-200 rounded-2xl bg-slate-50 p-3 overflow-hidden shadow-xs">
          <div className="flex items-center gap-4">
            {/* Visual Media Thumbnail */}
            <div className={`w-28 sm:w-36 ${previewHeight} rounded-xl overflow-hidden bg-slate-900 border border-slate-300 flex items-center justify-center shrink-0 relative`}>
              {isPdf ? (
                <div className="flex flex-col items-center justify-center p-2 text-red-500 text-center">
                  <PdfIcon className="w-8 h-8 mb-1" />
                  <span className="text-[10px] font-black text-slate-200 tracking-wider uppercase">PDF DOC</span>
                </div>
              ) : isVideo ? (
                <div className="flex flex-col items-center justify-center p-2 text-indigo-400 text-center">
                  <VidIcon className="w-8 h-8 mb-1" />
                  <span className="text-[10px] font-black text-slate-200 tracking-wider uppercase">VIDEO MP4</span>
                </div>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={value}
                  alt={label || 'Selected Asset'}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* File Path & Action Buttons */}
            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md flex items-center gap-1">
                  <CheckIcon className="w-3 h-3" />
                  <span>File Selected</span>
                </span>
                <span className="text-[11px] font-bold text-slate-500 truncate">
                  {value.split('/').pop() || value}
                </span>
              </div>

              <p className="text-[10px] font-medium text-slate-400 truncate">{value}</p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <UploadIcon className="w-3.5 h-3.5" />
                  <span>Upload Replacement File</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenLibrary}
                  className="px-3 py-1.5 bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
                >
                  <LibraryIcon className="w-3.5 h-3.5" />
                  <span>Pick from Media Gallery</span>
                </button>

                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="p-1.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition-colors"
                  title="Remove File"
                >
                  <RemoveIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Dropzone Upload Box */
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-[#E31B23] bg-slate-50/70 hover:bg-red-50/20 rounded-2xl p-6 text-center cursor-pointer transition-all space-y-3 group"
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-2 py-4">
              <SpinnerIcon className="w-8 h-8 text-[#E31B23] animate-spin" />
              <span className="text-xs font-bold text-slate-800">Uploading File ({progress}%)...</span>
              <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#E31B23] transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#E31B23] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                {type === 'pdf' ? (
                  <PdfIcon className="w-6 h-6" />
                ) : type === 'video' ? (
                  <VidIcon className="w-6 h-6" />
                ) : (
                  <UploadIcon className="w-6 h-6" />
                )}
              </div>

              <div className="space-y-1">
                <p className="text-xs font-black text-slate-900">
                  {placeholderText || (type === 'pdf' ? 'Click to Upload PDF Document from Computer' : 'Click to Upload Image from Gallery')}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  {helperText || (type === 'pdf' ? 'Supports PDF files of any size (MBs/KBs)' : 'Supports PNG, JPG, WebP, SVG high resolution files')}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-1">
                <span className="px-4 py-2 bg-[#E31B23] text-white text-xs font-extrabold rounded-xl shadow-xs group-hover:bg-red-700 transition-colors">
                  Choose File from Device
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOpenLibrary()
                  }}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-extrabold rounded-xl shadow-xs hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <LibraryIcon className="w-3.5 h-3.5" />
                  <span>Media Gallery</span>
                </button>
              </div>
            </>
          )}

          {uploadError && (
            <div className="p-2 bg-red-50 text-red-600 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5">
              <ErrorIcon className="w-4 h-4" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      )}

      {/* Optional Manual URL Input */}
      {showManualUrl && (
        <div className="pt-2">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste raw URL (e.g. /images/hero.png or https://...)"
            className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl text-xs font-mono text-slate-800"
          />
        </div>
      )}

      {/* MEDIA LIBRARY PICKER MODAL */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  <LibraryIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0B1B3D]">Select Asset from Media Gallery</h3>
                  <p className="text-xs text-slate-500">Pick any uploaded image or document from your gallery.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="flex-1 overflow-y-auto p-1 space-y-4">
              {isLoadingLibrary ? (
                <div className="flex items-center justify-center py-12 text-slate-500 gap-2">
                  <SpinnerIcon className="w-6 h-6 animate-spin text-[#E31B23]" />
                  <span className="text-xs font-bold">Loading media gallery...</span>
                </div>
              ) : libraryMedia.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <ImgIcon className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-600">No media items found in gallery yet.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLibraryOpen(false)
                      fileInputRef.current?.click()
                    }}
                    className="px-4 py-2 bg-[#E31B23] text-white text-xs font-extrabold rounded-xl"
                  >
                    Upload First File Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {libraryMedia.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onChange(item.public_url)
                        setIsLibraryOpen(false)
                      }}
                      className="group border border-slate-200 hover:border-[#E31B23] rounded-2xl overflow-hidden bg-slate-50 hover:shadow-lg transition-all text-left flex flex-col"
                    >
                      <div className="w-full h-28 bg-slate-950 relative overflow-hidden flex items-center justify-center">
                        {item.file_type?.includes('pdf') ? (
                          <PdfIcon className="w-8 h-8 text-red-400" />
                        ) : (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={item.public_url}
                            alt={item.filename}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        )}
                      </div>
                      <div className="p-2 bg-white space-y-0.5 border-t border-slate-100">
                        <span className="text-[11px] font-bold text-slate-900 block truncate">{item.filename}</span>
                        <span className="text-[9px] text-slate-400 block uppercase font-bold">
                          {item.file_type?.split('/')[1] || 'asset'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

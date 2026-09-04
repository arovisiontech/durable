'use client'

import { useState } from 'react'
import { X, Copy, Check, Save, Trash2, ExternalLink, Calendar, HardDrive, FileType, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { MediaItem } from '@/src/types/media'
import { updateMediaAltTextAction } from '@/app/admin/actions/media'

interface MediaDetailModalProps {
  media: MediaItem | null
  onClose: () => void
  onDelete: (media: MediaItem) => void
  onUpdate: () => void
}

export function MediaDetailModal({ media, onClose, onDelete, onUpdate }: MediaDetailModalProps) {
  const [altText, setAltText] = useState(media?.alt_text || '')
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!media) return null

  const isVideo = media.file_type.startsWith('video/')

  const handleSaveAltText = async () => {
    setIsSaving(true)
    const res = await updateMediaAltTextAction(media.id, altText)
    setIsSaving(false)

    if (res.success) {
      toast.success('Alt text updated successfully')
      onUpdate()
    } else {
      toast.error(res.error || 'Failed to update alt text')
    }
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(media.public_url)
    setCopied(true)
    toast.success('Public URL copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '—'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div className="relative bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Preview Box */}
        <div className="md:w-1/2 bg-slate-950 flex items-center justify-center p-6 relative min-h-[260px] md:min-h-[400px]">
          {isVideo ? (
            <video
              src={media.public_url}
              controls
              className="max-h-[70vh] max-w-full rounded-xl"
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={media.public_url}
              alt={media.alt_text || media.filename}
              className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-lg"
            />
          )}
        </div>

        {/* Details & Edit Panel */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[70vh] md:max-h-[90vh] space-y-6">
          <div className="space-y-6">
            {/* Title & Path */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-100">
                  {media.file_type}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 break-all leading-tight">
                {media.filename}
              </h2>
            </div>

            {/* Editable Alt Text */}
            <div className="space-y-2 bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Alt Text (Accessibility & SEO)
              </label>
              <textarea
                rows={2}
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe this media asset..."
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-800"
              />
              <button
                onClick={handleSaveAltText}
                disabled={isSaving || altText === (media.alt_text || '')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg disabled:opacity-40 transition-colors shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? 'Saving...' : 'Save Alt Text'}
              </button>
            </div>

            {/* File Metadata Info List */}
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <HardDrive className="w-3.5 h-3.5 text-slate-400" /> File Size:
                </span>
                <span className="font-bold text-slate-900">{formatFileSize(media.file_size)}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <FileType className="w-3.5 h-3.5 text-slate-400" /> MIME Type:
                </span>
                <span className="font-semibold text-slate-900">{media.file_type}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Uploaded Date:
                </span>
                <span className="font-semibold text-slate-900">
                  {new Date(media.created_at).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Storage Bucket:
                </span>
                <span className="font-semibold text-slate-900">website-media</span>
              </div>
            </div>

            {/* Public URL Box */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Public CDN URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={media.public_url}
                  className="flex-1 text-xs px-2.5 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-mono truncate select-all"
                />
                <button
                  onClick={handleCopyUrl}
                  className="p-2 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-800 transition-colors shrink-0"
                  title="Copy URL"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <a
                  href={media.public_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-800 transition-colors shrink-0"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onDelete(media)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-200"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
              Delete Asset
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Copy, Eye, Trash2, Check, Video, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { MediaItem } from '@/src/types/media'

interface MediaCardProps {
  media: MediaItem
  onSelect: (media: MediaItem) => void
  onDelete: (media: MediaItem) => void
}

export function MediaCard({ media, onSelect, onDelete }: MediaCardProps) {
  const [copied, setCopied] = useState(false)
  const isVideo = media.file_type.startsWith('video/')

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.stopPropagation()
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
    <div
      onClick={() => onSelect(media)}
      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Thumbnail Area */}
      <div className="relative aspect-4/3 bg-slate-900 overflow-hidden flex items-center justify-center">
        {isVideo ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-300">
            <Video className="w-10 h-10 text-purple-400 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
              Video ({media.file_type.split('/')[1]})
            </span>
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={media.public_url}
            alt={media.alt_text || media.filename}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              // Fallback on error
              ;(e.target as HTMLImageElement).src =
                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5-11 11"/></svg>'
            }}
          />
        )}

        {/* Hover Overlay Actions */}
        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSelect(media)
            }}
            className="p-2 bg-white/90 hover:bg-white text-slate-900 rounded-xl shadow-xs transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopyUrl}
            className="p-2 bg-white/90 hover:bg-white text-slate-900 rounded-xl shadow-xs transition-colors"
            title="Copy Public URL"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(media)
            }}
            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs transition-colors"
            title="Delete File"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Type Badge */}
        <div className="absolute top-2 left-2 pointer-events-none">
          <span className="inline-flex items-center gap-1 bg-slate-950/70 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md border border-white/10">
            {isVideo ? <Video className="w-3 h-3 text-purple-400" /> : <ImageIcon className="w-3 h-3 text-blue-400" />}
            {media.file_type.split('/')[1].toUpperCase()}
          </span>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-3.5 space-y-1">
        <p className="text-xs font-bold text-slate-900 truncate" title={media.filename}>
          {media.filename}
        </p>

        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>{formatFileSize(media.file_size)}</span>
          <span>
            {new Date(media.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>
    </div>
  )
}

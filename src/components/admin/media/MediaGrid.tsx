'use client'

import { Image as ImageIcon, Upload } from 'lucide-react'
import { MediaItem } from '@/src/types/media'
import { MediaCard } from './MediaCard'

interface MediaGridProps {
  media: MediaItem[]
  isLoading: boolean
  totalCount: number
  page: number
  pageSize: number
  onPageChange: (newPage: number) => void
  onSelect: (media: MediaItem) => void
  onDelete: (media: MediaItem) => void
  onOpenUpload: () => void
}

export function MediaGrid({
  media,
  isLoading,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onSelect,
  onDelete,
  onOpenUpload,
}: MediaGridProps) {
  const totalPages = Math.ceil(totalCount / pageSize)

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-2xl p-3 space-y-3 shadow-2xs animate-pulse"
          >
            <div className="aspect-4/3 bg-slate-200 rounded-xl" />
            <div className="space-y-1.5">
              <div className="h-3.5 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (media.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto my-8 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto shadow-xs">
          <ImageIcon className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">No media assets found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No image or video files match your current search and filter settings.
          </p>
        </div>
        <button
          onClick={onOpenUpload}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-xs"
        >
          <Upload className="w-4 h-4" />
          Upload New Asset
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {media.map((item) => (
          <MediaCard
            key={item.id}
            media={item}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <p className="text-xs font-medium text-slate-500">
            Showing <strong className="text-slate-900">{(page - 1) * pageSize + 1}</strong> to{' '}
            <strong className="text-slate-900">{Math.min(page * pageSize, totalCount)}</strong> of{' '}
            <strong className="text-slate-900">{totalCount}</strong> assets
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              Previous
            </button>
            <span className="text-xs font-bold text-slate-800 px-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

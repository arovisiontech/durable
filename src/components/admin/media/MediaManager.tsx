'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, ArrowUpDown, Upload, RefreshCw } from 'lucide-react'
import { MediaItem } from '@/src/types/media'
import { fetchMediaItemsAction } from '@/app/admin/actions/media'
import { MediaGrid } from './MediaGrid'
import { MediaUploadZone } from './MediaUploadZone'
import { MediaDetailModal } from './MediaDetailModal'
import { MediaDeleteDialog } from './MediaDeleteDialog'

export function MediaManager() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Filters & State
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [type, setType] = useState<'all' | 'image' | 'video'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'size'>('newest')
  const [page, setPage] = useState(1)
  const pageSize = 24

  // Modals & Panels
  const [showUploadZone, setShowUploadZone] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [deletingMedia, setDeletingMedia] = useState<MediaItem | null>(null)

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(handler)
  }, [search])

  const loadMedia = useCallback(async () => {
    setIsLoading(true)
    const res = await fetchMediaItemsAction({
      search: debouncedSearch,
      type,
      sortBy,
      page,
      pageSize,
    })

    setMedia(res.media)
    setTotalCount(res.totalCount)
    setIsLoading(false)
  }, [debouncedSearch, type, sortBy, page])

  useEffect(() => {
    loadMedia()
  }, [loadMedia])

  return (
    <div className="space-y-6">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Media Library
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage, upload, preview, and organize medical instrument images and brochures in Supabase Storage.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => loadMedia()}
            className="p-2.5 bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            title="Refresh Library"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowUploadZone(!showUploadZone)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-xs"
          >
            <Upload className="w-4 h-4" />
            {showUploadZone ? 'Close Upload' : 'Upload Assets'}
          </button>
        </div>
      </div>

      {/* Upload Zone Collapsible Area */}
      {showUploadZone && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-200">
          <MediaUploadZone
            onUploadSuccess={() => {
              loadMedia()
            }}
            onClose={() => setShowUploadZone(false)}
          />
        </div>
      )}

      {/* Search, Filter & Sort Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by file name or alt text..."
            className="w-full text-xs pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-900"
          />
        </div>

        {/* Filter & Sort Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Type Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value as 'all' | 'image' | 'video')
                setPage(1)
              }}
              className="bg-transparent focus:outline-none font-semibold text-slate-900 cursor-pointer"
            >
              <option value="all">All File Types</option>
              <option value="image">Images Only</option>
              <option value="video">Videos Only</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as 'newest' | 'oldest' | 'name' | 'size')
                setPage(1)
              }}
              className="bg-transparent focus:outline-none font-semibold text-slate-900 cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="name">Sort: Name A-Z</option>
              <option value="size">Sort: Size Large-Small</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid View */}
      <MediaGrid
        media={media}
        isLoading={isLoading}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        onPageChange={(p) => setPage(p)}
        onSelect={(m) => setSelectedMedia(m)}
        onDelete={(m) => setDeletingMedia(m)}
        onOpenUpload={() => setShowUploadZone(true)}
      />

      {/* Detail & Edit Modal */}
      <MediaDetailModal
        media={selectedMedia}
        onClose={() => setSelectedMedia(null)}
        onDelete={(m) => {
          setSelectedMedia(null)
          setDeletingMedia(m)
        }}
        onUpdate={() => loadMedia()}
      />

      {/* Delete Confirmation Dialog */}
      <MediaDeleteDialog
        media={deletingMedia}
        onClose={() => setDeletingMedia(null)}
        onSuccess={() => loadMedia()}
      />
    </div>
  )
}

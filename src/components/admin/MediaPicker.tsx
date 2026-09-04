'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Search, Check, Upload, Image as ImageIcon } from 'lucide-react'
import { MediaItem } from '@/src/types/media'
import { fetchMediaItemsAction } from '@/app/admin/actions/media'
import { MediaUploadZone } from './media/MediaUploadZone'

interface MediaPickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (media: MediaItem) => void
  filterType?: 'all' | 'image' | 'video'
  title?: string
}

export function MediaPicker({
  isOpen,
  onClose,
  onSelect,
  filterType = 'all',
  title = 'Select Media Asset',
}: MediaPickerProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library')
  const [media, setMedia] = useState<MediaItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const loadLibrary = useCallback(async () => {
    setIsLoading(true)
    const res = await fetchMediaItemsAction({
      search,
      type: filterType,
      sortBy: 'newest',
      page: 1,
      pageSize: 36,
    })
    setMedia(res.media)
    setIsLoading(false)
  }, [search, filterType])

  useEffect(() => {
    if (isOpen && activeTab === 'library') {
      loadLibrary()
    }
  }, [isOpen, activeTab, loadLibrary])

  if (!isOpen) return null

  const selectedItem = media.find((m) => m.id === selectedId)

  const handleConfirmSelect = () => {
    if (selectedItem) {
      onSelect(selectedItem)
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

      {/* Modal Dialog Box */}
      <div className="relative bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500">
              Select an asset from your Media Library or upload a new file.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-3 border-b border-slate-200 flex items-center gap-4 bg-white">
          <button
            onClick={() => setActiveTab('library')}
            className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'library'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Media Library
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'upload'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload New File
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'upload' ? (
            <MediaUploadZone
              onUploadSuccess={() => {
                setActiveTab('library')
                loadLibrary()
              }}
            />
          ) : (
            <div className="space-y-4">
              {/* Search input */}
              <div className="relative max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search assets..."
                  className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-900"
                />
              </div>

              {/* Grid Selection */}
              {isLoading ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-slate-100 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : media.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  No media assets found. Try uploading a new file.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {media.map((item) => {
                    const isSelected = item.id === selectedId
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${
                          isSelected
                            ? 'border-red-600 ring-2 ring-red-500/20'
                            : 'border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.public_url}
                          alt={item.alt_text || item.filename}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-red-600/30 flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center">
                              <Check className="w-4 h-4" />
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {selectedItem ? `Selected: ${selectedItem.filename}` : 'No asset selected'}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSelect}
              disabled={!selectedItem}
              className="px-5 py-2 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-40 transition-colors shadow-xs"
            >
              Select Asset
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

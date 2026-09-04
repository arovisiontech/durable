'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, X, Loader2, Package, FolderTree, ArrowRight } from 'lucide-react'
import { PublicSearchResult } from '@/src/types/public'
import { searchPublicAction } from '@/app/actions/public'

interface PublicSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PublicSearchModal({ isOpen, onClose }: PublicSearchModalProps) {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<PublicSearchResult>({ products: [], categories: [] })
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setResults({ products: [], categories: [] })
    }
  }, [isOpen])

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults({ products: [], categories: [] })
      return
    }

    setIsSearching(true)
    const handler = setTimeout(() => {
      searchPublicAction(query).then((res) => {
        setResults(res)
        setIsSearching(false)
      })
    }, 250)

    return () => clearTimeout(handler)
  }, [query])

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!isOpen) return null

  const hasResults = results.products.length > 0 || results.categories.length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Search Modal Box */}
      <div className="relative bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search surgical instruments, categories, or SKU codes..."
            className="w-full text-sm bg-transparent focus:outline-none text-slate-900 placeholder-slate-400 font-semibold"
          />
          {isSearching ? (
            <Loader2 className="w-5 h-5 animate-spin text-slate-400 shrink-0" />
          ) : query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <button
            onClick={onClose}
            className="px-2 py-1 text-[11px] font-bold text-slate-500 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results Box */}
        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-6">
          {!query.trim() ? (
            <div className="py-8 text-center space-y-2 text-slate-400">
              <Search className="w-8 h-8 mx-auto stroke-1" />
              <p className="text-xs">Type a keyword or SKU (e.g. &quot;Surgical Scissors&quot; or &quot;SURG-SC-101&quot;)</p>
            </div>
          ) : !hasResults && !isSearching ? (
            <div className="py-8 text-center space-y-2 text-slate-500">
              <Package className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-800">No results found for &quot;{query}&quot;</p>
              <p className="text-[11px] text-slate-400">Try searching with a different term or browse our categories.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Product Results */}
              {results.products.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block px-1">
                    Products ({results.products.length})
                  </span>
                  <div className="divide-y divide-slate-100 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                    {results.products.map((p) => (
                      <Link
                        key={p.id}
                        href={`/products/${p.slug}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-3 hover:bg-white transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                            {p.featured_image ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={p.featured_image}
                                alt={p.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-xs text-slate-900 group-hover:text-red-600 transition-colors truncate">
                              {p.title}
                            </p>
                            <div className="flex items-center gap-2 text-[11px]">
                              {p.sku && <span className="font-mono text-slate-500">{p.sku}</span>}
                              {p.category_name && (
                                <span className="text-red-600 font-semibold">• {p.category_name}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Results */}
              {results.categories.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block px-1">
                    Categories ({results.categories.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.categories.map((c) => (
                      <Link
                        key={c.id}
                        href={`/products?category=${c.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-white border border-slate-200 rounded-2xl transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0 font-bold text-xs">
                          <FolderTree className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-xs text-slate-900 group-hover:text-red-600 transition-colors truncate">
                            {c.name}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">/{c.slug}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Download, ExternalLink, ArrowRight, Sparkles } from 'lucide-react'
import { fetchPublicCatalogues } from '@/app/actions/public'
import { safeDownloadPdf } from '@/src/lib/pdfHelper'

export interface CatalogShowcaseItem {
  id: string
  number: string
  title: string
  description: string
  pdfUrl: string
  categorySlug: string
  coverImage: string
  badgeText: string
  accentColor: string
}

export function ProductCatalogShowcaseSection() {
  const [catalogues, setCatalogues] = useState<any[]>([])

  const loadData = async () => {
    try {
      const res = await fetchPublicCatalogues()
      setCatalogues(res.catalogues || [])
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('durable_content_updated', handleUpdate)
    return () => window.removeEventListener('durable_content_updated', handleUpdate)
  }, [])

  return (
    <section className="w-full bg-[#0B1B3D] text-white py-16 sm:py-20 border-b border-slate-800 relative overflow-hidden">
      {/* Background Subtle Gradient Mesh */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#E31B23_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E31B23]" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-200">
              DOWNLOADABLE PDF CATALOGUES
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Product Catalogues & PDF Literature
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Download our full-line surgical, dental, hollowware, and specialty instrument catalogues for off-line reference and ordering.
          </p>
        </div>

        {/* Catalogues Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {catalogues.map((cat, idx) => (
            <div
              key={cat.id || idx}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 hover:border-red-500/50 transition-all duration-300 shadow-xl group hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Cover Image Container */}
                <div className="w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-950 relative border border-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.cover_image || '/images/blog-instruments-tray.png'}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                  />
                  <div className="absolute top-3 left-3 bg-[#E31B23] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                    0{idx + 1} • {cat.category_name || 'Catalogue'}
                  </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-white group-hover:text-red-400 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {cat.description || 'Complete PDF catalogue download with technical specs and item numbers.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => safeDownloadPdf(cat.pdf_url, cat.title)}
                  className="flex-1 px-4 py-2.5 text-xs font-black text-white bg-[#E31B23] hover:bg-red-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD PDF</span>
                </button>

                <Link
                  href={`/catalogues/${cat.slug}`}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors border border-slate-700"
                  title="View Details"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center pt-4">
          <Link
            href="/catalogues"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-black text-[#0B1B3D] bg-white hover:bg-slate-100 rounded-2xl shadow-xl transition-all transform hover:scale-105"
          >
            <span>BROWSE ALL CATALOGUES & MANUALS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

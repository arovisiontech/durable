'use client'

import { useState, useEffect } from 'react'
import { Eye, Download, Sparkles } from 'lucide-react'
import { SubcategoryPdfItem, getStoredSubcategoryPdfs } from '@/src/lib/dataStore'
import { getItemIDB } from '@/src/lib/persistentStorage'
import { safeViewPdf, safeDownloadPdf } from '@/src/lib/pdfHelper'

interface SubcategoryPdfSectionProps {
  categorySlug: string
  categoryTitle: string
}

// Fallback dummy images for catalog covers if non-custom
const DUMMY_COVER_IMAGES: Record<string, string> = {
  'general-surgery': '/images/blog-instruments-tray.png',
  dental: '/images/dental-clinic-banner.png',
  'medical-hollowware': '/images/surgical-tray-durable.png',
  ophthalmic: '/images/blog-surgeon-scalpel.png',
  'hospital-furniture': '/images/about-surgical-instruments.png',
  'single-use-instruments': '/images/process-hand-filing.png',
}

export function SubcategoryPdfSection({ categorySlug, categoryTitle }: SubcategoryPdfSectionProps) {
  const [subcategories, setSubcategories] = useState<SubcategoryPdfItem[]>([])

  const loadData = () => {
    const all = getStoredSubcategoryPdfs()
    const filtered = all.filter(
      (item) => item.categorySlug.toLowerCase().trim() === categorySlug.toLowerCase().trim()
    )
    setSubcategories(filtered)

    if (typeof window !== 'undefined') {
      getItemIDB<SubcategoryPdfItem[]>('durable_subcategories_pdf').then((idbData) => {
        if (idbData && Array.isArray(idbData) && idbData.length > 0) {
          const idbFiltered = idbData.filter(
            (item) => item.categorySlug.toLowerCase().trim() === categorySlug.toLowerCase().trim()
          )
          setSubcategories(idbFiltered)
        }
      })
    }
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('durable_content_updated', handleUpdate)
    return () => window.removeEventListener('durable_content_updated', handleUpdate)
  }, [categorySlug])

  const handleViewPdf = (item: SubcategoryPdfItem) => {
    const targetUrl = item.pdfUrl || '/pdf/general-surgical-instruments-catalogue.pdf'
    safeViewPdf(targetUrl)
  }

  const handleDownloadPdf = (item: SubcategoryPdfItem) => {
    const targetUrl = item.pdfUrl || '/pdf/general-surgical-instruments-catalogue.pdf'
    const fileName = `${item.title.toLowerCase().replace(/\s+/g, '-')}-catalogue.pdf`
    safeDownloadPdf(targetUrl, fileName)
  }

  if (subcategories.length === 0) {
    return null
  }

  return (
    <section className="w-full space-y-6">
      {/* Subcategory PDF Catalogues Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1B3D] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3 h-3 text-[#E31B23]" />
            <span>OFFICIAL SUBCATEGORY TECHNICAL CATALOGUES</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0B1B3D]">
            {categoryTitle} Subcategories PDF Catalogue Showcase
          </h2>
        </div>

        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          {subcategories.length} Subcategory Catalogues Available
        </span>
      </div>

      {/* Grid of Subcategories PDF Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {subcategories.map((item) => {
          const coverImg =
            item.image && item.image !== '/images/catalogue-cover-yellow.png'
              ? item.image
              : DUMMY_COVER_IMAGES[categorySlug] || '/images/blog-instruments-tray.png'

          return (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Top Subcategory Cover Artwork matching Site Navy Blue (#0B1B3D) Theme */}
              <div className="relative aspect-[3/4] w-full bg-[#0B1B3D] overflow-hidden">
                {/* Background Cover Image with Navy Gradient Overlay */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImg}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-65 group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark Navy Blue & Black Diagonal Overlay Banner */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3D] via-[#0B1B3D]/70 to-transparent flex flex-col justify-between p-5 text-white">
                  {/* Top Left Header Text - Clean White */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-extrabold tracking-widest text-slate-200 uppercase block drop-shadow-xs">
                      CRAFTING THE INSTRUMENTS
                    </span>
                    <h3 className="text-xl font-black text-white italic tracking-tight uppercase leading-snug drop-shadow-md">
                      {item.title}
                    </h3>
                  </div>

                  {/* Plus Icon Accent */}
                  <div className="text-white text-3xl font-black font-mono opacity-90">+</div>

                  {/* Bottom Subcategory Description in White Text */}
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-slate-100 leading-snug uppercase drop-shadow-sm line-clamp-3">
                      {item.description || `Experience Future of ${item.title} with ENDO Tech`}
                    </p>
                  </div>
                </div>

                {/* Navy Blue Top Right Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-2.5 py-1 bg-[#0B1B3D]/90 backdrop-blur-xs text-white text-[9px] font-mono font-bold rounded-md border border-white/20 uppercase tracking-wider">
                    {item.categoryName}
                  </span>
                </div>
              </div>

              {/* Bottom Form Action Area */}
              <div className="p-4 space-y-3 bg-white">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-black text-[#0B1B3D] truncate">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 font-semibold">Technical PDF Catalog</p>
                </div>

                {/* Action Buttons: View PDF & Download PDF (Direct without password input) */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleViewPdf(item)}
                    className="w-full py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-extrabold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    title="View PDF directly online"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>View PDF</span>
                  </button>

                  {/* Dark Navy Blue Download PDF Button */}
                  <button
                    type="button"
                    onClick={() => handleDownloadPdf(item)}
                    className="w-full py-2 px-2 bg-[#0B1B3D] hover:bg-[#E31B23] text-white text-[11px] font-black rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

'use client'

import { FileText, ExternalLink, Download, FileSpreadsheet } from 'lucide-react'

export interface CataloguePdfItem {
  id: string
  title: string
  description?: string | null
  cover_image?: string | null
  pdf_url: string
  category_name?: string | null
}

interface CataloguePdfCardsProps {
  catalogues: CataloguePdfItem[]
  title?: string
  subtitle?: string
}

export function CataloguePdfCards({
  catalogues,
  title = 'Featured Product Catalogues & PDF Guides',
  subtitle = 'Download or view high-resolution PDF catalogues with complete technical specifications, sizing charts, and product SKUs.',
}: CataloguePdfCardsProps) {
  if (!catalogues || catalogues.length === 0) return null

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-red-500" />
            <h2 className="text-lg sm:text-xl font-black text-white">{title}</h2>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">{subtitle}</p>
        </div>

        <span className="self-start sm:self-center text-xs font-bold bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-full shrink-0">
          {catalogues.length} PDF Catalogues
        </span>
      </div>

      {/* Grid of PDF Catalogue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {catalogues.map((cat) => (
          <div
            key={cat.id}
            className="group bg-slate-900 border border-slate-800 hover:border-red-600/50 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Header Icon + Category Badge */}
              <div className="flex items-center justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 text-red-500 border border-red-500/20 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                {cat.category_name && (
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
                    {cat.category_name}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="font-extrabold text-white text-sm leading-snug group-hover:text-red-400 transition-colors">
                  {cat.title}
                </h3>
                {cat.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-normal">
                    {cat.description}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons: View PDF & Download PDF */}
            <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
              <a
                href={cat.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-extrabold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                <span>View PDF</span>
              </a>

              <a
                href={cat.pdf_url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-extrabold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

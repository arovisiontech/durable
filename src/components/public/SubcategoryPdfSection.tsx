'use client'

import { useState, useEffect } from 'react'
import { Eye, Download, Lock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'
import { SubcategoryPdfItem, getStoredSubcategoryPdfs } from '@/src/lib/dataStore'

interface SubcategoryPdfSectionProps {
  categorySlug: string
  categoryTitle: string
}

export function SubcategoryPdfSection({ categorySlug, categoryTitle }: SubcategoryPdfSectionProps) {
  const [subcategories, setSubcategories] = useState<SubcategoryPdfItem[]>([])
  const [passwordInputs, setPasswordInputs] = useState<Record<string, string>>({})
  const [statusMessages, setStatusMessages] = useState<Record<string, { type: 'success' | 'error'; text: string }>>({})

  const loadData = () => {
    const all = getStoredSubcategoryPdfs()
    const filtered = all.filter(
      (item) => item.categorySlug.toLowerCase().trim() === categorySlug.toLowerCase().trim()
    )
    setSubcategories(filtered)
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('durable_content_updated', handleUpdate)
    return () => window.removeEventListener('durable_content_updated', handleUpdate)
  }, [categorySlug])

  const handleInputChange = (id: string, val: string) => {
    setPasswordInputs((prev) => ({ ...prev, [id]: val }))
    if (statusMessages[id]) {
      setStatusMessages((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    }
  }

  const handleViewPdf = (item: SubcategoryPdfItem) => {
    const targetUrl = item.pdfUrl || '/pdf/general-surgical-instruments-catalogue.pdf'
    window.open(targetUrl, '_blank')
  }

  const handleDownloadPdf = (item: SubcategoryPdfItem) => {
    const inputPass = (passwordInputs[item.id] || '').trim()
    const requiredCode = (item.accessCode || '12345').trim()

    // Accept requiredCode, or universal default codes (12345, 2026, DURABLE) or direct download if code empty
    if (
      !requiredCode ||
      inputPass === requiredCode ||
      inputPass === '12345' ||
      inputPass === '2026' ||
      inputPass.toUpperCase() === 'DURABLE'
    ) {
      setStatusMessages((prev) => ({
        ...prev,
        [item.id]: { type: 'success', text: 'Access Granted! Downloading PDF...' },
      }))

      setTimeout(() => {
        const targetUrl = item.pdfUrl || '/pdf/general-surgical-instruments-catalogue.pdf'
        const link = document.createElement('a')
        link.href = targetUrl
        link.download = `${item.title.toLowerCase().replace(/\s+/g, '-')}-catalogue.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }, 500)
    } else {
      setStatusMessages((prev) => ({
        ...prev,
        [item.id]: { type: 'error', text: 'Invalid Password! (Use: 12345)' },
      }))
    }
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

      {/* Grid of Subcategories PDF Cards Matching SS 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {subcategories.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            {/* Top Subcategory Cover Artwork Matching SS 2 (Red Diagonal Branding) */}
            <div className="relative aspect-[3/4] w-full bg-slate-100 overflow-hidden">
              {item.image && item.image !== '/images/catalogue-cover-yellow.png' ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                /* SS 2 Style Red Diagonal Banner Graphic */
                <div className="w-full h-full bg-[#D4D4D4] relative p-4 flex flex-col justify-between overflow-hidden">
                  {/* Red Diagonal Corner Accent matching SS 2 */}
                  <div
                    className="absolute top-0 right-0 w-[140%] h-[140%] bg-[#8B0000] -rotate-45 translate-x-1/3 -translate-y-1/3 pointer-events-none"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
                  />

                  {/* Top Left Header Text matching SS 2 */}
                  <div className="relative z-10 space-y-0.5">
                    <span className="text-[9px] font-bold tracking-widest text-slate-700 uppercase block">
                      CRAFTING THE INSTRUMENTS
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-[#8B0000] italic tracking-tight uppercase leading-none">
                      {item.title}
                    </h3>
                  </div>

                  {/* Red Cross Icon Bottom Left matching SS 2 */}
                  <div className="relative z-10 text-[#8B0000] text-3xl font-black font-mono">
                    +
                  </div>

                  {/* Right Side Red Area Text matching SS 2 */}
                  <div className="absolute top-1/2 right-3 -translate-y-1/2 text-right z-10 max-w-[120px] text-white space-y-1">
                    <p className="text-[10px] font-bold leading-tight uppercase drop-shadow-xs">
                      {item.description || `Experience Future of ${item.title} with ENDO Tech`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Form Action Area matching SS 2 */}
            <div className="p-4 space-y-3 bg-white">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-[#0B1B3D] truncate">{item.title}</h4>
                <p className="text-[10px] text-slate-500 font-medium">Technical PDF Catalog</p>
              </div>

              {/* Password Input matching SS 2 */}
              <div className="space-y-1">
                <input
                  type="password"
                  value={passwordInputs[item.id] || ''}
                  onChange={(e) => handleInputChange(item.id, e.target.value)}
                  placeholder="Enter Password"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B1B3D]"
                />
              </div>

              {/* Status Message */}
              {statusMessages[item.id] && (
                <div
                  className={`p-2 rounded-lg text-[10px] font-bold flex items-center gap-1.5 ${
                    statusMessages[item.id].type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-600 border border-red-200'
                  }`}
                >
                  {statusMessages[item.id].type === 'success' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>{statusMessages[item.id].text}</span>
                </div>
              )}

              {/* Action Buttons: View PDF & Download PDF matching SS 2 */}
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

                {/* Dark Navy Angled Pill Download PDF Button matching SS 2 */}
                <button
                  type="button"
                  onClick={() => handleDownloadPdf(item)}
                  className="w-full py-2 px-2 bg-[#0B1B3D] hover:bg-[#E31B23] text-white text-[11px] font-black rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)' }}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Lock, Download, Eye, X, ShieldCheck, Mail, PhoneCall, CheckCircle2, AlertCircle } from 'lucide-react'

interface CatalogueCardItem {
  id: string
  code: string
  tag: string
  title: string
  description: string
  image: string
  pdfUrl: string
  accessCode: string
}

export function DownloadableCataloguesSection() {
  const catalogues: CatalogueCardItem[] = [
    {
      id: 'cat-1',
      code: 'CATALOG 01',
      tag: 'Hospital Furniture',
      title: 'HOSPITAL FURNITURE',
      description:
        'We Provide High-Quality Hospital Furniture Designed To Support Healthcare Professionals While Creating Safe, Comfortable, And Efficient Environments For Patients. Our Products Combine Durable Materials, Practical Functionality, Modern Design, And Reliable Performance For Hospitals, Clinics, Laboratories, And Healthcare Facilities.',
      image: '/images/catalogue-cover-yellow.png',
      pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
      accessCode: '12345',
    },
    {
      id: 'cat-2',
      code: 'CATALOG 02',
      tag: 'General Surgery',
      title: 'GENERAL SURGICAL INSTRUMENTS',
      description:
        'Comprehensive Range Of High-Precision Surgical Scissors, Scalpels, Forceps, Retractors, And Needle Holders Crafted From Medical-Grade Stainless Steel For General Surgical Procedures.',
      image: '/images/catalogue-cover-yellow.png',
      pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
      accessCode: '12345',
    },
    {
      id: 'cat-3',
      code: 'CATALOG 03',
      tag: 'Dental Instruments',
      title: 'DENTAL & MAXILLOFACIAL',
      description:
        'Precision Dental Scalers, Probes, Extracting Forceps, Elevator Sets, And Restorative Instruments Designed For Orthodontic And Maxillofacial Specialists Worldwide.',
      image: '/images/catalogue-cover-yellow.png',
      pdfUrl: '/pdf/dental-maxillofacial-catalogue.pdf',
      accessCode: '12345',
    },
    {
      id: 'cat-4',
      code: 'CATALOG 04',
      tag: 'Orthopedic',
      title: 'ORTHOPEDIC INSTRUMENTATION',
      description:
        'Bone Holding Forceps, Rongeurs, Bone Chisels, Mallets, And Implant Placement Toolkits Engineered Under Strict ISO 13485 Standards.',
      image: '/images/catalogue-cover-yellow.png',
      pdfUrl: '/pdf/orthopedic-instruments-catalogue.pdf',
      accessCode: '12345',
    },
    {
      id: 'cat-5',
      code: 'CATALOG 05',
      tag: 'Medical Hollowware',
      title: 'MEDICAL HOLLOWWARE & TRAYS',
      description:
        'Sterilization Trays, Kidney Dishes, Gallipots, Instrument Containers, And Procedure Bowls Built With Corrosion-Resistant Stainless Steel.',
      image: '/images/catalogue-cover-yellow.png',
      pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
      accessCode: '12345',
    },
    {
      id: 'cat-6',
      code: 'CATALOG 06',
      tag: 'Single Use',
      title: 'SINGLE USE & STERILE PACKS',
      description:
        'Sterile Procedure Packs, Single-Use Scissors, Forceps, And Custom Medical Kitting Solutions Tailored For Infection Control And Single-Use Convenience.',
      image: '/images/catalogue-cover-yellow.png',
      pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
      accessCode: '12345',
    },
  ]

  // Modal State for Access Code Protection (Download Only)
  const [selectedCatalogue, setSelectedCatalogue] = useState<CatalogueCardItem | null>(null)
  const [inputCode, setInputCode] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  // Direct View without Password
  const handleViewDirectly = (cat: CatalogueCardItem) => {
    window.open(cat.pdfUrl, '_blank')
  }

  // Open Modal for Protected Download
  const handleOpenDownloadModal = (cat: CatalogueCardItem) => {
    setSelectedCatalogue(cat)
    setInputCode('')
    setErrorMsg('')
    setIsSuccess(false)
  }

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCatalogue) return

    const trimmed = inputCode.trim()
    if (trimmed === '12345' || trimmed === '2026' || trimmed.toUpperCase() === 'DURABLE') {
      setIsSuccess(true)
      setErrorMsg('')

      setTimeout(() => {
        // Trigger file download
        const link = document.createElement('a')
        link.href = selectedCatalogue.pdfUrl
        link.download = `${selectedCatalogue.title.toLowerCase().replace(/\s+/g, '-')}-catalogue.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Close modal after download
        setTimeout(() => {
          setSelectedCatalogue(null)
          setIsSuccess(false)
        }, 1500)
      }, 600)
    } else {
      setErrorMsg('Invalid Access Code! Please request the correct code from the owner.')
    }
  }

  return (
    <section className="w-full bg-[#F8FAFC] py-12 sm:py-16 relative overflow-hidden border-b border-slate-200">
      {/* Background Vector Dots Pattern */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#0B1B3D_1.5px,transparent_1.5px)] [background-size:20px_20px]" />

      <div className="max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* 2-Column Grid of 3D Book Cover Catalogue Cards matching SS 1 & SS 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {catalogues.map((cat) => (
            <div
              key={cat.id}
              className="group bg-white rounded-3xl p-5 sm:p-7 shadow-md hover:shadow-2xl border border-slate-100 hover:border-red-500/30 transition-all duration-300 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center"
            >
              {/* Left Column: 3D Yellow Book Cover Artwork matching SS 3 */}
              <div className="sm:col-span-5 relative flex items-center justify-center">
                <div className="relative aspect-[3/4] w-full max-w-[200px] sm:max-w-none rounded-xl overflow-hidden shadow-xl transform group-hover:scale-105 transition-transform duration-500 bg-amber-400">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right Column: Information & Actions */}
              <div className="sm:col-span-7 space-y-3 flex flex-col justify-between h-full py-1">
                <div className="space-y-2">
                  {/* Code Tag Badge */}
                  <span className="text-[11px] font-black tracking-widest text-slate-700 uppercase bg-slate-100 px-3 py-1 rounded-full inline-block">
                    {cat.code}
                  </span>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-black text-[#0B1B3D] leading-tight group-hover:text-[#E31B23] transition-colors uppercase">
                    {cat.title}
                  </h3>

                  {/* Description Paragraph */}
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed line-clamp-4">
                    {cat.description}
                  </p>
                </div>

                {/* Divider Line */}
                <div className="w-full h-[1px] bg-slate-200/80 my-2" />

                {/* Action Buttons matching SS 1 */}
                <div className="flex items-center gap-3 pt-1">
                  {/* View Catalog Red Button (No Password Required!) */}
                  <button
                    onClick={() => handleViewDirectly(cat)}
                    className="inline-flex items-center gap-1.5 bg-[#E31B23] hover:bg-red-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Catalog</span>
                  </button>

                  {/* Download PDF Outlined Button (Requires Code: 12345) */}
                  <button
                    onClick={() => handleOpenDownloadModal(cat)}
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-800 text-slate-800 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
                  >
                    <span>Download PDF</span>
                    <Lock className="w-3.5 h-3.5 text-slate-700" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Centered CTA Button matching SS 2 */}
        <div className="text-center pt-4">
          <Link
            href="/products"
            className="inline-flex items-center justify-center bg-[#E31B23] hover:bg-red-700 text-white font-black text-xs sm:text-sm tracking-wider uppercase px-8 py-3.5 rounded-full shadow-lg transition-all transform hover:scale-105"
          >
            Browse Product Categories
          </Link>
        </div>
      </div>

      {/* Access Code Verification Protection Modal (Password Protected Downloads) */}
      {selectedCatalogue && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-200 space-y-6">
            {/* Close Modal Button */}
            <button
              onClick={() => setSelectedCatalogue(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Icon */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#E31B23] border border-red-100 flex items-center justify-center mx-auto shadow-xs">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-[#0B1B3D] tracking-tight">
                Catalogue Protected
              </h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Please enter the access code provided by the owner to download <strong className="text-slate-900">{selectedCatalogue.title}</strong>.
              </p>
            </div>

            {/* Access Code Form */}
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Access Code
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    maxLength={10}
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Enter Code (e.g. 12345)"
                    className="w-full text-sm font-mono tracking-widest px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E31B23] text-slate-900 font-bold"
                  />
                  <ShieldCheck className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-bold text-red-600">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Success Alert */}
              {isSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Access Granted! Downloading PDF...</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSuccess}
                className="w-full bg-[#E31B23] hover:bg-red-700 disabled:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{isSuccess ? 'Verifying...' : 'Unlock & Download PDF'}</span>
              </button>
            </form>

            {/* Owner Contact Information Box matching User Directive */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Don&apos;t have an Access Code?
              </p>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                Contact the company owner / sales department to request your instant access password:
              </p>

              <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-bold text-[#0B1B3D]">
                <a
                  href="mailto:Info@Durablehs.Com?subject=Request%20Catalogue%20Access%20Code"
                  className="flex items-center gap-1.5 hover:text-[#E31B23] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#E31B23]" />
                  <span>Info@Durablehs.Com</span>
                </a>

                <a
                  href="https://wa.me/92523563200"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-emerald-600 hover:underline"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>WhatsApp: (+92) 52 3563200</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

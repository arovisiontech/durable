'use client'

import Link from 'next/link'
import { Download, ExternalLink, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'

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
  const catalogList: CatalogShowcaseItem[] = [
    {
      id: 'cat-01',
      number: '01',
      title: 'General Surgery Catalog',
      description:
        'This comprehensive catalog is designed to meet the diverse needs of healthcare professionals across various medical disciplines, including Diagnostics, Autopsy, Gynecology, Orthopedics, Cardiology, Rhinology, Ophthalmology, Urology, and more. It also features specialized instruments such as Tungsten Carbide (Gold Plated), Titanium, Micro Surgery, and Diamond-Dusted instruments, ensuring precision and excellence in every procedure.',
      pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
      categorySlug: 'general-surgery',
      coverImage: '/images/about-surgical-instruments.png',
      badgeText: 'GENERAL SURGERY • 120 PAGES',
      accentColor: 'from-[#0B1B3D] to-[#1E293B]',
    },
    {
      id: 'cat-02',
      number: '02',
      title: 'Dental Instruments Catalog',
      description:
        'Our Dental catalog provides a comprehensive range of instruments across various dental specialties, including diagnostic, restorative, endodontic, orthodontic, and surgical fields. Each instrument is crafted with precision and durability in mind, offering dentists the confidence and reliability they need for successful procedures.',
      pdfUrl: '/pdf/dental-maxillofacial-catalogue.pdf',
      categorySlug: 'dental',
      coverImage: '/images/dental-clinic-banner.png',
      badgeText: 'DENTAL & RESTORATIVE • 84 PAGES',
      accentColor: 'from-[#0B1B3D] to-[#0A4D68]',
    },
    {
      id: 'cat-03',
      number: '03',
      title: 'Hi-Frequency (Electrosurgical) Catalog',
      description:
        'Our Electrosurgical catalog features a comprehensive selection of diathermy, bipolar and monopolar instruments, along with high-quality cables and accessories. Additionally, it caters to the demands of minimally invasive surgery by offering a premium range of laparoscopic instruments.',
      pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
      categorySlug: 'single-use-instruments',
      coverImage: '/images/blog-surgeon-scalpel.png',
      badgeText: 'ELECTROSURGICAL & LAPAROSCOPY',
      accentColor: 'from-[#0B1B3D] to-[#3B82F6]',
    },
    {
      id: 'cat-04',
      number: '04',
      title: 'Hollowware & Sterilization Catalog',
      description:
        'Our Hollowware catalog offers a complete range of instruments designed to meet the needs of hospitals and clinics, featuring everything from pans and bowls to sterilization containers and trays, crafted from highest quality 304 stainless steel.',
      pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
      categorySlug: 'medical-hollowware',
      coverImage: '/images/surgical-tray-durable.png',
      badgeText: 'HOLLOWWARE & STERILIZATION',
      accentColor: 'from-[#0B1B3D] to-[#475569]',
    },
    {
      id: 'cat-05',
      number: '05',
      title: 'Bone & Orthopedic Instruments Catalog',
      description:
        'Specialized range of bone chisels, osteotomes, mallets, rongeurs, gouges, bone holding forceps, and wire tighteners engineered for structural durability and ergonomic control during joint replacement and reconstructive procedures.',
      pdfUrl: '/pdf/orthopedic-instruments-catalogue.pdf',
      categorySlug: 'orthopedic-instruments',
      coverImage: '/images/blog-instruments-tray.png',
      badgeText: 'BONE & ORTHOPEDIC • 96 PAGES',
      accentColor: 'from-[#0B1B3D] to-[#D97706]',
    },
    {
      id: 'cat-06',
      number: '06',
      title: 'Discipline Specific & Ophthalmic Catalog',
      description:
        'Micro-dissecting forceps, spring scissors, corneal speculums, and discipline-specific instrumentation for ENT, gynecology, neurosurgery, dermatology, and cardiovascular disciplines, backed by CE MDR compliance and ISO 13485 certification.',
      pdfUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
      categorySlug: 'ophthalmic',
      coverImage: '/images/process-hand-filing.png',
      badgeText: 'OPHTHALMIC & MICRO-SURGERY',
      accentColor: 'from-[#0B1B3D] to-[#059669]',
    },
  ]

  return (
    <section className="w-full bg-slate-50/50 py-10 sm:py-16 border-t border-slate-200/80 relative overflow-hidden">
      {/* CSS Animation Keyframes for 4-Side Light Beam Rotation */}
      <style>{`
        @keyframes continuousLightSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-light-beam {
          animation: continuousLightSpin 5s linear infinite;
        }
        .animate-light-beam-fast {
          animation: continuousLightSpin 3.5s linear infinite;
        }
      `}</style>

      {/* Decorative background glow ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-red-500/5 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#E31B23] animate-ping" />
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#E31B23]" />
              OFFICIAL PRODUCT CATALOGUES
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1B3D] tracking-tight uppercase leading-tight">
            EXPLORE & DOWNLOAD OUR <br />
            TECHNICAL <span className="text-[#E31B23]">CATALOGUES</span>
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed">
            Full range product catalogues featuring technical instrument specifications, sizing dimensions, and ordering SKUs.
          </p>
        </div>

        {/* 6 Showcase Cards with Compact Size, Animations & 4-Side Light Beam */}
        <div className="space-y-8 sm:space-y-10">
          {catalogList.map((item, index) => {
            const isEven = index % 2 === 1

            return (
              <div
                key={item.id}
                id={`cat-${item.number}`}
                className="scroll-mt-24 group relative"
              >
                {/* 4-Side Ambient Aura Glow Shadow behind card */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#E31B23]/30 via-[#3B82F6]/30 to-[#E31B23]/30 rounded-3xl blur-xl opacity-40 group-hover:opacity-90 transition-opacity duration-500" />

                {/* 4-Side Animated Light Beam Running Around Border (The aesthetic 4-side light effect) */}
                <div className="relative p-[2px] rounded-3xl overflow-hidden bg-slate-200 group-hover:shadow-[0_15px_40px_rgba(227,27,35,0.2)] transition-all duration-500">
                  
                  {/* Rotating Conic Light Layer */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-0">
                    <div className="absolute -inset-[150%] animate-light-beam bg-[conic-gradient(from_0deg_at_50%_50%,#E31B23_0deg,transparent_60deg,#0B1B3D_120deg,#00F0FF_180deg,transparent_240deg,#E31B23_300deg,#FFD700_360deg)] opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Inner Sleek Card Body */}
                  <div className="relative z-10 bg-white rounded-[22px] p-5 sm:p-7 shadow-md group-hover:shadow-2xl transition-all duration-500">
                    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                      
                      {/* Text Content Column */}
                      <div
                        className={`space-y-4 ${
                          isEven ? 'lg:col-span-7 lg:order-2' : 'lg:col-span-7 lg:order-1'
                        }`}
                      >
                        {/* Big Number & Title */}
                        <div className="space-y-1">
                          <span className="text-4xl sm:text-5xl font-black text-[#0B1B3D] font-mono tracking-tighter leading-none block group-hover:text-[#E31B23] transition-colors duration-300">
                            {item.number}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-black text-[#0B1B3D] leading-tight">
                            {item.title}
                          </h3>
                        </div>

                        {/* Compact Description */}
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal line-clamp-3 sm:line-clamp-none">
                          {item.description}
                        </p>

                        {/* Action Buttons */}
                        <div className="pt-2 flex flex-wrap items-center gap-2.5">
                          {/* View PDF Button */}
                          <a
                            href={item.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#0B1B3D] hover:bg-slate-800 rounded-xl transition-all shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-95"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-red-400" />
                            <span>View Catalog PDF</span>
                          </a>

                          {/* Download PDF Button */}
                          <a
                            href={item.pdfUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#E31B23] hover:bg-red-700 rounded-xl transition-all shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-95"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download PDF</span>
                          </a>

                          {/* Category Link */}
                          <Link
                            href={`/category/${item.categorySlug}`}
                            className="inline-flex items-center gap-1 px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:text-[#E31B23] transition-colors group/link"
                          >
                            <span>Explore {item.number} Products</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#E31B23] group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>

                      {/* Compact 3D Book Cover Card Column with Light Beam */}
                      <div
                        className={`flex items-center justify-center ${
                          isEven ? 'lg:col-span-5 lg:order-1' : 'lg:col-span-5 lg:order-2'
                        }`}
                      >
                        <div className="relative w-full max-w-[240px] sm:max-w-[270px] group/book perspective-1000">
                          
                          {/* Book Outer Light Beam Wrapper */}
                          <div className="relative p-[1.5px] rounded-2xl overflow-hidden bg-slate-200 shadow-xl group-hover/book:shadow-2xl transition-all duration-500">
                            
                            {/* Rotating Conic Light on Book Border */}
                            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-0">
                              <div className="absolute -inset-[150%] animate-light-beam-fast bg-[conic-gradient(from_0deg_at_50%_50%,#E31B23_0deg,transparent_90deg,#3B82F6_180deg,transparent_270deg,#E31B23_360deg)] opacity-80" />
                            </div>

                            {/* Book Inner Container */}
                            <div className="relative z-10 rounded-[14px] overflow-hidden bg-white group-hover/book:scale-[1.03] group-hover/book:-rotate-1 transition-all duration-500">
                              
                              {/* Top Foil Band */}
                              <div className="bg-[#0B1B3D] text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-700">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-[#E31B23] animate-pulse" />
                                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-200 truncate max-w-[170px]">
                                    {item.badgeText}
                                  </span>
                                </div>
                                <div className="text-[10px] font-black tracking-widest text-[#E31B23]">
                                  DURABLE
                                </div>
                              </div>

                              {/* Book Cover Image */}
                              <div className="relative aspect-[3/4] bg-slate-900 overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={item.coverImage}
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover/book:scale-110 transition-transform duration-700 opacity-90"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3D] via-[#0B1B3D]/40 to-transparent" />

                                {/* Book Overlay Content */}
                                <div className="absolute bottom-4 left-4 right-4 space-y-1 text-white">
                                  <div className="text-2xl font-black font-mono opacity-40">
                                    {item.number}
                                  </div>
                                  <h4 className="text-sm font-black leading-snug uppercase text-white drop-shadow-sm line-clamp-2">
                                    {item.title}
                                  </h4>
                                  <div className="pt-0.5 flex items-center gap-1.5 text-[9px] font-semibold text-slate-300">
                                    <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                                    <span className="truncate">ISO 13485 & CE MDR</span>
                                  </div>
                                </div>
                              </div>

                              {/* Bottom Spine Edge */}
                              <div className="bg-[#051026] text-slate-400 text-[9px] font-bold text-center py-1.5 border-t border-slate-800 tracking-wider uppercase">
                                DURABLE HOSPITAL SUPPLIES
                              </div>
                            </div>
                          </div>

                          {/* Soft Floor Shadow */}
                          <div className="w-3/4 h-3 bg-slate-900/15 mx-auto rounded-full blur-xs mt-3 group-hover/book:w-4/5 transition-all" />
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

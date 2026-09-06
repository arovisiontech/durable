'use client'

import Link from 'next/link'
import { Download, ExternalLink, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'

export interface DentalShowcaseItem {
  id: string
  number: string
  title: string
  description: string
  pdfUrl: string
  categorySlug: string
  coverImage: string
  badgeText: string
}

export function DentalCatalogShowcaseSection() {
  const dentalList: DentalShowcaseItem[] = [
    {
      id: 'dental-01',
      number: '01',
      title: 'Extraction & Oral Surgery',
      description:
        'Comprehensive range of Extracting Forceps in English & American patterns for upper and lower jaws. Features anatomically shaped handles, delicate touch grip, root elevators, root fragment elevators, and luxators designed for minimal tissue trauma.',
      pdfUrl: '/pdf/dental-maxillofacial-catalogue.pdf',
      categorySlug: 'extraction-oral-surgery',
      coverImage: '/images/dental-clinic-banner.png',
      badgeText: 'EXTRACTION & SURGERY • 48 PAGES',
    },
    {
      id: 'dental-02',
      number: '02',
      title: 'Dental Bone Surgery',
      description:
        'Precision-crafted osteotomes, gouges, chisels, bone rongeurs, bone curettes, periosteal elevators, and surgical mallets engineered for controlled bone resection, grafting, and ridge augmentation.',
      pdfUrl: '/pdf/dental-maxillofacial-catalogue.pdf',
      categorySlug: 'dental-bone-surgery',
      coverImage: '/images/about-surgical-instruments.png',
      badgeText: 'BONE SURGERY • 36 PAGES',
    },
    {
      id: 'dental-03',
      number: '03',
      title: 'Periodontics & Cleaning',
      description:
        'Supragingival and subgingival scalers, Gracey curettes, periodontal probes, composite filling instruments, amalgam carvers, spatulas, and porcelain modeling tools crafted with ultra-fine working tips.',
      pdfUrl: '/pdf/dental-maxillofacial-catalogue.pdf',
      categorySlug: 'periodontics-cleaning',
      coverImage: '/images/blog-surgeon-scalpel.png',
      badgeText: 'PERIODONTICS & RESTORATIVE',
    },
    {
      id: 'dental-04',
      number: '04',
      title: 'Endodontics',
      description:
        "Complete root canal instrumentation including reamers, files, spreaders, Ehricke's impression trays, partial perforated trays, matrix bands, and retainers for precise endodontic therapy.",
      pdfUrl: '/pdf/dental-maxillofacial-catalogue.pdf',
      categorySlug: 'endodontics',
      coverImage: '/images/surgical-tray-durable.png',
      badgeText: 'ENDODONTICS & IMPRESSION',
    },
    {
      id: 'dental-05',
      number: '05',
      title: 'Diagnostic',
      description:
        'Mouth mirrors, rhodium front-surface mirrors, explorers, periodontal probes, college cotton pliers, articulating paper forceps, and endodontic locking tweezers for thorough oral examination.',
      pdfUrl: '/pdf/dental-maxillofacial-catalogue.pdf',
      categorySlug: 'diagnostic',
      coverImage: '/images/blog-instruments-tray.png',
      badgeText: 'DIAGNOSTIC INSTRUMENTS',
    },
    {
      id: 'dental-06',
      number: '06',
      title: 'Discipline Specific Instruments',
      description:
        'Micro needle holders, dissecting & gum scissors, hemostatic artery forceps, dressing pliers, tissue forceps, retractors, mouth gags, skin hooks, and suction cannulas compliant with international dental standards.',
      pdfUrl: '/pdf/dental-maxillofacial-catalogue.pdf',
      categorySlug: 'discipline-specific-dental',
      coverImage: '/images/process-hand-filing.png',
      badgeText: 'SPECIALTY DENTAL • ISO 13485',
    },
  ]

  return (
    <section className="w-full bg-slate-50/50 py-10 sm:py-16 border-t border-slate-200/80 relative overflow-hidden">
      {/* CSS Animation Keyframes for 4-Side Light Beam */}
      <style>{`
        @keyframes dentalLightSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-dental-light {
          animation: dentalLightSpin 4.5s linear infinite;
        }
        .animate-dental-light-fast {
          animation: dentalLightSpin 3s linear infinite;
        }
      `}</style>

      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-br from-red-500/5 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#E31B23] animate-ping" />
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#E31B23]" />
              DENTAL INSTRUMENTS SPECIFICATIONS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1B3D] tracking-tight uppercase leading-tight">
            DENTAL CATEGORIES & <br />
            TECHNICAL <span className="text-[#E31B23]">FLOW CHARTS</span>
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed">
            Detailed catalog breakdown for dental surgery, periodontics, endodontics, and restorative instrumentation.
          </p>
        </div>

        {/* 6 Dental Showcase Items (01 - 06) with 4-Side Animated Light Motion */}
        <div className="space-y-8 sm:space-y-10">
          {dentalList.map((item, index) => {
            const isEven = index % 2 === 1

            return (
              <div
                key={item.id}
                id={`dental-${item.number}`}
                className="scroll-mt-24 group relative"
              >
                {/* 4-Side Glow Backdrop Shadow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#E31B23]/30 via-[#3B82F6]/30 to-[#E31B23]/30 rounded-3xl blur-xl opacity-40 group-hover:opacity-90 transition-opacity duration-500" />

                {/* 4-Side Animated Light Motion Border Wrapper */}
                <div className="relative p-[2px] rounded-3xl overflow-hidden bg-slate-200 group-hover:shadow-[0_15px_40px_rgba(227,27,35,0.2)] transition-all duration-500">
                  
                  {/* Rotating Conic Light Beam Layer */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-0">
                    <div className="absolute -inset-[150%] animate-dental-light bg-[conic-gradient(from_0deg_at_50%_50%,#E31B23_0deg,transparent_60deg,#0B1B3D_120deg,#00F0FF_180deg,transparent_240deg,#E31B23_300deg,#FFD700_360deg)] opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
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
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
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
                            <span>View Dental PDF</span>
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
                            <span>Explore {item.number} Dental Range</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#E31B23] group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>

                      {/* Compact 3D Book Cover Card Column with Light Motion */}
                      <div
                        className={`flex items-center justify-center ${
                          isEven ? 'lg:col-span-5 lg:order-1' : 'lg:col-span-5 lg:order-2'
                        }`}
                      >
                        <div className="relative w-full max-w-[240px] sm:max-w-[270px] group/book perspective-1000">
                          
                          {/* Book Light Motion Wrapper */}
                          <div className="relative p-[1.5px] rounded-2xl overflow-hidden bg-slate-200 shadow-xl group-hover/book:shadow-2xl transition-all duration-500">
                            
                            {/* Rotating Conic Light on Book Border */}
                            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-0">
                              <div className="absolute -inset-[150%] animate-dental-light-fast bg-[conic-gradient(from_0deg_at_50%_50%,#E31B23_0deg,transparent_90deg,#3B82F6_180deg,transparent_270deg,#E31B23_360deg)] opacity-80" />
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
                                DURABLE DENTAL INSTRUMENTS
                              </div>
                            </div>
                          </div>

                          {/* Floor Shadow */}
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

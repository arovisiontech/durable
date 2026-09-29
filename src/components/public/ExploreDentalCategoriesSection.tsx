'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'

const DEFAULT_HEADER = {
  badge: 'COVERING ALL MAJOR FIELDS',
  titlePrimary: 'EXPLORE OUR ',
  titleHighlight: 'DENTAL INSTRUMENTS',
  titleEnd: ' CATEGORIES',
}

const DEFAULT_CARDS = [
  {
    id: 'd-1',
    number: '01',
    title: 'Extraction & Oral Surgery',
    description:
      'Extracting Forceps In Various Patterns (English And American, Upper And Lower Jaw, Anatomically Shaped Handles, Delicate Touch), Root Elevators, Root Fragment Elevators, And Luxators.',
    slug: 'extraction-oral-surgery',
  },
  {
    id: 'd-2',
    number: '02',
    title: 'Dental Bone Surgery',
    description:
      'Osteotomes, Gouges, Chisels, Bone Rongeurs, Bone Curettes, Periosteal Elevators, Mallets, And Related Bone Instruments.',
    slug: 'dental-bone-surgery',
  },
  {
    id: 'd-3',
    number: '03',
    title: 'Periodontics & Cleaning',
    description:
      'A Large Scaler Range (Supragingival And Subgingival), Cure, And Periodontal Probes. Restorative & Filling: Filling Instruments Composite Instruments, Amalgam Instruments, Wax/Porcelain/Carvers, And Spatulas.',
    slug: 'periodontics-cleaning',
  },
  {
    id: 'd-4',
    number: '04',
    title: 'Endodontics',
    description:
      "Root Canal Instruments. Impression Trays (Ehricke's, Partial Trays), Matrix Bands, And Retainers",
    slug: 'endodontics',
  },
  {
    id: 'd-5',
    number: '05',
    title: 'Diagnostic',
    description:
      'Mouth Mirrors, Explorers, Probes And Cotton Applicators Sickle Probe, Intraoral Mirror, Periadontal Probe, Dental Tweezers / College Cotton Pliers, Articulating Paper Forceps, Endodontic Locking Tweezers',
    slug: 'diagnostic',
  },
  {
    id: 'd-6',
    number: '06',
    title: 'Discipline Specific Instruments',
    description:
      'Needle Holders (Including Micro Needle Holders), Scissors (Dissecting, Gum, Delicate), Artery/Hemostatic Forceps, Dressing And Tissue Forceps (Including Micro), Retractors, Gags, Skin Hooks/Hooklets, Scalpels, Suction Cannulas,',
    slug: 'discipline-specific-dental',
  },
]

export function ExploreDentalCategoriesSection() {
  const [headerData, setHeaderData] = useState(DEFAULT_HEADER)
  const [dentalCategories, setDentalCategories] = useState(DEFAULT_CARDS)

  const loadData = () => {
    try {
      const savedHeader = localStorage.getItem('durable_dental_fields_data')
      if (savedHeader) {
        const parsed = JSON.parse(savedHeader)
        if (parsed && typeof parsed === 'object') {
          setHeaderData((prev) => ({ ...prev, ...parsed }))
        }
      }

      const savedCards = localStorage.getItem('durable_dental_fields_cards')
      if (savedCards) {
        const parsed = JSON.parse(savedCards)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDentalCategories(parsed)
        }
      }
    } catch (e) {
      console.error('LocalStorage ExploreDentalCategories read error:', e)
    }
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('durable_content_updated', handleUpdate)
    return () => window.removeEventListener('durable_content_updated', handleUpdate)
  }, [])

  return (
    <section className="w-full bg-slate-50/50 py-12 sm:py-16 border-b border-slate-200 relative overflow-hidden">
      {/* CSS Keyframes for 4-Side Light Beam */}
      <style>{`
        @keyframes dentalLightSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-dental-light {
          animation: dentalLightSpin 4.5s linear infinite;
        }
      `}</style>

      <div className="max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 sm:space-y-12">
        
        {/* Top Centered Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#E31B23] animate-ping" />
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#E31B23]" />
              {headerData.badge}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1B3D] tracking-tight uppercase leading-tight">
            {headerData.titlePrimary}<span className="text-[#E31B23]">{headerData.titleHighlight}</span>{headerData.titleEnd}
          </h2>
          
          {/* Centered Red Accent Line */}
          <div className="w-16 h-[3px] bg-[#E31B23] rounded-full mx-auto my-2.5" />
        </div>

        {/* 6 Numbered Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {dentalCategories.map((cat, idx) => (
            <Link
              key={cat.id || cat.number || idx}
              href={`/dental-showcase#dental-${cat.number || `0${idx + 1}`}`}
              className="group relative block rounded-2xl"
            >
              {/* 4-Side Glow Backdrop Aura Shadow */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#E31B23]/30 via-[#3B82F6]/30 to-[#E31B23]/30 rounded-2xl blur-lg opacity-40 group-hover:opacity-100 transition-opacity duration-500" />

              {/* 4-Side Animated Light Beam Border Wrapper */}
              <div className="relative p-[2px] rounded-2xl overflow-hidden bg-slate-200 group-hover:shadow-xl transition-all duration-500">
                
                {/* Rotating Conic Light Beam */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-0">
                  <div className="absolute -inset-[150%] animate-dental-light bg-[conic-gradient(from_0deg_at_50%_50%,#E31B23_0deg,transparent_60deg,#0B1B3D_120deg,#00F0FF_180deg,transparent_240deg,#E31B23_300deg,#FFD700_360deg)] opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Card Inner Body */}
                <div className="relative z-10 bg-white rounded-[14px] p-6 sm:p-7 h-full flex flex-col justify-between space-y-4 group-hover:-translate-y-1 transition-transform duration-300">
                  <div className="space-y-3">
                    {/* Number & Accent Bar */}
                    <div>
                      <span className="text-xl sm:text-2xl font-black text-[#0B1B3D] group-hover:text-[#E31B23] transition-colors font-mono">
                        {cat.number || `0${idx + 1}`}
                      </span>
                      <div className="w-8 h-[2.5px] bg-[#E31B23] rounded-full mt-1 group-hover:w-12 transition-all duration-300" />
                    </div>

                    {/* Card Title */}
                    <h3 className="text-base sm:text-lg font-black text-[#0B1B3D] leading-snug group-hover:text-[#E31B23] transition-colors">
                      {cat.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                      {cat.description}
                    </p>
                  </div>

                  {/* Red Link at Bottom */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-xs font-extrabold text-[#E31B23] tracking-wide inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>View Specifications & Flow</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}


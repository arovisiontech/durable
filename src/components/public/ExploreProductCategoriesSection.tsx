'use client'

import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'

export function ExploreProductCategoriesSection() {
  const categories = [
    {
      number: '01',
      title: 'General Surgical Instruments',
      description:
        'Forceps, Scissors, Needle Holders, Retractors, Clamps, Knives/Scalpels, Probes, Dilators, Curettes, Hooks, Elevators, And Suction Tubes And So',
      slug: 'surgical-instruments',
    },
    {
      number: '02',
      title: 'Bone & Orthopedic Instruments',
      description:
        'Bone Instruments, Chisels, Gouges, Osteotomes, Mallets/Hammers, Rongeurs, Raspatories, And Related Cutting Instruments',
      slug: 'orthopedic-instruments',
    },
    {
      number: '03',
      title: 'Diagnostic & Examination Instruments',
      description:
        'Specula (Vaginal, Nasal, Ear, Etc.), Laryngoscopes, Mouth Gags, Tongue Depressors, Stethoscopes, And Examination Tools.',
      slug: 'diagnostic-instruments',
    },
    {
      number: '04',
      title: 'Specialty Instruments',
      description:
        'Premium TC-Inserted Needle Holders, Super Cut Scissors, Razor Scissors, Micro Forceps, And TC Wire Cutters For Extended Sharp And Durability. Diamond Dusted Jaws Instruments, Titanium Coated, PVD, Anodized Titanium Instruments, Kerrison Punches.',
      slug: 'specialty-instruments',
    },
    {
      number: '05',
      title: 'Hollowware',
      description:
        'Instrument Trays (With Or Without Lids), Sterilization Boxes, Bowls, Dishes, And Basins, Kidney Dishes, Gallipots, Surgical Bowls And Solution Basins, Iodine / Prep Cups, Sterilization And Material Management Containers, Dressing Drums, Dressing / Forceps Jars, Graduated Measuring Jugs',
      slug: 'holloware',
    },
    {
      number: '06',
      title: 'Discipline Specific Instruments',
      description:
        'Ophthalmology, Gynecology & Obstetrics, Rhinology & ENT / Otology, Neurosurgery, Urology, Dermatology, And Thoracic / Abdominal Surgery.',
      slug: 'discipline-specific',
    },
  ]

  return (
    <section className="w-full bg-slate-50/50 py-12 sm:py-16 lg:py-20 border-b border-slate-200 relative overflow-hidden">
      {/* CSS Keyframes for 4-Side Light Motion Beam */}
      <style>{`
        @keyframes prodLightSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-prod-light {
          animation: prodLightSpin 4.5s linear infinite;
        }
      `}</style>

      {/* Background Radial Texture */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#0B1B3D_1.5px,transparent_1.5px)] [background-size:20px_20px]" />

      <div className="max-w-7xl 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 sm:space-y-12">
        
        {/* Top Header Block matching User Screenshot */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#E31B23] animate-ping" />
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#E31B23]" />
              PRECISION • QUALITY • TRUST
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-[#0B1B3D] tracking-tight uppercase leading-tight">
            EXPLORE OUR <br />
            PRODUCT <span className="text-[#E31B23]">CATEGORIES</span>
          </h2>
          
          {/* Red Accent Bar */}
          <div className="w-16 h-[3.5px] bg-[#E31B23] rounded-full my-2.5" />

          <p className="text-xs sm:text-sm lg:text-base text-slate-600 font-medium leading-relaxed">
            From Scissors Dissection Sets To Precision Surgical Instruments Forceps And A Full Range Of Cutting Instruments In Surgery. This Catalog Covers Every Core General Surgery Need. Our General Surgery Catalog Range Covers The Full Spectrum Of OR Instrumentation, From Basic Forceps And Scissors To Specialty TC And Titanium-Blade Instruments.
          </p>
        </div>

        {/* 6 Numbered Category Cards Grid with 4-Side Light Motion & Pre-fetched Fast Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {categories.map((cat) => {
            return (
              <Link
                key={cat.number}
                href={`/catalog-showcase#cat-${cat.number}`}
                prefetch={true}
                className="group relative block rounded-2xl"
              >
                {/* 4-Side Glow Backdrop Aura Shadow */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#E31B23]/30 via-[#3B82F6]/30 to-[#E31B23]/30 rounded-2xl blur-lg opacity-40 group-hover:opacity-100 transition-opacity duration-500" />

                {/* 4-Side Animated Light Motion Border Wrapper */}
                <div className="relative p-[2px] rounded-2xl overflow-hidden bg-slate-200 group-hover:shadow-xl transition-all duration-500 h-full">
                  
                  {/* Rotating Conic Light Beam */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-0">
                    <div className="absolute -inset-[150%] animate-prod-light bg-[conic-gradient(from_0deg_at_50%_50%,#E31B23_0deg,transparent_60deg,#0B1B3D_120deg,#00F0FF_180deg,transparent_240deg,#E31B23_300deg,#FFD700_360deg)] opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Card Inner Body */}
                  <div className="relative z-10 bg-white rounded-[14px] p-6 sm:p-7 h-full flex flex-col justify-between space-y-4 group-hover:-translate-y-1 transition-transform duration-300">
                    <div className="space-y-3">
                      {/* Number & Accent Bar */}
                      <div>
                        <span className="text-xl sm:text-2xl font-black text-[#0B1B3D] group-hover:text-[#E31B23] transition-colors font-mono">
                          {cat.number}
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
            )
          })}
        </div>

      </div>
    </section>
  )
}


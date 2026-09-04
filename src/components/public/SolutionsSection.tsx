'use client'

import Link from 'next/link'

export function SolutionsSection() {
  const solutions = [
    {
      id: '01',
      title: 'General Surgery',
      slug: 'general-surgery',
      description: 'Precision Instruments For All Surgical Discipline',
      imageIcon: '/images/icon-general-surgery.png',
    },
    {
      id: '02',
      title: 'Dental',
      slug: 'dental',
      description: 'Complete Dental Solutions For Every Specialty',
      imageIcon: '/images/icon-dental.png',
    },
    {
      id: '03',
      title: 'Medical Hollowware',
      slug: 'medical-hollowware',
      description: 'Instrument Storage & Sterilization Solutions',
      svgIcon: (
        <svg viewBox="0 0 64 64" fill="none" stroke="#0B1B3D" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
          <path d="M 12 28 C 12 18 52 18 52 28 C 52 42 12 42 12 28 Z" fill="#0B1B3D" fillOpacity="0.15" />
          <path d="M 16 28 C 22 22 42 22 48 28" />
          <rect x="22" y="38" width="20" height="8" rx="2" />
        </svg>
      ),
    },
    {
      id: '04',
      title: 'Ophthalmic',
      slug: 'ophthalmic',
      description: 'Complete Ophthalmic Instrument Range',
      svgIcon: (
        <svg viewBox="0 0 64 64" fill="none" stroke="#0B1B3D" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
          <path d="M 10 32 C 18 20 46 20 54 32 C 46 44 18 44 10 32 Z" />
          <circle cx="32" cy="32" r="8" fill="#0B1B3D" fillOpacity="0.2" />
          <circle cx="32" cy="32" r="4" fill="#0B1B3D" />
          <path d="M 40 40 L 50 50" strokeWidth="4" />
        </svg>
      ),
    },
    {
      id: '05',
      title: 'Hospital Furniture',
      slug: 'hospital-furniture',
      description: 'Functional Solutions For Hospitals',
      imageIcon: '/images/icon-hospital-furniture.png',
    },
    {
      id: '06',
      title: 'Single Use Instruments',
      slug: 'single-use-instruments',
      description: 'Reliable Single-Use Solutions',
      svgIcon: (
        <svg viewBox="0 0 64 64" fill="none" stroke="#0B1B3D" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
          <circle cx="32" cy="32" r="18" strokeWidth="3" />
          <text x="26" y="40" fontSize="22" fontWeight="900" fill="#0B1B3D" stroke="none">2</text>
          <line x1="16" y1="48" x2="48" y2="16" stroke="#E31B23" strokeWidth="4" />
        </svg>
      ),
    },
  ]

  return (
    <section className="w-full bg-[#F8FAFC] py-8 sm:py-10 relative overflow-hidden border-b border-slate-200">
      {/* Background Vector Dot Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0B1B3D_1.5px,transparent_1.5px)] [background-size:20px_20px]" />

      <div className="max-w-7xl 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 sm:space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-1">
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-[#0B1B3D] tracking-tight leading-tight">
            Comprehensive Surgical & Medical Instrument Solutions
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed">
            High-Quality Instruments Designed For Precision, Performance And Patient Safety.
          </p>
        </div>

        {/* 6 Cards Grid (3 Columns x 2 Rows) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {solutions.map((item) => (
            <Link
              key={item.id}
              href={`/category/${item.slug}`}
              className="group bg-white rounded-2xl p-5 shadow-xs hover:shadow-xl border border-slate-100 hover:border-red-500/30 transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              {/* Top Circular Icon */}
              <div className="w-12 h-12 rounded-full bg-slate-100/90 flex items-center justify-center group-hover:bg-red-50 transition-colors shrink-0">
                {item.imageIcon ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={item.imageIcon}
                    alt={item.title}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  item.svgIcon
                )}
              </div>

              {/* Bottom Content: Number | Title & Description */}
              <div className="flex items-center gap-3 pt-1">
                {/* Number */}
                <span className="text-xl sm:text-2xl font-black text-[#0B1B3D] shrink-0 font-mono">
                  {item.id}
                </span>

                {/* Vertical Divider */}
                <div className="w-[1.5px] h-8 bg-slate-200 shrink-0" />

                {/* Title & Subtitle */}
                <div className="space-y-0.5">
                  <h3 className="text-sm sm:text-base font-black text-[#0B1B3D] group-hover:text-[#E31B23] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'

interface ProductsHeroBannerProps {
  categoryTitle?: string
  categoryHighlight?: string
}

export function ProductsHeroBanner({
  categoryTitle = 'GENERAL',
  categoryHighlight = 'SURGERY',
}: ProductsHeroBannerProps) {
  const subCategories = [
    {
      id: 'scissors-shears',
      title: 'Scissors & Shears',
      icon: '/images/cat-scissors-shears.png',
      query: 'scissors',
    },
    {
      id: 'retractors',
      title: 'Retractors',
      icon: '/images/cat-retractors.png',
      query: 'retractors',
    },
    {
      id: 'forceps-clamps',
      title: 'Forceps & Clamps',
      icon: '/images/cat-forceps-clamps.png',
      query: 'forceps',
    },
    {
      id: 'handles-blades',
      title: 'Handles & Blades',
      icon: '/images/cat-handles-blades.png',
      query: 'scalpel',
    },
  ]

  return (
    <div className="w-full relative bg-white pb-12 sm:pb-16">
      {/* Top Banner Box matching SS 1 */}
      <section className="w-full relative bg-white overflow-hidden border-b border-slate-200">
        <div className="max-w-[1680px] mx-auto min-h-[340px] sm:min-h-[380px] lg:min-h-[420px] relative flex items-center">
          
          {/* Right Side Surgical Gloves Hero Image */}
          <div
            className="absolute inset-0 bg-right bg-cover bg-no-repeat z-0"
            style={{ backgroundImage: `url('/images/products-hero-banner.png')` }}
          />

          {/* White Fade Gradient Overlay from Left to Right */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 sm:via-white/85 via-50% to-transparent z-10" />

          {/* Text Content Overlay */}
          <div className="relative z-20 max-w-[1680px] mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-14 w-full">
            <div className="max-w-2xl space-y-3.5 sm:space-y-4">
              
              {/* Pill Badge matching SS 1 */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F1F5F9] border border-slate-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#E31B23]" />
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-800">
                  OUR PRODUCT CATEGORIES
                </span>
              </div>

              {/* Main Title matching SS 1 */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0B1B3D] tracking-tight leading-[1.1] uppercase">
                {categoryTitle} <br />
                <span className="text-[#E31B23]">{categoryHighlight}</span>
              </h1>

              {/* Subtitle Description */}
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-xl">
                Durable Hospital Supplies Is A Trusted Manufacturer And Exporter Of Premium Surgical Instruments, Serving Healthcare Professionals, Distributors, And OEM Brands In More Than 15 Countries.
              </p>

            </div>
          </div>

        </div>
      </section>

      {/* Floating Sub-Category Quick-Filter Pill Bar matching SS 1 */}
      <div className="max-w-6xl 2xl:max-w-[1680px] mx-auto px-4 relative z-30 -mt-12 sm:-mt-14">
        <div className="bg-white rounded-3xl p-3.5 sm:p-5 shadow-2xl border border-slate-200/90 grid grid-cols-2 md:grid-cols-4 items-center gap-3 sm:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-200/80">
          {subCategories.map((subCat) => (
            <Link
              key={subCat.id}
              href={`/products?search=${subCat.query}`}
              className="group flex items-center gap-3 px-2 sm:px-4 py-2 hover:opacity-90 transition-all justify-center text-center sm:text-left"
            >
              {/* Circle Sub-Category Image Icon */}
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border border-slate-200/90 bg-slate-50 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={subCat.icon}
                  alt={subCat.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Label Title */}
              <span className="text-xs sm:text-sm font-extrabold text-[#0B1B3D] group-hover:text-[#E31B23] transition-colors leading-tight">
                {subCat.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

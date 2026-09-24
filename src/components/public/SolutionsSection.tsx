'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const DEFAULT_SOLUTIONS = [
  {
    id: '01',
    title: 'General Surgery',
    slug: 'general-surgery',
    description: 'Precision Instruments For All Surgical Discipline',
    image_url: '/images/cat-scissors-shears.png',
  },
  {
    id: '02',
    title: 'Dental',
    slug: 'dental',
    description: 'Complete Dental Solutions For Every Specialty',
    image_url: '/images/cat-retractors.png',
  },
  {
    id: '03',
    title: 'Medical Hollowware',
    slug: 'medical-hollowware',
    description: 'Instrument Storage & Sterilization Solutions',
    image_url: '/images/cat-handles-blades.png',
  },
  {
    id: '04',
    title: 'Ophthalmic',
    slug: 'ophthalmic',
    description: 'Complete Ophthalmic Instrument Range',
    image_url: '/images/cat-scissors-shears.png',
  },
  {
    id: '05',
    title: 'Hospital Furniture',
    slug: 'hospital-furniture',
    description: 'Functional Solutions For Hospitals',
    image_url: '/images/cat-retractors.png',
  },
  {
    id: '06',
    title: 'Single Use Instruments',
    slug: 'single-use-instruments',
    description: 'Reliable Single-Use Solutions',
    image_url: '/images/cat-handles-blades.png',
  },
]

export function SolutionsSection() {
  const [solutions, setSolutions] = useState(DEFAULT_SOLUTIONS)

  const loadSolutions = () => {
    try {
      const saved = localStorage.getItem('durable_solutions_data')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mapped = parsed.map((item: any, idx: number) => ({
            id: item.count || String(idx + 1).padStart(2, '0'),
            title: item.title,
            slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: item.description,
            image_url: item.image_url || item.imageIcon || '/images/cat-scissors-shears.png',
          }))
          setSolutions(mapped)
        }
      }
    } catch (e) {
      console.error('LocalStorage solutions read error:', e)
    }
  }

  useEffect(() => {
    loadSolutions()
    const handleUpdate = () => loadSolutions()
    window.addEventListener('durable_content_updated', handleUpdate)
    return () => window.removeEventListener('durable_content_updated', handleUpdate)
  }, [])

  return (
    <section className="w-full bg-[#F8FAFC] py-8 sm:py-10 relative overflow-hidden border-b border-slate-200">
      {/* Background Vector Dot Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0B1B3D_1.5px,transparent_1.5px)] [background-size:20px_20px]" />

      <div className="max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 sm:space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-1">
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-[#0B1B3D] tracking-tight leading-tight">
            Comprehensive Surgical & Medical Instrument Solutions
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed">
            High-Quality Instruments Designed For Precision, Performance And Patient Safety.
          </p>
        </div>

        {/* 6 Cards Grid (3 Columns / 6 Columns on Ultra-wide) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-6 gap-4 sm:gap-5">
          {solutions.map((item) => (
            <Link
              key={item.id}
              href={`/category/${item.slug}`}
              className="group bg-white rounded-2xl p-5 shadow-xs hover:shadow-xl border border-slate-100 hover:border-red-500/30 transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              {/* Top Circular Icon / Image */}
              <div className="w-12 h-12 rounded-full bg-slate-100/90 flex items-center justify-center group-hover:bg-red-50 transition-colors shrink-0 overflow-hidden p-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
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


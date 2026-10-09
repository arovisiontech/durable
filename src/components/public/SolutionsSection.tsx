'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchPublicCategories } from '@/app/actions/public'

interface CategoryCard {
  id: string
  title: string
  slug: string
  description: string
  image_url: string
}

const DEFAULT_SOLUTIONS: CategoryCard[] = [
  {
    id: '01',
    title: 'General Surgery',
    slug: 'general-surgery',
    description: 'High-precision surgical scissors, forceps, scalpels, and retractors.',
    image_url: '/images/cat-scissors-shears.png',
  },
  {
    id: '02',
    title: 'Dental Instruments',
    slug: 'dental',
    description: 'Precision dental scalpels, probes, forceps, and restorative tools.',
    image_url: '/images/cat-retractors.png',
  },
  {
    id: '03',
    title: 'Medical Hollowware',
    slug: 'medical-hollowware',
    description: 'Otoscopes, ophthalmoscopes, reflex hammers, and diagnostic sets.',
    image_url: '/images/cat-handles-blades.png',
  },
  {
    id: '04',
    title: 'Ophthalmic',
    slug: 'ophthalmic',
    description: 'Bone holding forceps, rongeurs, bone chisels, and implant tools.',
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
  {
    id: '07',
    title: 'Veterinary Instruments',
    slug: 'veterinary-instruments',
    description: 'Efficiency in veterinary procedures and animal healthcare.',
    image_url: '/images/cat-scissors-shears.png',
  },
  {
    id: '08',
    title: 'Plastic Surgery',
    slug: 'plastic-surgery',
    description: 'Reliable performance in delicate plastic and reconstructive procedures.',
    image_url: '/images/cat-retractors.png',
  },
  {
    id: '09',
    title: 'Special Surgical Instruments',
    slug: 'special-surgical-instruments',
    description: 'Specialized, precision-engineered instruments designed for demanding surgical procedures, offering excellent control, accuracy.',
    image_url: '/images/cat-handles-blades.png',
  },
]

export function SolutionsSection() {
  const [solutions, setSolutions] = useState<CategoryCard[]>(DEFAULT_SOLUTIONS)

  const loadSolutions = async () => {
    try {
      const cats = await fetchPublicCategories()
      if (cats && cats.length > 0) {
        const mapped: CategoryCard[] = cats.map((item, idx) => ({
          id: String(idx + 1).padStart(2, '0'),
          title: item.name,
          slug: item.slug,
          description: item.description || 'Precision instruments designed for medical excellence.',
          image_url: item.image_url || '/images/cat-scissors-shears.png',
        }))
        setSolutions(mapped)
      }
    } catch (e) {
      console.error('Error fetching solutions categories:', e)
    }
  }

  useEffect(() => {
    loadSolutions()
    const handleUpdate = () => loadSolutions()
    window.addEventListener('durable_content_updated', handleUpdate)
    return () => window.removeEventListener('durable_content_updated', handleUpdate)
  }, [])

  return (
    <section className="w-full bg-[#F8FAFC] py-6 sm:py-8 relative overflow-hidden border-b border-slate-200">
      {/* Background Vector Dot Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0B1B3D_1.5px,transparent_1.5px)] [background-size:20px_20px]" />

      <div className="max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 sm:space-y-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-0.5">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0B1B3D] tracking-tight leading-tight">
            Comprehensive Surgical & Medical Instrument Solutions
          </h2>
          <p className="text-xs sm:text-xs font-semibold text-slate-500 leading-relaxed">
            High-Quality Instruments Designed For Precision, Performance And Patient Safety.
          </p>
        </div>

        {/* Dynamic Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {solutions.map((item) => (
            <Link
              key={item.slug}
              href={`/category/${item.slug}`}
              className="group bg-white rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-xl border border-slate-200/90 hover:border-[#E31B23]/50 transition-all duration-300 flex items-center gap-4 sm:gap-5"
            >
              {/* Prominent Large Icon Box */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-100/90 group-hover:bg-red-50 text-[#0B1B3D] transition-colors shrink-0 flex items-center justify-center p-3 border border-slate-200/70 shadow-2xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Number + Title & Description */}
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black text-[#E31B23] bg-red-50 px-2 py-0.5 rounded-md border border-red-100 shrink-0">
                    {item.id}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-[#0B1B3D] group-hover:text-[#E31B23] transition-colors leading-snug truncate">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-snug line-clamp-2">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'
import { fetchPublicCategories } from '@/app/actions/public'

interface CategoryCardItem {
  id: string
  number: string
  title: string
  description: string
  sku_count: string
  slug: string
}

const DEFAULT_MAIN_PRODUCT_CATEGORIES: CategoryCardItem[] = [
  {
    id: 'pr-1',
    number: '01',
    title: 'General Surgery',
    description: 'General surgical tools including scissors, forceps, retractors, scalpel handles, and clamps.',
    sku_count: '6+ SKUs',
    slug: 'general-surgery',
  },
  {
    id: 'pr-2',
    number: '02',
    title: 'Dental & Restorative',
    description: 'Ergonomic restorative, periodontal, extraction, and orthodontic dental instruments.',
    sku_count: '4+ SKUs',
    slug: 'dental',
  },
  {
    id: 'pr-3',
    number: '03',
    title: 'Medical Hollowware',
    description: 'Storage trays, kidney basins, gallipots, sterilization boxes, and autoclave bowls.',
    sku_count: '4+ SKUs',
    slug: 'medical-hollowware',
  },
  {
    id: 'pr-4',
    number: '04',
    title: 'Bone & Orthopedic Instruments',
    description: 'Bone chisels, osteotomes, mallets, rongeurs, gouges, and bone holding forceps.',
    sku_count: '3+ SKUs',
    slug: 'orthopedic-instruments',
  },
  {
    id: 'pr-5',
    number: '05',
    title: 'Ophthalmic Micro-Surgery',
    description: 'Micro-forceps, eye speculums, corneal scissors, and micro cassettes.',
    sku_count: '2+ SKUs',
    slug: 'ophthalmic',
  },
  {
    id: 'pr-6',
    number: '06',
    title: 'Hospital Furniture & Single Use',
    description: 'Hospital beds, MAYO instrument trolleys, IV poles, and sterile single use procedure kits.',
    sku_count: '2+ SKUs',
    slug: 'hospital-furniture',
  },
]

export function ExploreProductCategoriesSection() {
  const [categories, setCategories] = useState<CategoryCardItem[]>(DEFAULT_MAIN_PRODUCT_CATEGORIES)

  const loadData = async () => {
    try {
      const cats = await fetchPublicCategories()
      if (cats && cats.length > 0) {
        const mapped: CategoryCardItem[] = cats.map((item, idx) => ({
          id: item.id,
          number: String(idx + 1).padStart(2, '0'),
          title: item.name,
          description: item.description || 'Quality surgical and medical instruments.',
          sku_count: `${item.product_count || 5}+ SKUs`,
          slug: item.slug,
        }))
        setCategories(mapped)
      }
    } catch (e) {
      console.error('Error fetching explore categories:', e)
    }
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('durable_content_updated', handleUpdate)
    return () => window.removeEventListener('durable_content_updated', handleUpdate)
  }, [])

  return (
    <section className="w-full bg-slate-50/50 py-12 sm:py-16 lg:py-20 border-b border-slate-200 relative overflow-hidden">
      {/* CSS Keyframes for 4-Side Light Beam */}
      <style>{`
        @keyframes prodLightSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-prod-light {
          animation: prodLightSpin 4.5s linear infinite;
        }
      `}</style>

      <div className="max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 sm:space-y-12">
        {/* Top Centered Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#E31B23] animate-ping" />
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E31B23]" />
              EXPLORE OUR PRODUCT RANGE
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1B3D] tracking-tight uppercase leading-tight">
            EXPLORE <span className="text-[#E31B23]">PRODUCT CATEGORIES</span>
          </h2>

          {/* Centered Red Accent Line */}
          <div className="w-16 h-[3px] bg-[#E31B23] rounded-full mx-auto my-2.5" />

          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Discover our comprehensive classifications of surgical, dental, orthopedic, hollowware, and hospital supply instruments.
          </p>
        </div>

        {/* Dynamic Product Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {categories.map((cat, idx) => (
            <Link
              key={cat.slug || idx}
              href={`/category/${cat.slug}`}
              className="group relative block rounded-2xl"
            >
              {/* 4-Side Glow Backdrop Aura Shadow */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#E31B23]/30 via-[#3B82F6]/30 to-[#E31B23]/30 rounded-2xl blur-lg opacity-40 group-hover:opacity-100 transition-opacity duration-500" />

              {/* 4-Side Animated Light Beam Border Wrapper */}
              <div className="relative p-[2px] rounded-2xl overflow-hidden bg-slate-200 group-hover:shadow-xl transition-all duration-500">
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

                  {/* Red Link & SKU Count at Bottom */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#E31B23] tracking-wide inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>EXPLORE CATEGORY</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>

                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                      {cat.sku_count}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Product Categories Button */}
        <div className="text-center pt-4">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-7 py-3 text-xs font-black text-white bg-[#0B1B3D] hover:bg-[#E31B23] rounded-2xl shadow-lg transition-all transform hover:scale-105"
          >
            <span>VIEW ALL PRODUCT CATEGORIES</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

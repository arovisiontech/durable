'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'
import { getStoredCategories, INITIAL_CATEGORIES_SEED } from '@/src/lib/dataStore'

export function ExploreProductCategoriesSection() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES_SEED)

  const loadData = () => {
    try {
      const stored = getStoredCategories()
      if (stored && stored.length > 0) {
        setCategories(stored)
      }
    } catch (e) {
      console.error(e)
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
      {/* CSS Keyframes for 4-Side Light Motion Beam */}
      <style>{`
        @keyframes prodLightSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-prod-light {
          animation: prodLightSpin 6s linear infinite;
        }
      `}</style>

      <div className="max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E31B23]" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-800">
              EXPLORE OUR PRODUCT RANGE
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0B1B3D] tracking-tight leading-tight">
            Explore Product Categories
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Discover our comprehensive classifications of surgical, dental, orthopedic, hollowware, and hospital supply instruments.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.slice(0, 6).map((cat, idx) => (
            <div
              key={cat.id || idx}
              className="group relative rounded-3xl p-0.5 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl overflow-hidden bg-[#0B1B3D]/5"
            >
              {/* 4-Side Spinning Border Glow Light */}
              <div className="absolute -inset-[150%] animate-prod-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[conic-gradient(from_0deg,transparent_0_300deg,#E31B23_360deg)] pointer-events-none" />

              <div className="relative w-full h-full bg-white rounded-[23px] p-6 sm:p-7 flex flex-col justify-between space-y-6 z-10 border border-slate-200/80">
                <div className="space-y-4">
                  {/* Top Row: Category Number & Image Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-slate-300 group-hover:text-[#E31B23] transition-colors">
                      0{idx + 1}
                    </span>

                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 p-2 overflow-hidden flex items-center justify-center group-hover:border-red-300 transition-colors">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cat.image_url || '/images/cat-scissors-shears.png'}
                        alt={cat.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-[#0B1B3D] tracking-tight group-hover:text-[#E31B23] transition-colors">
                      {cat.name}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                      {cat.description || 'Explore precision surgical instruments crafted to international standards.'}
                    </p>
                  </div>
                </div>

                {/* Bottom CTA Link */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/category/${cat.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-black text-[#0B1B3D] group-hover:text-[#E31B23] transition-colors"
                  >
                    <span>EXPLORE CATEGORY</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    {cat.product_count || 5}+ SKUs
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Categories Button */}
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

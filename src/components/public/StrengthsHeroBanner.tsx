'use client'

import { useState, useEffect } from 'react'

interface HeroBannerData {
  badge: string
  title: string
  subtitle?: string
  bgImage: string
}

const DEFAULT_HERO: HeroBannerData = {
  badge: 'OUR STRENGTHS',
  title: 'Our Strengths',
  subtitle: 'PRECISION IN EVERY INSTRUMENT. TRUST IN EVERY DETAIL.',
  bgImage: '/images/about-hero-banner.png',
}

export function StrengthsHeroBanner() {
  const [heroData, setHeroData] = useState<HeroBannerData>(DEFAULT_HERO)

  const loadData = () => {
    try {
      const saved = localStorage.getItem('durable_strengths_data')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed?.hero) {
          setHeroData((prev) => ({ ...prev, ...parsed.hero }))
        }
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
    <section className="w-full relative bg-[#090D16] overflow-hidden border-b border-slate-800">
      {/* Background Banner Container - Responsive across all screens */}
      <div className="w-full max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] xl:min-h-[480px] relative flex items-center justify-center text-center">
        
        {/* Background Image Layer */}
        <div 
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-0 opacity-40 mix-blend-luminosity"
          style={{ backgroundImage: `url('${heroData.bgImage || '/images/about-hero-banner.png'}')` }}
        />

        {/* Gradient Overlay for Sleek Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-[#090D16]/60 to-transparent z-10" />

        {/* Content Overlay */}
        <div className="relative z-20 max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-20 w-full flex flex-col items-center">
          <div className="max-w-4xl space-y-4 text-center">
            
            {/* Pill Badge */}
            {heroData.badge && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#E31B23] animate-pulse" />
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-white">
                  {heroData.badge}
                </span>
              </div>
            )}

            {/* Main Title matching SS 1 */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] uppercase drop-shadow-md">
              {heroData.title}
            </h1>

            {heroData.subtitle && (
              <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-300 uppercase max-w-2xl mx-auto pt-1">
                {heroData.subtitle}
              </p>
            )}

          </div>
        </div>

      </div>
    </section>
  )
}

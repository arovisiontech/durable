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
  title: 'OUR STRENGTHS',
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
    <section className="w-full relative bg-white overflow-hidden border-b border-slate-200">
      {/* Background Banner Container matching SS 2 */}
      <div className="w-full max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto min-h-[360px] sm:min-h-[420px] lg:min-h-[480px] xl:min-h-[540px] relative flex items-center">
        
        {/* Right Side Background Image */}
        <div 
          className="absolute inset-0 bg-right bg-cover bg-no-repeat z-0"
          style={{ backgroundImage: `url('${heroData.bgImage || '/images/about-hero-banner.png'}')` }}
        />

        {/* White Fade Gradient Overlay from Left to Right */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 sm:via-white/85 via-50% to-transparent z-10" />

        {/* Text Content Overlay matching SS 2 */}
        <div className="relative z-20 max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-16 w-full">
          <div className="max-w-3xl space-y-4">
            
            {/* Pill Badge */}
            {heroData.badge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F1F5F9] border border-slate-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#E31B23]" />
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-800">
                  {heroData.badge}
                </span>
              </div>
            )}

            {/* Main Title matching SS 2 */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0B1B3D] tracking-tight leading-[1.12] uppercase">
              {heroData.title}
            </h1>

            {heroData.subtitle && (
              <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-600 uppercase max-w-2xl pt-1">
                {heroData.subtitle}
              </p>
            )}

          </div>
        </div>

      </div>
    </section>
  )
}

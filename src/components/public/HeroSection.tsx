'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react'

export interface HeroSlideItem {
  id: string
  image_url?: string | null
  title?: string | null
  button_text?: string | null
  button_link?: string | null
  secondary_button_text?: string | null
  secondary_button_link?: string | null
}

interface HeroSectionProps {
  slides?: HeroSlideItem[]
  heroBgImage?: string
}

const defaultSlides: HeroSlideItem[] = [
  { id: '1', image_url: '/images/surgical-hero.png' },
  { id: '2', image_url: '/images/dental-clinic-banner.png' },
  { id: '3', image_url: '/images/precision-healthcare-banner.png' },
  { id: '4', image_url: '/images/products-hero-banner.png' },
]

export function HeroSection({ slides, heroBgImage }: HeroSectionProps) {
  // Filter valid slides with non-empty image_url
  const validSlides = slides && slides.length > 0 
    ? slides.filter((s) => s.image_url && s.image_url.trim() !== '')
    : defaultSlides

  const activeSlides = validSlides.length > 0 ? validSlides : defaultSlides
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto switch slides if more than 1
  useEffect(() => {
    if (activeSlides.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [activeSlides.length])

  const currentSlide = activeSlides[currentIndex] || activeSlides[0]
  const displayImage = heroBgImage || currentSlide.image_url || '/images/surgical-hero.png'

  return (
    <section className="w-full bg-[#F8FAFC] overflow-hidden">
      {/* Hero Banner Container - Full 24", 29", 60" LCD Monitor Responsive */}
      <div className="w-full max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4">
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-white group">
          
          {/* Main Artwork Banner Image - Fits 100% on Laptop and LCD screens without cropping */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayImage}
            alt="Every 5 Seconds We Make a Difference - Durable Hospital Supplies"
            className="w-full h-auto object-contain block"
          />

          {/* Interactive CTA Buttons Overlay (Positioned on Left) */}
          <div className="absolute left-[3%] bottom-[5%] sm:bottom-[8%] flex flex-wrap items-center gap-2 sm:gap-4 z-20">
            <Link
              href={currentSlide.button_link || '/contact'}
              className="px-3 sm:px-6 lg:px-8 py-2 sm:py-3.5 text-[10px] sm:text-xs lg:text-sm font-black text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-full shadow-lg shadow-red-600/30 transition-all transform hover:scale-105 flex items-center gap-1.5 sm:gap-2 uppercase tracking-wider"
            >
              <span>{currentSlide.button_text || 'Partner With Us'}</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>

            <Link
              href={currentSlide.secondary_button_link || '/products'}
              className="px-3 sm:px-6 lg:px-8 py-2 sm:py-3.5 text-[10px] sm:text-xs lg:text-sm font-black text-[#E31B23] bg-white border-2 border-[#E31B23] hover:bg-red-50 rounded-full transition-all transform hover:scale-105 flex items-center gap-1.5 sm:gap-2 shadow-xs uppercase tracking-wider"
            >
              <span>{currentSlide.secondary_button_text || 'Explore Products'}</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </div>

          {/* Navigation Arrows (Only shown when multi-slides are active) */}
          {activeSlides.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-slate-900/40 hover:bg-slate-900 text-white backdrop-blur-xs transition-opacity opacity-0 group-hover:opacity-100"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev + 1) % activeSlides.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-slate-900/40 hover:bg-slate-900 text-white backdrop-blur-xs transition-opacity opacity-0 group-hover:opacity-100"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Navigation Dots */}
              <div className="absolute right-[3%] bottom-[5%] sm:bottom-[8%] z-30 flex items-center gap-1.5 bg-slate-900/40 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20">
                {activeSlides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === currentIndex ? 'w-5 bg-[#E31B23]' : 'w-2 bg-white/70 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

        </div>
      </div>

      {/* Bottom Trust Feature Bar */}
      <div className="w-full bg-[#051026] text-white py-3.5 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
          {/* Left Badge */}
          <div className="flex items-center gap-2 text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] sm:text-xs">Partner with a Trusted Surgical Manufacturer</span>
            <span className="hidden md:inline text-slate-600 font-normal">|</span>
          </div>

          {/* Right Features List */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-5 text-slate-300 text-[10px] sm:text-[11px] font-semibold">
            <span>OEM Manufacturing</span>
            <span className="text-[#E31B23] font-bold">•</span>
            <span>Private Label</span>
            <span className="text-[#E31B23] font-bold">•</span>
            <span>Sterile Procedure Packs</span>
            <span className="text-[#E31B23] font-bold">•</span>
            <span>Global Distribution</span>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

export interface HeroSlideItem {
  id: string
  image_url?: string | null
  title?: string | null
  subtitle?: string | null
  description?: string | null
  button_text?: string | null
  button_link?: string | null
  secondary_button_text?: string | null
  secondary_button_link?: string | null
}

interface HeroSectionProps {
  slides?: HeroSlideItem[]
  autoPlayInterval?: number
}

const defaultHeroSlides: HeroSlideItem[] = [
  {
    id: 'default-1',
    image_url: '/images/surgical-hero.png',
    title: 'EVERY 5 SECONDS, WE MAKE A DIFFERENCE',
    subtitle: 'SINCE 1973 • PRECISION SURGICAL MANUFACTURING',
    description: 'Durable Hospital Supplies is a trusted global partner for healthcare brands seeking reliable, high-quality surgical manufacturing solutions.',
    button_text: 'Partner With Us',
    button_link: '/contact',
    secondary_button_text: 'Explore Products',
    secondary_button_link: '/products',
  },
  {
    id: 'default-2',
    image_url: '/images/dental-clinic-banner.png',
    title: 'WORLD-CLASS DENTAL & SURGICAL INSTRUMENTS',
    subtitle: 'ISO 13485 CERTIFIED • DENTAL & SURGICAL EXCELLENCE',
    description: 'Engineered for precision surgeons and dental professionals worldwide.',
    button_text: 'Dental Catalogues',
    button_link: '/catalogues',
    secondary_button_text: 'Contact Sales',
    secondary_button_link: '/contact',
  },
  {
    id: 'default-3',
    image_url: '/images/precision-healthcare-banner.png',
    title: 'PRECISION SOLUTIONS. TRUSTED QUALITY. BETTER HEALTHCARE.',
    subtitle: 'GLOBAL OEM & PRIVATE LABEL SURGICAL SOLUTIONS',
    description: 'Custom surgical instrument manufacturing for global healthcare brands.',
    button_text: 'OEM Services',
    button_link: '/partner-with-us',
    secondary_button_text: 'Our Quality',
    secondary_button_link: '/quality',
  },
  {
    id: 'default-4',
    image_url: '/images/products-hero-banner.png',
    title: 'COMPREHENSIVE SURGICAL INSTRUMENTATION',
    subtitle: '10,000+ PRECISION SKUS MANUFACTURED IN SIALKOT',
    description: 'Explore full range technical instrument catalogues featuring sizing dimensions and SKUs.',
    button_text: 'Explore Products',
    button_link: '/products',
    secondary_button_text: 'Download PDF',
    secondary_button_link: '/catalogues',
  },
]

export function HeroSection({ slides, autoPlayInterval = 5000 }: HeroSectionProps) {
  const activeSlides = slides && slides.length > 0 ? slides : defaultHeroSlides
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length)
  }, [activeSlides.length])

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)
  }, [activeSlides.length])

  useEffect(() => {
    if (!isPlaying || activeSlides.length <= 1) return

    const timer = setInterval(() => {
      handleNext()
    }, autoPlayInterval)

    return () => clearInterval(timer)
  }, [isPlaying, activeSlides.length, autoPlayInterval, handleNext])

  const currentSlide = activeSlides[currentIndex] || activeSlides[0]

  return (
    <section className="w-full bg-[#F8FAFC] overflow-hidden">
      {/* Hero Banner Container - Full 24", 29", 60" LCD Monitor Responsive */}
      <div className="w-full max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4">
        <div 
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-950 group"
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
        >
          {/* Main Artwork Banner Image Container */}
          <div className="relative w-full min-h-[220px] sm:min-h-[380px] md:min-h-[480px] lg:min-h-[580px] overflow-hidden">
            {activeSlides.map((slide, idx) => (
              <div
                key={slide.id || idx}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  idx === currentIndex ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image_url || '/images/surgical-hero.png'}
                  alt={slide.title || 'Durable Hospital Supplies Hero Banner'}
                  className="w-full h-full object-cover object-center block"
                />
              </div>
            ))}
          </div>

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

          {/* Navigation Controls (Left / Right Arrows) */}
          {activeSlides.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 transform hover:scale-110"
                aria-label="Previous Hero Image"
              >
                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 transform hover:scale-110"
                aria-label="Next Hero Image"
              >
                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          {/* Slide Indicator Dots Bar & Play/Pause */}
          {activeSlides.length > 1 && (
            <div className="absolute right-[3%] bottom-[5%] sm:bottom-[8%] z-30 flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-slate-300 hover:text-white transition p-0.5"
                title={isPlaying ? 'Pause Auto Play' : 'Play Auto Play'}
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>

              <div className="h-3 w-[1px] bg-slate-700 mx-0.5" />

              <div className="flex items-center gap-1.5">
                {activeSlides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === currentIndex ? 'w-6 bg-[#E31B23]' : 'w-2 bg-slate-400 hover:bg-slate-200'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
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

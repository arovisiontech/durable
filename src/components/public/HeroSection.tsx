'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react'
import { getAdminHeroSlides } from '@/app/admin/actions/home'

export interface HeroSlide {
  id: string
  title: string
  subtitle?: string | null
  description?: string | null
  image_url: string
  button_text?: string | null
  button_link?: string | null
  secondary_button_text?: string | null
  secondary_button_link?: string | null
}

const DEFAULT_HERO_IMAGE = '/images/surgical-hero.png'

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    title: 'EVERY 5 SECONDS, WE MAKE A DIFFERENCE',
    subtitle: 'SINCE 1973 • PRECISION SURGICAL MANUFACTURING',
    description: 'Durable Hospital Supplies is a trusted global partner for healthcare brands seeking reliable, high-quality surgical manufacturing solutions.',
    image_url: DEFAULT_HERO_IMAGE,
    button_text: 'Partner With Us',
    button_link: '/contact',
    secondary_button_text: 'Explore Products',
    secondary_button_link: '/products',
  },
]

export function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_SLIDES)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // 1. Client-side localStorage sync fallback
    try {
      const saved = localStorage.getItem('durable_hero_slides')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSlides(parsed)
        }
      }
    } catch (e) {
      console.error('LocalStorage hero read error:', e)
    }

    // 2. Database Supabase Sync
    getAdminHeroSlides().then((dbSlides) => {
      if (dbSlides && dbSlides.length > 0) {
        const mapped: HeroSlide[] = dbSlides
          .filter((s: any) => s.is_published !== false)
          .map((item: any) => ({
            id: item.id,
            title: item.title,
            subtitle: item.subtitle,
            description: item.description,
            image_url: item.image_url || DEFAULT_HERO_IMAGE,
            button_text: item.button_text || 'Partner With Us',
            button_link: item.button_link || '/contact',
            secondary_button_text: item.secondary_button_text || 'Explore Products',
            secondary_button_link: item.secondary_button_link || '/products',
          }))
        if (mapped.length > 0) {
          setSlides(mapped)
        }
      }
    })
  }, [])

  // Auto-play slide carousel timer (6 seconds per slide)
  useEffect(() => {
    if (slides.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [slides.length])

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  const currentSlide = slides[currentIndex] || slides[0] || DEFAULT_SLIDES[0]

  // Active image URL with automatic fallback to default hero banner if image fails
  const activeImage = failedImages[currentSlide.id]
    ? DEFAULT_HERO_IMAGE
    : currentSlide.image_url || DEFAULT_HERO_IMAGE

  return (
    <section className="w-full bg-[#F8FAFC] overflow-hidden">
      {/* Hero Banner Container - Full 24", 29", 60" LCD Monitor Responsive */}
      <div className="w-full max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4">
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-white group min-h-[220px] sm:min-h-[380px] lg:min-h-[500px] flex items-center justify-center">
          
          {/* Main Artwork Banner Image - Dynamic Uploaded URL with Fallback */}
          <div key={currentSlide.id || currentIndex} className="relative w-full h-full transition-all duration-500 animate-in fade-in flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage}
              alt={currentSlide.title || 'Durable Hospital Supplies Hero Banner'}
              onError={() => {
                setFailedImages((prev) => ({ ...prev, [currentSlide.id]: true }))
              }}
              className="w-full h-auto object-contain block max-h-[85vh] mx-auto"
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
          </div>

          {/* Navigation Arrows for Multi-Slide Carousels */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-950/60 hover:bg-[#E31B23] text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-30 shadow-md"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-950/60 hover:bg-[#E31B23] text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-30 shadow-md"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Indicator Dots */}
              <div className="absolute right-4 bottom-3 sm:bottom-4 flex items-center gap-1.5 z-30 bg-slate-950/40 backdrop-blur-xs px-3 py-1.5 rounded-full">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentIndex ? 'w-6 bg-[#E31B23]' : 'w-2 bg-white/70 hover:bg-white'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
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


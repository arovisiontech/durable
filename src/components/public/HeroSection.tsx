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
    button_text: 'EXPLORE PRODUCTS',
    button_link: '/products',
    secondary_button_text: 'DOWNLOAD CATALOGUE',
    secondary_button_link: '/pdf/general-surgical-instruments-catalogue.pdf',
  },
  {
    id: 'slide-2',
    title: 'WORLD-CLASS DENTAL & SURGICAL INSTRUMENTS',
    subtitle: 'ISO 13485 CERTIFIED • DENTAL & SURGICAL EXCELLENCE',
    description: 'Engineered for precision surgeons and dental professionals worldwide.',
    image_url: '/images/dental-clinic-banner.png',
    button_text: 'EXPLORE PRODUCTS',
    button_link: '/products',
    secondary_button_text: 'DOWNLOAD CATALOGUE',
    secondary_button_link: '/pdf/general-surgical-instruments-catalogue.pdf',
  },
]

export function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_SLIDES)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})

  const loadHeroSlides = () => {
    // 1. LocalStorage Sync
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
            button_text: item.button_text || 'EXPLORE PRODUCTS',
            button_link: item.button_link || '/products',
            secondary_button_text: item.secondary_button_text || 'DOWNLOAD CATALOGUE',
            secondary_button_link: item.secondary_button_link || '/pdf/general-surgical-instruments-catalogue.pdf',
          }))
        if (mapped.length > 0) {
          setSlides(mapped)
        }
      }
    })
  }

  useEffect(() => {
    loadHeroSlides()
    const handleUpdate = () => loadHeroSlides()
    window.addEventListener('durable_content_updated', handleUpdate)
    return () => window.removeEventListener('durable_content_updated', handleUpdate)
  }, [])

  // Auto-play slide carousel timer (5 seconds per slide)
  useEffect(() => {
    if (slides.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 5000)
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
      {/* Hero Banner Container - 100% Fluid Width for 24", 29", 36", 64" LCD Monitors */}
      <div className="w-full px-0 sm:px-2 lg:px-4 py-0 sm:py-2">
        <div className="relative w-full rounded-none sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-white group min-h-[240px] sm:min-h-[420px] lg:min-h-[580px] xl:min-h-[680px] 2xl:min-h-[780px] flex items-center justify-center">
          
          {/* Main Artwork Banner Image - Dynamic Uploaded URL with Fallback */}
          <div key={currentSlide.id || currentIndex} className="relative w-full h-full transition-all duration-500 animate-in fade-in flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage}
              alt={currentSlide.title || 'Durable Hospital Supplies Hero Banner'}
              onError={() => {
                setFailedImages((prev) => ({ ...prev, [currentSlide.id]: true }))
              }}
              className="w-full h-auto object-contain block max-h-[90vh] mx-auto min-w-full"
            />

            {/* Interactive CTA Buttons Overlay (Positioned on Left) */}
            <div className="absolute left-[3%] bottom-[5%] sm:bottom-[8%] flex flex-wrap items-center gap-2.5 sm:gap-4 z-20">
              {/* Button 1: EXPLORE PRODUCTS (Red Solid Pill) */}
              <Link
                href={currentSlide.button_link || '/products'}
                className="px-4 sm:px-7 lg:px-9 py-2.5 sm:py-3.5 text-[10px] sm:text-xs lg:text-sm font-black text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-full shadow-lg shadow-red-600/30 transition-all transform hover:scale-105 flex items-center gap-2 uppercase tracking-wider"
              >
                <span>{currentSlide.button_text || 'EXPLORE PRODUCTS'}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>

              {/* Button 2: DOWNLOAD CATALOGUE (Red Outline Pill) */}
              <a
                href={currentSlide.secondary_button_link || '/pdf/general-surgical-instruments-catalogue.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="px-4 sm:px-7 lg:px-9 py-2.5 sm:py-3.5 text-[10px] sm:text-xs lg:text-sm font-black text-[#E31B23] bg-white border-2 border-[#E31B23] hover:bg-red-50 rounded-full transition-all transform hover:scale-105 flex items-center gap-2 shadow-xs uppercase tracking-wider"
              >
                <span>{currentSlide.secondary_button_text || 'DOWNLOAD CATALOGUE'}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Arrows for Multi-Slide Carousels */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-950/70 hover:bg-[#E31B23] text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-30 shadow-xl"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-950/70 hover:bg-[#E31B23] text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-30 shadow-xl"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Indicator Dots */}
              <div className="absolute right-6 bottom-4 sm:bottom-6 flex items-center gap-2 z-30 bg-slate-950/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2.5 rounded-full transition-all ${
                      i === currentIndex ? 'w-8 bg-[#E31B23]' : 'w-2.5 bg-white/70 hover:bg-white'
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


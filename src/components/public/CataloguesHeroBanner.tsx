'use client'

import { useState, useEffect } from 'react'
import { loadPersistentData } from '@/src/lib/persistentStorage'
import { RichText } from '@/src/components/ui/RichText'

const DEFAULT_HERO = {
  badge: 'PRECISION. QUALITY. TRUST',
  titlePrimary: 'ADVANCED MEDICAL',
  titleHighlight: 'PRODUCT SOLUTIONS.',
  description:
    'We Manufacture Premium Surgical & Dental Instruments For OEM, Private Label, And Sterile Kitting, Using High-Grade German & Japanese Stainless Steel To Meet DIN And ISO/ASTM Standards. Available In Reusable, Single-Use, And EO-Sterilized Options.',
  bgImage: '/images/precision-healthcare-banner.png',
}

export function CataloguesHeroBanner() {
  const [hero, setHero] = useState(DEFAULT_HERO)

  useEffect(() => {
    loadPersistentData('durable_catalogues_hero', DEFAULT_HERO, (data: any) => {
      if (data && typeof data === 'object') {
        setHero((prev) => ({ ...prev, ...data }))
      }
    })

    const handleUpdate = () => {
      loadPersistentData('durable_catalogues_hero', DEFAULT_HERO, (data: any) => {
        if (data && typeof data === 'object') {
          setHero((prev) => ({ ...prev, ...data }))
        }
      })
    }

    window.addEventListener('durable_content_updated', handleUpdate)
    return () => window.removeEventListener('durable_content_updated', handleUpdate)
  }, [])

  return (
    <section className="w-full bg-[#F8FAFC] py-10 sm:py-16 lg:py-20 relative overflow-hidden border-b border-slate-200">
      {/* Background Surgical Handoff Photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={hero.bgImage || '/images/precision-healthcare-banner.png'}
        alt={hero.titlePrimary || 'Advanced Medical Product Solutions'}
        className="absolute inset-0 w-full h-full object-cover object-right opacity-90 pointer-events-none"
      />

      {/* Left Crisp White Gradient Fade for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 sm:via-white/90 to-transparent w-full sm:w-3/4 lg:w-3/5 pointer-events-none" />

      {/* Halftone Dotted Matrix Pattern */}
      <div className="absolute left-4 bottom-4 w-36 h-36 opacity-[0.06] pointer-events-none bg-[radial-gradient(#0B1B3D_1.5px,transparent_1.5px)] [background-size:12px_12px]" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-4 max-w-2xl py-2">
          {/* Top Pill Tag Badge */}
          {hero.badge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#E31B23] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-800">
                {hero.badge}
              </span>
            </div>
          )}

          {/* Main Headline */}
          <div className="space-y-0.5">
            {hero.titlePrimary && (
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1B3D] tracking-tight leading-[1.1] uppercase">
                {hero.titlePrimary}
              </h1>
            )}
            {hero.titleHighlight && (
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#E31B23] tracking-tight leading-[1.1] uppercase">
                {hero.titleHighlight}
              </h1>
            )}
          </div>

          {/* Subtitle Paragraph */}
          {hero.description && (
            <div className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed pt-1">
              <RichText content={hero.description} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

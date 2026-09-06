'use client'

import Link from 'next/link'
import { Calendar, MapPin, Sparkles, ArrowRight } from 'lucide-react'

interface EventsHeroBannerProps {
  title: string
  subtitle: string
  categoryBadge: string
}

export function EventsHeroBanner({
  title,
  subtitle,
  categoryBadge,
}: EventsHeroBannerProps) {
  return (
    <section className="w-full bg-[#F8FAFC] overflow-hidden">
      <div className="w-full max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4">
        <div className="relative w-full aspect-[16/6] min-h-[360px] sm:min-h-[460px] lg:min-h-[540px] xl:min-h-[600px] 2xl:min-h-[660px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-[#051026]">
          {/* Background Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/precision-healthcare-banner.png"
            alt={title}
            className="w-full h-full object-cover opacity-35 filter brightness-90 contrast-110"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#051026] via-[#051026]/80 to-transparent" />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-20 max-w-4xl text-white space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E31B23] text-white text-xs font-black uppercase tracking-wider w-fit shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{categoryBadge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight uppercase">
              {title}
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl">
              {subtitle}
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link
                href="/events/upcoming"
                className="px-6 py-3 bg-[#E31B23] hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm rounded-full transition-all shadow-lg flex items-center gap-2 uppercase tracking-wider"
              >
                <span>Upcoming Expos</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/events/recent"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-extrabold text-xs sm:text-sm rounded-full transition-all flex items-center gap-2 uppercase tracking-wider backdrop-blur-xs"
              >
                <span>Recent Expos Archive</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

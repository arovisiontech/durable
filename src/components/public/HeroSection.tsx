'use client'

import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="w-full bg-[#F8FAFC] overflow-hidden">
      {/* Hero Banner Container - Full LCD Monitor Responsive */}
      <div className="w-full max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4">
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-white">
          
          {/* Main Artwork Banner Image - Fits 100% on Laptop and LCD screens without cropping */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/surgical-hero.png"
            alt="Every 5 Seconds We Make a Difference - Durable Hospital Supplies"
            className="w-full h-auto object-contain block"
          />

          {/* Interactive CTA Buttons Overlay (Positioned on Left) */}
          <div className="absolute left-[3%] bottom-[5%] sm:bottom-[8%] flex flex-wrap items-center gap-2 sm:gap-4 z-20">
            <Link
              href="/contact"
              className="px-3 sm:px-6 lg:px-8 py-2 sm:py-3.5 text-[10px] sm:text-xs lg:text-sm font-black text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-full shadow-lg shadow-red-600/30 transition-all transform hover:scale-105 flex items-center gap-1.5 sm:gap-2 uppercase tracking-wider"
            >
              <span>Partner With Us</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>

            <Link
              href="/products"
              className="px-3 sm:px-6 lg:px-8 py-2 sm:py-3.5 text-[10px] sm:text-xs lg:text-sm font-black text-[#E31B23] bg-white border-2 border-[#E31B23] hover:bg-red-50 rounded-full transition-all transform hover:scale-105 flex items-center gap-1.5 sm:gap-2 shadow-xs uppercase tracking-wider"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </div>

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

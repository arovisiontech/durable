'use client'

import Link from 'next/link'

export function PrecisionHealthcareSection() {
  return (
    <section className="w-full bg-[#F8FAFC] py-8 sm:py-10 relative overflow-hidden border-b border-slate-200">
      {/* Background Surgical Handoff Photo matching SS 1 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/precision-healthcare-banner.png"
        alt="Precision Solutions. Trusted Quality. Better Healthcare."
        className="absolute inset-0 w-full h-full object-cover object-right opacity-90 pointer-events-none"
      />

      {/* Left Crisp White Gradient Fade for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 sm:via-white/90 to-transparent w-full sm:w-3/4 lg:w-3/5 pointer-events-none" />

      {/* Subtle Halftone Dotted Matrix Pattern on Bottom Left */}
      <div className="absolute left-4 bottom-4 w-36 h-36 opacity-[0.06] pointer-events-none bg-[radial-gradient(#0B1B3D_1.5px,transparent_1.5px)] [background-size:12px_12px]" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex gap-4 sm:gap-6 items-stretch">
          {/* Left Red Contour Accent Line & Top Circle matching SS 1 */}
          <div className="flex flex-col items-center shrink-0 pt-1">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-[#E31B23] bg-white z-10 shadow-sm shrink-0" />
            <div className="w-[2px] bg-[#E31B23] flex-1 my-1" />
          </div>

          {/* Content Block matching SS 1 */}
          <div className="space-y-4 max-w-xl py-1">
            {/* Main Headline */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1B3D] tracking-tight leading-[1.12]">
              Precision Solutions. <br />
              Trusted Quality. <br />
              Better Healthcare.
            </h2>

            {/* Red Subtitle */}
            <p className="text-xs sm:text-sm font-extrabold text-[#E31B23] tracking-wide">
              Your Global Partner in Medical Manufacturing
            </p>

            {/* Description Paragraph */}
            <p className="text-xs font-semibold text-slate-600 leading-relaxed">
              We manufacture premium surgical instruments and sterile solutions with the highest standards of quality, compliance and precision - empowering healthcare brands worldwide.
            </p>

            {/* CTA Button */}
            <div className="pt-1">
              <Link
                href="/partner-with-us"
                className="inline-flex items-center justify-center bg-[#0F2942] hover:bg-[#E31B23] text-white text-[11px] font-black tracking-widest uppercase px-6 py-2.5 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
              >
                OUR STRENGTHS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { CataloguesOverviewSection } from '@/src/components/public/CataloguesOverviewSection'
import { DownloadableCataloguesSection } from '@/src/components/public/DownloadableCataloguesSection'
import { InstrumentPillarsSection } from '@/src/components/public/InstrumentPillarsSection'

export const revalidate = 60

export default function PublicCataloguesPage() {
  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen space-y-0">
      {/* 1. Hero Banner matching SS 1 (Precision Healthcare Surgical Banner) */}
      <section className="w-full bg-[#F8FAFC] py-10 sm:py-16 lg:py-20 relative overflow-hidden border-b border-slate-200">
        {/* Background Surgical Handoff Photo matching SS 1 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/precision-healthcare-banner.png"
          alt="Advanced Medical Product Solutions"
          className="absolute inset-0 w-full h-full object-cover object-right opacity-90 pointer-events-none"
        />

        {/* Left Crisp White Gradient Fade for Text Readability matching SS 1 */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 sm:via-white/90 to-transparent w-full sm:w-3/4 lg:w-3/5 pointer-events-none" />

        {/* Subtle Halftone Dotted Matrix Pattern on Bottom Left */}
        <div className="absolute left-4 bottom-4 w-36 h-36 opacity-[0.06] pointer-events-none bg-[radial-gradient(#0B1B3D_1.5px,transparent_1.5px)] [background-size:12px_12px]" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="space-y-4 max-w-2xl py-2">
            {/* Top Pill Tag Badge matching SS 1 */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#E31B23] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-800">
                PRECISION. QUALITY. TRUST
              </span>
            </div>

            {/* Main Headline matching SS 1 */}
            <div className="space-y-0.5">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1B3D] tracking-tight leading-[1.1]">
                ADVANCED MEDICAL
              </h1>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#E31B23] tracking-tight leading-[1.1]">
                PRODUCT SOLUTIONS.
              </h1>
            </div>

            {/* Subtitle Paragraph matching SS 1 */}
            <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed pt-1">
              We Manufacture Premium Surgical &amp; Dental Instruments For OEM, Private Label, And Sterile Kitting, Using High-Grade German &amp; Japanese Stainless Steel To Meet DIN And ISO/ASTM Standards. Available In Reusable, Single-Use, And EO-Sterilized Options.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Catalogues Overview Section matching SS 1 (4 Feature Cards + Explore Paragraph) */}
      <CataloguesOverviewSection />

      {/* 3. Downloadable Catalogues Grid Section matching SS 1 & SS 2 & SS 3 (with Access Code Protection System) */}
      <DownloadableCataloguesSection />

      {/* 4. Reusable, Single Use & Sterile Kitting 3-Pillars Grid Section (Placed right above the Footer!) */}
      <InstrumentPillarsSection />
    </div>
  )
}

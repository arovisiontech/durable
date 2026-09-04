'use client'

export function ContactHeroBanner() {
  return (
    <section className="w-full relative bg-white overflow-hidden border-b border-slate-200">
      {/* Background Banner Container */}
      <div className="max-w-[1440px] mx-auto min-h-[320px] sm:min-h-[360px] lg:min-h-[400px] relative flex items-center">
        
        {/* Right Side Background Image matching SS 2 */}
        <div 
          className="absolute inset-0 bg-right bg-cover bg-no-repeat z-0"
          style={{ backgroundImage: `url('/images/products-hero-banner.png')` }}
        />

        {/* White Fade Gradient Overlay from Left to Right */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 sm:via-white/85 via-50% to-transparent z-10" />

        {/* Text Content Overlay */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-14 w-full">
          <div className="max-w-2xl space-y-4">
            
            {/* Pill Badge matching SS 1 */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F1F5F9] border border-slate-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#E31B23]" />
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-800">
                PARTNER WITH US
              </span>
            </div>

            {/* Main Title matching SS 1 */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0B1B3D] tracking-tight leading-[1.12] uppercase">
              GLOBAL SURGICAL & HEALTHCARE <br />
              <span className="text-[#E31B23]">SUPPLIES MANUFACTURING</span>
            </h1>

            {/* Subtitle Description matching SS 1 */}
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-xl">
              Whether you require custom OEM manufacturing, private label surgical tools, bulk hospital supplies, or international distribution rights, our technical team is ready to serve you.
            </p>

          </div>
        </div>

      </div>
    </section>
  )
}

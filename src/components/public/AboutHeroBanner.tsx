'use client'

export function AboutHeroBanner() {
  return (
    <section className="w-full relative bg-white overflow-hidden border-b border-slate-200">
      {/* Background Banner Container - 100% Responsive across 24", 29", 60" LCD Monitors */}
      <div className="w-full max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto min-h-[360px] sm:min-h-[420px] lg:min-h-[480px] xl:min-h-[540px] relative flex items-center">
        
        {/* Right Side Background Image */}
        <div 
          className="absolute inset-0 bg-right bg-cover bg-no-repeat z-0"
          style={{ backgroundImage: `url('/images/about-hero-banner.png')` }}
        />

        {/* White Fade Gradient Overlay from Left to Right */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 sm:via-white/85 via-50% to-transparent z-10" />

        {/* Text Content Overlay */}
        <div className="relative z-20 max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-16 w-full">
          <div className="max-w-3xl space-y-4">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F1F5F9] border border-slate-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#E31B23]" />
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-800">
                ABOUT US
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0B1B3D] tracking-tight leading-[1.12] uppercase">
              PRECISION IN EVERY <br />
              INSTRUMENT. TRUST IN <br />
              <span className="text-[#E31B23]">EVERY DETAIL.</span>
            </h1>

          </div>
        </div>

      </div>
    </section>
  )
}

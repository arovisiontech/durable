'use client'

export function QualityTrustSection() {
  const qualityFeatures = [
    {
      id: 1,
      title: 'Premium Reusable Solutions',
      description:
        'High-Quality Reusable Instruments Engineered For Lasting Precision And Dependable Performance.',
      icon: '/images/icon-premium-reusable.png',
    },
    {
      id: 2,
      title: 'One-Time Use Instruments',
      description:
        'Single-Use Solutions Ensuring Optimal Hygiene And Performance.',
      icon: '/images/icon-single-use.png',
    },
    {
      id: 3,
      title: 'Qualified Or Licensed',
      description:
        'Manufactured Under Certified Quality Systems And International Standards.',
      icon: '/images/icon-qualified.png',
    },
    {
      id: 4,
      title: 'Reliable',
      description:
        'Engineered For Consistent Performance You Can Trust.',
      icon: '/images/icon-reliable.png',
    },
  ]

  return (
    <section className="w-full bg-[#FAFAFA] py-8 sm:py-10 relative overflow-hidden border-b border-slate-200">
      {/* Background Subtle Grid Texture */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#0B1B3D_1.5px,transparent_1.5px)] [background-size:20px_20px]" />

      <div className="max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 sm:space-y-8">
        {/* Section Header matching SS 1 */}
        <div className="text-center max-w-3xl mx-auto space-y-1.5">
          {/* Tagline Badge with Side Red Lines */}
          <div className="flex items-center justify-center gap-2">
            <span className="w-6 sm:w-8 h-[2px] bg-[#E31B23]" />
            <span className="text-[11px] sm:text-xs font-black tracking-widest text-[#E31B23] uppercase">
              BUILT FOR SAFETY. DESIGNED FOR EXCELLENCE.
            </span>
            <span className="w-6 sm:w-8 h-[2px] bg-[#E31B23]" />
          </div>

          {/* Main Title */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1B3D] tracking-tight leading-tight">
            Quality You Can Trust, Every Time
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed max-w-2xl mx-auto">
            From Raw Material To Final Inspection - Every Step Is Controlled, <br className="hidden sm:inline" />
            So You Can Focus On What Matters Most: Your Patients
          </p>
        </div>

        {/* 4 Feature Cards Grid matching SS 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {qualityFeatures.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl p-5 shadow-xs hover:shadow-xl border border-slate-100 hover:border-red-500/30 transition-all duration-300 flex flex-col items-center text-center justify-between space-y-4"
            >
              {/* Center Icon Graphic */}
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center p-2.5 group-hover:scale-105 transition-transform">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-12 h-12 object-contain"
                />
              </div>

              {/* Title, Red Accent Line & Description */}
              <div className="space-y-2 w-full">
                {/* Title */}
                <h3 className="text-sm sm:text-base font-black text-[#0B1B3D] group-hover:text-[#E31B23] transition-colors leading-snug">
                  {item.title}
                </h3>

                {/* Red Underline Accent Bar matching SS 1 */}
                <div className="w-8 h-[2px] bg-[#E31B23] mx-auto rounded-full" />

                {/* Description */}
                <p className="text-xs font-medium text-slate-400 leading-relaxed max-w-[200px] mx-auto">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

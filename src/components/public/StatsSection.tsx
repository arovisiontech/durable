'use client'

export function StatsSection() {
  const stats = [
    {
      id: 1,
      number: '20,000+',
      label: 'Products Manufactures',
      icon: (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6 sm:w-7 sm:h-7 text-white"
        >
          {/* Conveyor Belt & Robotic Arm Icon matching SS 2 */}
          <rect x="10" y="44" width="44" height="10" rx="5" strokeWidth="3" fill="#16325B" />
          <circle cx="18" cy="49" r="2.5" fill="white" />
          <circle cx="32" cy="49" r="2.5" fill="white" />
          <circle cx="46" cy="49" r="2.5" fill="white" />
          {/* Robotic Joint Arm */}
          <circle cx="28" cy="22" r="5" strokeWidth="3" />
          <path d="M 28 17 V 10 H 38 V 18" />
          <path d="M 28 27 V 44" />
          <circle cx="38" cy="18" r="2.5" fill="white" />
        </svg>
      ),
    },
    {
      id: 2,
      number: '6+',
      label: 'Production Facilities',
      icon: (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6 sm:w-7 sm:h-7 text-white"
        >
          {/* Factory Building with Windows & Gear Top matching SS 2 */}
          <path d="M 12 50 V 26 L 28 36 V 26 L 44 36 V 16 H 52 V 50 Z" strokeWidth="3" />
          <rect x="18" y="38" width="4" height="4" fill="white" />
          <rect x="24" y="38" width="4" height="4" fill="white" />
          <rect x="34" y="38" width="4" height="4" fill="white" />
          <rect x="40" y="38" width="4" height="4" fill="white" />
          {/* Top Gear */}
          <circle cx="22" cy="16" r="4.5" strokeWidth="2.5" />
        </svg>
      ),
    },
    {
      id: 3,
      number: '300+',
      label: 'Skills Workers',
      icon: (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6 sm:w-7 sm:h-7 text-white"
        >
          {/* Team Workers Assembling Gear matching SS 2 */}
          <circle cx="20" cy="18" r="4.5" />
          <circle cx="44" cy="18" r="4.5" />
          <path d="M 12 46 C 12 36 18 32 26 32 C 30 32 34 34 36 36" />
          <path d="M 52 46 C 52 36 46 32 38 32" />
          {/* Gear in middle */}
          <circle cx="32" cy="34" r="5" strokeWidth="2.5" fill="#16325B" />
        </svg>
      ),
    },
    {
      id: 4,
      number: '1 Million+',
      label: 'Patients Treated Every Year',
      icon: (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6 sm:w-7 sm:h-7 text-white"
        >
          {/* Medical Clipboard with Cross & Checkmark matching SS 2 */}
          <rect x="16" y="14" width="32" height="42" rx="4" strokeWidth="3" />
          <path d="M 26 14 V 10 H 38 V 14" strokeWidth="3" />
          <path d="M 27 26 H 37" strokeWidth="3" />
          <path d="M 32 21 V 31" strokeWidth="3" />
          {/* Checkmark Circle */}
          <circle cx="42" cy="44" r="8" fill="#0F2942" stroke="white" strokeWidth="2.5" />
          <path d="M 38 44 L 41 47 L 46 41" stroke="white" strokeWidth="2.5" />
        </svg>
      ),
    },
  ]

  return (
    <section className="w-full bg-white pt-6 sm:pt-8 pb-8 sm:pb-10 relative overflow-hidden border-b border-slate-200">
      {/* LEFT FLANK: Dotted World Map Vector Texture (Matching SS 2) */}
      <div className="absolute left-0 top-0 bottom-0 w-1/4 sm:w-1/5 opacity-[0.20] pointer-events-none bg-[radial-gradient(#0B1B3D_1.5px,transparent_1.5px)] [background-size:14px_14px]" />

      {/* RIGHT FLANK: Dotted World Map Vector Texture (Matching SS 2) */}
      <div className="absolute right-0 top-0 bottom-0 w-1/4 sm:w-1/5 opacity-[0.20] pointer-events-none bg-[radial-gradient(#0B1B3D_1.5px,transparent_1.5px)] [background-size:14px_14px]" />

      {/* CENTER: Pure Clean White Background for 4 Cards - 100% LCD Screen Responsive */}
      <div className="max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4 pt-4">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="relative bg-[#547395] text-white rounded-2xl pt-9 sm:pt-10 pb-5 px-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Double Ring Circular Top Icon Badge matching SS 2 */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#16325B] p-1 shadow-md border-2 border-white/30 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#0F2942] flex items-center justify-center shadow-inner">
                  {stat.icon}
                </div>
              </div>

              {/* Stat Content */}
              <div className="space-y-0.5 pt-0.5">
                {/* Number */}
                <div className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {stat.number}
                </div>

                {/* Thin Underline Accent Bar matching SS 2 */}
                <div className="w-10 h-[2px] bg-white/50 mx-auto rounded-full my-1" />

                {/* Label Subtitle */}
                <div className="text-xs font-bold text-white leading-snug max-w-[170px] mx-auto">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

export function DurableHistorySection() {
  const historyCards = [
    {
      id: 1,
      title: '40+ Years',
      subtitle: 'Of Manufacturing Excellence',
      icon: '/images/icon-history-40years.png',
    },
    {
      id: 2,
      title: 'ISO 13485, FDA & MDR',
      subtitle: 'Certified Quality & Compliance',
      icon: '/images/icon-history-iso.png',
    },
    {
      id: 3,
      title: 'Global Presence',
      subtitle: 'Trusted By Distributors Worldwide',
      icon: '/images/icon-history-global.png',
    },
    {
      id: 4,
      title: 'Precision Crafted',
      subtitle: 'With Advanced Technology & Skilled Expertise',
      icon: '/images/icon-history-precision.png',
    },
    {
      id: 5,
      title: 'OEM & Private Label',
      subtitle: 'Solutions Tailored To Your Brand',
      icon: '/images/icon-history-oem.png',
    },
  ]

  return (
    <section className="w-full bg-white py-10 sm:py-14 lg:py-16 border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10 space-y-10 sm:space-y-12">
        
        {/* Top Split Block: History Text (Left) + Building Photo (Right) matching SS 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12">
          
          {/* Left Column: Text Content (7 Cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            
            {/* Title with Red Underline Accent */}
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1B3D] tracking-tight uppercase">
                DURABLE HISTORY
              </h2>
              <div className="w-16 h-[3.5px] bg-[#E31B23] rounded-full mt-2" />
            </div>

            {/* Paragraphs matching SS 1 */}
            <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              <p>
                Since 1980, <strong className="text-slate-900 font-bold">Durable Hospital Supplies</strong> Has Been A Trusted Medical Engineering, OEM, And Private-Label Surgical Instrument Manufacturer Based In Sialkot, Pakistan — The Global Hub Of Precision Surgical Instrument Manufacturing.
              </p>
              
              <p>
                With More Than Four Decades Of Manufacturing Expertise, We Combine Skilled Craftsmanship, Advanced Engineering, And Rigorous Quality Control To Produce Surgical Instruments That Meet The Evolving Needs Of Healthcare Professionals And Global Medical Brands.
              </p>

              <p>
                Our Expertise Covers <strong className="text-slate-900 font-bold">General Surgery, Dental Instruments, Electrosurgery, Holloware, And EO Sterilized Instruments & Kits</strong>, With Customized OEM And Private-Label Solutions Tailored To International Markets.
              </p>

              <p>
                Driven By Quality, Precision, And Reliability, Our Manufacturing Processes Are Aligned With Internationally Recognized Standards, Including <strong className="text-slate-900 font-bold">ISO 13485, FDA, And MDR Requirements</strong>. Today, Durable Hospital Supplies Serves Hospitals, Healthcare Professionals, Distributors, And Medical Brands Worldwide — Delivering Dependable Instruments Designed To Support Better Healthcare Outcomes.
              </p>

              <p className="pt-1 font-bold text-slate-800 text-xs sm:text-sm">
                Durable Hospital Supplies — Precision Crafted. Globally Trusted.
              </p>
            </div>

          </div>

          {/* Right Column: Building Photo (5 Cols) matching SS 1 */}
          <div className="lg:col-span-5">
            <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-50 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/durable-building.png"
                alt="Durable Hospital Supplies Manufacturing Facility in Sialkot, Pakistan"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

        </div>

        {/* Bottom 5 Feature Cards Grid matching SS 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 pt-2">
          {historyCards.map((card) => (
            <div
              key={card.id}
              className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-red-500/30 transition-all duration-300 flex flex-col items-center justify-between text-center space-y-3"
            >
              {/* Red Vector Icon */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center group-hover:scale-110 transition-transform">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.icon}
                  alt={card.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-black text-[#0B1B3D] group-hover:text-[#E31B23] transition-colors leading-snug">
                  {card.title}
                </h3>
                <p className="text-[11px] sm:text-xs font-semibold text-slate-400 leading-snug max-w-[180px] mx-auto">
                  {card.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

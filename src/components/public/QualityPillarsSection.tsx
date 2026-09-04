'use client'

export function QualityPillarsSection() {
  const pillars = [
    {
      id: 'supply-chain',
      title: 'SUPPLY CHAIN RESILIENCE',
      description:
        'Our Robust Global Supply Chain Is Built To Ensure Consistent Product Availability, Timely Delivery, And Uninterrupted Support For Healthcare Providers Worldwide. Through Strategic Sourcing, Advanced Manufacturing, Efficient Inventory Management, And Dependable Logistics, We Maintain The Flexibility And Reliability Needed To Meet Evolving Market Demands While Delivering Exceptional Quality And Service.',
    },
    {
      id: 'compliance',
      title: 'COMPLIANCE & QUALITY ASSURANCE',
      description:
        'Quality And Compliance Are At The Core Of Everything We Do. Our Products Are Manufactured Under Stringent Quality Management Systems And Adhere To Internationally Recognized Regulatory Standards. Through Rigorous Inspections, Validated Processes, And Continuous Quality Control, We Ensure Every Instrument Delivers The Safety, Precision, And Reliability Healthcare Professionals Depend On.',
    },
    {
      id: 'risk-management',
      title: 'RISK MANAGEMENT',
      description:
        'We Take A Proactive Approach To Risk Management By Implementing Robust Quality Controls, Regulatory Compliance Measures, And Continuous Process Monitoring Throughout Our Operations. From Manufacturing To Delivery, Every Stage Is Carefully Managed To Minimize Risks, Ensure Product Integrity, And Provide Healthcare Professionals With Safe, Reliable, And Consistent Solutions They Can Trust.',
    },
  ]

  return (
    <section className="w-full bg-white py-8 sm:py-10 relative overflow-hidden border-b border-slate-200">
      {/* Background Subtle Halftone Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#0B1B3D_1.5px,transparent_1.5px)] [background-size:20px_20px]" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 sm:space-y-8">
        {/* Section Headline matching SS 1 */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            <span className="text-[#0B1B3D]">Delivering Confidence </span>
            <span className="text-[#E31B23]">Through Quality</span>
          </h2>
        </div>

        {/* 2-Column Content Layout (Image Left + 3 Pillars Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Surgical Tray Photo with Embroidered DURABLE Patch */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 group max-w-md mx-auto lg:max-w-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/surgical-tray-durable.png"
                alt="Delivering Confidence Through Quality - Surgical Tray"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-60" />
            </div>
          </div>

          {/* Right Column: 3 Pillar Blocks matching SS 1 */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {pillars.map((pillar) => (
              <div key={pillar.id} className="space-y-1">
                <h3 className="text-sm sm:text-base font-black text-[#0B1B3D] tracking-wider uppercase">
                  {pillar.title}
                </h3>
                <p className="text-xs font-semibold text-slate-400 leading-relaxed max-w-3xl">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

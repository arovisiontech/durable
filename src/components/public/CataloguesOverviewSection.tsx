'use client'

import Link from 'next/link'

export function CataloguesOverviewSection() {
  const cards = [
    {
      id: 1,
      title: 'Product Catalogs',
      description:
        'Explore Our Comprehensive Range Of Surgical Instruments Designed For Precision And Professional Use.',
      icon: '/images/icon-cat-newspaper.png',
    },
    {
      id: 2,
      title: 'Quality Standards',
      description:
        'Manufactured to DIN and ISO/ASTM Standards with strict quality control to ensure reliability and safety.',
      icon: '/images/icon-cat-checklist.png',
    },
    {
      id: 3,
      title: 'OEM / Private Label',
      description:
        'Custom Manufacturing, Private Label Branding And Sterile Kitting Solutions Tailored To Your Business Needs.',
      icon: '/images/icon-cat-box.png',
    },
    {
      id: 4,
      title: 'Materials & Sterilization',
      description:
        'Premium German & Japanese Stainless Steel With Options For Reusable, Single-Use And EO Sterilized Configurations.',
      icon: '/images/icon-cat-layers.png',
    },
  ]

  return (
    <section className="w-full bg-[#F8FAFC] py-10 sm:py-14 border-b border-slate-200 relative overflow-hidden">
      {/* Background Subtle Dot Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#0B1B3D_1.5px,transparent_1.5px)] [background-size:20px_20px]" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-16">
        {/* Top Feature Grid Block */}
        <div className="space-y-6">
          {/* Centered Top Tagline matching SS 1 */}
          <div className="text-center">
            <h3 className="text-xs sm:text-sm font-extrabold tracking-widest text-[#0B1B3D] uppercase">
              BUILT TO PERFORM. MADE TO LAST.
            </h3>
          </div>

          {/* 4 Cards Grid matching SS 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {cards.map((card) => (
              <div
                key={card.id}
                className="group bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl border border-slate-100 hover:border-red-500/30 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Circular Icon Badge */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100/90 flex items-center justify-center p-2.5 group-hover:bg-red-50 transition-colors shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={card.icon}
                        alt={card.title}
                        className="w-7 h-7 object-contain"
                      />
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-[#0B1B3D] leading-snug group-hover:text-[#E31B23] transition-colors">
                      {card.title}
                    </h4>
                  </div>

                  {/* Description */}
                  <p className="text-xs font-medium text-slate-500 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Red Link matching SS 1 */}
                <div className="pt-2">
                  <Link
                    href="#catalogues-grid"
                    className="inline-block text-xs font-bold text-[#E31B23] hover:underline"
                  >
                    View Catalogs
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Explore Section matching SS 1 */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          {/* Main Title */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1B3D] tracking-tight uppercase">
            EXPLORE OUR INSTRUMENT CATALOGS
          </h2>

          {/* Red Underline Accent Bar matching SS 1 */}
          <div className="w-16 h-[3px] bg-[#E31B23] mx-auto rounded-full" />

          {/* Paragraph Description matching SS 1 */}
          <div className="space-y-3 text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed pt-1">
            <p>
              Durable Hospital Supplies Offers An Extensive Range Of Surgical, Dental, And Specialty Instruments, From Essential Items Such As Scalpels, Scissors, And Forceps To Complete Surgical Instrument Sets And Customized Trays For Hospitals, Distributors, And Healthcare Suppliers.
            </p>
            <p>
              With A Portfolio Of More Than 20,000 Surgical, Dental, And Medical Instruments Manufactured In Sialkot, Pakistan, We Serve Customers Worldwide With Precision-Engineered Solutions Across A Wide Range Of Medical Specialties. As An ISO 13485 And FDA-Certified OEM Surgical Instrument Manufacturer, We Focus On Delivering Consistent Quality, Reliability, Precision, And Cost-Effective Solutions For Hospitals, Medical Distributors, And Private-Label Healthcare Brands.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

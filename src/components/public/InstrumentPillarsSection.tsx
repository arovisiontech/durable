'use client'

export function InstrumentPillarsSection() {
  const pillars = [
    {
      id: 'reusable',
      title: 'REUSABLE',
      description:
        'Our Reusable Instruments Are Designed For Repeated Use. Crafted From The Highest Quality Steel, They Undergo Specialized Production Processes, Including Passivation, To Ensure A Long, Rust-Free Lifespan. These Instruments Offer Both Durability And Safety, Providing Reliable Performance In Every Procedure. Browse Our Full Surgical Instruments List In Catalogs Below, Or Request Any Specialty Instruments By Reaching Out To Us.',
      icon: '/images/icon-reusable.png',
    },
    {
      id: 'single-use',
      title: 'SINGLE USE',
      description:
        'Our Single-Use Instruments Are Designed For Practical Functionality And Cost-Effectiveness. Made From Recycled Steel, They Provide Excellent Value By Eliminating The Need For Resterilization, Making Them A Convenient And Economical Choice For Hospitals. Produced In Bulk, These Instruments Not Only Reduce Operational Costs But Also Ensure A Reliable Option For One-Time Use.',
      icon: '/images/icon-single-use-instruments.png',
    },
    {
      id: 'sterile-kitting',
      title: 'STERILE KITTING',
      description:
        'Our Sterile Instruments & Procedure Packs Are Designed To Help Distributors And Hospitals Reduce Operational Costs. By Adhering To Certified Cleaning & Sterilization Protocols, We Offer The Highest Level Of Sterility While Offering Significant Savings In Both Cost & Time. This Ensures Our Customers Receive Reliable, Ready-To-Use Instruments That Streamline Their Operations And Enhance Efficiency.',
      icon: '/images/icon-sterile-kitting.png',
    },
  ]

  return (
    <section className="w-full bg-[#FAFAFA] py-12 sm:py-16 relative overflow-hidden border-b border-slate-200">
      {/* Background Vector Dots Pattern */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#0B1B3D_1.5px,transparent_1.5px)] [background-size:20px_20px]" />

      <div className="max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 3 Pillar Cards Grid matching SS 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {pillars.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-2xl border border-slate-200/80 border-b-4 border-b-[#0F2942] transition-all duration-300 flex flex-col items-center text-center justify-between space-y-5"
            >
              {/* Top Circular Blue Icon Badge matching SS 1 */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#EBF3FA] flex items-center justify-center p-3.5 border border-blue-100 group-hover:scale-105 transition-transform shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
                />
              </div>

              {/* Title & Red Accent Line */}
              <div className="space-y-2 w-full flex-1 flex flex-col items-center">
                <h3 className="text-lg sm:text-xl font-black text-[#0B1B3D] tracking-wider uppercase group-hover:text-[#E31B23] transition-colors">
                  {item.title}
                </h3>

                {/* Red Underline Accent Bar matching SS 1 */}
                <div className="w-10 h-[3px] bg-[#E31B23] rounded-full my-1.5" />

                {/* Description Paragraph */}
                <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed pt-1">
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

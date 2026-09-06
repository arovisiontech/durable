'use client'

import Link from 'next/link'
import { Mail, Download, ArrowRight } from 'lucide-react'

export function AboutSection() {
  return (
    <section className="w-full bg-[#F8FAFC] pt-3 sm:pt-4 lg:pt-5 pb-12 sm:pb-16 border-b border-slate-200 overflow-hidden relative">
      {/* Background World Map Vector Graphic Pattern */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#0B1B3D_1.5px,transparent_1.5px)] [background-size:20px_20px]" />

      <div className="max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12">
          
          {/* Left Column: Text & Content (7 Cols) */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200/80 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#E31B23] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-800">
                SINCE 1973
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-0.5">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0B1B3D] tracking-tight leading-tight">
                Elevating Global
              </h2>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#E31B23] tracking-tight leading-tight">
                Healthcare Standards
              </h2>
            </div>

            {/* Description Paragraph 1 */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              <strong className="text-slate-900 font-bold">Durable Hospital Supplies</strong> is A Trusted Global Partner For Healthcare Brands Seeking Reliable, High-Quality Surgical Manufacturing Solutions. With <strong className="text-slate-900 font-bold">Over 53 Years Of Experience</strong>, We Operate From Our Modern Facility In <strong className="text-slate-900 font-bold">Sialkot, Pakistan</strong>, Where We Design And Manufacture A Wide Range Of <strong className="text-slate-900 font-bold">General Surgical, Dental Instruments, Ophthalmic, Medical Hollowwares, Hospital Furniture, And Single Use Instruments</strong>, As Well As <strong className="text-slate-900 font-bold">Sterile Procedure Packs And Custom Medical Kits</strong>.
            </p>

            {/* Description Paragraph 2 */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Our Commitment To Excellence Is Supported By <strong className="text-slate-900 font-bold">ISO 13485-Certified Processes</strong> And Compliance With <strong className="text-slate-900 font-bold">ISO, MDR-Ready And FDA Requirements</strong>, Ensuring Every Product Meets The Highest Standards Of Safety And Performance. Offering More Than <strong className="text-slate-900 font-bold">20,000 Precision-Made Products</strong>, We Deliver Tailored <strong className="text-slate-900 font-bold">OEM And Private Label Solutions</strong> That Help Hospitals, Distributors, And Healthcare Brands Grow With Confidence.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/contact"
                className="px-5 sm:px-6 py-2.5 sm:py-3 text-xs font-black text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>GET IN TOUCH</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="/pdf/general-surgical-instruments-catalogue.pdf"
                target="_blank"
                download
                className="px-5 sm:px-6 py-2.5 sm:py-3 text-xs font-black text-[#E31B23] bg-white border-2 border-[#E31B23] hover:bg-red-50 rounded-xl transition-all flex items-center gap-2 shadow-2xs"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD CATALOGUE</span>
              </a>
            </div>
          </div>

          {/* Right Column: Curved Image Container & Compliance Bar (5 Cols matching SS 1) */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative w-full">
              
              {/* Surgical Photo Frame with Diagonal Red Contour Line matching SS 1 */}
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#E31B23]/40 bg-white">
                
                {/* Red Curved Accent Arc on Left Border matching SS 1 */}
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-[#E31B23] z-10 rounded-r-full shadow-md" />

                {/* Surgical Photo */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/about-surgical-instruments.png"
                  alt="Durable Surgical Instruments Manufacturing Quality"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Compliance Badge Bar (Centered Overlapping Bottom matching SS 1) */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[94%] sm:w-[90%] bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-200/90 shadow-2xl z-20 flex items-center justify-between gap-1.5 sm:gap-2">
                
                {/* ISO Logo */}
                <div className="flex-1 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/icon-iso.png"
                    alt="ISO 9001:2015 ISO 13485:2016"
                    className="h-7 sm:h-9 object-contain"
                  />
                </div>

                <div className="h-7 w-[1px] bg-slate-200 shrink-0" />

                {/* CE FDA Registered */}
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <span className="text-xs sm:text-sm font-black text-[#0B1B3D] tracking-tight leading-none">
                    CE FDA
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 tracking-wider">
                    REGISTERED
                  </span>
                </div>

                <div className="h-7 w-[1px] bg-slate-200 shrink-0" />

                {/* EU-MDR Logo */}
                <div className="flex-1 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/icon-eumdr.png"
                    alt="EU-MDR Ready"
                    className="h-6 sm:h-8 object-contain"
                  />
                </div>

                <div className="h-7 w-[1px] bg-slate-200 shrink-0" />

                {/* OEM / ODM Solutions Icon */}
                <div className="flex-1 flex items-center justify-center gap-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/icon-oem.png"
                    alt="OEM/ODM Solutions"
                    className="h-6 sm:h-8 object-contain"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] sm:text-[10px] font-black text-[#0B1B3D] leading-none">
                      OEM/ODM
                    </span>
                    <span className="text-[7px] sm:text-[8px] font-extrabold text-red-600 leading-none">
                      SOLUTIONS
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

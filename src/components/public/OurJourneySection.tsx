'use client'

import { useState, useEffect } from 'react'

const DEFAULT_JOURNEY = {
  badge: 'OUR JOURNEY',
  title: 'From Humble Origins To Global Recognition',
  subtitle: 'A Journey Built On Trust, Precision And An Unwavering Commitment To Excellence.',
  pastText:
    'Durable Hospital Supplies Began In A Small Rented Shop, Producing Only A Few Instruments And Serving A Single Customer. That Customer, Still With Us After Nearly Half A Century, Is A Testament To Our Commitment To Quality And Relationships. From These Humble Beginnings, We Laid The Foundation For What Would Become A Global Brand, Driven By Precision Craftsmanship And Unwavering Dedication To Excellence.',
  presentText1:
    'Today, As An ISO 13485 And FDA Certified Surgical Instrument Manufacturer In Sialkot, Pakistan, Durable Hospital Supplies Offers A Portfolio Of Over 20,000 Instruments As OEM And Operates International Offices In 5 Countries, With Distributors In Over 70 Including US, UK, EU, Japan And The Middle East.',
  presentText2:
    'We Supply Private Label Instruments To Thousands Of Hospitals And Clinics Worldwide, Cementing Our Position Among The World\'s Most Established Surgical Instrument Companies And As An Industry Leader.',
  presentText3:
    'Our Products Meet Stringent Global Certifications, And We Are Pioneers In Key Areas, Including The Production Of EO Sterile Procedure Packs. As We Continue To Grow At A Rapid Pace, Our Focus Remains On Delivering Innovation, Quality, And Compliance In Every Product.',
  mapImage: '/images/world-map-journey.png',
  futureText:
    'The Future Of Durable Hospital Supplies Is Exceptionally Bright. We Are Expanding Our Product Range And Making Strategic Moves To Establish New Manufacturing Units And Global Partnerships, Aiming To Set New Benchmarks In The Surgical Instrument Industry.',
}

export function OurJourneySection() {
  const [data, setData] = useState(DEFAULT_JOURNEY)

  const loadData = () => {
    try {
      const saved = localStorage.getItem('durable_journey_data')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed === 'object') {
          setData((prev) => ({ ...prev, ...parsed }))
        }
      }
    } catch (e) {
      console.error('LocalStorage OurJourney read error:', e)
    }
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('durable_content_updated', handleUpdate)
    return () => window.removeEventListener('durable_content_updated', handleUpdate)
  }, [])

  const journeyItems = [
    {
      id: 'past',
      tag: 'PAST',
      content: (
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          {data.pastText}
        </p>
      ),
    },
    {
      id: 'present',
      tag: 'PRESENT',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Left Text Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-2 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            <p>{data.presentText1}</p>
            <p>{data.presentText2}</p>
            <p>{data.presentText3}</p>
          </div>

          {/* Right Column: World Map */}
          <div className="lg:col-span-5 flex items-center justify-center pt-1 lg:pt-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.mapImage || '/images/world-map-journey.png'}
              alt="Durable Hospital Supplies Global Reach World Map"
              className="w-full max-w-sm sm:max-w-md h-auto object-contain"
            />
          </div>
        </div>
      ),
    },
    {
      id: 'future',
      tag: 'FUTURE',
      content: (
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          {data.futureText}
        </p>
      ),
    },
  ]

  return (
    <section className="w-full bg-[#F8FAFC] py-8 sm:py-12 border-b border-slate-200 relative overflow-hidden">
      {/* Background Radial Texture */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#0B1B3D_1.5px,transparent_1.5px)] [background-size:20px_20px]" />

      <div className="max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Top Header */}
        <div className="text-center space-y-1 mb-8 sm:mb-10">
          <span className="text-[10px] sm:text-xs font-black tracking-widest text-[#E31B23] uppercase block">
            {data.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1B3D] tracking-tight leading-tight">
            {data.title}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed max-w-2xl mx-auto">
            {data.subtitle}
          </p>
        </div>

        {/* Timeline Hierarchy Container */}
        <div className="relative max-w-5xl mx-auto space-y-5 sm:space-y-6">
          
          {/* Continuous Vertical Timeline Line on Left */}
          <div className="absolute left-[20px] sm:left-[27px] top-6 bottom-6 w-[2px] bg-slate-200/90 z-0" />

          {journeyItems.map((item) => (
            <div key={item.id} className="flex items-start gap-3.5 sm:gap-5 relative z-10">
              
              {/* Left Circle Node Column */}
              <div className="relative shrink-0 flex items-center justify-center pt-1">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#051438] border-[3px] border-slate-200/90 shadow-xs flex items-center justify-center z-10" />
                <div className="hidden sm:block absolute left-[52px] sm:left-[55px] top-7 sm:top-8 w-4 h-[1.5px] bg-slate-300 z-10" />
                <div className="hidden sm:block absolute left-[68px] sm:left-[71px] top-7 sm:top-8 -translate-y-1/2 w-2 h-2 rounded-full border border-slate-400 bg-white z-10" />
              </div>

              {/* Right Compact Card Container */}
              <div className="flex-1 bg-white rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-md border border-slate-200/80 transition-all duration-300 space-y-1.5">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-[#E31B23] tracking-tight uppercase">
                    {item.tag}
                  </h3>
                  <div className="w-8 h-[2.5px] bg-[#E31B23] rounded-full mt-0.5" />
                </div>

                <div className="pt-0.5">
                  {item.content}
                </div>
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  )
}


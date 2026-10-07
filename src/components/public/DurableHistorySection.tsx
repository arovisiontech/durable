'use client'

import { useState, useEffect } from 'react'
import { RichText } from '@/src/components/ui/RichText'
import { loadPersistentData } from '@/src/lib/persistentStorage'

const DEFAULT_HISTORY = {
  title: 'DURABLE HISTORY',
  p1: 'Since 1980, Durable Hospital Supplies Has Been A Trusted Medical Engineering, OEM, And Private-Label Surgical Instrument Manufacturer Based In Sialkot, Pakistan — The Global Hub Of Precision Surgical Instrument Manufacturing.',
  p2: 'With More Than Four Decades Of Manufacturing Expertise, We Combine Skilled Craftsmanship, Advanced Engineering, And Rigorous Quality Control To Produce Surgical Instruments That Meet The Evolving Needs Of Healthcare Professionals And Global Medical Brands.',
  p3: 'Our Expertise Covers General Surgery, Dental Instruments, Electrosurgery, Holloware, And EO Sterilized Instruments & Kits, With Customized OEM And Private-Label Solutions Tailored To International Markets.',
  p4: 'Driven By Quality, Precision, And Reliability, Our Manufacturing Processes Are Aligned With Internationally Recognized Standards, Including ISO 13485, FDA, And MDR Requirements. Today, Durable Hospital Supplies Serves Hospitals, Healthcare Professionals, Distributors, And Medical Brands Worldwide — Delivering Dependable Instruments Designed To Support Better Healthcare Outcomes.',
  tagline: 'Durable Hospital Supplies — Precision Crafted. Globally Trusted.',
  imageUrl: '/images/durable-building.png',
}

const DEFAULT_CARDS = [
  {
    id: 'h-1',
    title: '40+ Years',
    subtitle: 'Of Manufacturing Excellence',
    icon: '/images/icon-history-40years.png',
  },
  {
    id: 'h-2',
    title: 'ISO 13485, FDA & MDR',
    subtitle: 'Certified Quality & Compliance',
    icon: '/images/icon-history-iso.png',
  },
  {
    id: 'h-3',
    title: 'Global Presence',
    subtitle: 'Trusted By Distributors Worldwide',
    icon: '/images/icon-history-global.png',
  },
  {
    id: 'h-4',
    title: 'Precision Crafted',
    subtitle: 'With Advanced Technology & Skilled Expertise',
    icon: '/images/icon-history-precision.png',
  },
  {
    id: 'h-5',
    title: 'OEM & Private Label',
    subtitle: 'Solutions Tailored To Your Brand',
    icon: '/images/icon-history-oem.png',
  },
]

export function DurableHistorySection() {
  const [historyData, setHistoryData] = useState(DEFAULT_HISTORY)
  const [cards, setCards] = useState(DEFAULT_CARDS)

  useEffect(() => {
    loadPersistentData('durable_history_data', DEFAULT_HISTORY, (data) => {
      if (data && typeof data === 'object') {
        setHistoryData((prev) => ({ ...prev, ...data }))
      }
    })

    loadPersistentData('durable_history_cards', DEFAULT_CARDS, (data) => {
      if (Array.isArray(data) && data.length > 0) {
        setCards(data)
      }
    })

    const handleUpdate = () => {
      loadPersistentData('durable_history_data', DEFAULT_HISTORY, (data) => {
        if (data && typeof data === 'object') {
          setHistoryData((prev) => ({ ...prev, ...data }))
        }
      })
      loadPersistentData('durable_history_cards', DEFAULT_CARDS, (data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCards(data)
        }
      })
    }

    window.addEventListener('durable_content_updated', handleUpdate)
    return () => window.removeEventListener('durable_content_updated', handleUpdate)
  }, [])

  return (
    <section className="w-full bg-white py-10 sm:py-14 lg:py-16 border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10 space-y-10 sm:space-y-12">
        
        {/* Top Split Block: History Text (Left) + Building Photo (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12">
          
          {/* Left Column: Text Content (7 Cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            
            {/* Title with Red Underline Accent */}
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1B3D] tracking-tight uppercase">
                {historyData.title}
              </h2>
              <div className="w-16 h-[3.5px] bg-[#E31B23] rounded-full mt-2" />
            </div>

            {/* Paragraphs */}
            <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              <RichText content={historyData.p1} />
              <RichText content={historyData.p2} />
              <RichText content={historyData.p3} />
              <RichText content={historyData.p4} />

              <RichText content={historyData.tagline} className="pt-1 font-bold text-slate-800 text-xs sm:text-sm" />
            </div>

          </div>

          {/* Right Column: Building Photo (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-50 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={historyData.imageUrl || '/images/durable-building.png'}
                alt="Durable Hospital Supplies Manufacturing Facility in Sialkot, Pakistan"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

        </div>

        {/* Bottom Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 pt-2">
          {cards.map((card) => (
            <div
              key={card.id}
              className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-red-500/30 transition-all duration-300 flex flex-col items-center justify-between text-center space-y-3"
            >
              {/* Red Vector Icon */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center group-hover:scale-110 transition-transform">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.icon || '/images/icon-history-40years.png'}
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


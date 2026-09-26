'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export interface StrengthCard {
  id: string
  title: string
  description: string
  image_url: string
}

export interface CustomBlock {
  id: string
  title: string
  subheading?: string
  description: string
  image_url?: string
}

export interface StrengthsPageData {
  introText: string
  feature: {
    title: string
    subheading?: string
    description: string
    image_url: string
  }
  cards: StrengthCard[]
  customBlocks: CustomBlock[]
}

const DEFAULT_STRENGTHS_DATA: StrengthsPageData = {
  introText:
    'Dr. Frigz is a vertically integrated OEM surgical instrument manufacturer and medical device supply chain partner based in Sialkot, Pakistan, working directly with surgical equipment suppliers, surgical instrument distributors and dental instruments suppliers across the US, EU & UK. From precision forging and CNC machining to EO sterilization and global distribution, every step of our manufacturing process is performed in-house. This gives our distributors, hospital procurement teams and private label healthcare brands complete confidence in quality, compliance and supply chain reliability.',
  feature: {
    title: 'Precision Driven Manufacturing',
    subheading: 'IN-HOUSE EXCELLENCE',
    description:
      'Everything begins with design. We meticulously plan and establish dimensions, tolerances, and metallurgical requirements before production even starts. Our state-of-the-art CNC machinery combined with skilled craftsmanship guarantees that every instrument conforms to exact specifications and international standards.',
    image_url: '/images/process-hand-filing.png',
  },
  cards: [
    {
      id: 'card-1',
      title: 'Our Team',
      description:
        "Our team is the backbone of our success. We are a cohesive group of professionals, technicians, and engineers united by a shared goal: to create exceptional products. Their expertise, dedication, and collaboration are the driving force behind everything we achieve. Our team's passion for excellence is what sets us apart, making them the bloodline of our company and the key to our continued growth and success. We are more than a team; we are Dr Frigz family.",
      image_url: '/images/blog-instruments-tray.png',
    },
    {
      id: 'card-2',
      title: 'Passion for technical mastery',
      description:
        'We have a deep understanding of technicalities, standards, and compliance, and we thrive on challenges that push us to excel. Our ability to see the nuances and subtleties that distinguish a great instrument from a nominal one sets us apart. As technical people with a passion for manufacturing, we embrace the complexities of our industry. This passion is woven into our ethos and reflected in the precision and quality of our products.',
      image_url: '/images/process-wooden-anvil.png',
    },
  ],
  customBlocks: [],
}

export function StrengthsSection() {
  const [data, setData] = useState<StrengthsPageData>(DEFAULT_STRENGTHS_DATA)

  const loadData = () => {
    try {
      const saved = localStorage.getItem('durable_strengths_data')
      if (saved) {
        const parsed = JSON.parse(saved)
        setData((prev) => ({
          introText: parsed.introText ?? prev.introText,
          feature: { ...prev.feature, ...(parsed.feature || {}) },
          cards: Array.isArray(parsed.cards) ? parsed.cards : prev.cards,
          customBlocks: Array.isArray(parsed.customBlocks) ? parsed.customBlocks : prev.customBlocks,
        }))
      }
    } catch (e) {
      console.error('Error loading strengths data from localStorage:', e)
    }
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('durable_content_updated', handleUpdate)
    return () => window.removeEventListener('durable_content_updated', handleUpdate)
  }, [])

  return (
    <div className="w-full bg-[#EAE8E3]/60 py-10 sm:py-16 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* SECTION 1: Intro Overview Paragraph matching SS 2 */}
        {data.introText && (
          <div className="max-w-5xl mx-auto text-center font-serif sm:font-sans">
            <p className="text-base sm:text-lg lg:text-xl font-normal text-slate-800 leading-relaxed text-left sm:text-center">
              {data.introText}
            </p>
          </div>
        )}

        {/* SECTION 2: Feature Block 1 ("Precision Driven Manufacturing") matching SS 2 */}
        {data.feature && (
          <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 items-center">
              
              {/* Image Column */}
              <div className="md:col-span-5 relative h-64 sm:h-80 md:h-full min-h-[300px] w-full bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.feature.image_url || '/images/process-hand-filing.png'}
                  alt={data.feature.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Column */}
              <div className="md:col-span-7 p-6 sm:p-10 lg:p-12 space-y-4">
                {data.feature.subheading && (
                  <span className="text-xs font-black uppercase tracking-widest text-[#E31B23]">
                    {data.feature.subheading}
                  </span>
                )}
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0B1B3D] tracking-tight leading-tight">
                  {data.feature.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                  {data.feature.description}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* SECTION 3: Cards Grid ("Our Team" & "Passion for technical mastery") matching SS 3 & SS 4 */}
        {data.cards && data.cards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {data.cards.map((card) => (
              <div key={card.id} className="space-y-4 flex flex-col h-full">
                
                {/* Card Top Image Block with Rounded Corners matching SS 3 */}
                <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-200 border border-slate-200 shadow-xs group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image_url || '/images/blog-instruments-tray.png'}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Card Title & Content matching SS 4 */}
                <div className="space-y-3 pt-2 flex-1">
                  <h3 className="text-xl sm:text-2xl font-black text-[#0B1B3D] tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-normal text-slate-700 leading-relaxed">
                    {card.description}
                  </p>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* SECTION 4: Additional Custom Content Blocks (Dynamically added from Admin) */}
        {data.customBlocks && data.customBlocks.length > 0 && (
          <div className="space-y-10 pt-4 border-t border-slate-300/60">
            {data.customBlocks.map((block) => (
              <div
                key={block.id}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4"
              >
                {block.subheading && (
                  <span className="text-xs font-bold uppercase tracking-wider text-[#E31B23]">
                    {block.subheading}
                  </span>
                )}
                <h3 className="text-xl sm:text-3xl font-black text-[#0B1B3D]">
                  {block.title}
                </h3>
                {block.image_url && (
                  <div className="relative h-60 sm:h-80 w-full rounded-xl overflow-hidden my-4 bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={block.image_url}
                      alt={block.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  {block.description}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

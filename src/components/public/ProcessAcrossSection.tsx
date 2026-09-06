'use client'

import { useState } from 'react'

export function ProcessAcrossSection() {
  const [activeTab, setActiveTab] = useState('All')

  const tabs = [
    'All',
    'Research & Development',
    'Material Sourcing',
    'Precision Manufacturing',
    'Quality Inspection',
    'Surface Finishing',
    'Sterilization & Cleaning',
    'Testing & Validation',
  ]

  const processItems = [
    {
      id: 1,
      title: 'Material Selection',
      category: 'Material Sourcing',
      image: '/images/process-wooden-anvil.png',
    },
    {
      id: 2,
      title: 'Material Selection',
      category: 'Quality Inspection',
      image: '/images/process-traveler-card.png',
    },
    {
      id: 3,
      title: 'Material Selection',
      category: 'Research & Development',
      image: '/images/process-erp-operator.png',
    },
    {
      id: 4,
      title: 'Material Selection',
      category: 'Precision Manufacturing',
      image: '/images/process-hand-filing.png',
    },
    {
      id: 5,
      title: 'Material Selection',
      category: 'Surface Finishing',
      image: '/images/process-wooden-anvil.png',
    },
    {
      id: 6,
      title: 'Material Selection',
      category: 'Testing & Validation',
      image: '/images/about-surgical-instruments.png',
    },
  ]

  const filteredItems =
    activeTab === 'All'
      ? processItems
      : processItems.filter((item) => item.category === activeTab)

  return (
    <section className="w-full bg-[#FAFAFA] py-8 sm:py-10 relative overflow-hidden border-b border-slate-200">
      {/* Subtle Halftone Background Texture */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#0B1B3D_1.5px,transparent_1.5px)] [background-size:20px_20px]" />

      <div className="max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 sm:space-y-8">
        {/* Top Header Row matching SS 1 */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-1">
          {/* Left Title Block */}
          <div className="space-y-1">
            {/* Dark Navy Pill Badge */}
            <div className="inline-flex items-center gap-1.5 bg-[#0F2942] text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]" />
              OUR DEPARTMENTS
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1B3D] tracking-tight">
              How We Process Across
            </h2>
          </div>

          {/* Right Subtitle Paragraph */}
          <p className="text-xs font-semibold text-slate-500 leading-relaxed max-w-xl">
            Every Department At Durable Hospital Supplies Operates Through A Streamlined And Quality-Driven Workflow To Ensure Precision, Efficiency, And Consistency.
          </p>
        </div>

        {/* Filter Tabs Bar matching SS 1 */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold border-b border-slate-200/80 pb-3">
          {tabs.map((tab, idx) => {
            const isActive = activeTab === tab
            return (
              <div key={tab} className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`transition-colors relative pb-1 ${
                    isActive
                      ? 'text-[#E31B23] font-extrabold'
                      : 'text-slate-700 hover:text-[#0B1B3D]'
                  }`}
                >
                  {tab}
                  {isActive && (
                    <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#E31B23] rounded-full" />
                  )}
                </button>

                {/* Divider Slash */}
                {idx < tabs.length - 1 && (
                  <span className="text-slate-300 font-normal">/</span>
                )}
              </div>
            )
          })}
        </div>

        {/* 6 Gallery Cards Grid matching SS 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {(filteredItems.length > 0 ? filteredItems : processItems).map((item) => (
            <div key={item.id} className="group space-y-2">
              {/* Photo Wrapper with Smooth Rounded Corners */}
              <div className="relative rounded-2xl overflow-hidden shadow-xs group-hover:shadow-xl border border-slate-200/80 aspect-[4/3] transition-all duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Label Underneath matching SS 1 */}
              <p className="text-center font-black text-slate-900 text-xs sm:text-sm tracking-tight group-hover:text-[#E31B23] transition-colors">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

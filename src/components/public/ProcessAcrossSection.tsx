'use client'

import { useState, useEffect } from 'react'

export interface ProcessItem {
  id: string
  stepNumber?: string
  title: string
  category: string
  subtitle?: string
  description?: string
  image: string
}

const DEPARTMENT_CATEGORIES = [
  'Research & Development',
  'Material Sourcing',
  'Precision Manufacturing',
  'Quality Inspection',
  'Surface Finishing',
  'Sterilization & Cleaning',
  'Testing & Validation',
]

const DEFAULT_PROCESS: ProcessItem[] = [
  {
    id: 'p-1',
    stepNumber: '01',
    title: 'Raw Material Forging & Selection',
    category: 'Precision Manufacturing',
    subtitle: 'Precision Manufacturing',
    description: 'German & Japanese stainless steel grade selection.',
    image: '/images/process-wooden-anvil.png',
  },
  {
    id: 'p-2',
    stepNumber: '02',
    title: 'Precision Machining & Hand Filing',
    category: 'Precision Manufacturing',
    subtitle: 'Precision Manufacturing',
    description: 'Master craftsmen hand-file jaw serrations and box joints.',
    image: '/images/process-hand-filing.png',
  },
  {
    id: 'p-3',
    stepNumber: '03',
    title: 'Heat Treatment & Passivation',
    category: 'Precision Manufacturing',
    subtitle: 'Precision Manufacturing',
    description: 'Vacuum heat treatment for long-lasting edge retention.',
    image: '/images/about-surgical-instruments.png',
  },
  {
    id: 'p-4',
    stepNumber: '04',
    title: 'Computer Aided R&D & CAD Prototyping',
    category: 'Research & Development',
    subtitle: 'Research & Development',
    description: '3D CAD modeling, custom instrument prototyping, and ergonomic stress simulation for surgical tools.',
    image: '/images/process-erp-operator.png',
  },
  {
    id: 'p-5',
    stepNumber: '05',
    title: 'German & Japanese Stainless Steel Sourcing',
    category: 'Material Sourcing',
    subtitle: 'Material Sourcing',
    description: 'Strict procurement of AISI 420, 440, and 316L medical grade stainless steel with mill test certificates.',
    image: '/images/process-hand-filing.png',
  },
  {
    id: 'p-6',
    stepNumber: '06',
    title: 'Microscopic & Hardness QC Inspection',
    category: 'Quality Inspection',
    subtitle: 'Quality Inspection',
    description: '100% microscopic inspection under 20x magnification for jaw alignment and Rockwell C hardness testing (48-52 HRC).',
    image: '/images/process-traveler-card.png',
  },
  {
    id: 'p-7',
    stepNumber: '07',
    title: 'Anti-Glare Satin Surface Anodizing',
    category: 'Surface Finishing',
    subtitle: 'Surface Finishing',
    description: 'Passivated non-reflective satin anodizing and electro-polishing eliminating glare under operating room lamps.',
    image: '/images/process-hand-filing.png',
  },
  {
    id: 'p-8',
    stepNumber: '08',
    title: 'Ultrasonic Sterilization & Cleaning',
    category: 'Sterilization & Cleaning',
    subtitle: 'Sterilization & Cleaning',
    description: 'Multi-stage ultrasonic solvent wash, bio-burden cleaning, and ISO Class 7 cleanroom packaging.',
    image: '/images/about-surgical-instruments.png',
  },
  {
    id: 'p-9',
    stepNumber: '09',
    title: 'Boil & Passivation Corrosion Testing',
    category: 'Testing & Validation',
    subtitle: 'Testing & Validation',
    description: 'ASTM F1089 boil test and chemical nitric acid passivation verification to guarantee zero rust.',
    image: '/images/process-erp-operator.png',
  },
]

function normalizeCategory(rawCategory?: string, rawSubtitle?: string): string {
  if (rawCategory && DEPARTMENT_CATEGORIES.includes(rawCategory)) {
    return rawCategory
  }
  const str = `${rawCategory || ''} ${rawSubtitle || ''}`.toLowerCase()
  if (str.includes('research') || str.includes('r&d') || str.includes('cad')) return 'Research & Development'
  if (str.includes('source') || str.includes('material') || str.includes('steel')) return 'Material Sourcing'
  if (str.includes('inspection') || str.includes('qc') || str.includes('microscopic')) return 'Quality Inspection'
  if (str.includes('surface') || str.includes('anodiz') || str.includes('satin') || str.includes('polish')) return 'Surface Finishing'
  if (str.includes('sterili') || str.includes('clean') || str.includes('ultrasonic')) return 'Sterilization & Cleaning'
  if (str.includes('test') || str.includes('validation') || str.includes('boil') || str.includes('corrosion')) return 'Testing & Validation'
  if (str.includes('manuf') || str.includes('forg') || str.includes('machin') || str.includes('filing')) return 'Precision Manufacturing'

  return rawCategory || rawSubtitle || 'Precision Manufacturing'
}

export function ProcessAcrossSection() {
  const [activeTab, setActiveTab] = useState('All')
  const [processItems, setProcessItems] = useState<ProcessItem[]>(DEFAULT_PROCESS)

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

  const loadData = () => {
    try {
      const saved = localStorage.getItem('durable_process_data')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mapped: ProcessItem[] = parsed.map((item: any, idx: number) => ({
            id: item.id || `p-${idx}`,
            stepNumber: item.stepNumber || (item.step_number ? `0${item.step_number}` : `0${idx + 1}`),
            title: item.title,
            category: normalizeCategory(item.category, item.subtitle),
            subtitle: item.subtitle || item.category || '',
            description: item.description || '',
            image: item.image || item.image_url || '/images/process-hand-filing.png',
          }))

          // Merge loaded items with defaults so all 7 departments have at least 1 process step unless explicitly empty
          const existingCategories = new Set(mapped.map((m) => m.category))
          const missingDefaults = DEFAULT_PROCESS.filter((d) => !existingCategories.has(d.category))
          
          setProcessItems([...mapped, ...missingDefaults])
          return
        }
      }
      setProcessItems(DEFAULT_PROCESS)
    } catch (e) {
      console.error('LocalStorage process read error:', e)
      setProcessItems(DEFAULT_PROCESS)
    }
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('durable_content_updated', handleUpdate)
    return () => window.removeEventListener('durable_content_updated', handleUpdate)
  }, [])

  const filteredItems =
    activeTab === 'All'
      ? processItems
      : processItems.filter(
          (item) => item.category?.trim().toLowerCase() === activeTab.trim().toLowerCase()
        )

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
            const count = tab === 'All' ? processItems.length : processItems.filter((i) => i.category === tab).length
            return (
              <div key={tab} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`transition-colors relative pb-1 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#E31B23] font-extrabold'
                      : 'text-slate-700 hover:text-[#0B1B3D]'
                  }`}
                >
                  <span>{tab}</span>
                  {count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                        isActive ? 'bg-red-100 text-[#E31B23]' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  )}
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

        {/* Gallery Cards Grid matching SS 1 */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="group space-y-2">
                {/* Photo Wrapper with Smooth Rounded Corners */}
                <div className="relative rounded-2xl overflow-hidden shadow-xs group-hover:shadow-xl border border-slate-200/80 aspect-[4/3] transition-all duration-300 bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {item.category && (
                    <div className="absolute top-3 left-3 bg-[#0B1B3D]/90 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg">
                      {item.category}
                    </div>
                  )}
                </div>

                {/* Label Underneath matching SS 1 */}
                <p className="text-center font-black text-slate-900 text-xs sm:text-sm tracking-tight group-hover:text-[#E31B23] transition-colors">
                  {item.title}
                </p>
                {item.description && (
                  <p className="text-center text-[11px] text-slate-500 font-medium line-clamp-2 px-2">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500 font-bold text-xs bg-white rounded-2xl border border-slate-200">
            No process steps listed under {activeTab} yet. You can add one in the Admin Panel!
          </div>
        )}
      </div>
    </section>
  )
}


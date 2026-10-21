'use client'

import { useState, useEffect } from 'react'
import { loadPersistentData, getLocalStorageSync } from '@/src/lib/persistentStorage'

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

export const DEFAULT_PROCESS: ProcessItem[] = [
  {
    id: 'proc-1792524647601-dz7i',
    stepNumber: '01',
    title: 'QC Inspection',
    category: 'Research & Development',
    subtitle: 'Research & Development',
    description: 'Rigorous quality control and working-end inspection ensuring precise jaw alignment and exact tolerances.',
    image: 'https://usxgwauwqhasrzaxcvyg.supabase.co/storage/v1/object/public/website-media/uploads/2026-10/1792524632956-qc-inspection-teethworking-end.jpg',
  },
  {
    id: 'proc-1792524708539-rwyv',
    stepNumber: '02',
    title: 'Initial Polishing',
    category: 'Material Sourcing',
    subtitle: 'Material Sourcing',
    description: 'Specialized preliminary polishing removing burrs and surface irregularities before precision finishing.',
    image: 'https://usxgwauwqhasrzaxcvyg.supabase.co/storage/v1/object/public/website-media/uploads/2026-10/1792524686433-initial-polishing.jpg',
  },
  {
    id: 'proc-1792524761468-dnq4',
    stepNumber: '03',
    title: 'Final Setting',
    category: 'Precision Manufacturing',
    subtitle: 'Precision Manufacturing',
    description: 'Expert hand-setting and joint calibration on anvils to guarantee smooth action and perfect closure.',
    image: 'https://usxgwauwqhasrzaxcvyg.supabase.co/storage/v1/object/public/website-media/uploads/2026-10/1792524740321-final-setting.jpg',
  },
  {
    id: 'proc-1792524780419-sqrk',
    stepNumber: '04',
    title: 'Sand Blasting',
    category: 'Quality Inspection',
    subtitle: 'Quality Inspection',
    description: 'Uniform matte satin finish application through micro-fine abrasive blasting eliminating glare.',
    image: 'https://usxgwauwqhasrzaxcvyg.supabase.co/storage/v1/object/public/website-media/uploads/2026-10/1792524771685-sand-blasting.jpg',
  },
  {
    id: 'proc-1792524947519-laser',
    stepNumber: '05',
    title: 'Laser Marking & Etching',
    category: 'Surface Finishing',
    subtitle: 'Surface Finishing',
    description: 'High-precision fiber laser marking for CE marks, lot numbers, barcodes, and custom brand logos.',
    image: 'https://usxgwauwqhasrzaxcvyg.supabase.co/storage/v1/object/public/website-media/uploads/2026-10/1792524947519-laser-markingetching.jpg',
  },
  {
    id: 'proc-1792524995112-weld',
    stepNumber: '06',
    title: 'Laser Welding',
    category: 'Precision Manufacturing',
    subtitle: 'Precision Manufacturing',
    description: 'Advanced micro-laser welding of tungsten carbide inserts and delicate joint components.',
    image: 'https://usxgwauwqhasrzaxcvyg.supabase.co/storage/v1/object/public/website-media/uploads/2026-10/1792524995112-laser-welding.jpg',
  },
  {
    id: 'proc-1792525037867-pack',
    stepNumber: '07',
    title: 'Final Packing',
    category: 'Sterilization & Cleaning',
    subtitle: 'Sterilization & Cleaning',
    description: 'Ultrasonic solvent bath cleaning followed by cleanroom packaging with medical-grade protective pouches.',
    image: 'https://usxgwauwqhasrzaxcvyg.supabase.co/storage/v1/object/public/website-media/uploads/2026-10/1792525037867-final-packing.jpg',
  },
  {
    id: 'proc-1792525066777-disp',
    stepNumber: '08',
    title: 'Dispatch & Logistics',
    category: 'Testing & Validation',
    subtitle: 'Testing & Validation',
    description: 'Final outgoing batch inspection, certificate verification, and secure worldwide express dispatch.',
    image: 'https://usxgwauwqhasrzaxcvyg.supabase.co/storage/v1/object/public/website-media/uploads/2026-10/1792525066777-dispatch.jpg',
  },
  {
    id: 'proc-1792520578949-pass',
    stepNumber: '09',
    title: 'Passivation & Corrosion Testing',
    category: 'Testing & Validation',
    subtitle: 'Testing & Validation',
    description: 'ASTM F1089 boil and copper sulfate testing verifying complete chromium oxide passivation layer against rust.',
    image: 'https://usxgwauwqhasrzaxcvyg.supabase.co/storage/v1/object/public/website-media/uploads/2026-10/1792520578949-dsc0950.jpg',
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
  if (str.includes('surface') || str.includes('anodiz') || str.includes('satin') || str.includes('polish') || str.includes('etching') || str.includes('marking')) return 'Surface Finishing'
  if (str.includes('sterili') || str.includes('clean') || str.includes('ultrasonic') || str.includes('packing')) return 'Sterilization & Cleaning'
  if (str.includes('test') || str.includes('validation') || str.includes('boil') || str.includes('corrosion') || str.includes('dispatch') || str.includes('logistics')) return 'Testing & Validation'
  if (str.includes('manuf') || str.includes('forg') || str.includes('machin') || str.includes('filing') || str.includes('weld') || str.includes('setting')) return 'Precision Manufacturing'

  return rawCategory || rawSubtitle || 'Precision Manufacturing'
}

export function ProcessAcrossSection() {
  const [activeTab, setActiveTab] = useState('All')
  const [processItems, setProcessItems] = useState<ProcessItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = getLocalStorageSync<any[]>('durable_process_data', null as any)
      if (Array.isArray(saved) && saved.length > 0) {
        return saved
          .filter((item: any) => {
            if (!item) return false
            const id = item.id || ''
            const title = (item.title || '').trim().toLowerCase()
            if (id === 'proc-1792547532465-236o') return false
            if (title === 'text' && (!item.description || item.description.trim() === '')) return false
            return true
          })
          .map((item: any, idx: number) => ({
            id: item.id || `p-${idx}`,
            stepNumber:
              item.stepNumber ||
              (item.step_number
                ? item.step_number < 10
                  ? `0${item.step_number}`
                  : `${item.step_number}`
                : `0${idx + 1}`),
            title: item.title || '',
            category: normalizeCategory(item.category, item.subtitle),
            subtitle: item.subtitle || item.category || '',
            description: item.description || '',
            image: item.image || item.image_url || '/images/process-hand-filing.png',
          }))
      }
    }
    return DEFAULT_PROCESS
  })

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
    loadPersistentData<any[]>('durable_process_data', DEFAULT_PROCESS, (data) => {
      if (Array.isArray(data) && data.length > 0) {
        const mapped: ProcessItem[] = data
          .filter((item: any) => {
            if (!item) return false
            const id = item.id || ''
            const title = (item.title || '').trim().toLowerCase()
            if (id === 'proc-1792547532465-236o') return false
            if (title === 'text' && (!item.description || item.description.trim() === '')) return false
            return true
          })
          .map((item: any, idx: number) => ({
            id: item.id || `p-${idx}`,
            stepNumber:
              item.stepNumber ||
              (item.step_number
                ? item.step_number < 10
                  ? `0${item.step_number}`
                  : `${item.step_number}`
                : `0${idx + 1}`),
            title: item.title || '',
            category: normalizeCategory(item.category, item.subtitle),
            subtitle: item.subtitle || item.category || '',
            description: item.description || '',
            image: item.image || item.image_url || '/images/process-hand-filing.png',
          }))
        setProcessItems(mapped)
      } else if (Array.isArray(data) && data.length === 0) {
        setProcessItems([])
      } else {
        setProcessItems(DEFAULT_PROCESS)
      }
    })
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('durable_content_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('durable_content_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
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


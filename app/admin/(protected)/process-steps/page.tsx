'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  ArrowLeft,
  X,
  Save,
  Layers,
  Sparkles,
  Filter,
} from 'lucide-react'
import { AdminMediaUploadPlaceholder } from '@/src/components/admin/AdminMediaUploadPlaceholder'
import { savePersistentData, loadPersistentData } from '@/src/lib/persistentStorage'

export interface ProcessStepItem {
  id: string
  stepNumber: string
  step_number?: number
  title: string
  category: string
  subtitle: string
  description: string
  image: string
  image_url?: string
}

export const DEPARTMENT_CATEGORIES = [
  'Research & Development',
  'Material Sourcing',
  'Precision Manufacturing',
  'Quality Inspection',
  'Surface Finishing',
  'Sterilization & Cleaning',
  'Testing & Validation',
]

const DEFAULT_STEPS: ProcessStepItem[] = [
  {
    id: 'step-1',
    stepNumber: '01',
    step_number: 1,
    title: 'Computer Aided R&D & CAD Prototyping',
    category: 'Research & Development',
    subtitle: 'R&D & Engineering',
    description: '3D CAD modeling, custom instrument prototyping, and ergonomic stress simulation for surgical tools.',
    image: '/images/process-erp-operator.png',
  },
  {
    id: 'step-2',
    stepNumber: '02',
    step_number: 2,
    title: 'German & Japanese Stainless Steel Sourcing',
    category: 'Material Sourcing',
    subtitle: 'Raw Metallurgy Sourcing',
    description: 'Strict procurement of AISI 420, 440, and 316L medical grade stainless steel with mill test certificates.',
    image: '/images/process-hand-filing.png',
  },
  {
    id: 'step-3',
    stepNumber: '03',
    step_number: 3,
    title: 'Precision Hot Drop Forging & Machining',
    category: 'Precision Manufacturing',
    subtitle: 'Precision Manufacturing',
    description: 'Precision hot drop forging at 1100°C followed by CNC milling and master filing of serrations.',
    image: '/images/process-wooden-anvil.png',
  },
  {
    id: 'step-4',
    stepNumber: '04',
    step_number: 4,
    title: 'Microscopic & Hardness QC Inspection',
    category: 'Quality Inspection',
    subtitle: 'Quality Inspection',
    description: '100% microscopic inspection under 20x magnification for jaw alignment and Rockwell C hardness testing (48-52 HRC).',
    image: '/images/process-traveler-card.png',
  },
  {
    id: 'step-5',
    stepNumber: '05',
    step_number: 5,
    title: 'Anti-Glare Satin Surface Anodizing',
    category: 'Surface Finishing',
    subtitle: 'Surface Finishing',
    description: 'Passivated non-reflective satin anodizing and electro-polishing eliminating glare under operating room lamps.',
    image: '/images/process-hand-filing.png',
  },
  {
    id: 'step-6',
    stepNumber: '06',
    step_number: 6,
    title: 'Ultrasonic Sterilization & Cleaning',
    category: 'Sterilization & Cleaning',
    subtitle: 'Sterilization & Cleaning',
    description: 'Multi-stage ultrasonic solvent wash, bio-burden cleaning, and ISO Class 7 cleanroom packaging.',
    image: '/images/about-surgical-instruments.png',
  },
  {
    id: 'step-7',
    stepNumber: '07',
    step_number: 7,
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

export default function AdminProcessStepsPage() {
  const [steps, setSteps] = useState<ProcessStepItem[]>(DEFAULT_STEPS)
  const [selectedTab, setSelectedTab] = useState<string>('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStep, setEditingStep] = useState<ProcessStepItem | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [saveMessage, setSaveMessage] = useState('Process steps updated and published live!')

  const [newStep, setNewStep] = useState({
    stepNumber: '',
    title: '',
    category: 'Research & Development',
    subtitle: '',
    description: '',
    image: '/images/process-hand-filing.png',
  })

  // Load from Cloud / LocalStorage on mount
  useEffect(() => {
    loadPersistentData('durable_process_data', DEFAULT_STEPS, (parsed) => {
      if (Array.isArray(parsed) && parsed.length > 0) {
        const loaded: ProcessStepItem[] = parsed.map((item: any, idx: number) => ({
          id: item.id || `step-${idx + 1}`,
          stepNumber: item.stepNumber || (item.step_number ? `0${item.step_number}` : `0${idx + 1}`),
          step_number: item.step_number || idx + 1,
          title: item.title || '',
          category: normalizeCategory(item.category, item.subtitle),
          subtitle: item.subtitle || item.category || '',
          description: item.description || '',
          image: item.image || item.image_url || '/images/process-hand-filing.png',
          image_url: item.image_url || item.image || '/images/process-hand-filing.png',
        }))

        // Merge loaded with default items if any category is missing
        const existingCats = new Set(loaded.map((l) => l.category))
        const missing = DEFAULT_STEPS.filter((d) => !existingCats.has(d.category))
        const merged = [...loaded, ...missing]

        setSteps(merged)
      }
    })
  }, [])

  const saveToStorage = (updatedSteps: ProcessStepItem[], customMsg?: string) => {
    try {
      savePersistentData('durable_process_data', updatedSteps)
      setSaveMessage(customMsg || 'Process steps updated and published live across all devices!')
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 4000)
    } catch (e) {
      console.error('Error saving durable_process_data:', e)
    }
  }

  const handleOpenAddModal = (defaultCategory?: string) => {
    setEditingStep(null)
    const targetCategory = defaultCategory && defaultCategory !== 'All' ? defaultCategory : selectedTab !== 'All' ? selectedTab : 'Research & Development'
    setNewStep({
      stepNumber: `0${steps.length + 1}`,
      title: '',
      category: targetCategory,
      subtitle: targetCategory,
      description: '',
      image: '/images/process-hand-filing.png',
    })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (step: ProcessStepItem) => {
    setEditingStep(step)
    setNewStep({
      stepNumber: step.stepNumber || `0${step.step_number || 1}`,
      title: step.title,
      category: step.category,
      subtitle: step.subtitle || step.category,
      description: step.description,
      image: step.image || step.image_url || '/images/process-hand-filing.png',
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this process step?')) {
      const updated = steps.filter((s) => s.id !== id)
      setSteps(updated)
      saveToStorage(updated, 'Process step deleted & changes published live!')
    }
  }

  const handleSaveStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStep.title.trim()) return

    let updated: ProcessStepItem[]
    if (editingStep) {
      updated = steps.map((s) =>
        s.id === editingStep.id
          ? {
              ...s,
              stepNumber: newStep.stepNumber,
              title: newStep.title,
              category: newStep.category,
              subtitle: newStep.subtitle || newStep.category,
              description: newStep.description,
              image: newStep.image,
              image_url: newStep.image,
            }
          : s
      )
    } else {
      const createdItem: ProcessStepItem = {
        id: `step-${Date.now()}`,
        stepNumber: newStep.stepNumber || `0${steps.length + 1}`,
        step_number: steps.length + 1,
        title: newStep.title,
        category: newStep.category,
        subtitle: newStep.subtitle || newStep.category,
        description: newStep.description,
        image: newStep.image,
        image_url: newStep.image,
      }
      updated = [...steps, createdItem]
    }

    setSteps(updated)
    saveToStorage(updated, editingStep ? 'Process step updated successfully!' : 'New process step added successfully!')
    setIsModalOpen(false)
  }

  const filteredSteps =
    selectedTab === 'All'
      ? steps
      : steps.filter((s) => s.category.trim().toLowerCase() === selectedTab.trim().toLowerCase())

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 px-4 sm:px-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Company Management</span>
            <span>•</span>
            <span className="text-[#E31B23] font-black">Manufacturing Process Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1B3D] tracking-tight">
            How We Process Across - Departments Manager
          </h1>
          <p className="text-xs text-slate-500 font-medium max-w-2xl">
            Create, edit, delete, and organize process steps for all 7 manufacturing departments ({steps.length} total steps across {DEPARTMENT_CATEGORIES.length} departments). All changes persist automatically upon refresh and update the website live.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin"
            className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          <button
            type="button"
            onClick={() => saveToStorage(steps, 'All process steps saved & published live!')}
            className="px-5 py-2.5 text-xs font-black text-white bg-[#0B1B3D] hover:bg-slate-900 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenAddModal()}
            className="px-5 py-2.5 text-xs font-black text-white bg-[#E31B23] hover:bg-red-700 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Process Step</span>
          </button>
        </div>
      </div>

      {/* Success Alert Banner */}
      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 text-emerald-800 text-xs font-bold shadow-xs animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{saveMessage}</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider bg-emerald-200/80 px-2 py-0.5 rounded-md text-emerald-900 font-black">
            SAVED LIVE
          </span>
        </div>
      )}

      {/* Overview Department Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div
          onClick={() => setSelectedTab('All')}
          className={`p-3 rounded-2xl border transition-all cursor-pointer text-center space-y-1 ${
            selectedTab === 'All'
              ? 'bg-[#0B1B3D] text-white border-[#0B1B3D] shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-black uppercase tracking-wider opacity-80">ALL DEPT</div>
          <div className="text-xl font-black">{steps.length}</div>
        </div>

        {DEPARTMENT_CATEGORIES.map((dept) => {
          const deptCount = steps.filter((s) => s.category === dept).length
          const isSelected = selectedTab === dept
          return (
            <div
              key={dept}
              onClick={() => setSelectedTab(dept)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer text-center space-y-1 ${
                isSelected
                  ? 'bg-[#E31B23] text-white border-[#E31B23] shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-[9px] font-black uppercase tracking-wider truncate" title={dept}>
                {dept.split(' ')[0]}
              </div>
              <div className="text-xl font-black">{deptCount}</div>
            </div>
          )
        })}
      </div>

      {/* Filter Tabs Navigation */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-black text-[#0B1B3D]">
            <Filter className="w-4 h-4 text-[#E31B23]" />
            <span>SELECT PROCESS SECTION / DEPARTMENT ({DEPARTMENT_CATEGORIES.length} DEPARTMENTS)</span>
          </div>

          <span className="text-[11px] font-semibold text-slate-500">
            Showing <strong className="text-slate-900">{filteredSteps.length}</strong> process step(s) under{' '}
            <span className="text-[#E31B23] font-bold">{selectedTab}</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedTab('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedTab === 'All'
                ? 'bg-[#0B1B3D] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Departments ({steps.length})
          </button>

          {DEPARTMENT_CATEGORIES.map((cat) => {
            const count = steps.filter((s) => s.category === cat).length
            const active = selectedTab === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedTab(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  active
                    ? 'bg-[#E31B23] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Steps List */}
      {filteredSteps.length > 0 ? (
        <div className="space-y-4">
          {filteredSteps.map((step) => (
            <div
              key={step.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-5 min-w-0 flex-1">
                <div className="w-14 h-14 rounded-2xl bg-[#0B1B3D] text-white flex items-center justify-center font-mono font-black text-xl shrink-0 shadow-xs">
                  {step.stepNumber || `0${step.step_number || 1}`}
                </div>

                <div className="w-24 h-20 rounded-2xl bg-slate-900 border border-slate-200 overflow-hidden shrink-0 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={step.image || step.image_url}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold text-[#E31B23] bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {step.category}
                    </span>
                    {step.subtitle && (
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        • {step.subtitle}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-black text-[#0B1B3D] truncate">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 max-w-3xl">
                    {step.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(step)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-[#0B1B3D] rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(step.id)}
                  className="px-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-red-200/60"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E31B23] flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-[#0B1B3D]">No Process Steps in {selectedTab}</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
              There are currently no process items created under {selectedTab}. Click below to add a new process step for this department section.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleOpenAddModal(selectedTab)}
            className="px-5 py-2.5 text-xs font-black text-white bg-[#E31B23] hover:bg-red-700 rounded-xl shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Process Step under {selectedTab}</span>
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4 text-[#E31B23]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0B1B3D]">
                    {editingStep ? 'Edit Process Step' : 'Add New Process Step'}
                  </h3>
                  <p className="text-xs text-slate-500">Configure manufacturing step details & department section.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStep} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Department Section <span className="text-[#E31B23]">*</span>
                  </label>
                  <select
                    required
                    value={newStep.category}
                    onChange={(e) => setNewStep({ ...newStep, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-[#0B1B3D]"
                  >
                    {DEPARTMENT_CATEGORIES.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Step Number / Badge <span className="text-[#E31B23]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newStep.stepNumber}
                    onChange={(e) => setNewStep({ ...newStep, stepNumber: e.target.value })}
                    placeholder="e.g. 01"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-[#0B1B3D]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Step Title <span className="text-[#E31B23]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newStep.title}
                  onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                  placeholder="e.g. Computer Aided R&D & CAD Prototyping"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-[#0B1B3D]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider">Subtitle / Tag</label>
                <input
                  type="text"
                  value={newStep.subtitle}
                  onChange={(e) => setNewStep({ ...newStep, subtitle: e.target.value })}
                  placeholder="e.g. R&D & Engineering"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#0B1B3D]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Step Description <span className="text-[#E31B23]">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={newStep.description}
                  onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                  placeholder="Describe the manufacturing workflow, machines used, quality standards, or precision checks..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-[#0B1B3D]"
                />
              </div>

              <div className="space-y-1.5">
                <AdminMediaUploadPlaceholder
                  label="Process Step Image"
                  value={newStep.image}
                  onChange={(url) => setNewStep({ ...newStep, image: url })}
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-black text-white bg-[#E31B23] hover:bg-red-700 rounded-xl shadow-md cursor-pointer"
                >
                  {editingStep ? 'Update Process Step' : 'Save & Publish Step'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

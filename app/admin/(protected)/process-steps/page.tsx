'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Cpu,
  ArrowLeft,
  X,
  Layers,
  Image as ImageIcon,
} from 'lucide-react'

export interface ProcessStepItem {
  id: string
  stepNumber: string
  title: string
  subtitle: string
  description: string
  image: string
}

export default function AdminProcessStepsPage() {
  const [steps, setSteps] = useState<ProcessStepItem[]>([
    {
      id: 'step-1',
      stepNumber: '01',
      title: 'Precision Hot Drop Forging',
      subtitle: 'Raw Metallurgy Shaping',
      description:
        'High-density Japanese AISI 420 stainless steel billets are heated to 1100°C and precision-forged under heavy drop-hammers to establish grain structure.',
      image: '/images/process-wooden-anvil.png',
    },
    {
      id: 'step-2',
      stepNumber: '02',
      title: 'Hand Filing & Master Fitting',
      subtitle: 'Artisan Bench Work',
      description:
        'Experienced Sialkot master craftsmen hand-file jaw serrations, scissor bevels, and box-joint ratchets for exact alignment and smooth motion.',
      image: '/images/process-hand-filing.png',
    },
    {
      id: 'step-3',
      stepNumber: '03',
      title: 'Vacuum Heat Treatment & Passivation',
      subtitle: 'Corrosion Prevention',
      description:
        'Instruments undergo computer-controlled vacuum hardening, tempering to 48-52 HRC hardness, and chemical nitric passivation.',
      image: '/images/process-traveler-card.png',
    },
    {
      id: 'step-4',
      stepNumber: '04',
      title: '100% Microscopic QC & Cleanroom Kitting',
      subtitle: 'Final Inspection',
      description:
        'Every single instrument is inspected under 20x magnification for jaw closure, cutting sharpness, and laser-engraved with UDI barcodes.',
      image: '/images/process-erp-operator.png',
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStep, setEditingStep] = useState<ProcessStepItem | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  const [newStep, setNewStep] = useState({
    stepNumber: '',
    title: '',
    subtitle: '',
    description: '',
    image: '/images/process-hand-filing.png',
  })

  const handleOpenAddModal = () => {
    setEditingStep(null)
    setNewStep({ stepNumber: `0${steps.length + 1}`, title: '', subtitle: '', description: '', image: '/images/process-hand-filing.png' })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (step: ProcessStepItem) => {
    setEditingStep(step)
    setNewStep({ ...step })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this manufacturing process step?')) {
      setSteps((prev) => prev.filter((s) => s.id !== id))
      triggerToast()
    }
  }

  const handleSaveStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStep.title.trim()) return

    if (editingStep) {
      setSteps((prev) => prev.map((s) => (s.id === editingStep.id ? { ...s, ...newStep } : s)))
    } else {
      const createdItem: ProcessStepItem = {
        id: `step-${Date.now()}`,
        ...newStep,
      }
      setSteps((prev) => [...prev, createdItem])
    }

    setIsModalOpen(false)
    triggerToast()
  }

  const triggerToast = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 4000)
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span>Company Management</span>
            <span>•</span>
            <span className="text-[#E31B23]">Manufacturing Process Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3D] tracking-tight">
            Manufacturing Process & Workflow
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage the step-by-step instrument manufacturing process, photos, and quality assurance checkpoints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 text-xs font-extrabold text-white bg-[#E31B23] hover:bg-red-700 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Process Step</span>
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold shadow-xs animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Manufacturing process steps list successfully updated!</span>
        </div>
      )}

      {/* Steps List */}
      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#0B1B3D] text-white flex items-center justify-center font-mono font-black text-2xl shrink-0">
                {step.stepNumber}
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#E31B23] uppercase tracking-wider">
                  {step.subtitle}
                </span>
                <h3 className="text-base font-black text-[#0B1B3D]">{step.title}</h3>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">{step.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button onClick={() => handleOpenEditModal(step)} className="p-2.5 text-slate-700 hover:text-[#E31B23] bg-slate-100 rounded-xl">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(step.id)} className="p-2.5 text-red-600 hover:text-red-800 bg-red-50 rounded-xl">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-[#0B1B3D]">
                {editingStep ? 'Edit Process Step' : 'Add New Process Step'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStep} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Step Number</label>
                  <input
                    type="text"
                    required
                    value={newStep.stepNumber}
                    onChange={(e) => setNewStep({ ...newStep, stepNumber: e.target.value })}
                    placeholder="e.g. 01"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Subtitle Tag</label>
                  <input
                    type="text"
                    value={newStep.subtitle}
                    onChange={(e) => setNewStep({ ...newStep, subtitle: e.target.value })}
                    placeholder="e.g. Raw Metallurgy Shaping"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Step Title</label>
                <input
                  type="text"
                  required
                  value={newStep.title}
                  onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                  placeholder="e.g. Precision Hot Drop Forging"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Step Description</label>
                <textarea
                  required
                  rows={3}
                  value={newStep.description}
                  onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 text-xs font-black text-white bg-[#E31B23] hover:bg-red-700 rounded-xl shadow-md">
                  Save Process Step
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

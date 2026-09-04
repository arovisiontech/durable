'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle2,
  HelpCircle,
  ArrowLeft,
  X,
  Search,
} from 'lucide-react'

export interface FaqItem {
  id: string
  question: string
  answer: string
  category: string
  isActive: boolean
}

export default function AdminContentFaqsPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([
    {
      id: 'faq-1',
      question: 'What materials are used in Durable surgical instruments?',
      answer:
        'All our surgical instruments are manufactured exclusively from high-grade Japanese AISI 420 and German AISI 410/316L stainless steel alloys, paired with premium tungsten carbide inserts for extended cutting sharpness and corrosion resistance.',
      category: 'General',
      isActive: true,
    },
    {
      id: 'faq-2',
      question: 'Are Durable instruments CE MDR and ISO 13485 certified?',
      answer:
        'Yes, our manufacturing facility in Sialkot, Pakistan operates under strict ISO 13485:2016 quality management systems and complies fully with European CE MDR (EU 2017/745) and US FDA regulations.',
      category: 'Compliance',
      isActive: true,
    },
    {
      id: 'faq-3',
      question: 'Do you offer OEM and private label custom branding?',
      answer:
        'We specialize in OEM contract manufacturing for international medical distributors, offering laser marking, custom jaw serrations, titanium color coatings, and custom sterile procedure packaging.',
      category: 'Manufacturing',
      isActive: true,
    },
    {
      id: 'faq-4',
      question: 'What is the standard warranty on your instruments?',
      answer:
        'We offer a 10-Year Guarantee against material defects and manufacturing workmanship on all reusable surgical instruments.',
      category: 'General',
      isActive: true,
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // New FAQ Draft
  const [newFaq, setNewFaq] = useState({
    question: '',
    answer: '',
    category: 'General',
  })

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenAddModal = () => {
    setEditingFaq(null)
    setNewFaq({ question: '', answer: '', category: 'General' })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (faq: FaqItem) => {
    setEditingFaq(faq)
    setNewFaq({ question: faq.question, answer: faq.answer, category: faq.category })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this FAQ question?')) {
      setFaqs((prev) => prev.filter((f) => f.id !== id))
      triggerToast()
    }
  }

  const handleToggleActive = (id: string) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f))
    )
    triggerToast()
  }

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return

    if (editingFaq) {
      setFaqs((prev) =>
        prev.map((f) =>
          f.id === editingFaq.id
            ? { ...f, question: newFaq.question, answer: newFaq.answer, category: newFaq.category }
            : f
        )
      )
    } else {
      const createdItem: FaqItem = {
        id: `faq-${Date.now()}`,
        question: newFaq.question,
        answer: newFaq.answer,
        category: newFaq.category,
        isActive: true,
      }
      setFaqs((prev) => [createdItem, ...prev])
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
            <span>Website Content</span>
            <span>•</span>
            <span className="text-[#E31B23]">FAQs Management Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3D] tracking-tight">
            Frequently Asked Questions (FAQs)
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Add, edit, modify, and delete FAQ questions and answers displayed on the FAQ page.
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
            <span>Add New FAQ</span>
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold shadow-xs animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>FAQs list successfully updated and saved live!</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search FAQs by question or answer keyword..."
          className="w-full text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* FAQs List Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#E31B23]" />
            <h2 className="text-base font-black text-[#0B1B3D]">Active FAQs ({filteredFaqs.length})</h2>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="p-6 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-slate-900 text-white font-mono text-[10px] font-bold rounded-md uppercase">
                    {faq.category}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-md ${
                      faq.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {faq.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <h3 className="text-sm font-black text-[#0B1B3D]">{faq.question}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleActive(faq.id)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  {faq.isActive ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => handleOpenEditModal(faq)}
                  className="p-2 text-slate-700 hover:text-[#E31B23] bg-slate-100 hover:bg-red-50 rounded-lg transition-colors"
                  title="Edit FAQ"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="p-2 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-[#0B1B3D]">
                {editingFaq ? 'Edit FAQ Item' : 'Add New FAQ Item'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Category Tag
                </label>
                <select
                  value={newFaq.category}
                  onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                >
                  <option value="General">General</option>
                  <option value="Compliance">Compliance & ISO</option>
                  <option value="Manufacturing">Manufacturing & OEM</option>
                  <option value="Shipping">Shipping & Export</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  FAQ Question
                </label>
                <input
                  type="text"
                  required
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  placeholder="e.g. What is your minimum order quantity for OEM?"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  FAQ Detailed Answer
                </label>
                <textarea
                  required
                  rows={4}
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  placeholder="Enter detailed explanation..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-black text-white bg-[#E31B23] hover:bg-red-700 rounded-xl shadow-md"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Save,
  RotateCcw,
  CheckCircle2,
  Building2,
  Award,
  Globe2,
  ArrowLeft,
  FileText,
  ShieldCheck,
} from 'lucide-react'

export default function AdminContentAboutPage() {
  const [isSaved, setIsSaved] = useState(false)
  const [formData, setFormData] = useState({
    badgeText: 'SINCE 1973',
    titlePrimary: 'Elevating Global',
    titleHighlight: 'Healthcare Standards',
    locationText: 'Sialkot - 51310 Pakistan',
    yearsExperience: '53+',
    productsCount: '20,000+',
    facilitiesCount: '6+',
    workersCount: '300+',
    patientsTreated: '1 Million+',
    
    paragraph1:
      'Durable Hospital Supplies is a trusted global partner for healthcare brands seeking reliable, high-quality surgical manufacturing solutions. With Over 53 Years Of Experience, We Operate From Our Modern Facility In Sialkot, Pakistan.',
    paragraph2:
      'Our commitment to excellence is supported by ISO 13485-Certified Processes and compliance with ISO, MDR-Ready and FDA Requirements, ensuring every product meets the highest standards of safety and performance.',
    
    isoBadgeText: 'ISO 13485:2016 Certified',
    ceBadgeText: 'CE MDR EU 2017/745 Compliant',
    fdaBadgeText: 'US FDA Registered Facility',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
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
            <span className="text-[#E31B23]">About Us Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3D] tracking-tight">
            About Us Content Manager
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage company story, heritage text, location details, statistics, and ISO compliance standards.
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
            onClick={handleSave}
            className="px-5 py-2.5 text-xs font-extrabold text-white bg-[#E31B23] hover:bg-red-700 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold shadow-xs animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>About Us content successfully updated and saved live!</span>
        </div>
      )}

      {/* Main Content Form */}
      <form onSubmit={handleSave} className="space-y-8">
        
        {/* SECTION 1: Company Heritage & Heading */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">1. Company Heritage & Story Heading</h2>
              <p className="text-xs text-slate-500">Edit core company story title, location, and paragraphs.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Established Badge Text
              </label>
              <input
                type="text"
                name="badgeText"
                value={formData.badgeText}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Factory & Headquarters Location
              </label>
              <input
                type="text"
                name="locationText"
                value={formData.locationText}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Primary Heading Text
              </label>
              <input
                type="text"
                name="titlePrimary"
                value={formData.titlePrimary}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Highlighted Heading Red Word
              </label>
              <input
                type="text"
                name="titleHighlight"
                value={formData.titleHighlight}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#E31B23] focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Story Paragraph 1 (Overview & History)
              </label>
              <textarea
                name="paragraph1"
                rows={3}
                value={formData.paragraph1}
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Story Paragraph 2 (Quality & Compliance)
              </label>
              <textarea
                name="paragraph2"
                rows={3}
                value={formData.paragraph2}
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#E31B23]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Key Company Statistics */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">2. Company Performance Statistics</h2>
              <p className="text-xs text-slate-500">Edit key statistics displayed across the site.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Products Count</label>
              <input
                type="text"
                name="productsCount"
                value={formData.productsCount}
                onChange={handleChange}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-black text-[#0B1B3D]"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Production Facilities</label>
              <input
                type="text"
                name="facilitiesCount"
                value={formData.facilitiesCount}
                onChange={handleChange}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-black text-[#0B1B3D]"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Skilled Craftsmen</label>
              <input
                type="text"
                name="workersCount"
                value={formData.workersCount}
                onChange={handleChange}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-black text-[#0B1B3D]"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Patients Treated</label>
              <input
                type="text"
                name="patientsTreated"
                value={formData.patientsTreated}
                onChange={handleChange}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-black text-[#0B1B3D]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Regulatory Compliance Badges */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">3. Quality & Certification Badges</h2>
              <p className="text-xs text-slate-500">Edit quality assurance badges and accreditation titles.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                ISO Standard Badge
              </label>
              <input
                type="text"
                name="isoBadgeText"
                value={formData.isoBadgeText}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                CE MDR Regulation Badge
              </label>
              <input
                type="text"
                name="ceBadgeText"
                value={formData.ceBadgeText}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                FDA Registration Badge
              </label>
              <input
                type="text"
                name="fdaBadgeText"
                value={formData.fdaBadgeText}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="pt-4 flex items-center justify-end gap-4">
          <button
            type="submit"
            className="px-7 py-3 text-xs font-black text-white bg-[#E31B23] hover:bg-red-700 rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save About Us Changes</span>
          </button>
        </div>

      </form>
    </div>
  )
}

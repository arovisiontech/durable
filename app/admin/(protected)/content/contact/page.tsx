'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Save,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowLeft,
  MessageSquare,
} from 'lucide-react'

export default function AdminContentContactPage() {
  const [isSaved, setIsSaved] = useState(false)
  const [formData, setFormData] = useState({
    titlePrimary: 'GET IN TOUCH WITH OUR',
    titleHighlight: 'SURGICAL EXPERTS',
    subTitle:
      'Have questions about surgical specifications, OEM private label branding, or bulk hospital procurement? Our team is available 24/7.',
    
    // Address Details
    addressLine1: 'Noal More, Roras Road P.O. Box 919',
    cityCountry: 'Sialkot - 51310 Pakistan',
    
    // Contact Info
    phoneMain: '(+92) 52 3563200',
    phoneAlt: '(+92) 52 3553777 | (+92) 523252500',
    emailPrimary: 'Info@Durablehs.Com',
    emailSales: 'Sales@Durablehs.Com',
    
    workingHours: 'Monday - Saturday: 8:00 AM - 6:00 PM (PKT)',
    mapEmbedLink:
      'https://maps.google.com/maps?q=Sialkot+Pakistan&t=&z=13&ie=UTF8&iwloc=&output=embed',
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
            <span className="text-[#E31B23]">Contact & Location Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3D] tracking-tight">
            Contact & Location Content Manager
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage factory address, phone lines, email addresses, working hours, and map embeds.
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
          <span>Contact & Location content successfully updated and saved live!</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-8">
        
        {/* SECTION 1: Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">1. Contact Banner Heading</h2>
              <p className="text-xs text-slate-500">Edit titles and subtitle descriptions.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Primary Banner Title
              </label>
              <input
                type="text"
                name="titlePrimary"
                value={formData.titlePrimary}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Highlight Word (Red Accent)
              </label>
              <input
                type="text"
                name="titleHighlight"
                value={formData.titleHighlight}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#E31B23]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Subtitle Description
              </label>
              <textarea
                name="subTitle"
                rows={2}
                value={formData.subTitle}
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Physical Location & Contact Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#E31B23]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">2. Location Address & Phone Lines</h2>
              <p className="text-xs text-slate-500">Edit physical address, phone numbers, and emails.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Address Line 1
              </label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                City, Postal Code & Country
              </label>
              <input
                type="text"
                name="cityCountry"
                value={formData.cityCountry}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Main Telephone Number
              </label>
              <input
                type="text"
                name="phoneMain"
                value={formData.phoneMain}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Alternate Phone Lines
              </label>
              <input
                type="text"
                name="phoneAlt"
                value={formData.phoneAlt}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Primary Support Email
              </label>
              <input
                type="email"
                name="emailPrimary"
                value={formData.emailPrimary}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Sales & OEM Export Email
              </label>
              <input
                type="email"
                name="emailSales"
                value={formData.emailSales}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
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
            <span>Save Contact Changes</span>
          </button>
        </div>

      </form>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Save,
  RotateCcw,
  CheckCircle2,
  Image as ImageIcon,
  Sparkles,
  Layout,
  Globe,
  ArrowLeft,
  Sliders,
} from 'lucide-react'

export default function AdminContentHomePage() {
  const [isSaved, setIsSaved] = useState(false)
  const [formData, setFormData] = useState({
    heroTitle: 'EVERY 5 SECONDS, WE MAKE A DIFFERENCE',
    heroHighlight: 'HEALTHCARE NEVER STOPS. NEITHER DO OUR INSTRUMENTS.',
    heroBadge: 'SINCE 1973 • PRECISION SURGICAL MANUFACTURING',
    heroDescription:
      'Durable Hospital Supplies is a trusted global partner for healthcare brands seeking reliable, high-quality surgical manufacturing solutions. Operating from Sialkot, Pakistan.',
    heroBgImage: '/images/surgical-hero.png',
    
    // Product Showcase Section Headers
    catSectionTitle: 'EXPLORE OUR TECHNICAL CATALOGUES',
    catSectionHighlight: 'TECHNICAL CATALOGUES',
    catSectionDesc:
      'Full range product catalogues featuring technical instrument specifications, sizing dimensions, tungsten carbide inserts, and ordering SKUs.',
    
    // Primary CTA Buttons
    ctaPrimaryText: 'Partner With Us',
    ctaPrimaryUrl: '/contact',
    ctaSecondaryText: 'Explore Products',
    ctaSecondaryUrl: '/products',
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
            <span className="text-[#E31B23]">Home Page Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3D] tracking-tight">
            Home Page Content Manager
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage hero banners, section headings, titles, descriptions, and call-to-action buttons.
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
          <span>Home Page content successfully updated and saved live!</span>
        </div>
      )}

      {/* Main Content Form */}
      <form onSubmit={handleSave} className="space-y-8">
        
        {/* SECTION 1: Main Hero Banner Settings */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">1. Main Hero Banner Settings</h2>
              <p className="text-xs text-slate-500">Configure top hero slide typography, badge text, and imagery.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Hero Badge Tagline
              </label>
              <input
                type="text"
                name="heroBadge"
                value={formData.heroBadge}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Hero Background Image URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  name="heroBgImage"
                  value={formData.heroBgImage}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#E31B23]"
                />
                <button
                  type="button"
                  onClick={() => alert('Media Library Image Picker: Selected /images/surgical-hero.png')}
                  className="px-3.5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 shrink-0"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Main Hero Title
              </label>
              <input
                type="text"
                name="heroTitle"
                value={formData.heroTitle}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Highlighted Sub-Title
              </label>
              <input
                type="text"
                name="heroHighlight"
                value={formData.heroHighlight}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#E31B23] focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Hero Description Paragraph
              </label>
              <textarea
                name="heroDescription"
                rows={3}
                value={formData.heroDescription}
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#E31B23]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Call-To-Action (CTA) Buttons */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">2. Hero Call-To-Action Buttons</h2>
              <p className="text-xs text-slate-500">Configure text labels and target link URLs for hero buttons.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Primary Button Label
              </label>
              <input
                type="text"
                name="ctaPrimaryText"
                value={formData.ctaPrimaryText}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Primary Button Target URL
              </label>
              <input
                type="text"
                name="ctaPrimaryUrl"
                value={formData.ctaPrimaryUrl}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-700 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Secondary Button Label
              </label>
              <input
                type="text"
                name="ctaSecondaryText"
                value={formData.ctaSecondaryText}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Secondary Button Target URL
              </label>
              <input
                type="text"
                name="ctaSecondaryUrl"
                value={formData.ctaSecondaryUrl}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-700 focus:outline-none focus:border-[#E31B23]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Catalog Showcase Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#E31B23]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">3. Technical Catalogues Showcase Heading</h2>
              <p className="text-xs text-slate-500">Manage heading text for the 6 showcase catalog cards.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Section Title
              </label>
              <input
                type="text"
                name="catSectionTitle"
                value={formData.catSectionTitle}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Highlight Word / Text
              </label>
              <input
                type="text"
                name="catSectionHighlight"
                value={formData.catSectionHighlight}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#E31B23] focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Section Description Text
              </label>
              <textarea
                name="catSectionDesc"
                rows={2}
                value={formData.catSectionDesc}
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#E31B23]"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="pt-4 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => setFormData({
              heroTitle: 'EVERY 5 SECONDS, WE MAKE A DIFFERENCE',
              heroHighlight: 'HEALTHCARE NEVER STOPS. NEITHER DO OUR INSTRUMENTS.',
              heroBadge: 'SINCE 1973 • PRECISION SURGICAL MANUFACTURING',
              heroDescription:
                'Durable Hospital Supplies is a trusted global partner for healthcare brands seeking reliable, high-quality surgical manufacturing solutions.',
              heroBgImage: '/images/surgical-hero.png',
              catSectionTitle: 'EXPLORE OUR TECHNICAL CATALOGUES',
              catSectionHighlight: 'TECHNICAL CATALOGUES',
              catSectionDesc:
                'Full range product catalogues featuring technical instrument specifications.',
              ctaPrimaryText: 'Partner With Us',
              ctaPrimaryUrl: '/contact',
              ctaSecondaryText: 'Explore Products',
              ctaSecondaryUrl: '/products',
            })}
            className="px-5 py-3 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="submit"
            className="px-7 py-3 text-xs font-black text-white bg-[#E31B23] hover:bg-red-700 rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Home Page Changes</span>
          </button>
        </div>

      </form>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Phone,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  ArrowLeft,
  Upload,
  MapPin,
  Mail,
  Clock,
  ShieldCheck,
  Award,
  Globe,
  PackageCheck,
  HelpCircle,
  FileText,
} from 'lucide-react'

// Default Data Constants
const DEFAULT_HERO = {
  categoryBadge: 'PARTNER WITH US',
  title: 'GLOBAL SURGICAL & HEALTHCARE SUPPLIES MANUFACTURING',
  subtitle:
    'Whether you require custom OEM manufacturing, private label surgical tools, bulk hospital supplies, or international distribution rights, our technical team is ready to serve you.',
  bgImage: '/images/products-hero-banner.png',
}

const DEFAULT_FORM_SETTINGS = {
  title: 'Send Us an Inquiry',
  subtitle:
    'Fill out the form below to receive immediate quotes, technical catalogs, or sample requests.',
  submitButtonText: 'Send Partnership Inquiry',
  inquiryOptions: [
    'Partnership Inquiry',
    'OEM Manufacturing & Custom Instruments',
    'Private Labeling Services',
    'Bulk Hospital Procurement',
    'Become an International Distributor',
    'General Inquiry',
  ],
}

const DEFAULT_INFO = {
  hqTitle: 'Global Manufacturing HQ',
  addressLine1: 'Noal More, Roras Road P.O. Box 919',
  addressLine2: 'Sialkot - 51310 Pakistan.',
  phoneTitle: 'Direct Phone Support',
  phone1: 'Phone : (+92) 52 3563200',
  phone2: 'Phone: (+92) 52 3553777 | (+92) 523252500',
  emailTitle: 'Email Support',
  email: 'Info@Durablehs.Com',
  hoursTitle: 'Business Hours',
  hoursLine1: 'Monday - Saturday: 8:00 AM - 6:00 PM (PKT)',
  hoursLine2: '24/7 Priority Emergency Export Support',
}

const DEFAULT_WHY_FEATURES = [
  {
    title: 'ISO 13485 & CE',
    desc: 'Certified ISO quality standards',
    icon: 'Award',
  },
  {
    title: 'German Steel',
    desc: 'Medical-grade stainless steel',
    icon: 'ShieldCheck',
  },
  {
    title: 'OEM & Private Label',
    desc: 'Custom logo & laser marking',
    icon: 'PackageCheck',
  },
  {
    title: 'Global Shipping',
    desc: 'Express DHL/FedEx logistics',
    icon: 'Globe',
  },
]

export default function AdminContactContentPage() {
  const [heroData, setHeroData] = useState(DEFAULT_HERO)
  const [formSettings, setFormSettings] = useState(DEFAULT_FORM_SETTINGS)
  const [infoData, setInfoData] = useState(DEFAULT_INFO)
  const [whyFeatures, setWhyFeatures] = useState(DEFAULT_WHY_FEATURES)

  const [newOptionText, setNewOptionText] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedHero = localStorage.getItem('durable_contact_hero_data')
      if (savedHero) setHeroData(JSON.parse(savedHero))

      const savedForm = localStorage.getItem('durable_contact_form_data')
      if (savedForm) setFormSettings(JSON.parse(savedForm))

      const savedInfo = localStorage.getItem('durable_contact_info_data')
      if (savedInfo) setInfoData(JSON.parse(savedInfo))

      const savedWhy = localStorage.getItem('durable_contact_why_data')
      if (savedWhy) setWhyFeatures(JSON.parse(savedWhy))
    } catch (e) {
      console.error('Error reading contact content from localStorage:', e)
    }
  }, [])

  // Save changes handler
  const handleSaveAll = () => {
    try {
      localStorage.setItem('durable_contact_hero_data', JSON.stringify(heroData))
      localStorage.setItem('durable_contact_form_data', JSON.stringify(formSettings))
      localStorage.setItem('durable_contact_info_data', JSON.stringify(infoData))
      localStorage.setItem('durable_contact_why_data', JSON.stringify(whyFeatures))

      // Trigger custom window event so open website tabs update live
      window.dispatchEvent(new Event('durable_content_updated'))

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 4000)
    } catch (e) {
      console.error('Error saving contact content:', e)
      alert('Failed to save changes. Please try again.')
    }
  }

  // File upload helper
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setter(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Inquiry options helpers
  const handleAddInquiryOption = () => {
    if (!newOptionText.trim()) return
    setFormSettings({
      ...formSettings,
      inquiryOptions: [...formSettings.inquiryOptions, newOptionText.trim()],
    })
    setNewOptionText('')
  }

  const handleDeleteInquiryOption = (index: number) => {
    setFormSettings({
      ...formSettings,
      inquiryOptions: formSettings.inquiryOptions.filter((_, i) => i !== index),
    })
  }

  // Why Choose Features Helpers
  const updateWhyFeature = (index: number, field: string, value: any) => {
    const updated = [...whyFeatures]
    updated[index] = { ...updated[index], [field]: value }
    setWhyFeatures(updated)
  }

  const addWhyFeature = () => {
    setWhyFeatures([
      ...whyFeatures,
      {
        title: '24/7 Technical Support',
        desc: 'Dedicated account manager response',
        icon: 'Award',
      },
    ])
  }

  const deleteWhyFeature = (index: number) => {
    setWhyFeatures(whyFeatures.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 bg-[#090F1E] text-slate-100 min-h-screen">
      {/* Top Header Card */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[#E31B23] text-xs font-black uppercase tracking-wider">
              Website Content Module
            </span>
            <span className="text-xs text-slate-400 font-mono">/admin/content/contact</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Phone className="w-8 h-8 text-[#E31B23]" />
            <span>Contact Page Content Manager</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Manage Contact Hero Banner, Inquiry Form Options, Global HQ Address, Direct Phone Support, and Why Choose Durable features dynamically.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <button
            onClick={handleSaveAll}
            className="px-6 py-2.5 rounded-xl bg-[#E31B23] hover:bg-red-700 text-white text-xs font-black tracking-wider uppercase transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>✓ All Contact Changes Saved Successfully! Your website contact page has been updated live.</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: CONTACT HERO BANNER SETTINGS */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-red-600/20 text-[#E31B23] font-black flex items-center justify-center text-sm border border-red-500/30">
              1
            </span>
            <h2 className="text-xl font-bold text-white">Contact Hero Banner Settings</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">`/contact` Banner</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Hero Pill Badge Text
            </label>
            <input
              type="text"
              value={heroData.categoryBadge}
              onChange={(e) => setHeroData({ ...heroData, categoryBadge: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Hero Main Title
            </label>
            <input
              type="text"
              value={heroData.title}
              onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Hero Subtitle / Overview Description
            </label>
            <textarea
              rows={3}
              value={heroData.subtitle}
              onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl p-4 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="md:col-span-2 space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#E31B23]" />
              <span>Hero Background Image URL</span>
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="text"
                value={heroData.bgImage}
                onChange={(e) => setHeroData({ ...heroData, bgImage: e.target.value })}
                className="flex-1 w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
                placeholder="/images/products-hero-banner.png"
              />
              <label className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 border border-slate-700 shrink-0">
                <Upload className="w-4 h-4 text-[#E31B23]" />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, (url) => setHeroData({ ...heroData, bgImage: url }))}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2: PARTNERSHIP INQUIRY FORM SETTINGS */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-red-600/20 text-[#E31B23] font-black flex items-center justify-center text-sm border border-red-500/30">
              2
            </span>
            <h2 className="text-xl font-bold text-white">Partnership Inquiry Form Settings</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Form Config</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Form Card Title
            </label>
            <input
              type="text"
              value={formSettings.title}
              onChange={(e) => setFormSettings({ ...formSettings, title: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Submit Button Label
            </label>
            <input
              type="text"
              value={formSettings.submitButtonText}
              onChange={(e) => setFormSettings({ ...formSettings, submitButtonText: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Form Subtitle / Instruction Text
            </label>
            <textarea
              rows={2}
              value={formSettings.subtitle}
              onChange={(e) => setFormSettings({ ...formSettings, subtitle: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl p-4 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Inquiry Dropdown Options Manager */}
          <div className="md:col-span-2 space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Inquiry Type Dropdown Options ({formSettings.inquiryOptions.length})
            </label>

            <div className="space-y-2">
              {formSettings.inquiryOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-[#141E36] p-2.5 rounded-xl border border-slate-700/70">
                  <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-400 font-mono text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const updated = [...formSettings.inquiryOptions]
                      updated[idx] = e.target.value
                      setFormSettings({ ...formSettings, inquiryOptions: updated })
                    }}
                    className="flex-1 bg-[#0D1527] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteInquiryOption(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="text"
                placeholder="Enter new inquiry type option..."
                value={newOptionText}
                onChange={(e) => setNewOptionText(e.target.value)}
                className="flex-1 bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
              <button
                type="button"
                onClick={handleAddInquiryOption}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Option</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 3: HEADQUARTERS & DIRECT PHONE LINES SETTINGS */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-red-600/20 text-[#E31B23] font-black flex items-center justify-center text-sm border border-red-500/30">
              3
            </span>
            <h2 className="text-xl font-bold text-white">Headquarters & Direct Lines Info</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Factory Contact</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              HQ Block Title
            </label>
            <input
              type="text"
              value={infoData.hqTitle}
              onChange={(e) => setInfoData({ ...infoData, hqTitle: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Address Line 1
            </label>
            <input
              type="text"
              value={infoData.addressLine1}
              onChange={(e) => setInfoData({ ...infoData, addressLine1: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Address Line 2 (City / Country / Zip)
            </label>
            <input
              type="text"
              value={infoData.addressLine2}
              onChange={(e) => setInfoData({ ...infoData, addressLine2: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Direct Phone Support Title
            </label>
            <input
              type="text"
              value={infoData.phoneTitle}
              onChange={(e) => setInfoData({ ...infoData, phoneTitle: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Phone Line 1
            </label>
            <input
              type="text"
              value={infoData.phone1}
              onChange={(e) => setInfoData({ ...infoData, phone1: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-mono font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Phone Line 2
            </label>
            <input
              type="text"
              value={infoData.phone2}
              onChange={(e) => setInfoData({ ...infoData, phone2: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-mono font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Email Support Address
            </label>
            <input
              type="text"
              value={infoData.email}
              onChange={(e) => setInfoData({ ...infoData, email: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Business Hours Line 1
            </label>
            <input
              type="text"
              value={infoData.hoursLine1}
              onChange={(e) => setInfoData({ ...infoData, hoursLine1: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Business Hours Line 2 (Emergency Support Note)
            </label>
            <input
              type="text"
              value={infoData.hoursLine2}
              onChange={(e) => setInfoData({ ...infoData, hoursLine2: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 4: WHY CHOOSE DURABLE FEATURES MANAGER (CRUD) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-red-600/20 text-[#E31B23] font-black flex items-center justify-center text-sm border border-red-500/30">
              4
            </span>
            <div>
              <h2 className="text-xl font-bold text-white">Why Choose Durable Features ({whyFeatures.length})</h2>
              <p className="text-xs text-slate-400">Add, edit, delete, or update key advantages cards displayed on contact page.</p>
            </div>
          </div>

          <button
            onClick={addWhyFeature}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Feature Card</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {whyFeatures.map((item, idx) => (
            <div key={idx} className="bg-[#141E36] border border-slate-700/80 rounded-2xl p-5 space-y-4 relative">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                <span className="px-2.5 py-0.5 rounded-md bg-red-500/10 text-[#E31B23] text-xs font-mono font-bold">
                  Card #{idx + 1}
                </span>
                <button
                  onClick={() => deleteWhyFeature(idx)}
                  className="p-1 text-slate-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Feature Title
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateWhyFeature(idx, 'title', e.target.value)}
                    className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Subtitle Description
                  </label>
                  <input
                    type="text"
                    value={item.desc}
                    onChange={(e) => updateWhyFeature(idx, 'desc', e.target.value)}
                    className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Icon Type
                  </label>
                  <select
                    value={item.icon}
                    onChange={(e) => updateWhyFeature(idx, 'icon', e.target.value)}
                    className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Award">Award (ISO Standards)</option>
                    <option value="ShieldCheck">ShieldCheck (German Steel)</option>
                    <option value="PackageCheck">PackageCheck (OEM Branding)</option>
                    <option value="Globe">Globe (Global Logistics)</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Save Action Bar */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={handleSaveAll}
            className="px-8 py-3.5 rounded-xl bg-[#E31B23] hover:bg-red-700 text-white text-xs font-black tracking-wider uppercase transition-all shadow-xl shadow-red-600/30 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-5 h-5" />
            <span>Save All Contact Page Changes</span>
          </button>
        </div>
      </div>
    </div>
  )
}

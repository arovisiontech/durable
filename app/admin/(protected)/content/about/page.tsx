'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Save,
  CheckCircle2,
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  Building2,
  ShieldCheck,
  Award,
  Globe2,
  Clock,
  Sparkles,
  X,
} from 'lucide-react'
import { AdminMediaUploadPlaceholder } from '@/src/components/admin/AdminMediaUploadPlaceholder'

export interface HistoryCard {
  id: string
  title: string
  subtitle: string
  icon: string
}

export interface CustomAboutBlock {
  id: string
  title: string
  subheading?: string
  description: string
  image_url?: string
}

export default function AdminContentAboutPage() {
  const [isSaved, setIsSaved] = useState(false)
  const [saveMessage, setSaveMessage] = useState('About Us content updated and published live!')

  // 1. HERO BANNER STATE
  const [heroForm, setHeroForm] = useState({
    badge: 'ABOUT US',
    title: 'PRECISION IN EVERY INSTRUMENT. TRUST IN EVERY DETAIL.',
    bgImage: '/images/about-hero-banner.png',
  })

  // 2. DURABLE HISTORY SECTION STATE
  const [historyForm, setHistoryForm] = useState({
    title: 'DURABLE HISTORY',
    p1: 'Since 1980, Durable Hospital Supplies Has Been A Trusted Medical Engineering, OEM, And Private-Label Surgical Instrument Manufacturer Based In Sialkot, Pakistan — The Global Hub Of Precision Surgical Instrument Manufacturing.',
    p2: 'With More Than Four Decades Of Manufacturing Expertise, We Combine Skilled Craftsmanship, Advanced Engineering, And Rigorous Quality Control To Produce Surgical Instruments That Meet The Evolving Needs Of Healthcare Professionals And Global Medical Brands.',
    p3: 'Our Expertise Covers General Surgery, Dental Instruments, Electrosurgery, Holloware, And EO Sterilized Instruments & Kits, With Customized OEM And Private-Label Solutions Tailored To International Markets.',
    p4: 'Driven By Quality, Precision, And Reliability, Our Manufacturing Processes Are Aligned With Internationally Recognized Standards, Including ISO 13485, FDA, And MDR Requirements. Today, Durable Hospital Supplies Serves Hospitals, Healthcare Professionals, Distributors, And Medical Brands Worldwide — Delivering Dependable Instruments Designed To Support Better Healthcare Outcomes.',
    tagline: 'Durable Hospital Supplies — Precision Crafted. Globally Trusted.',
    imageUrl: '/images/durable-building.png',
  })

  // 3. 5 HISTORY EXCELLENCE CARDS STATE
  const [historyCards, setHistoryCards] = useState<HistoryCard[]>([
    { id: 'h-1', title: '40+ Years', subtitle: 'Of Manufacturing Excellence', icon: '/images/icon-history-40years.png' },
    { id: 'h-2', title: 'ISO 13485, FDA & MDR', subtitle: 'Certified Quality & Compliance', icon: '/images/icon-history-iso.png' },
    { id: 'h-3', title: 'Global Presence', subtitle: 'Trusted By Distributors Worldwide', icon: '/images/icon-history-global.png' },
    { id: 'h-4', title: 'Precision Crafted', subtitle: 'With Advanced Technology & Skilled Expertise', icon: '/images/icon-history-precision.png' },
    { id: 'h-5', title: 'OEM & Private Label', subtitle: 'Solutions Tailored To Your Brand', icon: '/images/icon-history-oem.png' },
  ])

  // 4. OUR JOURNEY SECTION STATE
  const [journeyForm, setJourneyForm] = useState({
    badge: 'OUR JOURNEY',
    title: 'From Humble Origins To Global Recognition',
    subtitle: 'A Journey Built On Trust, Precision And An Unwavering Commitment To Excellence.',
    pastText:
      'Durable Hospital Supplies Began In A Small Rented Shop, Producing Only A Few Instruments And Serving A Single Customer. That Customer, Still With Us After Nearly Half A Century, Is A Testament To Our Commitment To Quality And Relationships. From These Humble Beginnings, We Laid The Foundation For What Would Become A Global Brand, Driven By Precision Craftsmanship And Unwavering Dedication To Excellence.',
    presentText1:
      'Today, As An ISO 13485 And FDA Certified Surgical Instrument Manufacturer In Sialkot, Pakistan, Durable Hospital Supplies Offers A Portfolio Of Over 20,000 Instruments As OEM And Operates International Offices In 5 Countries, With Distributors In Over 70 Including US, UK, EU, Japan And The Middle East.',
    presentText2:
      'We Supply Private Label Instruments To Thousands Of Hospitals And Clinics Worldwide, Cementing Our Position Among The World\'s Most Established Surgical Instrument Companies And As An Industry Leader.',
    presentText3:
      'Our Products Meet Stringent Global Certifications, And We Are Pioneers In Key Areas, Including The Production Of EO Sterile Procedure Packs. As We Continue To Grow At A Rapid Pace, Our Focus Remains On Delivering Innovation, Quality, And Compliance In Every Product.',
    mapImage: '/images/world-map-journey.png',
    futureText:
      'The Future Of Durable Hospital Supplies Is Exceptionally Bright. We Are Expanding Our Product Range And Making Strategic Moves To Establish New Manufacturing Units And Global Partnerships, Aiming To Set New Benchmarks In The Surgical Instrument Industry.',
  })

  // 5. CUSTOM BLOCKS STATE
  const [customBlocks, setCustomBlocks] = useState<CustomAboutBlock[]>([])

  // Modal Dialog Control States
  const [activeModal, setActiveModal] = useState<'card' | 'custom' | null>(null)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)

  const [cardModalForm, setCardModalForm] = useState({ title: '', subtitle: '', icon: '/images/icon-history-40years.png' })
  const [customModalForm, setCustomModalForm] = useState({ title: '', subheading: '', description: '', image_url: '' })

  // SYNC FROM LOCALSTORAGE ON MOUNT
  useEffect(() => {
    try {
      const savedHero = localStorage.getItem('durable_about_hero_data')
      if (savedHero) {
        const parsed = JSON.parse(savedHero)
        if (parsed && typeof parsed === 'object') setHeroForm((prev) => ({ ...prev, ...parsed }))
      }

      const savedHist = localStorage.getItem('durable_history_data')
      if (savedHist) {
        const parsed = JSON.parse(savedHist)
        if (parsed && typeof parsed === 'object') setHistoryForm((prev) => ({ ...prev, ...parsed }))
      }

      const savedCards = localStorage.getItem('durable_history_cards')
      if (savedCards) {
        const parsed = JSON.parse(savedCards)
        if (Array.isArray(parsed) && parsed.length > 0) setHistoryCards(parsed)
      }

      const savedJourney = localStorage.getItem('durable_journey_data')
      if (savedJourney) {
        const parsed = JSON.parse(savedJourney)
        if (parsed && typeof parsed === 'object') setJourneyForm((prev) => ({ ...prev, ...parsed }))
      }

      const savedCustom = localStorage.getItem('durable_custom_about_blocks')
      if (savedCustom) {
        const parsed = JSON.parse(savedCustom)
        if (Array.isArray(parsed)) setCustomBlocks(parsed)
      }
    } catch (e) {
      console.error('LocalStorage About mount read error:', e)
    }
  }, [])

  // SAVE ALL CHANGES TO LOCALSTORAGE & EMIT EVENT
  const saveAllToStorage = () => {
    try {
      localStorage.setItem('durable_about_hero_data', JSON.stringify(heroForm))
      localStorage.setItem('durable_history_data', JSON.stringify(historyForm))
      localStorage.setItem('durable_history_cards', JSON.stringify(historyCards))
      localStorage.setItem('durable_journey_data', JSON.stringify(journeyForm))
      localStorage.setItem('durable_custom_about_blocks', JSON.stringify(customBlocks))

      window.dispatchEvent(new Event('durable_content_updated'))

      setIsSaved(true)
      setSaveMessage('About Us page content updated and published live!')
      setTimeout(() => setIsSaved(false), 4000)
    } catch (e) {
      console.error('LocalStorage write error:', e)
    }
  }

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    saveAllToStorage()
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span>Website Content</span>
            <span>•</span>
            <span className="text-[#E31B23]">About Us Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3D] tracking-tight">
            About Us Page Content Manager
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage all 5 sections of the About Us page dynamically (Hero Banner, Durable History, Excellence Cards, Our Journey, Custom Sections).
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
            onClick={handleSaveAll}
            className="px-5 py-2.5 text-xs font-extrabold text-white bg-[#E31B23] hover:bg-red-700 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold shadow-xs animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* ALL 5 STACKED SECTIONS */}
      <div className="space-y-8">

        {/* SECTION 1: ABOUT US HERO BANNER SETTINGS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">1. About Us Hero Banner Settings</h2>
              <p className="text-xs text-slate-500">Edit hero title, pill badge text, and background banner image.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Pill Badge Text</label>
              <input
                type="text"
                value={heroForm.badge}
                onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Hero Main Title</label>
              <textarea
                rows={2}
                value={heroForm.title}
                onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Hero Background Banner Image</label>
              <AdminMediaUploadPlaceholder
                value={heroForm.bgImage}
                onChange={(url) => setHeroForm({ ...heroForm, bgImage: url })}
                label="Choose or Upload Hero Banner Image"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: DURABLE HISTORY SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">2. Durable History Section</h2>
              <p className="text-xs text-slate-500">Edit history overview title, 4 paragraphs, tagline, and manufacturing facility image.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Section Title</label>
              <input
                type="text"
                value={historyForm.title}
                onChange={(e) => setHistoryForm({ ...historyForm, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Paragraph 1 (Since 1980...)</label>
              <textarea
                rows={3}
                value={historyForm.p1}
                onChange={(e) => setHistoryForm({ ...historyForm, p1: e.target.value })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Paragraph 2 (Four Decades...)</label>
              <textarea
                rows={3}
                value={historyForm.p2}
                onChange={(e) => setHistoryForm({ ...historyForm, p2: e.target.value })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Paragraph 3 (Our Expertise Covers...)</label>
              <textarea
                rows={3}
                value={historyForm.p3}
                onChange={(e) => setHistoryForm({ ...historyForm, p3: e.target.value })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Paragraph 4 (ISO 13485, FDA, MDR...)</label>
              <textarea
                rows={3}
                value={historyForm.p4}
                onChange={(e) => setHistoryForm({ ...historyForm, p4: e.target.value })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Conclusion Tagline</label>
              <input
                type="text"
                value={historyForm.tagline}
                onChange={(e) => setHistoryForm({ ...historyForm, tagline: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Facility Building Photo</label>
              <AdminMediaUploadPlaceholder
                value={historyForm.imageUrl}
                onChange={(url) => setHistoryForm({ ...historyForm, imageUrl: url })}
                label="Choose or Upload Facility Photo"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: 5 HISTORY EXCELLENCE CARDS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#0B1B3D]">3. 5 History Excellence Feature Cards Grid</h2>
                <p className="text-xs text-slate-500">Manage 40+ Years, ISO 13485/FDA/MDR, Global Presence, Precision Crafted, and OEM/Private Label cards.</p>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingItemId(null)
                setCardModalForm({ title: '', subtitle: '', icon: '/images/icon-history-40years.png' })
                setActiveModal('card')
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-[#0B1B3D] hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Excellence Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {historyCards.map((card) => (
              <div key={card.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 flex flex-col justify-between text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 mx-auto flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={card.icon} alt={card.title} className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-xs font-black text-[#0B1B3D]">{card.title}</h3>
                  <p className="text-[11px] text-slate-500 leading-snug">{card.subtitle}</p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setEditingItemId(card.id)
                      setCardModalForm({ title: card.title, subtitle: card.subtitle, icon: card.icon })
                      setActiveModal('card')
                    }}
                    className="p-1 text-slate-700 hover:bg-slate-200 rounded-md cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      const updated = historyCards.filter((c) => c.id !== card.id)
                      setHistoryCards(updated)
                      saveAllToStorage()
                    }}
                    className="p-1 text-red-600 hover:bg-red-100 rounded-md cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: OUR JOURNEY TIMELINE */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">4. OUR JOURNEY (Past, Present, Future Timeline)</h2>
              <p className="text-xs text-slate-500">Edit journey badge, title, subtitle, PAST, PRESENT (3 paragraphs + map), and FUTURE blocks.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Badge Tagline</label>
              <input
                type="text"
                value={journeyForm.badge}
                onChange={(e) => setJourneyForm({ ...journeyForm, badge: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Main Title</label>
              <input
                type="text"
                value={journeyForm.title}
                onChange={(e) => setJourneyForm({ ...journeyForm, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Subtitle Paragraph</label>
              <input
                type="text"
                value={journeyForm.subtitle}
                onChange={(e) => setJourneyForm({ ...journeyForm, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-[#E31B23] uppercase">PAST Narrative Block</label>
              <textarea
                rows={4}
                value={journeyForm.pastText}
                onChange={(e) => setJourneyForm({ ...journeyForm, pastText: e.target.value })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-[#E31B23] uppercase">PRESENT Paragraph 1 (Sialkot 20,000+ OEM...)</label>
              <textarea
                rows={3}
                value={journeyForm.presentText1}
                onChange={(e) => setJourneyForm({ ...journeyForm, presentText1: e.target.value })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-[#E31B23] uppercase">PRESENT Paragraph 2 (Thousands of Hospitals...)</label>
              <textarea
                rows={2}
                value={journeyForm.presentText2}
                onChange={(e) => setJourneyForm({ ...journeyForm, presentText2: e.target.value })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-[#E31B23] uppercase">PRESENT Paragraph 3 (Global Certifications & EO Sterile Packs...)</label>
              <textarea
                rows={2}
                value={journeyForm.presentText3}
                onChange={(e) => setJourneyForm({ ...journeyForm, presentText3: e.target.value })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Global Reach World Map Image</label>
              <AdminMediaUploadPlaceholder
                value={journeyForm.mapImage}
                onChange={(url) => setJourneyForm({ ...journeyForm, mapImage: url })}
                label="Choose or Upload World Map Graphic"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-[#E31B23] uppercase">FUTURE Narrative Block</label>
              <textarea
                rows={3}
                value={journeyForm.futureText}
                onChange={(e) => setJourneyForm({ ...journeyForm, futureText: e.target.value })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: CUSTOM SECTIONS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#0B1B3D]">5. Additional Custom About Sections</h2>
                <p className="text-xs text-slate-500">Add custom blocks or feature banners to the About Us page dynamically.</p>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingItemId(null)
                setCustomModalForm({ title: '', subheading: '', description: '', image_url: '' })
                setActiveModal('custom')
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-[#0B1B3D] hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Section</span>
            </button>
          </div>

          {customBlocks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customBlocks.map((block) => (
                <div key={block.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 space-y-3">
                  {block.image_url && (
                    <div className="h-36 w-full rounded-xl overflow-hidden bg-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={block.image_url} alt={block.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <span className="text-[10px] font-bold text-[#E31B23] uppercase">{block.subheading}</span>
                  <h3 className="text-base font-black text-[#0B1B3D]">{block.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3">{block.description}</p>
                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                    <button
                      onClick={() => {
                        const updated = customBlocks.filter((b) => b.id !== block.id)
                        setCustomBlocks(updated)
                        saveAllToStorage()
                      }}
                      className="px-3 py-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl space-y-2">
              <p className="text-xs font-bold text-slate-600">No extra custom sections added yet.</p>
              <p className="text-[11px] text-slate-400">Click &quot;Add Custom Section&quot; above to create more content blocks!</p>
            </div>
          )}
        </div>

      </div>

      {/* MODAL DIALOGS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-[#0B1B3D] uppercase">Configure Item Details & Image Upload</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CARD MODAL */}
            {activeModal === 'card' && (
              <div className="space-y-4">
                <AdminMediaUploadPlaceholder
                  label="Card Icon Image"
                  value={cardModalForm.icon}
                  onChange={(url) => setCardModalForm({ ...cardModalForm, icon: url })}
                  placeholderText="Upload Icon Image"
                />
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Card Title</label>
                  <input
                    type="text"
                    value={cardModalForm.title}
                    onChange={(e) => setCardModalForm({ ...cardModalForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Card Subtitle / Description</label>
                  <input
                    type="text"
                    value={cardModalForm.subtitle}
                    onChange={(e) => setCardModalForm({ ...cardModalForm, subtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>
                <button
                  onClick={() => {
                    let updated: HistoryCard[] = []
                    if (editingItemId) {
                      updated = historyCards.map((c) => (c.id === editingItemId ? { ...cardModalForm, id: editingItemId } : c))
                    } else {
                      updated = [...historyCards, { ...cardModalForm, id: `card-${Date.now()}` }]
                    }
                    setHistoryCards(updated)
                    saveAllToStorage()
                    setActiveModal(null)
                  }}
                  className="w-full py-2.5 bg-[#E31B23] text-white text-xs font-black rounded-xl cursor-pointer"
                >
                  Save Card
                </button>
              </div>
            )}

            {/* CUSTOM BLOCK MODAL */}
            {activeModal === 'custom' && (
              <div className="space-y-4">
                <AdminMediaUploadPlaceholder
                  label="Custom Block Image"
                  value={customModalForm.image_url}
                  onChange={(url) => setCustomModalForm({ ...customModalForm, image_url: url })}
                  placeholderText="Upload Image"
                />
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Subheading / Badge</label>
                  <input
                    type="text"
                    value={customModalForm.subheading}
                    onChange={(e) => setCustomModalForm({ ...customModalForm, subheading: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Block Title</label>
                  <input
                    type="text"
                    value={customModalForm.title}
                    onChange={(e) => setCustomModalForm({ ...customModalForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Description</label>
                  <textarea
                    rows={3}
                    value={customModalForm.description}
                    onChange={(e) => setCustomModalForm({ ...customModalForm, description: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <button
                  onClick={() => {
                    const updated = [...customBlocks, { id: `block-${Date.now()}`, ...customModalForm }]
                    setCustomBlocks(updated)
                    saveAllToStorage()
                    setActiveModal(null)
                  }}
                  className="w-full py-2.5 bg-[#0B1B3D] text-white text-xs font-black rounded-xl cursor-pointer"
                >
                  Save Custom Block
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  )
}

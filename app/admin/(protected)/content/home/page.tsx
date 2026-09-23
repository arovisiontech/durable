'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Save,
  CheckCircle2,
  Image as ImageIcon,
  Layout,
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  Layers,
  X,
  Check,
  Video,
  Award,
  BarChart3,
  ListOrdered,
  ShieldCheck,
  FileText,
  Info,
  HelpCircle,
  Sliders,
  Sparkles,
} from 'lucide-react'
import { AdminMediaUploadPlaceholder } from '@/src/components/admin/AdminMediaUploadPlaceholder'

// Interfaces for Section Models
export interface AdminHeroSlide {
  id: string
  title: string
  subtitle: string
  description: string
  image_url: string
  button_text: string
  button_link: string
  secondary_button_text: string
  secondary_button_link: string
  is_published: boolean
}

export interface AdminStatItem {
  id: string
  number: string
  label: string
}

export interface AdminSolutionCard {
  id: string
  title: string
  image_url: string
  count: string
  description: string
}

export interface AdminQualityCard {
  id: string
  title: string
  description: string
  points: string[]
}

export interface AdminProcessStep {
  id: string
  step_number: number
  title: string
  description: string
  image_url: string
  highlights: string[]
}

export interface AdminCertLogo {
  id: string
  name: string
  logo_url: string
}

export default function AdminContentHomePage() {
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'stats' | 'solutions' | 'quality' | 'pillars' | 'precision' | 'process' | 'video'>('hero')
  const [isSaved, setIsSaved] = useState(false)
  const [saveMessage, setSaveMessage] = useState('Home Page content updated successfully!')

  // 1. HERO BANNER SLIDES STATE
  const [heroSlides, setHeroSlides] = useState<AdminHeroSlide[]>([
    {
      id: 'slide-1',
      title: 'EVERY 5 SECONDS, WE MAKE A DIFFERENCE',
      subtitle: 'SINCE 1973 • PRECISION SURGICAL MANUFACTURING',
      description: 'Durable Hospital Supplies is a trusted global partner for healthcare brands seeking reliable, high-quality surgical manufacturing solutions.',
      image_url: '/images/surgical-hero.png',
      button_text: 'Partner With Us',
      button_link: '/contact',
      secondary_button_text: 'Explore Products',
      secondary_button_link: '/products',
      is_published: true,
    },
    {
      id: 'slide-2',
      title: 'WORLD-CLASS DENTAL & SURGICAL INSTRUMENTS',
      subtitle: 'ISO 13485 CERTIFIED • DENTAL & SURGICAL EXCELLENCE',
      description: 'Engineered for precision surgeons and dental professionals worldwide.',
      image_url: '/images/dental-clinic-banner.png',
      button_text: 'Dental Catalogues',
      button_link: '/catalogues',
      secondary_button_text: 'Contact Sales',
      secondary_button_link: '/contact',
      is_published: true,
    },
  ])

  // 2. ABOUT US SECTION STATE
  const [aboutData, setAboutData] = useState({
    badge: 'SINCE 1973',
    titlePrimary: 'Elevating Global',
    titleHighlight: 'Healthcare Standards',
    desc1: 'Durable Hospital Supplies is A Trusted Global Partner For Healthcare Brands Seeking Reliable, High-Quality Surgical Manufacturing Solutions. With Over 53 Years Of Experience, We Operate From Our Modern Facility In Sialkot, Pakistan.',
    desc2: 'Our Commitment To Excellence Is Supported By ISO 13485-Certified Processes And Compliance With ISO, MDR-Ready And FDA Requirements, Ensuring Every Product Meets The Highest Standards Of Safety And Performance.',
    imageUrl: '/images/about-surgical-instruments.png',
    ctaPrimaryText: 'GET IN TOUCH',
    ctaPrimaryUrl: '/contact',
    ctaSecondaryText: 'DOWNLOAD CATALOGUE',
    ctaSecondaryUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
  })

  // 3. KEY STATS COUNTER STATE
  const [statsData, setStatsData] = useState<AdminStatItem[]>([
    { id: 'stat-1', number: '20,000+', label: 'Products Manufactured' },
    { id: 'stat-2', number: '6+', label: 'Production Facilities' },
    { id: 'stat-3', number: '300+', label: 'Skilled Workers' },
    { id: 'stat-4', number: '50+', label: 'Export Countries' },
  ])

  // 4. SOLUTIONS GRID STATE
  const [solutionsData, setSolutionsData] = useState<AdminSolutionCard[]>([
    { id: 'sol-1', title: 'General Surgery Instruments', image_url: '/images/cat-scissors-shears.png', count: '5,000+ SKUs', description: 'Forceps, Scissors, Scalpels, Needle Holders & Clamps.' },
    { id: 'sol-2', title: 'Dental & Oral Surgery', image_url: '/images/cat-retractors.png', count: '3,200+ SKUs', description: 'Extracting Forceps, Elevators, Scalers & Explorers.' },
    { id: 'sol-3', title: 'TC Inserts & Tungsten Carbide', image_url: '/images/cat-handles-blades.png', count: '1,800+ SKUs', description: 'Gold-handled Scissors with Tungsten Carbide cutting edges.' },
  ])

  // 6. QUALITY PILLARS 2-COLUMN STATE
  const [pillarsData, setPillarsData] = useState({
    badge: 'MANUFACTURING EXCELLENCE',
    title: 'Delivering Confidence Through Quality',
    subtitle: 'Precision Engineering Meets Strict Compliance',
    description: 'Every surgical instrument undergoes multi-stage inspections, hardness testing, passivated corrosion checks, and dimensional calibration.',
    imageUrl: '/images/company-stats-banner.png',
  })

  // 7. PRECISION HEALTHCARE CALLOUT BANNER STATE
  const [precisionData, setPrecisionData] = useState({
    badge: 'GLOBAL HEALTHCARE PARTNER',
    title: 'Precision Solutions. Trusted Quality. Better Healthcare.',
    subtitle: 'Partner with Sialkot’s premier surgical manufacturing facility.',
    bgImage: '/images/precision-healthcare-banner.png',
    ctaText: 'Partner With Us',
    ctaUrl: '/contact',
  })

  // 8. PROCESS STEPS STATE
  const [processSteps, setProcessSteps] = useState<AdminProcessStep[]>([
    { id: 'step-1', step_number: 1, title: 'Raw Material Forging & Selection', description: 'German & Japanese stainless steel grade selection.', image_url: '/images/process-hand-filing.png', highlights: ['AISI 420 / 410 Steel', 'Hardness Verification'] },
    { id: 'step-2', step_number: 2, title: 'Precision Machining & Hand Filing', description: 'Master craftsmen hand-file jaw serrations and box joints.', image_url: '/images/process-wooden-anvil.png', highlights: ['Micro Serrations', 'Perfect Alignment'] },
    { id: 'step-3', step_number: 3, title: 'Heat Treatment & Passivation', description: 'Vacuum heat treatment for long-lasting edge retention.', image_url: '/images/process-erp-operator.png', highlights: ['Boil Test Passed', 'Corrosion Resistant'] },
  ])

  // 9. COMPLIANCE VIDEO & LOGOS STATE
  const [videoData, setVideoData] = useState({
    badge: 'COMPLIANCE AND CERTIFICATIONS',
    title: 'Watch Our Quality & Manufacturing Process Showcase',
    videoUrl: '/videos/0609.mp4',
    thumbnailImage: '/images/company-stats-banner.png',
  })

  const [certLogos, setCertLogos] = useState<AdminCertLogo[]>([
    { id: 'c-1', name: 'ISO 13485:2016 Certified', logo_url: '/images/icon-iso.png' },
    { id: 'c-2', name: 'CE & FDA Registered', logo_url: '/images/icon-scci-white.png' },
    { id: 'c-3', name: 'EU-MDR Ready', logo_url: '/images/icon-eumdr.png' },
  ])

  // MODAL STATES FOR ADDING/EDITING ITEMS
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)

  // Temp Form States for Modal Dialogs
  const [heroForm, setHeroForm] = useState<Omit<AdminHeroSlide, 'id'>>({
    title: '',
    subtitle: '',
    description: '',
    image_url: '/images/surgical-hero.png',
    button_text: 'Partner With Us',
    button_link: '/contact',
    secondary_button_text: 'Explore Products',
    secondary_button_link: '/products',
    is_published: true,
  })

  const [statForm, setStatForm] = useState({ number: '', label: '' })
  const [solutionForm, setSolutionForm] = useState({ title: '', image_url: '/images/cat-scissors-shears.png', count: '1,000+ SKUs', description: '' })
  const [processForm, setProcessForm] = useState({ step_number: 1, title: '', description: '', image_url: '/images/process-hand-filing.png' })
  const [certForm, setCertForm] = useState({ name: '', logo_url: '/images/icon-iso.png' })

  // Sync Hero Slides from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('durable_hero_slides')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHeroSlides(parsed)
        }
      }
    } catch (e) {
      console.error('LocalStorage read error:', e)
    }
  }, [])

  const saveHeroSlidesToStorage = (slides: AdminHeroSlide[]) => {
    try {
      localStorage.setItem('durable_hero_slides', JSON.stringify(slides))
    } catch (e) {
      console.error('LocalStorage write error:', e)
    }
  }

  // Trigger Saved Toast
  const notifySaved = (msg: string) => {
    setSaveMessage(msg)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 4000)
  }

  // SAVE ALL HANDLER
  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault()
    saveHeroSlidesToStorage(heroSlides)
    notifySaved('All Home Page section contents & images updated live!')
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span>Website Content</span>
            <span>•</span>
            <span className="text-[#E31B23]">Home Page Manager</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3D] tracking-tight">
            Home Page Full Content & Section Manager
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Upload images from device/gallery, update video MP4s, titles, text, stats, and badges section-by-section.
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
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Section Switcher Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {[
          { id: 'hero', label: '1. Hero Slider', icon: Layout },
          { id: 'about', label: '2. About Us', icon: Info },
          { id: 'stats', label: '3. Stat Counters', icon: BarChart3 },
          { id: 'solutions', label: '4. Solutions Grid', icon: Layers },
          { id: 'pillars', label: '5. Quality Pillars', icon: Sliders },
          { id: 'precision', label: '6. Precision Banner', icon: Sparkles },
          { id: 'process', label: '7. Process Steps', icon: ListOrdered },
          { id: 'video', label: '8. Video & Logos', icon: Video },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shrink-0 transition-all ${
                isActive
                  ? 'bg-[#0B1B3D] text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* SECTION 1: HERO SLIDER & BANNER IMAGES */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">Section 1: Hero Banner Images & Carousel Slider</h2>
              <p className="text-xs text-slate-500">Upload new hero banner images directly from your computer/gallery.</p>
            </div>
            <button
              onClick={() => {
                setEditingItemId(null)
                setHeroForm({
                  title: 'NEW SURGICAL MANUFACTURING SLIDE',
                  subtitle: 'ISO 13485 CERTIFIED • GLOBAL DISTRIBUTION',
                  description: 'High quality surgical instruments.',
                  image_url: '/images/surgical-hero.png',
                  button_text: 'Partner With Us',
                  button_link: '/contact',
                  secondary_button_text: 'Explore Products',
                  secondary_button_link: '/products',
                  is_published: true,
                })
                setActiveModal('hero')
              }}
              className="px-4 py-2 bg-[#E31B23] text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Hero Image</span>
            </button>
          </div>

          <div className="space-y-4">
            {heroSlides.map((slide, idx) => (
              <div key={slide.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-32 h-20 rounded-xl overflow-hidden bg-slate-950 border border-slate-300 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <span className="text-[10px] font-black text-[#E31B23] uppercase block">Slide {idx + 1} • {slide.subtitle}</span>
                    <h3 className="text-xs font-black text-[#0B1B3D] truncate">{slide.title}</h3>
                    <p className="text-[11px] text-slate-500 truncate">{slide.image_url}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingItemId(slide.id)
                      setHeroForm({ ...slide })
                      setActiveModal('hero')
                    }}
                    className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Slide</span>
                  </button>
                  <button
                    onClick={() => {
                      const updated = heroSlides.filter((s) => s.id !== slide.id)
                      setHeroSlides(updated)
                      saveHeroSlidesToStorage(updated)
                      notifySaved('Hero image slide deleted!')
                    }}
                    className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: ABOUT US SECTION MANAGER */}
      {activeTab === 'about' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-lg font-black text-[#0B1B3D]">Section 2: About Us Paragraphs, Image Upload & Badges</h2>
            <p className="text-xs text-slate-500">Upload section image directly from device and update description paragraphs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 md:col-span-2">
              <AdminMediaUploadPlaceholder
                label="About Us Section Main Image"
                type="image"
                value={aboutData.imageUrl}
                onChange={(url) => setAboutData({ ...aboutData, imageUrl: url })}
                placeholderText="Click or Drop to Upload About Us Section Image from Gallery"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Badge Tagline</label>
              <input
                type="text"
                value={aboutData.badge}
                onChange={(e) => setAboutData({ ...aboutData, badge: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Title Line 1</label>
              <input
                type="text"
                value={aboutData.titlePrimary}
                onChange={(e) => setAboutData({ ...aboutData, titlePrimary: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Title Highlight Line 2</label>
              <input
                type="text"
                value={aboutData.titleHighlight}
                onChange={(e) => setAboutData({ ...aboutData, titleHighlight: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#E31B23]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Description Paragraph 1</label>
              <textarea
                rows={3}
                value={aboutData.desc1}
                onChange={(e) => setAboutData({ ...aboutData, desc1: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Description Paragraph 2</label>
              <textarea
                rows={3}
                value={aboutData.desc2}
                onChange={(e) => setAboutData({ ...aboutData, desc2: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: KEY STATS COUNTER CARDS */}
      {activeTab === 'stats' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">Section 3: Key Company Statistics Counter Cards</h2>
              <p className="text-xs text-slate-500">Add, edit, update, or remove company milestone counters.</p>
            </div>
            <button
              onClick={() => {
                setEditingItemId(null)
                setStatForm({ number: '100+', label: 'New Counter Metric' })
                setActiveModal('stat')
              }}
              className="px-4 py-2 bg-[#0B1B3D] text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Stat Counter</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {statsData.map((stat) => (
              <div key={stat.id} className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-2 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-white">{stat.number}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingItemId(stat.id)
                        setStatForm({ number: stat.number, label: stat.label })
                        setActiveModal('stat')
                      }}
                      className="p-1 text-slate-300 hover:text-white"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setStatsData((prev) => prev.filter((s) => s.id !== stat.id))
                        notifySaved('Stat counter removed!')
                      }}
                      className="p-1 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs font-bold text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: SURGICAL SOLUTIONS GRID */}
      {activeTab === 'solutions' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">Section 4: Instrument Solutions Category Cards</h2>
              <p className="text-xs text-slate-500">Upload category images from device and manage descriptions.</p>
            </div>
            <button
              onClick={() => {
                setEditingItemId(null)
                setSolutionForm({ title: 'New Instrument Category', image_url: '/images/cat-scissors-shears.png', count: '500+ SKUs', description: 'Precision instruments.' })
                setActiveModal('solution')
              }}
              className="px-4 py-2 bg-[#E31B23] text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category Solution</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {solutionsData.map((sol) => (
              <div key={sol.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="w-full h-28 rounded-xl overflow-hidden bg-white border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sol.image_url} alt={sol.title} className="w-full h-full object-contain p-2" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-red-600 block">{sol.count}</span>
                  <h3 className="text-xs font-black text-[#0B1B3D]">{sol.title}</h3>
                  <p className="text-[11px] text-slate-500">{sol.description}</p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setEditingItemId(sol.id)
                      setSolutionForm({ title: sol.title, image_url: sol.image_url, count: sol.count, description: sol.description })
                      setActiveModal('solution')
                    }}
                    className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg"
                  >
                    Edit Card
                  </button>
                  <button
                    onClick={() => {
                      setSolutionsData((prev) => prev.filter((s) => s.id !== sol.id))
                      notifySaved('Solution card deleted!')
                    }}
                    className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: QUALITY PILLARS & MANUFACTURING */}
      {activeTab === 'pillars' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-lg font-black text-[#0B1B3D]">Section 5: Quality Pillars 2-Column Showcase</h2>
            <p className="text-xs text-slate-500">Upload quality pillars banner image directly from computer.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 md:col-span-2">
              <AdminMediaUploadPlaceholder
                label="Quality Pillars Banner Image"
                type="image"
                value={pillarsData.imageUrl}
                onChange={(url) => setPillarsData({ ...pillarsData, imageUrl: url })}
                placeholderText="Click or Drop to Upload Pillars Banner Image from Device"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Badge Tagline</label>
              <input
                type="text"
                value={pillarsData.badge}
                onChange={(e) => setPillarsData({ ...pillarsData, badge: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Main Title</label>
              <input
                type="text"
                value={pillarsData.title}
                onChange={(e) => setPillarsData({ ...pillarsData, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Description Paragraph</label>
              <textarea
                rows={3}
                value={pillarsData.description}
                onChange={(e) => setPillarsData({ ...pillarsData, description: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: PRECISION HEALTHCARE CALLOUT BANNER */}
      {activeTab === 'precision' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-lg font-black text-[#0B1B3D]">Section 6: Precision Healthcare Callout Banner</h2>
            <p className="text-xs text-slate-500">Upload background banner image directly and edit callout text.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 md:col-span-2">
              <AdminMediaUploadPlaceholder
                label="Precision Callout Banner Background Image"
                type="image"
                value={precisionData.bgImage}
                onChange={(url) => setPrecisionData({ ...precisionData, bgImage: url })}
                placeholderText="Click or Drop to Upload Precision Banner Image from Computer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Badge Tagline</label>
              <input
                type="text"
                value={precisionData.badge}
                onChange={(e) => setPrecisionData({ ...precisionData, badge: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Main Banner Title</label>
              <input
                type="text"
                value={precisionData.title}
                onChange={(e) => setPrecisionData({ ...precisionData, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: PROCESS STEPS SHOWCASE */}
      {activeTab === 'process' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">Section 7: How We Process Across Department Workflow</h2>
              <p className="text-xs text-slate-500">Upload step images directly and manage process step details.</p>
            </div>
            <button
              onClick={() => {
                setEditingItemId(null)
                setProcessForm({ step_number: processSteps.length + 1, title: 'New Manufacturing Step', description: 'Step description', image_url: '/images/process-hand-filing.png' })
                setActiveModal('process')
              }}
              className="px-4 py-2 bg-[#0B1B3D] text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Process Step</span>
            </button>
          </div>

          <div className="space-y-4">
            {processSteps.map((step) => (
              <div key={step.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-24 h-16 rounded-xl overflow-hidden bg-slate-950 border border-slate-300 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={step.image_url} alt={step.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-black text-red-600 block">STEP 0{step.step_number}</span>
                    <h3 className="text-xs font-black text-[#0B1B3D]">{step.title}</h3>
                    <p className="text-[11px] text-slate-500">{step.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setProcessSteps((prev) => prev.filter((p) => p.id !== step.id))
                      notifySaved('Process step deleted!')
                    }}
                    className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 8: VIDEO & CERTIFICATION LOGOS */}
      {activeTab === 'video' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-lg font-black text-[#0B1B3D]">Section 8: Compliance Video & Certification Logos Upload</h2>
            <p className="text-xs text-slate-500">Upload MP4 videos, video thumbnail poster image, and certification logo images.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <AdminMediaUploadPlaceholder
                label="Compliance Showcase Video File (MP4/WebM)"
                type="video"
                accept="video/mp4,video/webm"
                value={videoData.videoUrl}
                onChange={(url) => setVideoData({ ...videoData, videoUrl: url })}
                placeholderText="Click or Drop to Upload MP4 Video File from Device"
              />
            </div>

            <div className="space-y-4">
              <AdminMediaUploadPlaceholder
                label="Video Thumbnail Poster Image"
                type="image"
                value={videoData.thumbnailImage}
                onChange={(url) => setVideoData({ ...videoData, thumbnailImage: url })}
                placeholderText="Click or Drop to Upload Video Thumbnail Poster"
              />
            </div>
          </div>

          {/* Certification Logos List */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase">Certification Logos</h3>
              <button
                onClick={() => {
                  setCertForm({ name: 'New Certification Logo', logo_url: '/images/icon-iso.png' })
                  setActiveModal('cert')
                }}
                className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Logo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {certLogos.map((cert) => (
                <div key={cert.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cert.logo_url} alt={cert.name} className="h-8 object-contain" />
                    <span className="text-xs font-bold text-slate-800 truncate">{cert.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      setCertLogos((prev) => prev.filter((c) => c.id !== cert.id))
                      notifySaved('Certification logo removed!')
                    }}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DIALOGS FOR ITEM EDITING WITH DIRECT UPLOAD PLACEHOLDERS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-[#0B1B3D] uppercase">Configure Item Details & Image Upload</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* HERO MODAL */}
            {activeModal === 'hero' && (
              <div className="space-y-4">
                <AdminMediaUploadPlaceholder
                  label="Hero Banner Image"
                  type="image"
                  value={heroForm.image_url}
                  onChange={(url) => setHeroForm({ ...heroForm, image_url: url })}
                  placeholderText="Click or Drop to Upload Hero Image from Gallery"
                />
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Main Title</label>
                  <input
                    type="text"
                    value={heroForm.title}
                    onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-bold"
                  />
                </div>
                <button
                  onClick={() => {
                    let updated: AdminHeroSlide[] = []
                    if (editingItemId) {
                      updated = heroSlides.map((s) => (s.id === editingItemId ? { ...heroForm, id: editingItemId } : s))
                    } else {
                      updated = [...heroSlides, { ...heroForm, id: `slide-${Date.now()}` }]
                    }
                    setHeroSlides(updated)
                    saveHeroSlidesToStorage(updated)
                    setActiveModal(null)
                    notifySaved('Hero slide updated & saved!')
                  }}
                  className="w-full py-2.5 bg-[#E31B23] text-white text-xs font-black rounded-xl"
                >
                  Save Hero Slide
                </button>
              </div>
            )}

            {/* STAT MODAL */}
            {activeModal === 'stat' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Counter Number</label>
                  <input
                    type="text"
                    value={statForm.number}
                    onChange={(e) => setStatForm({ ...statForm, number: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Counter Label</label>
                  <input
                    type="text"
                    value={statForm.label}
                    onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-bold"
                  />
                </div>
                <button
                  onClick={() => {
                    if (editingItemId) {
                      setStatsData((prev) => prev.map((s) => (s.id === editingItemId ? { ...statForm, id: editingItemId } : s)))
                    } else {
                      setStatsData((prev) => [...prev, { ...statForm, id: `stat-${Date.now()}` }])
                    }
                    setActiveModal(null)
                    notifySaved('Stat counter updated!')
                  }}
                  className="w-full py-2.5 bg-[#0B1B3D] text-white text-xs font-black rounded-xl"
                >
                  Save Counter
                </button>
              </div>
            )}

            {/* SOLUTION MODAL */}
            {activeModal === 'solution' && (
              <div className="space-y-4">
                <AdminMediaUploadPlaceholder
                  label="Category Card Image"
                  type="image"
                  value={solutionForm.image_url}
                  onChange={(url) => setSolutionForm({ ...solutionForm, image_url: url })}
                  placeholderText="Upload Category Image from Gallery"
                />
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category Title</label>
                  <input
                    type="text"
                    value={solutionForm.title}
                    onChange={(e) => setSolutionForm({ ...solutionForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-bold"
                  />
                </div>
                <button
                  onClick={() => {
                    if (editingItemId) {
                      setSolutionsData((prev) => prev.map((s) => (s.id === editingItemId ? { ...solutionForm, id: editingItemId } : s)))
                    } else {
                      setSolutionsData((prev) => [...prev, { ...solutionForm, id: `sol-${Date.now()}` }])
                    }
                    setActiveModal(null)
                    notifySaved('Solution card saved!')
                  }}
                  className="w-full py-2.5 bg-[#E31B23] text-white text-xs font-black rounded-xl"
                >
                  Save Category Solution
                </button>
              </div>
            )}

            {/* PROCESS MODAL */}
            {activeModal === 'process' && (
              <div className="space-y-4">
                <AdminMediaUploadPlaceholder
                  label="Process Step Image"
                  type="image"
                  value={processForm.image_url}
                  onChange={(url) => setProcessForm({ ...processForm, image_url: url })}
                  placeholderText="Upload Process Image from Gallery"
                />
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Step Title</label>
                  <input
                    type="text"
                    value={processForm.title}
                    onChange={(e) => setProcessForm({ ...processForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-bold"
                  />
                </div>
                <button
                  onClick={() => {
                    setProcessSteps((prev) => [...prev, { id: `proc-${Date.now()}`, ...processForm, highlights: [] }])
                    setActiveModal(null)
                    notifySaved('Process step added!')
                  }}
                  className="w-full py-2.5 bg-[#0B1B3D] text-white text-xs font-black rounded-xl"
                >
                  Save Process Step
                </button>
              </div>
            )}

            {/* CERT LOGO MODAL */}
            {activeModal === 'cert' && (
              <div className="space-y-4">
                <AdminMediaUploadPlaceholder
                  label="Certification Logo Image"
                  type="image"
                  value={certForm.logo_url}
                  onChange={(url) => setCertForm({ ...certForm, logo_url: url })}
                  placeholderText="Upload Certificate Logo Image"
                />
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Certificate Name</label>
                  <input
                    type="text"
                    value={certForm.name}
                    onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-bold"
                  />
                </div>
                <button
                  onClick={() => {
                    setCertLogos((prev) => [...prev, { id: `cert-${Date.now()}`, ...certForm }])
                    setActiveModal(null)
                    notifySaved('Certification logo added!')
                  }}
                  className="w-full py-2.5 bg-[#E31B23] text-white text-xs font-black rounded-xl"
                >
                  Save Certification Logo
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}

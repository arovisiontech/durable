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
  Layers,
  X,
  Video,
  Award,
  BarChart3,
  ListOrdered,
  ShieldCheck,
  FileText,
  Info,
  Sliders,
  Sparkles,
  Building2,
  CheckCircle,
  HelpCircle,
  Globe,
  TrendingUp,
  Factory,
} from 'lucide-react'
import { AdminMediaUploadPlaceholder } from '@/src/components/admin/AdminMediaUploadPlaceholder'
import { RichTextToolbar } from '@/src/components/admin/RichTextToolbar'
import { savePersistentData, loadPersistentData } from '@/src/lib/persistentStorage'

// Interfaces
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
  is_published?: boolean
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

export interface AdminQualityTrustCard {
  id: string
  title: string
  description: string
  icon: string
}

export interface AdminPillarBlock {
  id: string
  title: string
  description: string
}

export interface AdminProcessStep {
  id: string
  step_number: number
  title: string
  category: string
  description: string
  image_url: string
  highlights?: string[]
}

export interface AdminCertLogo {
  id: string
  name: string
  logo_url: string
}

export interface CustomHomeBlock {
  id: string
  title: string
  subheading?: string
  description: string
  image_url?: string
}

export default function AdminContentHomePage() {
  const [isSaved, setIsSaved] = useState(false)
  const [saveMessage, setSaveMessage] = useState('Home Page content updated and published live!')

  // 1. HERO SLIDER STATE
  const [heroSlides, setHeroSlides] = useState<AdminHeroSlide[]>([
    {
      id: 'slide-1',
      title: 'EVERY 5 SECONDS, WE MAKE A DIFFERENCE',
      subtitle: 'SINCE 1973 • PRECISION SURGICAL MANUFACTURING',
      description: 'Durable Hospital Supplies is a trusted global partner for healthcare brands seeking reliable, high-quality surgical manufacturing solutions.',
      image_url: '/images/surgical-hero.png',
      button_text: 'EXPLORE PRODUCTS',
      button_link: '/products',
      secondary_button_text: 'VIEW CATALOGUE',
      secondary_button_link: '/catalogues',
      is_published: true,
    },
    {
      id: 'slide-2',
      title: 'WORLD-CLASS DENTAL & SURGICAL INSTRUMENTS',
      subtitle: 'ISO 13485 CERTIFIED • DENTAL & SURGICAL EXCELLENCE',
      description: 'Engineered for precision surgeons and dental professionals worldwide.',
      image_url: '/images/dental-clinic-banner.png',
      button_text: 'EXPLORE PRODUCTS',
      button_link: '/products',
      secondary_button_text: 'VIEW CATALOGUE',
      secondary_button_link: '/catalogues',
      is_published: true,
    },
  ])

  // 2. ABOUT US SECTION STATE ("SINCE 1973")
  const [aboutData, setAboutData] = useState({
    badge: 'SINCE 1973',
    titlePrimary: 'Elevating Global',
    titleHighlight: 'Healthcare Standards',
    desc1: 'Durable Hospital Supplies is A Trusted Global Partner For Healthcare Brands Seeking Reliable, High-Quality Surgical Manufacturing Solutions. With Over 53 Years Of Experience, We Operate From Our Modern Facility In Sialkot, Pakistan, Where We Design And Manufacture A Wide Range Of General Surgical, Dental Instruments, Ophthalmic, Medical Hollowwares, Hospital Furniture, And Single Use Instruments.',
    desc2: 'Our Commitment To Excellence Is Supported By ISO 13485-Certified Processes And Compliance With ISO, MDR-Ready And FDA Requirements, Ensuring Every Product Meets The Highest Standards Of Safety And Performance.',
    imageUrl: '/images/about-surgical-instruments.png',
    ctaPrimaryText: 'GET IN TOUCH',
    ctaPrimaryUrl: '/contact',
    ctaSecondaryText: 'DOWNLOAD CATALOGUE',
    ctaSecondaryUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
  })

  // 3. KEY STATS COUNTER CARDS STATE
  const [statsData, setStatsData] = useState<AdminStatItem[]>([
    { id: 'stat-1', number: '20,000+', label: 'Products Manufactured' },
    { id: 'stat-2', number: '6+', label: 'Production Facilities' },
    { id: 'stat-3', number: '300+', label: 'Skilled Workers' },
    { id: 'stat-4', number: '50+', label: 'Export Countries' },
  ])

  // 4. SOLUTIONS GRID CARDS STATE (6 Categories)
  const [solutionsData, setSolutionsData] = useState<AdminSolutionCard[]>([
    { id: 'sol-1', title: 'General Surgery', image_url: '/images/cat-scissors-shears.png', count: '01', description: 'Precision Instruments For All Surgical Discipline' },
    { id: 'sol-2', title: 'Dental', image_url: '/images/cat-retractors.png', count: '02', description: 'Complete Dental Solutions For Every Specialty' },
    { id: 'sol-3', title: 'Medical Hollowware', image_url: '/images/cat-handles-blades.png', count: '03', description: 'Instrument Storage & Sterilization Solutions' },
    { id: 'sol-4', title: 'Ophthalmic', image_url: '/images/cat-scissors-shears.png', count: '04', description: 'Complete Ophthalmic Instrument Range' },
    { id: 'sol-5', title: 'Hospital Furniture', image_url: '/images/cat-retractors.png', count: '05', description: 'Functional Solutions For Hospitals' },
    { id: 'sol-6', title: 'Single Use Instruments', image_url: '/images/cat-handles-blades.png', count: '06', description: 'Reliable Single-Use Solutions' },
  ])

  // 5. QUALITY YOU CAN TRUST SECTION STATE (4 Cards)
  const [qualityTrustData, setQualityTrustData] = useState({
    badge: 'BUILT FOR SAFETY. DESIGNED FOR EXCELLENCE.',
    title: 'Quality You Can Trust, Every Time',
    subtitle: 'From Raw Material To Final Inspection - Every Step Is Controlled, So You Can Focus On What Matters Most: Your Patients',
    cards: [
      {
        id: 'qt-1',
        title: 'Premium Reusable Solutions',
        description: 'High-Quality Reusable Instruments Engineered For Lasting Precision And Dependable Performance.',
        icon: '/images/icon-premium-reusable.png',
      },
      {
        id: 'qt-2',
        title: 'One-Time Use Instruments',
        description: 'Single-Use Solutions Ensuring Optimal Hygiene And Performance.',
        icon: '/images/icon-single-use.png',
      },
      {
        id: 'qt-3',
        title: 'Qualified Or Licensed',
        description: 'Manufactured Under Certified Quality Systems And International Standards.',
        icon: '/images/icon-qualified.png',
      },
      {
        id: 'qt-4',
        title: 'Reliable',
        description: 'Engineered For Consistent Performance You Can Trust.',
        icon: '/images/icon-reliable.png',
      },
    ],
  })

  // 6. DELIVERING CONFIDENCE THROUGH QUALITY / PILLARS STATE
  const [pillarsData, setPillarsData] = useState({
    titlePrimary: 'Delivering Confidence ',
    titleHighlight: 'Through Quality',
    imageUrl: '/images/surgical-tray-durable.png',
    pillars: [
      {
        id: 'supply-chain',
        title: 'SUPPLY CHAIN RESILIENCE',
        description:
          'Our Robust Global Supply Chain Is Built To Ensure Consistent Product Availability, Timely Delivery, And Uninterrupted Support For Healthcare Providers Worldwide. Through Strategic Sourcing, Advanced Manufacturing, Efficient Inventory Management, And Dependable Logistics, We Maintain The Flexibility And Reliability Needed To Meet Evolving Market Demands While Delivering Exceptional Quality And Service.',
      },
      {
        id: 'compliance',
        title: 'COMPLIANCE & QUALITY ASSURANCE',
        description:
          'Quality And Compliance Are At The Core Of Everything We Do. Our Products Are Manufactured Under Stringent Quality Management Systems And Adhere To Internationally Recognized Regulatory Standards. Through Rigorous Inspections, Validated Processes, And Continuous Quality Control, We Ensure Every Instrument Delivers The Safety, Precision, And Reliability Healthcare Professionals Depend On.',
      },
      {
        id: 'risk-management',
        title: 'RISK MANAGEMENT',
        description:
          'We Take A Proactive Approach To Risk Management By Implementing Robust Quality Controls, Regulatory Compliance Measures, And Continuous Process Monitoring Throughout Our Operations. From Manufacturing To Delivery, Every Stage Is Carefully Managed To Minimize Risks, Ensure Product Integrity, And Provide Healthcare Professionals With Safe, Reliable, And Consistent Solutions They Can Trust.',
      },
    ],
  })

  // 7. PRECISION SOLUTIONS CALLOUT BANNER STATE
  const [precisionData, setPrecisionData] = useState({
    badge: 'GLOBAL HEALTHCARE PARTNER',
    title: 'Precision Solutions. Trusted Quality. Better Healthcare.',
    subtitle: 'Partner with Sialkot’s premier surgical manufacturing facility.',
    description: 'We manufacture premium surgical instruments and sterile solutions with the highest standards of quality, compliance and precision - empowering healthcare brands worldwide.',
    bgImage: '/images/precision-healthcare-banner.png',
    ctaText: 'Partner With Us',
    ctaUrl: '/contact',
  })

  // 8. PROCESS STEPS STATE (7 Departments)
  const [processSteps, setProcessSteps] = useState<AdminProcessStep[]>([
    { id: 'step-1', step_number: 1, title: 'Computer Aided R&D & CAD Prototyping', category: 'Research & Development', description: '3D modeling, CAD prototyping and ergonomic testing.', image_url: '/images/process-erp-operator.png' },
    { id: 'step-2', step_number: 2, title: 'German & Japanese Stainless Steel Sourcing', category: 'Material Sourcing', description: 'German & Japanese stainless steel grade selection.', image_url: '/images/process-hand-filing.png' },
    { id: 'step-3', step_number: 3, title: 'Precision Machining & Hand Filing', category: 'Precision Manufacturing', description: 'Master craftsmen hand-file jaw serrations and box joints.', image_url: '/images/process-wooden-anvil.png' },
    { id: 'step-4', step_number: 4, title: 'Microscopic & Hardness Inspection', category: 'Quality Inspection', description: 'Microscopic inspection and Rockwell C hardness verification.', image_url: '/images/process-traveler-card.png' },
    { id: 'step-5', step_number: 5, title: 'Anti-Glare Satin Surface Anodizing', category: 'Surface Finishing', description: 'Passivated satin finish preventing glare under surgical lamps.', image_url: '/images/process-hand-filing.png' },
    { id: 'step-6', step_number: 6, title: 'Ultrasonic Sterilization & Cleaning', category: 'Sterilization & Cleaning', description: 'ISO Class 7 cleanroom ultrasonic wash and residue removal.', image_url: '/images/about-surgical-instruments.png' },
    { id: 'step-7', step_number: 7, title: 'Boil & Passivation Corrosion Testing', category: 'Testing & Validation', description: 'Autoclave testing and chemical passivation validation.', image_url: '/images/process-erp-operator.png' },
  ])

  // 9. VIDEO & CERTIFICATION LOGOS STATE
  const [videoData, setVideoData] = useState({
    badge: 'COMPLIANCE AND CERTIFICATIONS',
    title: 'Watch Our Quality & Manufacturing Process Showcase',
    description: 'Durable Hospital Supplies Operates In Full Compliance With Internationally Recognized Medical Device Regulations And Quality Management Standards. Our Surgical, Dental, And Medical Instruments Are Manufactured, Inspected, And Validated To Meet Global Healthcare Markets Requirements.',
    videoUrl: 'https://vimeo.com/1230520070?fl=ip&fe=ec',
    thumbnailImage: '',
  })

  const [certLogos, setCertLogos] = useState<AdminCertLogo[]>([
    { id: 'c-1', name: 'SCCI Sialkot Chamber', logo_url: '/images/icon-scci-white.png' },
    { id: 'c-2', name: 'ISO 9001:2015', logo_url: '/images/icon-iso.png' },
    { id: 'c-3', name: 'ISO 13485:2016', logo_url: '/images/icon-iso-13485-white.png' },
    { id: 'c-4', name: 'SIMA Surgical Instrument Manufacturers Association', logo_url: '/images/icon-sima-scci.png' },
    { id: 'c-5', name: 'CE Registered', logo_url: '/images/icon-oem.png' },
    { id: 'c-6', name: 'FDA Registered', logo_url: '/images/icon-oem.png' },
    { id: 'c-7', name: 'EU-MDR Ready', logo_url: '/images/icon-eumdr.png' },
    { id: 'c-8', name: 'EMDR Registered', logo_url: '/images/emdr.png' },
  ])

  // 10. CUSTOM HOME BLOCKS STATE
  const [customBlocks, setCustomBlocks] = useState<CustomHomeBlock[]>([])

  // Modal Dialog Control States
  const [activeModal, setActiveModal] = useState<'hero' | 'stat' | 'solution' | 'qualityCard' | 'pillar' | 'process' | 'cert' | 'custom' | null>(null)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)

  // Forms for Modals
  const [heroForm, setHeroForm] = useState<Omit<AdminHeroSlide, 'id'>>({
    title: '',
    subtitle: '',
    description: '',
    image_url: '/images/surgical-hero.png',
    button_text: 'EXPLORE PRODUCTS',
    button_link: '/products',
    secondary_button_text: 'VIEW CATALOGUE',
    secondary_button_link: '/catalogues',
    is_published: true,
  })

  const [statForm, setStatForm] = useState({ number: '', label: '' })
  const [solutionForm, setSolutionForm] = useState({ title: '', image_url: '/images/cat-scissors-shears.png', count: '01', description: '' })
  const [qualityCardForm, setQualityCardForm] = useState({ title: '', description: '', icon: '/images/icon-premium-reusable.png' })
  const [pillarForm, setPillarForm] = useState({ title: '', description: '' })
  const [processForm, setProcessForm] = useState({ step_number: 1, title: '', category: 'Research & Development', description: '', image_url: '/images/process-hand-filing.png' })
  const [certForm, setCertForm] = useState({ name: '', logo_url: '/images/icon-iso.png' })
  const [customModalForm, setCustomModalForm] = useState({ title: '', subheading: '', description: '', image_url: '' })

  // SYNC FROM STORAGE AND CLOUD API ON MOUNT
  useEffect(() => {
    loadPersistentData('durable_hero_slides', heroSlides, (data) => {
      if (Array.isArray(data) && data.length > 0) setHeroSlides(data)
    })
    loadPersistentData('durable_about_data', aboutData, (data) => {
      if (data && typeof data === 'object') setAboutData((prev) => ({ ...prev, ...data }))
    })
    loadPersistentData('durable_stats_data', statsData, (data) => {
      if (Array.isArray(data) && data.length > 0) setStatsData(data)
    })
    loadPersistentData('durable_solutions_data', solutionsData, (data) => {
      if (Array.isArray(data) && data.length > 0) setSolutionsData(data)
    })
    loadPersistentData('durable_quality_trust_data', qualityTrustData, (data) => {
      if (data && typeof data === 'object') setQualityTrustData((prev) => ({ ...prev, ...data }))
    })
    loadPersistentData('durable_pillars_data', pillarsData, (data) => {
      if (data && typeof data === 'object') setPillarsData((prev) => ({ ...prev, ...data }))
    })
    loadPersistentData('durable_precision_data', precisionData, (data) => {
      if (data && typeof data === 'object') setPrecisionData((prev) => ({ ...prev, ...data }))
    })
    loadPersistentData('durable_process_data', processSteps, (data) => {
      if (Array.isArray(data) && data.length > 0) setProcessSteps(data)
    })
    loadPersistentData('durable_video_data', videoData, (data) => {
      if (data && typeof data === 'object') setVideoData((prev) => ({ ...prev, ...data }))
    })
    loadPersistentData('durable_cert_logos', certLogos, (data) => {
      if (Array.isArray(data) && data.length > 0) setCertLogos(data)
    })
    loadPersistentData('durable_custom_home_blocks', customBlocks, (data) => {
      if (Array.isArray(data)) setCustomBlocks(data)
    })
  }, [])

  // SAVE ALL CHANGES TO STORAGE & CLOUD AUTOMATICALLY
  const saveAllToStorage = (overrideHero?: AdminHeroSlide[]) => {
    try {
      savePersistentData('durable_hero_slides', overrideHero || heroSlides)
      savePersistentData('durable_about_data', aboutData)
      savePersistentData('durable_stats_data', statsData)
      savePersistentData('durable_solutions_data', solutionsData)
      savePersistentData('durable_quality_trust_data', qualityTrustData)
      savePersistentData('durable_pillars_data', pillarsData)
      savePersistentData('durable_precision_data', precisionData)
      savePersistentData('durable_process_data', processSteps)
      savePersistentData('durable_video_data', videoData)
      savePersistentData('durable_cert_logos', certLogos)
      savePersistentData('durable_custom_home_blocks', customBlocks)

      setIsSaved(true)
      setSaveMessage('Home Page changes saved & synced live across all devices!')
      setTimeout(() => setIsSaved(false), 4000)
    } catch (e) {
      console.error('Persistent write error:', e)
    }
  }

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    saveAllToStorage()
  }

  // --- ACTIONS ---
  const handleOpenAddHeroModal = () => {
    setEditingItemId(null)
    setHeroForm({
      title: 'EVERY 5 SECONDS, WE MAKE A DIFFERENCE',
      subtitle: 'SINCE 1973 • PRECISION SURGICAL MANUFACTURING',
      description: 'Durable Hospital Supplies surgical manufacturing solutions.',
      image_url: '/images/surgical-hero.png',
      button_text: 'EXPLORE PRODUCTS',
      button_link: '/products',
      secondary_button_text: 'VIEW CATALOGUE',
      secondary_button_link: '/catalogues',
      is_published: true,
    })
    setActiveModal('hero')
  }

  const handleOpenEditHeroModal = (slide: AdminHeroSlide) => {
    setEditingItemId(slide.id)
    setHeroForm({
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description,
      image_url: slide.image_url,
      button_text: slide.button_text,
      button_link: slide.button_link,
      secondary_button_text: slide.secondary_button_text,
      secondary_button_link: slide.secondary_button_link,
      is_published: slide.is_published,
    })
    setActiveModal('hero')
  }

  const handleDeleteHeroSlide = (id: string) => {
    if (confirm('Are you sure you want to delete this hero slide?')) {
      const updated = heroSlides.filter((s) => s.id !== id)
      setHeroSlides(updated)
      saveAllToStorage(updated)
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span>Website Content</span>
            <span>•</span>
            <span className="text-[#E31B23]">Home Page Manager</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3D] tracking-tight">
            Home Page Content Manager
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage all 10 sections of the Home page dynamically (Hero Slider, SINCE 1973 About Us, Stat Counters, Solutions, Quality Trust, Quality Pillars, Precision Banner, Departments Process, Compliance Video & Logos, Custom Sections).
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

      {/* Quick Jump Navigation Bar */}
      <div className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-2 overflow-x-auto scrollbar-none text-xs font-bold">
        <span className="text-slate-400 uppercase text-[10px] tracking-wider px-2 shrink-0">Quick Jump:</span>
        <a href="#sec-hero" className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 shrink-0">1. Hero Banner</a>
        <a href="#sec-about" className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 shrink-0">2. About Us</a>
        <a href="#sec-stats" className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 shrink-0">3. Stat Counters</a>
        <a href="#sec-solutions" className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 shrink-0">4. Solutions Grid</a>
        <a href="#sec-qualitytrust" className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 shrink-0">5. Quality Trust</a>
        <a href="#sec-pillars" className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 shrink-0">6. Quality Pillars</a>
        <a href="#sec-precision" className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 shrink-0">7. Precision Banner</a>
        <a href="#sec-process" className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 shrink-0">8. Process Steps</a>
        <a href="#sec-video" className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 shrink-0">9. Video & Logos</a>
        <a href="#sec-custom" className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 shrink-0">10. Custom Sections</a>
      </div>

      {/* ALL 10 STACKED SECTIONS */}
      <div className="space-y-8">

        {/* SECTION 1: HERO BANNER SETTINGS */}
        <div id="sec-hero" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#0B1B3D]">1. Home Hero Banner Settings & Carousel Slides</h2>
                <p className="text-xs text-slate-500">Edit hero banner title, subtitle, buttons, and upload background images.</p>
              </div>
            </div>

            <button
              onClick={handleOpenAddHeroModal}
              className="px-4 py-2 text-xs font-bold text-white bg-[#0B1B3D] hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Hero Slide</span>
            </button>
          </div>

          <div className="space-y-4">
            {heroSlides.map((slide, idx) => (
              <div key={slide.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-4">
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
                    onClick={() => handleOpenEditHeroModal(slide)}
                    className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Slide</span>
                  </button>
                  <button
                    onClick={() => handleDeleteHeroSlide(slide.id)}
                    className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: ABOUT US SECTION ("SINCE 1973") */}
        <div id="sec-about" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">2. Introductory Overview Text (SINCE 1973)</h2>
              <p className="text-xs text-slate-500">Edit top overview paragraph, title, image, and CTA buttons.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Pill Badge Text</label>
              <input
                type="text"
                value={aboutData.badge}
                onChange={(e) => setAboutData({ ...aboutData, badge: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Title Line 1</label>
              <input
                type="text"
                value={aboutData.titlePrimary}
                onChange={(e) => setAboutData({ ...aboutData, titlePrimary: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Title Highlight (Line 2 Red)</label>
              <input
                type="text"
                value={aboutData.titleHighlight}
                onChange={(e) => setAboutData({ ...aboutData, titleHighlight: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#E31B23] focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <RichTextToolbar
                label="Description Paragraph 1"
                value={aboutData.desc1}
                onChange={(val) => setAboutData({ ...aboutData, desc1: val })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <RichTextToolbar
                label="Description Paragraph 2"
                value={aboutData.desc2}
                onChange={(val) => setAboutData({ ...aboutData, desc2: val })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Primary CTA Button Text</label>
              <input
                type="text"
                value={aboutData.ctaPrimaryText}
                onChange={(e) => setAboutData({ ...aboutData, ctaPrimaryText: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Primary CTA Button URL</label>
              <input
                type="text"
                value={aboutData.ctaPrimaryUrl}
                onChange={(e) => setAboutData({ ...aboutData, ctaPrimaryUrl: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Secondary CTA Button Text</label>
              <input
                type="text"
                value={aboutData.ctaSecondaryText}
                onChange={(e) => setAboutData({ ...aboutData, ctaSecondaryText: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Secondary CTA Button URL</label>
              <input
                type="text"
                value={aboutData.ctaSecondaryUrl}
                onChange={(e) => setAboutData({ ...aboutData, ctaSecondaryUrl: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">About Us Main Image</label>
              <AdminMediaUploadPlaceholder
                value={aboutData.imageUrl}
                onChange={(url) => setAboutData({ ...aboutData, imageUrl: url })}
                label="Choose or Upload About Section Image"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: KEY STATS COUNTERS */}
        <div id="sec-stats" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#0B1B3D]">3. Key Company Statistics Counters</h2>
                <p className="text-xs text-slate-500">Manage 20,000+ Products, 6+ Facilities, 300+ Workers, 50+ Export Countries counters.</p>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingItemId(null)
                setStatForm({ number: '100+', label: 'New Metric Label' })
                setActiveModal('stat')
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-[#0B1B3D] hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Counter</span>
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
                      className="p-1 text-slate-300 hover:text-white cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        const updated = statsData.filter((s) => s.id !== stat.id)
                        setStatsData(updated)
                        saveAllToStorage()
                      }}
                      className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
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

        {/* SECTION 4: SOLUTIONS GRID (6 Categories) */}
        <div id="sec-solutions" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#0B1B3D]">4. Comprehensive Surgical & Medical Instrument Solutions</h2>
                <p className="text-xs text-slate-500">Manage all 6 product category solution cards (General Surgery, Dental, etc.).</p>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingItemId(null)
                setSolutionForm({ title: 'New Category', image_url: '/images/cat-scissors-shears.png', count: '07', description: 'Category description' })
                setActiveModal('solution')
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-[#0B1B3D] hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Solution Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {solutionsData.map((sol) => (
              <div key={sol.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-full h-28 rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={sol.image_url} alt={sol.title} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#E31B23] block">{sol.count}</span>
                    <h3 className="text-xs font-black text-[#0B1B3D]">{sol.title}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{sol.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setEditingItemId(sol.id)
                      setSolutionForm({ title: sol.title, image_url: sol.image_url, count: sol.count, description: sol.description })
                      setActiveModal('solution')
                    }}
                    className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Edit Card
                  </button>
                  <button
                    onClick={() => {
                      const updated = solutionsData.filter((s) => s.id !== sol.id)
                      setSolutionsData(updated)
                      saveAllToStorage()
                    }}
                    className="p-1 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: QUALITY YOU CAN TRUST (4 Cards) */}
        <div id="sec-qualitytrust" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">5. BUILT FOR SAFETY. DESIGNED FOR EXCELLENCE. (4 Quality Cards)</h2>
              <p className="text-xs text-slate-500">Edit feature badge, title, subtitle, and all 4 quality cards.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Tagline Badge</label>
              <input
                type="text"
                value={qualityTrustData.badge}
                onChange={(e) => setQualityTrustData({ ...qualityTrustData, badge: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Main Title</label>
              <input
                type="text"
                value={qualityTrustData.title}
                onChange={(e) => setQualityTrustData({ ...qualityTrustData, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Subtitle Paragraph</label>
              <textarea
                rows={2}
                value={qualityTrustData.subtitle}
                onChange={(e) => setQualityTrustData({ ...qualityTrustData, subtitle: e.target.value })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase">4 Quality Trust Feature Cards</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {qualityTrustData.cards.map((card, idx) => (
                <div key={card.id || idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <AdminMediaUploadPlaceholder
                    label={`Card ${idx + 1} Icon`}
                    value={card.icon}
                    onChange={(url) => {
                      const updated = qualityTrustData.cards.map((c, i) => (i === idx ? { ...c, icon: url } : c))
                      setQualityTrustData({ ...qualityTrustData, cards: updated })
                    }}
                    placeholderText="Upload Icon Image"
                  />
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Title</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => {
                        const updated = qualityTrustData.cards.map((c, i) => (i === idx ? { ...c, title: e.target.value } : c))
                        setQualityTrustData({ ...qualityTrustData, cards: updated })
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Description</label>
                    <textarea
                      rows={2}
                      value={card.description}
                      onChange={(e) => {
                        const updated = qualityTrustData.cards.map((c, i) => (i === idx ? { ...c, description: e.target.value } : c))
                        setQualityTrustData({ ...qualityTrustData, cards: updated })
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 6: DELIVERING CONFIDENCE THROUGH QUALITY / PILLARS */}
        <div id="sec-pillars" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#0B1B3D]">6. Delivering Confidence Through Quality (Quality Pillars)</h2>
                <p className="text-xs text-slate-500">Edit titles, surgical tray photo, supply chain, compliance, and risk management pillars.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Title Line 1</label>
              <input
                type="text"
                value={pillarsData.titlePrimary}
                onChange={(e) => setPillarsData({ ...pillarsData, titlePrimary: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Title Line 2 (Red Highlight)</label>
              <input
                type="text"
                value={pillarsData.titleHighlight}
                onChange={(e) => setPillarsData({ ...pillarsData, titleHighlight: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#E31B23]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Surgical Tray Image</label>
              <AdminMediaUploadPlaceholder
                value={pillarsData.imageUrl}
                onChange={(url) => setPillarsData({ ...pillarsData, imageUrl: url })}
                label="Choose or Upload Surgical Tray Banner Image"
              />
            </div>
          </div>

          {/* 3 Pillar Blocks Editor */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase">Pillar Blocks</h3>
            <div className="space-y-4">
              {pillarsData.pillars.map((pillar, idx) => (
                <div key={pillar.id || idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase">Pillar {idx + 1} Title</label>
                    <input
                      type="text"
                      value={pillar.title}
                      onChange={(e) => {
                        const updated = pillarsData.pillars.map((p, i) => (i === idx ? { ...p, title: e.target.value } : p))
                        setPillarsData({ ...pillarsData, pillars: updated })
                      }}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase">Pillar {idx + 1} Description</label>
                    <textarea
                      rows={3}
                      value={pillar.description}
                      onChange={(e) => {
                        const updated = pillarsData.pillars.map((p, i) => (i === idx ? { ...p, description: e.target.value } : p))
                        setPillarsData({ ...pillarsData, pillars: updated })
                      }}
                      className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 7: PRECISION SOLUTIONS CALLOUT BANNER */}
        <div id="sec-precision" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">7. Precision Solutions. Trusted Quality. Better Healthcare.</h2>
              <p className="text-xs text-slate-500">Edit callout title, subtitle, paragraph, CTA button link & background image.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Badge Tagline</label>
              <input
                type="text"
                value={precisionData.badge}
                onChange={(e) => setPrecisionData({ ...precisionData, badge: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Main Title</label>
              <input
                type="text"
                value={precisionData.title}
                onChange={(e) => setPrecisionData({ ...precisionData, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Red Subtitle Line</label>
              <input
                type="text"
                value={precisionData.subtitle}
                onChange={(e) => setPrecisionData({ ...precisionData, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#E31B23]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Description Paragraph</label>
              <textarea
                rows={3}
                value={precisionData.description}
                onChange={(e) => setPrecisionData({ ...precisionData, description: e.target.value })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">CTA Button Text</label>
              <input
                type="text"
                value={precisionData.ctaText}
                onChange={(e) => setPrecisionData({ ...precisionData, ctaText: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">CTA Button Link</label>
              <input
                type="text"
                value={precisionData.ctaUrl}
                onChange={(e) => setPrecisionData({ ...precisionData, ctaUrl: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Background Banner Image</label>
              <AdminMediaUploadPlaceholder
                value={precisionData.bgImage}
                onChange={(url) => setPrecisionData({ ...precisionData, bgImage: url })}
                label="Choose or Upload Precision Banner Background Image"
              />
            </div>
          </div>
        </div>

        {/* SECTION 8: PROCESS STEPS (OUR DEPARTMENTS / 7 Steps) */}
        <div id="sec-process" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
                <ListOrdered className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#0B1B3D]">8. How We Process Across Department Workflow (7 Departments)</h2>
                <p className="text-xs text-slate-500">Manage all 7 manufacturing department steps (R&D, Forging, Machining, Sterilization, etc.).</p>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingItemId(null)
                setProcessForm({ step_number: processSteps.length + 1, title: 'New Process Step', category: 'Research & Development', description: 'Step description', image_url: '/images/process-hand-filing.png' })
                setActiveModal('process')
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-[#0B1B3D] hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
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
                    <span className="text-[10px] font-black text-[#E31B23] uppercase block">STEP 0{step.step_number} • {step.category}</span>
                    <h3 className="text-xs font-black text-[#0B1B3D]">{step.title}</h3>
                    <p className="text-[11px] text-slate-500 truncate">{step.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const updated = processSteps.filter((p) => p.id !== step.id)
                      setProcessSteps(updated)
                      saveAllToStorage()
                    }}
                    className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer border border-red-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 9: VIDEO SHOWCASE & COMPLIANCE LOGOS */}
        <div id="sec-video" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">9. Watch Our Quality & Manufacturing Process Showcase (Video & Logos)</h2>
              <p className="text-xs text-slate-500">Upload video MP4/Vimeo link, video thumbnail poster, and certification logo badges (SCCI, ISO, CE, FDA, EU-MDR).</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Section Main Title</label>
              <input
                type="text"
                value={videoData.title}
                onChange={(e) => setVideoData({ ...videoData, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase">Section Description Paragraph</label>
              <textarea
                rows={3}
                value={videoData.description}
                onChange={(e) => setVideoData({ ...videoData, description: e.target.value })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>

            <div className="space-y-4">
              <AdminMediaUploadPlaceholder
                label="Compliance Video File (MP4/WebM)"
                type="video"
                accept="video/mp4,video/webm"
                value={videoData.videoUrl}
                onChange={(url) => setVideoData({ ...videoData, videoUrl: url })}
                placeholderText="Click or Drop to Upload MP4 Video File from Device"
              />
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Or Vimeo / External Video URL</label>
                <input
                  type="text"
                  value={videoData.videoUrl}
                  onChange={(e) => setVideoData({ ...videoData, videoUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  placeholder="https://vimeo.com/1230520070"
                />
              </div>
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

          {/* Certification Logos */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase">Compliance Certification Logos (7 Badges)</h3>
              <button
                onClick={() => {
                  setCertForm({ name: 'New Certification Logo', logo_url: '/images/icon-iso.png' })
                  setActiveModal('cert')
                }}
                className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
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
                      const updated = certLogos.filter((c) => c.id !== cert.id)
                      setCertLogos(updated)
                      saveAllToStorage()
                    }}
                    className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 10: CUSTOM SECTIONS */}
        <div id="sec-custom" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#0B1B3D]">10. Additional Custom Home Sections</h2>
                <p className="text-xs text-slate-500">Add custom content blocks or promo banners to the Home page dynamically.</p>
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
              <h3 className="text-sm font-black text-[#0B1B3D] uppercase">Configure Item Details & Media Upload</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* HERO MODAL */}
            {activeModal === 'hero' && (
              <div className="space-y-4">
                <AdminMediaUploadPlaceholder
                  label="Hero Banner Background Image"
                  type="image"
                  value={heroForm.image_url}
                  onChange={(url) => setHeroForm({ ...heroForm, image_url: url })}
                  placeholderText="Click or Drop to Upload Hero Image"
                />

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Main Title</label>
                  <input
                    type="text"
                    value={heroForm.title}
                    onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Subtitle / Tagline</label>
                  <input
                    type="text"
                    value={heroForm.subtitle}
                    onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-red-50/50 border border-red-100 rounded-xl">
                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold text-[#E31B23] uppercase">Button 1 Text</label>
                    <input
                      type="text"
                      value={heroForm.button_text}
                      onChange={(e) => setHeroForm({ ...heroForm, button_text: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold text-slate-700 uppercase">Button 1 Link</label>
                    <input
                      type="text"
                      value={heroForm.button_link}
                      onChange={(e) => setHeroForm({ ...heroForm, button_link: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold text-[#E31B23] uppercase">Button 2 Text</label>
                    <input
                      type="text"
                      value={heroForm.secondary_button_text}
                      onChange={(e) => setHeroForm({ ...heroForm, secondary_button_text: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-extrabold text-slate-700 uppercase">Button 2 Link</label>
                    <input
                      type="text"
                      value={heroForm.secondary_button_link}
                      onChange={(e) => setHeroForm({ ...heroForm, secondary_button_link: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900"
                    />
                  </div>
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
                    saveAllToStorage(updated)
                    setActiveModal(null)
                  }}
                  className="w-full py-2.5 bg-[#E31B23] text-white text-xs font-black rounded-xl cursor-pointer hover:bg-red-700 transition-all shadow-md"
                >
                  Save Hero Slide
                </button>
              </div>
            )}

            {/* STAT MODAL */}
            {activeModal === 'stat' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Counter Metric Number</label>
                  <input
                    type="text"
                    value={statForm.number}
                    onChange={(e) => setStatForm({ ...statForm, number: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Counter Metric Label</label>
                  <input
                    type="text"
                    value={statForm.label}
                    onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <button
                  onClick={() => {
                    let updated: AdminStatItem[] = []
                    if (editingItemId) {
                      updated = statsData.map((s) => (s.id === editingItemId ? { ...statForm, id: editingItemId } : s))
                    } else {
                      updated = [...statsData, { ...statForm, id: `stat-${Date.now()}` }]
                    }
                    setStatsData(updated)
                    saveAllToStorage()
                    setActiveModal(null)
                  }}
                  className="w-full py-2.5 bg-[#0B1B3D] text-white text-xs font-black rounded-xl cursor-pointer"
                >
                  Save Counter
                </button>
              </div>
            )}

            {/* SOLUTION MODAL */}
            {activeModal === 'solution' && (
              <div className="space-y-4">
                <AdminMediaUploadPlaceholder
                  label="Solution Category Image"
                  value={solutionForm.image_url}
                  onChange={(url) => setSolutionForm({ ...solutionForm, image_url: url })}
                  placeholderText="Upload Category Image"
                />
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category Title</label>
                  <input
                    type="text"
                    value={solutionForm.title}
                    onChange={(e) => setSolutionForm({ ...solutionForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Number / Count Tag</label>
                  <input
                    type="text"
                    value={solutionForm.count}
                    onChange={(e) => setSolutionForm({ ...solutionForm, count: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Description</label>
                  <textarea
                    rows={2}
                    value={solutionForm.description}
                    onChange={(e) => setSolutionForm({ ...solutionForm, description: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <button
                  onClick={() => {
                    let updated: AdminSolutionCard[] = []
                    if (editingItemId) {
                      updated = solutionsData.map((s) => (s.id === editingItemId ? { ...solutionForm, id: editingItemId } : s))
                    } else {
                      updated = [...solutionsData, { ...solutionForm, id: `sol-${Date.now()}` }]
                    }
                    setSolutionsData(updated)
                    saveAllToStorage()
                    setActiveModal(null)
                  }}
                  className="w-full py-2.5 bg-[#E31B23] text-white text-xs font-black rounded-xl cursor-pointer"
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
                  value={processForm.image_url}
                  onChange={(url) => setProcessForm({ ...processForm, image_url: url })}
                  placeholderText="Upload Process Image"
                />

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Department Category</label>
                  <select
                    value={processForm.category}
                    onChange={(e) => setProcessForm({ ...processForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  >
                    <option value="Research & Development">Research & Development</option>
                    <option value="Material Sourcing">Material Sourcing</option>
                    <option value="Precision Manufacturing">Precision Manufacturing</option>
                    <option value="Quality Inspection">Quality Inspection</option>
                    <option value="Surface Finishing">Surface Finishing</option>
                    <option value="Sterilization & Cleaning">Sterilization & Cleaning</option>
                    <option value="Testing & Validation">Testing & Validation</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Step Title</label>
                  <input
                    type="text"
                    value={processForm.title}
                    onChange={(e) => setProcessForm({ ...processForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <button
                  onClick={() => {
                    const updated = [...processSteps, { id: `proc-${Date.now()}`, ...processForm }]
                    setProcessSteps(updated)
                    saveAllToStorage()
                    setActiveModal(null)
                  }}
                  className="w-full py-2.5 bg-[#0B1B3D] text-white text-xs font-black rounded-xl cursor-pointer"
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <button
                  onClick={() => {
                    const updated = [...certLogos, { id: `cert-${Date.now()}`, ...certForm }]
                    setCertLogos(updated)
                    saveAllToStorage()
                    setActiveModal(null)
                  }}
                  className="w-full py-2.5 bg-[#E31B23] text-white text-xs font-black rounded-xl cursor-pointer"
                >
                  Save Certification Logo
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

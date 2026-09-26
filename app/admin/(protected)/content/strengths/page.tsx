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
  MoveUp,
  MoveDown,
  ShieldCheck,
  Building2,
  Layers,
  Sparkles,
  X,
  Check,
  Award,
  Factory,
} from 'lucide-react'
import { AdminMediaUploadPlaceholder } from '@/src/components/admin/AdminMediaUploadPlaceholder'
import { StrengthCard, CustomBlock, InHouseSectionData } from '@/src/components/public/StrengthsSection'

export default function AdminContentStrengthsPage() {
  const [isSaved, setIsSaved] = useState(false)
  const [saveMessage, setSaveMessage] = useState('Strengths Page content updated live!')

  // 1. Hero Section State
  const [heroForm, setHeroForm] = useState({
    badge: 'OUR STRENGTHS',
    title: 'OUR STRENGTHS',
    subtitle: 'PRECISION IN EVERY INSTRUMENT. TRUST IN EVERY DETAIL.',
    bgImage: '/images/about-hero-banner.png',
  })

  // 2. Intro Overview Text State
  const [introText, setIntroText] = useState(
    'Dr. Frigz is a vertically integrated OEM surgical instrument manufacturer and medical device supply chain partner based in Sialkot, Pakistan, working directly with surgical equipment suppliers, surgical instrument distributors and dental instruments suppliers across the US, EU & UK. From precision forging and CNC machining to EO sterilization and global distribution, every step of our manufacturing process is performed in-house. This gives our distributors, hospital procurement teams and private label healthcare brands complete confidence in quality, compliance and supply chain reliability.'
  )

  // 3. Feature Section State ("Precision Driven Manufacturing")
  const [featureForm, setFeatureForm] = useState({
    title: 'Precision Driven Manufacturing',
    subheading: 'IN-HOUSE EXCELLENCE',
    description:
      'Everything begins with design. We meticulously plan and establish dimensions, tolerances, and metallurgical requirements before production even starts. Our state-of-the-art CNC machinery combined with skilled craftsmanship guarantees that every instrument conforms to exact specifications and international standards.',
    image_url: '/images/process-hand-filing.png',
  })

  // 4. Cards Grid 1 State ("Our Team" & "Passion for technical mastery")
  const [cardsGrid1, setCardsGrid1] = useState<StrengthCard[]>([
    {
      id: 'card-team',
      title: 'Our Team',
      description:
        "Our team is the backbone of our success. We are a cohesive group of professionals, technicians, and engineers united by a shared goal: to create exceptional products. Their expertise, dedication, and collaboration are the driving force behind everything we achieve. Our team's passion for excellence is what sets us apart, making them the bloodline of our company and the key to our continued growth and success. We are more than a team; we are Dr Frigz family.",
      image_url: '/images/blog-instruments-tray.png',
    },
    {
      id: 'card-mastery',
      title: 'Passion for technical mastery',
      description:
        'We have a deep understanding of technicalities, standards, and compliance, and we thrive on challenges that push us to excel. Our ability to see the nuances and subtleties that distinguish a great instrument from a nominal one sets us apart. As technical people with a passion for manufacturing, we embrace the complexities of our industry. This passion is woven into our ethos and reflected in the precision and quality of our products.',
      image_url: '/images/process-wooden-anvil.png',
    },
  ])

  // 5. In-House Section State ("Our strength is being In-House")
  const [inHouseForm, setInHouseForm] = useState<InHouseSectionData>({
    title: 'Our strength is being In-House',
    description:
      'We control every aspect of production, from crafting our own forging dies and forging units to machining, vacuum hardening, polishing, setting, finishing, coatings, and laser marking—all within our factory premises. Afterwards, we package the products in our cleanroom, sterilize them with EO, and ship them directly to our customers. Due to our in-house processes, we maintain strict quality control at every step and meet delivery deadlines with confidence. Additionally, we are committed to continually improving our processes and expanding our capacities to better serve our customers.',
    image_url: '/images/process-erp-operator.png',
  })

  // 6. Cards Grid 2 State (Certifications & Compliance, Quality, Capacity, Oracle ERP)
  const [cardsGrid2, setCardsGrid2] = useState<StrengthCard[]>([
    {
      id: 'card-cert',
      title: 'Certifications & Compliance',
      description:
        'Our instruments and manufacturing facilities are fully compliant with ISO 9001, ISO 13485, and SA 8000 standards. We are in process of getting our MDR and are equipped with an ISO Class 8 cleanroom and EO sterilization capabilities. Additionally, we hold FDA and a wide range of country-specific certifications to meet the diverse needs of our customers',
      image_url: '/images/process-traveler-card.png',
    },
    {
      id: 'card-quality',
      title: 'No Compromise on Quality',
      description:
        "Quality is non-negotiable. We adhere to the highest industry standards, ensuring that every instrument we produce is crafted with precision, reliability, and excellence. Our commitment to quality extends through every stage of the manufacturing process, from sourcing premium materials to implementing rigorous quality control checks.  For us, there is no compromise on quality—it's the foundation of our reputation and the trust our customers place in us.",
      image_url: '/images/blog-scissors-highres.png',
    },
    {
      id: 'card-capacity',
      title: 'Scalability & Capacity',
      description:
        'Scalability and capacity are at the heart of our operations. With the ability to supply millions of pieces each month already, we are actively increasing our production capacities across all categories, including reusable, disposable, and sterile instruments. This ongoing expansion ensures that we not only meet the current demands of our customers but are also well-positioned to scale further as market needs evolve.',
      image_url: '/images/cat-forceps-clamps.png',
    },
    {
      id: 'card-erp',
      title: 'Oracle ERP',
      description:
        'One of our greatest strengths is our robust ERP system. It enables us to effectively manage customer requirements, handle high business volumes, and oversee diverse operations and compliance with ease. Manufacturing at this scale would be impossible without accurate, real-time information, and Oracle ERP empowers us to achieve this seamlessly',
      image_url: '/images/durable-building.png',
    },
  ])

  // 7. Custom Blocks State
  const [customBlocks, setCustomBlocks] = useState<CustomBlock[]>([])

  // Modal Dialog States
  const [activeModal, setActiveModal] = useState<'card1' | 'card2' | 'custom' | null>(null)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)

  // Form states for modals
  const [cardModalForm, setCardModalForm] = useState({
    title: '',
    description: '',
    image_url: '/images/blog-instruments-tray.png',
  })

  const [customModalForm, setCustomModalForm] = useState({
    title: '',
    subheading: '',
    description: '',
    image_url: '',
  })

  // Sync data from LocalStorage on Mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('durable_strengths_data')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.hero) setHeroForm((prev) => ({ ...prev, ...parsed.hero }))
        if (typeof parsed.introText === 'string') setIntroText(parsed.introText)
        if (parsed.feature) setFeatureForm((prev) => ({ ...prev, ...parsed.feature }))
        if (Array.isArray(parsed.cardsGrid1)) setCardsGrid1(parsed.cardsGrid1)
        else if (Array.isArray(parsed.cards)) setCardsGrid1(parsed.cards)
        if (parsed.inHouse) setInHouseForm((prev) => ({ ...prev, ...parsed.inHouse }))
        if (Array.isArray(parsed.cardsGrid2)) setCardsGrid2(parsed.cardsGrid2)
        if (Array.isArray(parsed.customBlocks)) setCustomBlocks(parsed.customBlocks)
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  // Save changes to localStorage & trigger live update event
  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    try {
      const payload = {
        hero: heroForm,
        introText,
        feature: featureForm,
        cardsGrid1,
        inHouse: inHouseForm,
        cardsGrid2,
        customBlocks,
      }
      localStorage.setItem('durable_strengths_data', JSON.stringify(payload))
      window.dispatchEvent(new Event('durable_content_updated'))
      
      setIsSaved(true)
      setSaveMessage('Strengths Page content updated and published live!')
      setTimeout(() => setIsSaved(false), 4000)
    } catch (err) {
      console.error(err)
    }
  }

  // --- CARD GRID 1 ACTIONS ---
  const handleOpenAddCard1Modal = () => {
    setEditingItemId(null)
    setCardModalForm({
      title: '',
      description: '',
      image_url: '/images/blog-instruments-tray.png',
    })
    setActiveModal('card1')
  }

  const handleOpenEditCard1Modal = (card: StrengthCard) => {
    setEditingItemId(card.id)
    setCardModalForm({
      title: card.title,
      description: card.description,
      image_url: card.image_url,
    })
    setActiveModal('card1')
  }

  const handleDeleteCard1 = (id: string) => {
    if (confirm('Are you sure you want to delete this card?')) {
      setCardsGrid1((prev) => prev.filter((c) => c.id !== id))
    }
  }

  // --- CARD GRID 2 ACTIONS ---
  const handleOpenAddCard2Modal = () => {
    setEditingItemId(null)
    setCardModalForm({
      title: '',
      description: '',
      image_url: '/images/process-traveler-card.png',
    })
    setActiveModal('card2')
  }

  const handleOpenEditCard2Modal = (card: StrengthCard) => {
    setEditingItemId(card.id)
    setCardModalForm({
      title: card.title,
      description: card.description,
      image_url: card.image_url,
    })
    setActiveModal('card2')
  }

  const handleDeleteCard2 = (id: string) => {
    if (confirm('Are you sure you want to delete this card?')) {
      setCardsGrid2((prev) => prev.filter((c) => c.id !== id))
    }
  }

  const handleSaveCardModal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!cardModalForm.title.trim()) return

    if (activeModal === 'card1') {
      if (editingItemId) {
        setCardsGrid1((prev) =>
          prev.map((c) => (c.id === editingItemId ? { ...c, ...cardModalForm } : c))
        )
      } else {
        setCardsGrid1((prev) => [...prev, { id: `card1-${Date.now()}`, ...cardModalForm }])
      }
    } else if (activeModal === 'card2') {
      if (editingItemId) {
        setCardsGrid2((prev) =>
          prev.map((c) => (c.id === editingItemId ? { ...c, ...cardModalForm } : c))
        )
      } else {
        setCardsGrid2((prev) => [...prev, { id: `card2-${Date.now()}`, ...cardModalForm }])
      }
    }

    setActiveModal(null)
  }

  // --- CUSTOM BLOCK ACTIONS ---
  const handleOpenAddCustomModal = () => {
    setEditingItemId(null)
    setCustomModalForm({ title: '', subheading: '', description: '', image_url: '' })
    setActiveModal('custom')
  }

  const handleOpenEditCustomModal = (block: CustomBlock) => {
    setEditingItemId(block.id)
    setCustomModalForm({
      title: block.title,
      subheading: block.subheading || '',
      description: block.description,
      image_url: block.image_url || '',
    })
    setActiveModal('custom')
  }

  const handleSaveCustomModal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customModalForm.title.trim()) return

    if (editingItemId) {
      setCustomBlocks((prev) =>
        prev.map((b) => (b.id === editingItemId ? { ...b, ...customModalForm } : b))
      )
    } else {
      setCustomBlocks((prev) => [...prev, { id: `block-${Date.now()}`, ...customModalForm }])
    }

    setActiveModal(null)
  }

  const handleDeleteCustomBlock = (id: string) => {
    if (confirm('Are you sure you want to delete this custom section?')) {
      setCustomBlocks((prev) => prev.filter((b) => b.id !== id))
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span>Website Content</span>
            <span>•</span>
            <span className="text-[#E31B23]">Strengths Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3D] tracking-tight">
            Strengths Page Content Manager
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage banner images, intro text, manufacturing blocks, In-House section, strength cards, and custom content.
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

      {/* MAIN EDITOR FORM */}
      <div className="space-y-8">
        
        {/* SECTION 1: HERO BANNER CONFIGURATION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">1. Strengths Hero Banner Settings (SS 2)</h2>
              <p className="text-xs text-slate-500">Edit hero banner title, subtitle, badge, and background image.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Hero Pill Badge Text
              </label>
              <input
                type="text"
                value={heroForm.badge}
                onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Hero Main Title
              </label>
              <input
                type="text"
                value={heroForm.title}
                onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Hero Subtitle / Tagline
              </label>
              <input
                type="text"
                value={heroForm.subtitle}
                onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Hero Background Image (Default: /images/about-hero-banner.png)
              </label>
              <AdminMediaUploadPlaceholder
                value={heroForm.bgImage}
                onChange={(url) => setHeroForm({ ...heroForm, bgImage: url })}
                label="Choose or Upload Hero Background Image"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: INTRO OVERVIEW PARAGRAPH */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">2. Introductory Overview Text (SS 2)</h2>
              <p className="text-xs text-slate-500">Edit the top overview paragraph about Dr. Frigz manufacturing capabilities.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Intro Paragraph Text
            </label>
            <textarea
              rows={4}
              value={introText}
              onChange={(e) => setIntroText(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#E31B23]"
            />
          </div>
        </div>

        {/* SECTION 3: FEATURE BLOCK ("Precision Driven Manufacturing") */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">3. Feature Block (Precision Driven Manufacturing - SS 2)</h2>
              <p className="text-xs text-slate-500">Configure title, description, badge, and image for the main feature showcase.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Subheading / Badge
              </label>
              <input
                type="text"
                value={featureForm.subheading}
                onChange={(e) => setFeatureForm({ ...featureForm, subheading: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#E31B23] focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Feature Title
              </label>
              <input
                type="text"
                value={featureForm.title}
                onChange={(e) => setFeatureForm({ ...featureForm, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Feature Description
              </label>
              <textarea
                rows={3}
                value={featureForm.description}
                onChange={(e) => setFeatureForm({ ...featureForm, description: e.target.value })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Feature Image
              </label>
              <AdminMediaUploadPlaceholder
                value={featureForm.image_url}
                onChange={(url) => setFeatureForm({ ...featureForm, image_url: url })}
                label="Choose or Upload Feature Image"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: CARDS GRID 1 ("Our Team" & "Passion for technical mastery") */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#0B1B3D]">4. Strength Cards Grid 1 (SS 3 & SS 4)</h2>
                <p className="text-xs text-slate-500">Manage Our Team & Technical Mastery cards.</p>
              </div>
            </div>

            <button
              onClick={handleOpenAddCard1Modal}
              className="px-4 py-2 text-xs font-bold text-white bg-[#0B1B3D] hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cardsGrid1.map((card) => (
              <div key={card.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={card.image_url} alt={card.title} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-base font-extrabold text-[#0B1B3D]">{card.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3">{card.description}</p>
                </div>
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/80">
                  <button
                    onClick={() => handleOpenEditCard1Modal(card)}
                    className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteCard1(card.id)}
                    className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: IN-HOUSE BANNER SECTION ("Our strength is being In-House") */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">5. In-House Manufacturing Section (SS 4)</h2>
              <p className="text-xs text-slate-500">Configure the large In-House wide banner section title, description, and factory image.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Section Title
              </label>
              <input
                type="text"
                value={inHouseForm.title}
                onChange={(e) => setInHouseForm({ ...inHouseForm, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Section Detailed Description
              </label>
              <textarea
                rows={4}
                value={inHouseForm.description}
                onChange={(e) => setInHouseForm({ ...inHouseForm, description: e.target.value })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                In-House Wide Factory Banner Image
              </label>
              <AdminMediaUploadPlaceholder
                value={inHouseForm.image_url}
                onChange={(url) => setInHouseForm({ ...inHouseForm, image_url: url })}
                label="Choose or Upload In-House Banner Image"
              />
            </div>
          </div>
        </div>

        {/* SECTION 6: CARDS GRID 2 (Certifications, Quality, Capacity, Oracle ERP) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#0B1B3D]">6. 4 Strength Cards Grid (SS 5)</h2>
                <p className="text-xs text-slate-500">Manage Certifications, Quality, Scalability, and Oracle ERP cards.</p>
              </div>
            </div>

            <button
              onClick={handleOpenAddCard2Modal}
              className="px-4 py-2 text-xs font-bold text-white bg-[#0B1B3D] hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cardsGrid2.map((card) => (
              <div key={card.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={card.image_url} alt={card.title} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-base font-extrabold text-[#0B1B3D]">{card.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3">{card.description}</p>
                </div>
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/80">
                  <button
                    onClick={() => handleOpenEditCard2Modal(card)}
                    className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteCard2(card.id)}
                    className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 7: CUSTOM SECTIONS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">7. Additional Custom Sections</h2>
              <p className="text-xs text-slate-500">Client can add extra sections or custom blocks to the Strengths page.</p>
            </div>

            <button
              onClick={handleOpenAddCustomModal}
              className="px-4 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Section</span>
            </button>
          </div>

          {customBlocks.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs font-medium text-slate-500">
              No extra custom sections added yet. Click &quot;Add Custom Section&quot; above to create more content blocks!
            </div>
          ) : (
            <div className="space-y-4">
              {customBlocks.map((block) => (
                <div key={block.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#0B1B3D]">{block.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{block.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenEditCustomModal(block)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCustomBlock(block.id)}
                      className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* MODAL DIALOG: CARD ADD / EDIT */}
      {(activeModal === 'card1' || activeModal === 'card2') && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-[#0B1B3D]">
                {editingItemId ? 'Edit Card' : 'Add Card'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCardModal} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Card Title</label>
                <input
                  type="text"
                  required
                  value={cardModalForm.title}
                  onChange={(e) => setCardModalForm({ ...cardModalForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#E31B23]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Card Description</label>
                <textarea
                  rows={4}
                  required
                  value={cardModalForm.description}
                  onChange={(e) => setCardModalForm({ ...cardModalForm, description: e.target.value })}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#E31B23]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Card Image</label>
                <AdminMediaUploadPlaceholder
                  value={cardModalForm.image_url}
                  onChange={(url) => setCardModalForm({ ...cardModalForm, image_url: url })}
                  label="Select Card Image"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-extrabold text-white bg-[#E31B23] hover:bg-red-700 rounded-xl flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Card</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DIALOG: CUSTOM SECTION */}
      {activeModal === 'custom' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-[#0B1B3D]">
                {editingItemId ? 'Edit Custom Section' : 'Add Custom Section'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomModal} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Section Title</label>
                <input
                  type="text"
                  required
                  value={customModalForm.title}
                  onChange={(e) => setCustomModalForm({ ...customModalForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#E31B23]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Subheading (Optional)</label>
                <input
                  type="text"
                  value={customModalForm.subheading}
                  onChange={(e) => setCustomModalForm({ ...customModalForm, subheading: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#E31B23]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Section Description</label>
                <textarea
                  rows={4}
                  required
                  value={customModalForm.description}
                  onChange={(e) => setCustomModalForm({ ...customModalForm, description: e.target.value })}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#E31B23]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Section Image (Optional)</label>
                <AdminMediaUploadPlaceholder
                  value={customModalForm.image_url}
                  onChange={(url) => setCustomModalForm({ ...customModalForm, image_url: url })}
                  label="Select Optional Image"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-extrabold text-white bg-[#E31B23] hover:bg-red-700 rounded-xl flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Section</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

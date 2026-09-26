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
} from 'lucide-react'
import { AdminMediaUploadPlaceholder } from '@/src/components/admin/AdminMediaUploadPlaceholder'
import { StrengthCard, CustomBlock } from '@/src/components/public/StrengthsSection'

export default function AdminContentStrengthsPage() {
  const [isSaved, setIsSaved] = useState(false)
  const [saveMessage, setSaveMessage] = useState('Strengths Page content updated live!')

  // 1. Hero Section State
  const [heroForm, setHeroForm] = useState({
    badge: 'OUR STRENGTHS',
    title: 'Our Strengths',
    subtitle: 'PRECISION IN EVERY INSTRUMENT. TRUST IN EVERY DETAIL.',
    bgImage: '/images/about-hero-banner.png',
  })

  // 2. Intro Overview Text State
  const [introText, setIntroText] = useState(
    'Dr. Frigz is a vertically integrated OEM surgical instrument manufacturer and medical device supply chain partner based in Sialkot, Pakistan, working directly with surgical equipment suppliers, surgical instrument distributors and dental instruments suppliers across the US, EU & UK. From precision forging and CNC machining to EO sterilization and global distribution, every step of our manufacturing process is performed in-house. This gives our distributors, hospital procurement teams and private label healthcare brands complete confidence in quality, compliance and supply chain reliability.'
  )

  // 3. Feature Section State
  const [featureForm, setFeatureForm] = useState({
    title: 'Precision Driven Manufacturing',
    subheading: 'IN-HOUSE EXCELLENCE',
    description:
      'Everything begins with design. We meticulously plan and establish dimensions, tolerances, and metallurgical requirements before production even starts. Our state-of-the-art CNC machinery combined with skilled craftsmanship guarantees that every instrument conforms to exact specifications and international standards.',
    image_url: '/images/process-hand-filing.png',
  })

  // 4. Strength Cards List State
  const [cards, setCards] = useState<StrengthCard[]>([
    {
      id: 'card-1',
      title: 'Our Team',
      description:
        "Our team is the backbone of our success. We are a cohesive group of professionals, technicians, and engineers united by a shared goal: to create exceptional products. Their expertise, dedication, and collaboration are the driving force behind everything we achieve. Our team's passion for excellence is what sets us apart, making them the bloodline of our company and the key to our continued growth and success. We are more than a team; we are Dr Frigz family.",
      image_url: '/images/blog-instruments-tray.png',
    },
    {
      id: 'card-2',
      title: 'Passion for technical mastery',
      description:
        'We have a deep understanding of technicalities, standards, and compliance, and we thrive on challenges that push us to excel. Our ability to see the nuances and subtleties that distinguish a great instrument from a nominal one sets us apart. As technical people with a passion for manufacturing, we embrace the complexities of our industry. This passion is woven into our ethos and reflected in the precision and quality of our products.',
      image_url: '/images/process-wooden-anvil.png',
    },
  ])

  // 5. Custom Blocks List State
  const [customBlocks, setCustomBlocks] = useState<CustomBlock[]>([])

  // Modal Dialog States
  const [activeModal, setActiveModal] = useState<'card' | 'custom' | null>(null)
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
        if (Array.isArray(parsed.cards)) setCards(parsed.cards)
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
        cards,
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

  // --- CARD MODAL ACTIONS ---
  const handleOpenAddCardModal = () => {
    setEditingItemId(null)
    setCardModalForm({
      title: '',
      description: '',
      image_url: '/images/blog-instruments-tray.png',
    })
    setActiveModal('card')
  }

  const handleOpenEditCardModal = (card: StrengthCard) => {
    setEditingItemId(card.id)
    setCardModalForm({
      title: card.title,
      description: card.description,
      image_url: card.image_url,
    })
    setActiveModal('card')
  }

  const handleSaveCardModal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!cardModalForm.title.trim()) return

    if (editingItemId) {
      setCards((prev) =>
        prev.map((c) =>
          c.id === editingItemId
            ? { ...c, title: cardModalForm.title, description: cardModalForm.description, image_url: cardModalForm.image_url }
            : c
        )
      )
    } else {
      const newCard: StrengthCard = {
        id: `card-${Date.now()}`,
        title: cardModalForm.title,
        description: cardModalForm.description,
        image_url: cardModalForm.image_url,
      }
      setCards((prev) => [...prev, newCard])
    }

    setActiveModal(null)
  }

  const handleDeleteCard = (id: string) => {
    if (confirm('Are you sure you want to delete this strength card?')) {
      setCards((prev) => prev.filter((c) => c.id !== id))
    }
  }

  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= cards.length) return
    const updated = [...cards]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp
    setCards(updated)
  }

  // --- CUSTOM BLOCK MODAL ACTIONS ---
  const handleOpenAddCustomModal = () => {
    setEditingItemId(null)
    setCustomModalForm({
      title: '',
      subheading: '',
      description: '',
      image_url: '',
    })
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
        prev.map((b) =>
          b.id === editingItemId
            ? {
                ...b,
                title: customModalForm.title,
                subheading: customModalForm.subheading,
                description: customModalForm.description,
                image_url: customModalForm.image_url,
              }
            : b
        )
      )
    } else {
      const newBlock: CustomBlock = {
        id: `block-${Date.now()}`,
        title: customModalForm.title,
        subheading: customModalForm.subheading,
        description: customModalForm.description,
        image_url: customModalForm.image_url,
      }
      setCustomBlocks((prev) => [...prev, newBlock])
    }

    setActiveModal(null)
  }

  const handleDeleteCustomBlock = (id: string) => {
    if (confirm('Are you sure you want to delete this section block?')) {
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
            Manage banner images, introductory text, manufacturing feature blocks, strength cards, and custom content.
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
              <h2 className="text-lg font-black text-[#0B1B3D]">1. Strengths Hero Banner Settings</h2>
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
                Hero Background Banner Image (Default: /images/about-hero-banner.png)
              </label>
              <AdminMediaUploadPlaceholder
                value={heroForm.bgImage}
                onChange={(url) => setHeroForm({ ...heroForm, bgImage: url })}
                label="Choose or Upload Hero Banner Image"
                placeholderText="Upload or select hero background image..."
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
              <h2 className="text-lg font-black text-[#0B1B3D]">2. Introductory Overview Text</h2>
              <p className="text-xs text-slate-500">Edit the top overview paragraph about Dr. Frigz manufacturing capabilities.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Intro Paragraph Text (SS 2)
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
              <h2 className="text-lg font-black text-[#0B1B3D]">3. Main Feature Block (Precision Driven Manufacturing)</h2>
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

        {/* SECTION 4: STRENGTH CARDS MANAGER */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#0B1B3D]">4. Strength Cards Grid (SS 3 & SS 4)</h2>
                <p className="text-xs text-slate-500">Add, edit, remove, or reorder strength cards (Our Team, Passion for technical mastery, etc.).</p>
              </div>
            </div>

            <button
              onClick={handleOpenAddCardModal}
              className="px-4 py-2 text-xs font-bold text-white bg-[#0B1B3D] hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card, idx) => (
              <div
                key={card.id}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200/90 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={card.image_url} alt={card.title} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-base font-extrabold text-[#0B1B3D]">{card.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3">{card.description}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/80">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveCard(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-black disabled:opacity-30"
                      title="Move Up"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveCard(idx, 'down')}
                      disabled={idx === cards.length - 1}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-black disabled:opacity-30"
                      title="Move Down"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditCardModal(card)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: CUSTOM BLOCK CONTENT MANAGER */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">5. Additional Content Blocks</h2>
              <p className="text-xs text-slate-500">Client can add extra sections, custom text, or image blocks to the Strengths page.</p>
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
              No additional custom sections added yet. Click &quot;Add Custom Section&quot; above to add more content blocks!
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
      {activeModal === 'card' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-[#0B1B3D]">
                {editingItemId ? 'Edit Strength Card' : 'Add New Strength Card'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCardModal} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Card Title
                </label>
                <input
                  type="text"
                  required
                  value={cardModalForm.title}
                  onChange={(e) => setCardModalForm({ ...cardModalForm, title: e.target.value })}
                  placeholder="e.g. Our Team or Technical Mastery..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#E31B23]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Card Description / Content
                </label>
                <textarea
                  rows={4}
                  required
                  value={cardModalForm.description}
                  onChange={(e) => setCardModalForm({ ...cardModalForm, description: e.target.value })}
                  placeholder="Enter detailed description..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#E31B23]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Card Image (Placeholder / Upload)
                </label>
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

      {/* MODAL DIALOG: CUSTOM SECTION ADD / EDIT */}
      {activeModal === 'custom' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-[#0B1B3D]">
                {editingItemId ? 'Edit Custom Section' : 'Add Custom Section'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomModal} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Section Title
                </label>
                <input
                  type="text"
                  required
                  value={customModalForm.title}
                  onChange={(e) => setCustomModalForm({ ...customModalForm, title: e.target.value })}
                  placeholder="Section title..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#E31B23]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Subheading (Optional)
                </label>
                <input
                  type="text"
                  value={customModalForm.subheading}
                  onChange={(e) => setCustomModalForm({ ...customModalForm, subheading: e.target.value })}
                  placeholder="Optional badge or subheading..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#E31B23]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Section Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={customModalForm.description}
                  onChange={(e) => setCustomModalForm({ ...customModalForm, description: e.target.value })}
                  placeholder="Detailed text content..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#E31B23]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Section Image (Optional)
                </label>
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

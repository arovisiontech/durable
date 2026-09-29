'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  HelpCircle,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  ArrowLeft,
  Upload,
  Search,
  Eye,
  EyeOff,
  MessageSquare,
  Tag,
  FileText,
} from 'lucide-react'

// Default Data Constants
const DEFAULT_HERO = {
  categoryBadge: 'FREQUENTLY ASKED QUESTIONS',
  title: 'GOT QUESTIONS? WE HAVE CLEAR ANSWERS.',
  subtitle:
    'Find comprehensive answers regarding surgical & dental instrument specifications, ISO/CE certifications, custom OEM manufacturing, shipping, and warranty policies.',
  bgImage: '/images/products-hero-banner.png',
}

const DEFAULT_FAQS = [
  {
    id: 'faq-1',
    category: 'Quality & Certifications',
    question: 'What steel grades and raw materials do you use for surgical instruments?',
    answer:
      'We primarily utilize premium Japanese AISI 420 (SUS420J2) and German AISI 410 stainless steel for martensitic hardness, alongside AISI 304/316 for non-magnetic handles and hollowware. For gold-handle scissors and needle holders, we vacuum-bond ultra-hard Tungsten Carbide (TC) inserts for extended edge retention up to 70 HRC.',
    isActive: true,
  },
  {
    id: 'faq-2',
    category: 'Quality & Certifications',
    question: 'Which international quality certifications do Durable Hospital Supplies hold?',
    answer:
      'Our Sialkot manufacturing plant is certified under ISO 13485:2016 (Medical Devices Quality Management System), ISO 9001:2015, CE Marking (MDR 2017/745 compliant), cGMP, and registered with US FDA. Every production lot undergoes chemical mill certificate validation and ASTM F1089 corrosion resistance testing.',
    isActive: true,
  },
  {
    id: 'faq-3',
    category: 'OEM & Custom Manufacturing',
    question: 'Do you offer OEM / ODM contract manufacturing and private labeling?',
    answer:
      'Yes, contract manufacturing for healthcare brands and regional distributors in over 15 countries is our core specialty. Services include custom fiber laser etching (brand logo, SKU, serial numbers, UDI barcode), custom color coding (titanium coating), modified jaw geometry, and custom sterile/non-sterile packaging.',
    isActive: true,
  },
  {
    id: 'faq-4',
    category: 'OEM & Custom Manufacturing',
    question: 'What is the Minimum Order Quantity (MOQ) for custom instrument production?',
    answer:
      'For standard catalog items, our flexible MOQ starts at 10 to 25 units per SKU. For custom OEM instruments requiring specialized drop-forging dies or custom CNC tooling, the MOQ typically ranges between 50 and 100 units per line item.',
    isActive: true,
  },
  {
    id: 'faq-5',
    category: 'Orders & Shipping',
    question: 'What are your standard lead times for manufacturing and international dispatch?',
    answer:
      'In-stock catalog items ship within 3-5 business days. Standard production manufacturing orders take 3 to 4 weeks from order confirmation. Custom OEM drop-forged batches require 5 to 6 weeks including passivation chemical treatment and final 100% optical inspection.',
    isActive: true,
  },
  {
    id: 'faq-6',
    category: 'Orders & Shipping',
    question: 'Which international shipping methods and Incoterms do you support?',
    answer:
      'We export worldwide via DHL, FedEx, and UPS Express for urgent sample kits and air freight, as well as LCL/FCL ocean shipping for large hospital bulk orders. Supported Incoterms include FOB Sialkot/Lahore, CIF, EXW, and DDP upon client arrangement.',
    isActive: true,
  },
  {
    id: 'faq-7',
    category: 'Warranty & Sterilization',
    question: 'What is the warranty coverage on Durable Hospital Supplies instruments?',
    answer:
      'All our reusable surgical and dental instruments come with a Life-Time Warranty against material defects and manufacturing craftsmanship under intended clinical usage. Any instrument demonstrating manufacturing defects will be repaired or replaced free of cost.',
    isActive: true,
  },
  {
    id: 'faq-8',
    category: 'Warranty & Sterilization',
    question: 'Are your surgical instruments supplied sterile or non-sterile?',
    answer:
      'Standard catalog instruments are delivered non-sterile in protective pouches and must be thoroughly washed, lubricated, and autoclaved prior to surgical use. We also provide pre-sterilized single-use kitting in cleanroom pouch packaging for OEM contracts upon request.',
    isActive: true,
  },
  {
    id: 'faq-9',
    category: 'Warranty & Sterilization',
    question: 'How should instruments be washed and autoclaved to prevent staining or corrosion?',
    answer:
      'Rinse instruments with neutral pH enzymatic cleaners immediately after surgery to prevent blood drying. Avoid saline or bleach exposure. Use ultrasonic bath washing for 5-10 minutes, dry thoroughly, lubricate box locks with water-soluble instrument milk, and autoclave at standard 134°C (273°F) steam cycles.',
    isActive: true,
  },
  {
    id: 'faq-10',
    category: 'General & Payments',
    question: 'Can we request evaluation samples before placing a commercial order?',
    answer:
      'Yes, we encourage healthcare procurement managers and hospital buyers to inspect evaluation sample kits. Sample orders are processed swiftly, and sample costs are fully credited toward your first commercial production order.',
    isActive: true,
  },
  {
    id: 'faq-11',
    category: 'General & Payments',
    question: 'What payment terms do you accept for international orders?',
    answer:
      'We accept Telegraphic Transfer (T/T), Irrevocable L/C at Sight, Bank Wire, and Credit Card payments for smaller orders. Standard OEM production terms are 30% advance deposit upon order placement and 70% balance payment prior to shipment dispatch.',
    isActive: true,
  },
  {
    id: 'faq-12',
    category: 'General & Payments',
    question: 'How can I obtain your full PDF catalogue and price list?',
    answer:
      'You can download our 2026 General Surgical and Dental PDF Catalogues directly from our Catalogues page, or send an inquiry to Info@Durablehs.Com to receive custom SKU pricing spreadsheets tailored to your order quantity.',
    isActive: true,
  },
]

const DEFAULT_SUPPORT = {
  badge: 'STILL HAVE QUESTIONS?',
  title: 'WE ARE HERE TO HELP YOU 24/7',
  description:
    'Need detailed custom quotations, CAD sizing blueprints, or sample kits? Our global customer support team responds within 24 hours.',
  buttonText: 'CONTACT SUPPORT',
  buttonLink: '/contact',
}

export default function AdminContentFaqsPage() {
  const [heroData, setHeroData] = useState(DEFAULT_HERO)
  const [faqsList, setFaqsList] = useState(DEFAULT_FAQS)
  const [supportData, setSupportData] = useState(DEFAULT_SUPPORT)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedHero = localStorage.getItem('durable_faq_hero_data')
      if (savedHero) setHeroData(JSON.parse(savedHero))

      const savedFaqs = localStorage.getItem('durable_faqs_list')
      if (savedFaqs) setFaqsList(JSON.parse(savedFaqs))

      const savedSupport = localStorage.getItem('durable_faq_support_data')
      if (savedSupport) setSupportData(JSON.parse(savedSupport))
    } catch (e) {
      console.error('Error reading FAQ content from localStorage:', e)
    }
  }, [])

  // Save changes handler
  const handleSaveAll = () => {
    try {
      localStorage.setItem('durable_faq_hero_data', JSON.stringify(heroData))
      localStorage.setItem('durable_faqs_list', JSON.stringify(faqsList))
      localStorage.setItem('durable_faq_support_data', JSON.stringify(supportData))

      // Trigger custom window event so open website tabs update live
      window.dispatchEvent(new Event('durable_content_updated'))

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 4000)
    } catch (e) {
      console.error('Error saving FAQ content:', e)
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

  // CRUD Helpers for FAQ Items
  const updateFaqItem = (index: number, field: string, value: any) => {
    const updated = [...faqsList]
    updated[index] = { ...updated[index], [field]: value }
    setFaqsList(updated)
  }

  const addFaqQuestion = () => {
    const newId = `faq-${Date.now()}`
    setFaqsList([
      {
        id: newId,
        category: selectedCategory === 'All' ? 'General & Payments' : selectedCategory,
        question: 'New Frequently Asked Question Title?',
        answer:
          'Detailed answer text outlining your instrument specifications, quality compliance, shipping terms, or ordering procedure.',
        isActive: true,
      },
      ...faqsList,
    ])
  }

  const deleteFaqQuestion = (index: number) => {
    if (confirm('Are you sure you want to delete this question?')) {
      setFaqsList(faqsList.filter((_, i) => i !== index))
    }
  }

  // Filtered FAQs for search inside Admin
  const filteredFaqs = faqsList.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory
    const matchesSearch =
      searchTerm.trim() === '' ||
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCat && matchesSearch
  })

  const availableCategories = [
    'All',
    'Quality & Certifications',
    'OEM & Custom Manufacturing',
    'Orders & Shipping',
    'Warranty & Sterilization',
    'General & Payments',
  ]

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 bg-[#090F1E] text-slate-100 min-h-screen">
      {/* Top Header Card */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[#E31B23] text-xs font-black uppercase tracking-wider">
              Website Content Module
            </span>
            <span className="text-xs text-slate-400 font-mono">/admin/content/faqs</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-[#E31B23]" />
            <span>FAQ Page Content Manager</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Manage all 12+ Frequently Asked Questions, categories, search text, hero banner, and bottom support callout section with live browser refresh persistence.
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
          <span>✓ All FAQ Changes Saved Successfully! Your website FAQ page has been updated live.</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: FAQ HERO BANNER SETTINGS */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-red-600/20 text-[#E31B23] font-black flex items-center justify-center text-sm border border-red-500/30">
              1
            </span>
            <h2 className="text-xl font-bold text-white">FAQ Hero Banner Settings</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Top Section</span>
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
      {/* SECTION 2: QUESTIONS LIST MANAGER (FULL CRUD) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-red-600/20 text-[#E31B23] font-black flex items-center justify-center text-sm border border-red-500/30">
              2
            </span>
            <div>
              <h2 className="text-xl font-bold text-white">
                Frequently Asked Questions Manager ({faqsList.length})
              </h2>
              <p className="text-xs text-slate-400">Add, edit, delete, or hide individual questions and answers.</p>
            </div>
          </div>

          <button
            onClick={addFaqQuestion}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New FAQ Question</span>
          </button>
        </div>

        {/* Search & Category Filter Controls inside Admin */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#141E36] p-4 rounded-2xl border border-slate-700/80">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions or keywords..."
              className="w-full bg-[#0D1527] border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#E31B23] text-white shadow-sm'
                    : 'bg-[#0D1527] text-slate-300 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Questions Cards List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center bg-[#141E36] rounded-2xl border border-slate-700 text-slate-400 text-xs font-medium">
              No questions found matching your filter criteria. Click &quot;Add New FAQ Question&quot; to create one.
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const actualIndex = faqsList.findIndex((item) => item.id === faq.id)

              return (
                <div
                  key={faq.id}
                  className={`bg-[#141E36] border rounded-2xl p-6 space-y-4 transition-all ${
                    faq.isActive ? 'border-slate-700/80' : 'border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700/60 pb-3 gap-3">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-[#E31B23] text-[11px] font-mono font-bold">
                        {faq.category}
                      </span>
                      <span className="text-xs font-mono font-semibold text-slate-400">ID: {faq.id}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => updateFaqItem(actualIndex, 'isActive', !faq.isActive)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          faq.isActive
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {faq.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{faq.isActive ? 'Active on Site' : 'Hidden'}</span>
                      </button>

                      <button
                        onClick={() => deleteFaqQuestion(actualIndex)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                          Category Group
                        </label>
                        <select
                          value={faq.category}
                          onChange={(e) => updateFaqItem(actualIndex, 'category', e.target.value)}
                          className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                        >
                          <option value="Quality & Certifications">Quality & Certifications</option>
                          <option value="OEM & Custom Manufacturing">OEM & Custom Manufacturing</option>
                          <option value="Orders & Shipping">Orders & Shipping</option>
                          <option value="Warranty & Sterilization">Warranty & Sterilization</option>
                          <option value="General & Payments">General & Payments</option>
                        </select>
                      </div>

                      <div className="md:col-span-3 space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                          Question Title
                        </label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => updateFaqItem(actualIndex, 'question', e.target.value)}
                          className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Detailed Answer Description
                      </label>
                      <textarea
                        rows={3}
                        value={faq.answer}
                        onChange={(e) => updateFaqItem(actualIndex, 'answer', e.target.value)}
                        className="w-full bg-[#0D1527] border border-slate-700 rounded-xl p-3.5 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 3: BOTTOM SUPPORT CALLOUT SETTINGS */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-red-600/20 text-[#E31B23] font-black flex items-center justify-center text-sm border border-red-500/30">
              3
            </span>
            <h2 className="text-xl font-bold text-white">Bottom Support Callout Banner</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Footer Callout</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Support Pill Badge
            </label>
            <input
              type="text"
              value={supportData.badge}
              onChange={(e) => setSupportData({ ...supportData, badge: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Support Main Heading
            </label>
            <input
              type="text"
              value={supportData.title}
              onChange={(e) => setSupportData({ ...supportData, title: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Support Subtitle Description
            </label>
            <textarea
              rows={2}
              value={supportData.description}
              onChange={(e) => setSupportData({ ...supportData, description: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl p-4 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Button Action Label
            </label>
            <input
              type="text"
              value={supportData.buttonText}
              onChange={(e) => setSupportData({ ...supportData, buttonText: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Button Action Link
            </label>
            <input
              type="text"
              value={supportData.buttonLink}
              onChange={(e) => setSupportData({ ...supportData, buttonLink: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Bottom Save Action Bar */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={handleSaveAll}
            className="px-8 py-3.5 rounded-xl bg-[#E31B23] hover:bg-red-700 text-white text-xs font-black tracking-wider uppercase transition-all shadow-xl shadow-red-600/30 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-5 h-5" />
            <span>Save All FAQ Page Changes</span>
          </button>
        </div>
      </div>
    </div>
  )
}

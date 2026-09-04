'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search,
  Plus,
  Minus,
  HelpCircle,
  ShieldCheck,
  Package,
  Wrench,
  Truck,
  ArrowRight,
  MessageSquare,
} from 'lucide-react'

export interface FaqItem {
  id: string
  category: string
  question: string
  answer: string
}

export const FAQS_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Quality & Certifications',
    question: 'What steel grades and raw materials do you use for surgical instruments?',
    answer:
      'We primarily utilize premium Japanese AISI 420 (SUS420J2) and German AISI 410 stainless steel for martensitic hardness, alongside AISI 304/316 for non-magnetic handles and hollowware. For gold-handle scissors and needle holders, we vacuum-bond ultra-hard Tungsten Carbide (TC) inserts for extended edge retention up to 70 HRC.',
  },
  {
    id: 'faq-2',
    category: 'Quality & Certifications',
    question: 'Which international quality certifications do Durable Hospital Supplies hold?',
    answer:
      'Our Sialkot manufacturing plant is certified under ISO 13485:2016 (Medical Devices Quality Management System), ISO 9001:2015, CE Marking (MDR 2017/745 compliant), cGMP, and registered with US FDA. Every production lot undergoes chemical mill certificate validation and ASTM F1089 corrosion resistance testing.',
  },
  {
    id: 'faq-3',
    category: 'OEM & Custom Manufacturing',
    question: 'Do you offer OEM / ODM contract manufacturing and private labeling?',
    answer:
      'Yes, contract manufacturing for healthcare brands and regional distributors in over 15 countries is our core specialty. Services include custom fiber laser etching (brand logo, SKU, serial numbers, UDI barcode), custom color coding (titanium coating), modified jaw geometry, and custom sterile/non-sterile packaging.',
  },
  {
    id: 'faq-4',
    category: 'OEM & Custom Manufacturing',
    question: 'What is the Minimum Order Quantity (MOQ) for custom instrument production?',
    answer:
      'For standard catalog items, our flexible MOQ starts at 10 to 25 units per SKU. For custom OEM instruments requiring specialized drop-forging dies or custom CNC tooling, the MOQ typically ranges between 50 and 100 units per line item.',
  },
  {
    id: 'faq-5',
    category: 'Orders & Shipping',
    question: 'What are your standard lead times for manufacturing and international dispatch?',
    answer:
      'In-stock catalog items ship within 3-5 business days. Standard production manufacturing orders take 3 to 4 weeks from order confirmation. Custom OEM drop-forged batches require 5 to 6 weeks including passivation chemical treatment and final 100% optical inspection.',
  },
  {
    id: 'faq-6',
    category: 'Orders & Shipping',
    question: 'Which international shipping methods and Incoterms do you support?',
    answer:
      'We export worldwide via DHL, FedEx, and UPS Express for urgent sample kits and air freight, as well as LCL/FCL ocean shipping for large hospital bulk orders. Supported Incoterms include FOB Sialkot/Lahore, CIF, EXW, and DDP upon client arrangement.',
  },
  {
    id: 'faq-7',
    category: 'Warranty & Sterilization',
    question: 'What is the warranty coverage on Durable Hospital Supplies instruments?',
    answer:
      'All our reusable surgical and dental instruments come with a Life-Time Warranty against material defects and manufacturing craftsmanship under intended clinical usage. Any instrument demonstrating manufacturing defects will be repaired or replaced free of cost.',
  },
  {
    id: 'faq-8',
    category: 'Warranty & Sterilization',
    question: 'Are your surgical instruments supplied sterile or non-sterile?',
    answer:
      'Standard catalog instruments are delivered non-sterile in protective pouches and must be thoroughly washed, lubricated, and autoclaved prior to surgical use. We also provide pre-sterilized single-use kitting in cleanroom pouch packaging for OEM contracts upon request.',
  },
  {
    id: 'faq-9',
    category: 'Warranty & Sterilization',
    question: 'How should instruments be washed and autoclaved to prevent staining or corrosion?',
    answer:
      'Rinse instruments with neutral pH enzymatic cleaners immediately after surgery to prevent blood drying. Avoid saline or bleach exposure. Use ultrasonic bath washing for 5-10 minutes, dry thoroughly, lubricate box locks with water-soluble instrument milk, and autoclave at standard 134°C (273°F) steam cycles.',
  },
  {
    id: 'faq-10',
    category: 'General & Payments',
    question: 'Can we request evaluation samples before placing a commercial order?',
    answer:
      'Yes, we encourage healthcare procurement managers and hospital buyers to inspect evaluation sample kits. Sample orders are processed swiftly, and sample costs are fully credited toward your first commercial production order.',
  },
  {
    id: 'faq-11',
    category: 'General & Payments',
    question: 'What payment terms do you accept for international orders?',
    answer:
      'We accept Telegraphic Transfer (T/T), Irrevocable L/C at Sight, Bank Wire, and Credit Card payments for smaller orders. Standard OEM production terms are 30% advance deposit upon order placement and 70% balance payment prior to shipment dispatch.',
  },
  {
    id: 'faq-12',
    category: 'General & Payments',
    question: 'How can I obtain your full PDF catalogue and price list?',
    answer:
      'You can download our 2026 General Surgical and Dental PDF Catalogues directly from our Catalogues page, or send an inquiry to Info@Durablehs.Com to receive custom SKU pricing spreadsheets tailored to your order quantity.',
  },
]

export function FaqAccordionSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1')

  const categories = [
    'All',
    'Quality & Certifications',
    'OEM & Custom Manufacturing',
    'Orders & Shipping',
    'Warranty & Sterilization',
    'General & Payments',
  ]

  const filteredFaqs = useMemo(() => {
    return FAQS_DATA.filter((faq) => {
      const matchesCategory =
        selectedCategory === 'All' || faq.category === selectedCategory
      const matchesSearch =
        searchQuery.trim() === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id))
  }

  return (
    <section className="w-full bg-[#FAFAFA] py-12 sm:py-16 relative overflow-hidden border-b border-slate-200">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#0B1B3D_1.5px,transparent_1.5px)] [background-size:20px_20px]" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Top Control Bar: Search & Category Filter Pills */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-xl space-y-6">
          {/* Search Input Box */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, keyword (e.g. ISO, TC scissors, shipping, warranty)..."
              className="w-full text-xs sm:text-sm pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E31B23]/30 focus:border-[#E31B23] text-slate-900 font-semibold shadow-inner transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 border-t border-slate-100">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#0B1B3D] text-white shadow-md scale-105'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* FAQ Accordion Items List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#E31B23] border border-red-100 flex items-center justify-center mx-auto shadow-xs">
                <HelpCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#0B1B3D]">No FAQs found</h3>
                <p className="text-xs text-slate-500 font-medium">
                  No questions matched your search &quot;{searchQuery}&quot;. Try resetting your search or selecting &quot;All&quot;.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('All')
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#0B1B3D] rounded-xl hover:bg-slate-800 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id

              return (
                <div
                  key={faq.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs overflow-hidden ${
                    isOpen
                      ? 'border-[#E31B23] ring-1 ring-[#E31B23]/20 shadow-md'
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  {/* Accordion Header / Question Row */}
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 select-none"
                  >
                    <div className="space-y-1.5 pr-2">
                      <span className="inline-block text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        {faq.category}
                      </span>
                      <h3
                        className={`text-sm sm:text-base font-extrabold transition-colors leading-snug ${
                          isOpen ? 'text-[#E31B23]' : 'text-[#0B1B3D] hover:text-[#E31B23]'
                        }`}
                      >
                        {faq.question}
                      </h3>
                    </div>

                    {/* Toggle Icon Button */}
                    <div
                      className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-colors shadow-2xs ${
                        isOpen
                          ? 'bg-[#E31B23] text-white'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                      }`}
                    >
                      {isOpen ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {/* Accordion Expandable Answer Body */}
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-0 border-t border-slate-100 animate-in fade-in duration-200">
                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed pt-3">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Bottom Help & Contact Box */}
        <div className="max-w-4xl mx-auto bg-[#0B1B3D] rounded-3xl p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          {/* Accent Glow */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#E31B23]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5 text-[#E31B23]" />
              <span>STILL HAVE QUESTIONS?</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight uppercase">
              WE ARE HERE TO HELP YOU 24/7
            </h3>
            <p className="text-xs text-slate-300 font-medium max-w-md">
              Need detailed custom quotations, CAD sizing blueprints, or sample kits? Our global customer support team responds within 24 hours.
            </p>
          </div>

          <Link
            href="/contact"
            className="z-10 inline-flex items-center gap-2 px-6 py-3.5 bg-[#E31B23] hover:bg-red-700 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-lg hover:shadow-xl shrink-0 group"
          >
            <span>CONTACT SUPPORT</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  )
}

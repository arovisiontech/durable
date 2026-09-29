'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Calendar,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  ArrowLeft,
  Upload,
  Globe,
  Clock,
  MapPin,
  Users,
  Tag,
  FileText,
} from 'lucide-react'

// Default Data Constants
const DEFAULT_RECENT_HERO = {
  categoryBadge: 'Recent Events Archive',
  title: 'Recent International Events Archive',
  subtitle:
    'A look back at our recent trade exhibitions, global convention outcomes, and international distributor partnerships.',
  bgImage: '/images/products-hero-banner.png',
}

const DEFAULT_RECENT_EVENTS = [
  {
    id: 'RE-01',
    category: 'General Surgery',
    title: 'MEDICA Düsseldorf 2025 International Forum',
    date: 'November 17 - 20, 2025',
    location: 'Messe Düsseldorf, Germany',
    attendees: '120,000+ Healthcare Visitors',
    delegates: 'German & European Hospital Buyers',
    highlights: [
      'Showcased 300+ precision stainless steel surgical scissors and clamps.',
      'Signed OEM private label agreements with 14 European distributors.',
      'Demonstrated ISO 13485 & CE MDR technical compliance files.',
    ],
    booth: 'Hall 3, Stand C-89',
    image: '/images/about-surgical-instruments.png',
    actionText: 'Completed Exhibition Archive',
    statusBadge: 'Completed Event',
  },
  {
    id: 'RE-02',
    category: 'Hospital Supplies',
    title: 'FIME Florida International Medical Exhibition 2025',
    date: 'June 18 - 20, 2025',
    location: 'Miami Beach Convention Center, Florida, USA',
    attendees: '15,000+ Trade Professionals',
    delegates: 'North & South American Importers',
    highlights: [
      'Unveiled custom tungsten carbide (TC) micro-forceps for cardiovascular surgery.',
      'Expanded FDA registered product offerings to Latin American markets.',
      'Distributed 500+ physical product catalogs to verified medical buyers.',
    ],
    booth: 'Stand 1420',
    image: '/images/precision-healthcare-banner.png',
    actionText: 'Completed Exhibition Archive',
    statusBadge: 'Completed Event',
  },
  {
    id: 'RE-03',
    category: 'Manufacturing & Export',
    title: 'Sialkot International Surgical Industry Expo 2025',
    date: 'February 10 - 12, 2025',
    location: 'Sialkot Chamber of Commerce & Industry, Pakistan',
    attendees: 'Local & Global Exporters',
    delegates: 'Ministry of Commerce & SCCI Trade Leaders',
    highlights: [
      'Honored with Best Quality Manufacturing Excellence Award by SCCI.',
      'Live demonstration of 4-step hand-filing and heat treatment forging.',
      'Hosted international delegation from Middle Eastern health ministries.',
    ],
    booth: 'Pavilion A, Stand 12',
    image: '/images/surgical-tray-durable.png',
    actionText: 'Completed Exhibition Archive',
    statusBadge: 'Completed Event',
  },
]

const DEFAULT_UPCOMING_HERO = {
  categoryBadge: 'Upcoming Fairs 2026',
  title: 'Upcoming Global Exhibitions 2026',
  subtitle:
    'Explore our schedule of upcoming international medical trade shows and book a dedicated B2B booth meeting with our executive export team.',
  bgImage: '/images/products-hero-banner.png',
}

const DEFAULT_UPCOMING_EVENTS = [
  {
    id: 'UE-01',
    category: 'Dental & Maxillofacial',
    daysLeft: 'Upcoming 2026',
    title: 'IDS Cologne 2026 - 41st International Dental Show',
    date: 'March 24 - 28, 2026',
    location: 'Koelnmesse, Cologne, Germany',
    booth: 'Hall 10.2, Stand B-045',
    image: '/images/dental-clinic-banner.png',
    overview:
      'The premier global trade fair for dental medicine and technology. Durable Medical will unveil 150+ German stainless steel dental extraction forceps, periosteal elevators, and titanium implantology kits.',
    focusArea: 'Custom OEM Private Labeling & European Distribution Rights',
    tagline1: 'Official Exhibition Floor Showcase',
    tagline2: 'Confirmed Participation 2026',
  },
  {
    id: 'UE-02',
    category: 'General Surgery & Hospital Supplies',
    daysLeft: 'Upcoming 2026',
    title: 'Arab Health Dubai 2026',
    date: 'January 26 - 29, 2026',
    location: 'Dubai World Trade Centre, UAE',
    booth: 'Za’abeel Hall 3, Stand Z3.D12',
    image: '/images/surgical-tray-durable.png',
    overview:
      'Connecting healthcare leaders from the Middle East, Asia, and Africa. Visit our booth for live demonstrations of autoclavable cardiovascular forceps and custom single-use surgery packs.',
    focusArea: 'GCC Regional Hospital Supply Contracts & Sterile Kitting Services',
    tagline1: 'Official Exhibition Floor Showcase',
    tagline2: 'Confirmed Participation 2026',
  },
  {
    id: 'UE-03',
    category: 'Surgical & Orthopedic Tools',
    daysLeft: 'Upcoming 2026',
    title: 'Asia Health Kuala Lumpur Expo 2026',
    date: 'July 14 - 16, 2026',
    location: 'Kuala Lumpur Convention Centre, Malaysia',
    booth: 'Hall 4, Stand A-108',
    image: '/images/precision-healthcare-banner.png',
    overview:
      'Expanding our Southeast Asian distribution footprint with premium stainless steel bone retractors, rongeurs, and orthopedic instruments.',
    focusArea: 'ASEAN Importer Partnerships & Bulk Supply Pricing',
    tagline1: 'Official Exhibition Floor Showcase',
    tagline2: 'Confirmed Participation 2026',
  },
]

const DEFAULT_OVERVIEW_HERO = {
  categoryBadge: 'Global Exhibitions',
  title: 'Global Medical Fairs & Trade Events',
  subtitle:
    'Meet Durable Hospital Supplies at leading international surgical trade exhibitions, dental forums, and global healthcare conventions.',
  bgImage: '/images/products-hero-banner.png',
}

export default function AdminEventsContentPage() {
  const [recentHero, setRecentHero] = useState(DEFAULT_RECENT_HERO)
  const [recentList, setRecentList] = useState(DEFAULT_RECENT_EVENTS)

  const [upcomingHero, setUpcomingHero] = useState(DEFAULT_UPCOMING_HERO)
  const [upcomingList, setUpcomingList] = useState(DEFAULT_UPCOMING_EVENTS)

  const [overviewHero, setOverviewHero] = useState(DEFAULT_OVERVIEW_HERO)

  const [saveSuccess, setSaveSuccess] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedRH = localStorage.getItem('durable_recent_events_hero')
      if (savedRH) setRecentHero(JSON.parse(savedRH))

      const savedRL = localStorage.getItem('durable_recent_events_list')
      if (savedRL) setRecentList(JSON.parse(savedRL))

      const savedUH = localStorage.getItem('durable_upcoming_events_hero')
      if (savedUH) setUpcomingHero(JSON.parse(savedUH))

      const savedUL = localStorage.getItem('durable_upcoming_events_list')
      if (savedUL) setUpcomingList(JSON.parse(savedUL))

      const savedOH = localStorage.getItem('durable_events_overview_hero')
      if (savedOH) setOverviewHero(JSON.parse(savedOH))
    } catch (e) {
      console.error('Error reading events content from localStorage:', e)
    }
  }, [])

  // Save changes handler
  const handleSaveAll = () => {
    try {
      localStorage.setItem('durable_recent_events_hero', JSON.stringify(recentHero))
      localStorage.setItem('durable_recent_events_list', JSON.stringify(recentList))
      localStorage.setItem('durable_upcoming_events_hero', JSON.stringify(upcomingHero))
      localStorage.setItem('durable_upcoming_events_list', JSON.stringify(upcomingList))
      localStorage.setItem('durable_events_overview_hero', JSON.stringify(overviewHero))

      // Trigger custom window event so open tabs update immediately
      window.dispatchEvent(new Event('durable_content_updated'))

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 4000)
    } catch (e) {
      console.error('Error saving events content:', e)
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

  // Recent Event Item Helpers
  const updateRecentItem = (index: number, field: string, value: any) => {
    const updated = [...recentList]
    updated[index] = { ...updated[index], [field]: value }
    setRecentList(updated)
  }

  const updateRecentHighlights = (index: number, textValue: string) => {
    const highlightsArray = textValue.split('\n').filter((line) => line.trim().length > 0)
    updateRecentItem(index, 'highlights', highlightsArray)
  }

  const addRecentEvent = () => {
    const newId = `RE-0${recentList.length + 1}`
    setRecentList([
      ...recentList,
      {
        id: newId,
        category: 'Surgical Instruments',
        title: 'New Trade Fair Exhibition 2026',
        date: 'October 10 - 14, 2026',
        location: 'Exhibition Center, City, Country',
        attendees: '10,000+ Visitors',
        delegates: 'Global Medical Distributors',
        highlights: [
          'Showcased new medical equipment and tools.',
          'Signed international supplier contracts.',
        ],
        booth: 'Hall 1, Stand A-01',
        image: '/images/about-surgical-instruments.png',
        actionText: 'Completed Exhibition Archive',
        statusBadge: 'Completed Event',
      },
    ])
  }

  const deleteRecentEvent = (index: number) => {
    if (confirm('Are you sure you want to delete this recent event card?')) {
      setRecentList(recentList.filter((_, i) => i !== index))
    }
  }

  // Upcoming Event Item Helpers
  const updateUpcomingItem = (index: number, field: string, value: any) => {
    const updated = [...upcomingList]
    updated[index] = { ...updated[index], [field]: value }
    setUpcomingList(updated)
  }

  const addUpcomingEvent = () => {
    const newId = `UE-0${upcomingList.length + 1}`
    setUpcomingList([
      ...upcomingList,
      {
        id: newId,
        category: 'Hospital Equipment',
        daysLeft: 'Upcoming 2026',
        title: 'New International Healthcare Expo 2026',
        date: 'November 05 - 08, 2026',
        location: 'Global Convention Center',
        booth: 'Stand 505',
        image: '/images/dental-clinic-banner.png',
        overview:
          'Join us for live demonstrations of premium medical instruments, OEM customization, and distribution partnerships.',
        focusArea: 'Global B2B Distributor Rights',
        tagline1: 'Official Exhibition Floor Showcase',
        tagline2: 'Confirmed Participation 2026',
      },
    ])
  }

  const deleteUpcomingEvent = (index: number) => {
    if (confirm('Are you sure you want to delete this upcoming event card?')) {
      setUpcomingList(upcomingList.filter((_, i) => i !== index))
    }
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
            <span className="text-xs text-slate-400 font-mono">/admin/content/events</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Calendar className="w-8 h-8 text-[#E31B23]" />
            <span>Events Page Content Manager</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Manage all sections of the Recent Events Archive (`/events/recent`), Upcoming Global Exhibitions (`/events/upcoming`), and main Events overview (`/events`) with live persistence.
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
          <span>✓ All Changes Saved Successfully! Your website events pages have been updated live.</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: RECENT EVENTS HERO SETTINGS */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-red-600/20 text-[#E31B23] font-black flex items-center justify-center text-sm border border-red-500/30">
              1
            </span>
            <h2 className="text-xl font-bold text-white">Recent Events Hero Banner Settings</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">`/events/recent`</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Hero Pill Badge Text
            </label>
            <input
              type="text"
              value={recentHero.categoryBadge}
              onChange={(e) => setRecentHero({ ...recentHero, categoryBadge: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Hero Main Title
            </label>
            <input
              type="text"
              value={recentHero.title}
              onChange={(e) => setRecentHero({ ...recentHero, title: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Hero Subtitle / Description
            </label>
            <textarea
              rows={3}
              value={recentHero.subtitle}
              onChange={(e) => setRecentHero({ ...recentHero, subtitle: e.target.value })}
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
                value={recentHero.bgImage}
                onChange={(e) => setRecentHero({ ...recentHero, bgImage: e.target.value })}
                className="flex-1 w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
                placeholder="/images/products-hero-banner.png"
              />
              <label className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 border border-slate-700 shrink-0">
                <Upload className="w-4 h-4 text-[#E31B23]" />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, (url) => setRecentHero({ ...recentHero, bgImage: url }))}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2: RECENT EVENTS CARDS LIST MANAGER */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-red-600/20 text-[#E31B23] font-black flex items-center justify-center text-sm border border-red-500/30">
              2
            </span>
            <div>
              <h2 className="text-xl font-bold text-white">Recent Events Archive Cards List ({recentList.length})</h2>
              <p className="text-xs text-slate-400">Add, edit, delete, or update past international trade show records.</p>
            </div>
          </div>

          <button
            onClick={addRecentEvent}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Recent Event</span>
          </button>
        </div>

        <div className="space-y-6">
          {recentList.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#141E36] border border-slate-700/70 rounded-2xl p-6 space-y-6 relative group"
            >
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-[#E31B23] text-xs font-mono font-bold">
                    #{idx + 1} - {item.id}
                  </span>
                  <h3 className="text-sm font-bold text-white truncate max-w-md">{item.title}</h3>
                </div>

                <button
                  onClick={() => deleteRecentEvent(idx)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Delete event card"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Event Category
                  </label>
                  <input
                    type="text"
                    value={item.category}
                    onChange={(e) => updateRecentItem(idx, 'category', e.target.value)}
                    className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Event ID
                  </label>
                  <input
                    type="text"
                    value={item.id}
                    onChange={(e) => updateRecentItem(idx, 'id', e.target.value)}
                    className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Status Badge
                  </label>
                  <input
                    type="text"
                    value={item.statusBadge || 'Completed Event'}
                    onChange={(e) => updateRecentItem(idx, 'statusBadge', e.target.value)}
                    className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateRecentItem(idx, 'title', e.target.value)}
                    className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Event Dates
                  </label>
                  <input
                    type="text"
                    value={item.date}
                    onChange={(e) => updateRecentItem(idx, 'date', e.target.value)}
                    className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Location & Venue
                  </label>
                  <input
                    type="text"
                    value={item.location}
                    onChange={(e) => updateRecentItem(idx, 'location', e.target.value)}
                    className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Attendees Count
                  </label>
                  <input
                    type="text"
                    value={item.attendees}
                    onChange={(e) => updateRecentItem(idx, 'attendees', e.target.value)}
                    className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Target Buyers / Delegates
                  </label>
                  <input
                    type="text"
                    value={item.delegates}
                    onChange={(e) => updateRecentItem(idx, 'delegates', e.target.value)}
                    className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Booth Location
                  </label>
                  <input
                    type="text"
                    value={item.booth}
                    onChange={(e) => updateRecentItem(idx, 'booth', e.target.value)}
                    className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Action Button Label
                  </label>
                  <input
                    type="text"
                    value={item.actionText || 'Completed Exhibition Archive'}
                    onChange={(e) => updateRecentItem(idx, 'actionText', e.target.value)}
                    className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Key Highlights & Outcomes (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={(item.highlights || []).join('\n')}
                    onChange={(e) => updateRecentHighlights(idx, e.target.value)}
                    className="w-full bg-[#0D1527] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                    placeholder="Line 1: Highlight 1&#10;Line 2: Highlight 2"
                  />
                </div>

                <div className="md:col-span-3 space-y-2">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Event Image URL
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="text"
                      value={item.image}
                      onChange={(e) => updateRecentItem(idx, 'image', e.target.value)}
                      className="flex-1 w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                    <label className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 border border-slate-700 shrink-0">
                      <Upload className="w-4 h-4 text-[#E31B23]" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageUpload(e, (url) => updateRecentItem(idx, 'image', url))
                        }
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 3: UPCOMING EVENTS HERO SETTINGS */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-red-600/20 text-[#E31B23] font-black flex items-center justify-center text-sm border border-red-500/30">
              3
            </span>
            <h2 className="text-xl font-bold text-white">Upcoming Events Hero Banner Settings</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">`/events/upcoming`</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Hero Pill Badge Text
            </label>
            <input
              type="text"
              value={upcomingHero.categoryBadge}
              onChange={(e) => setUpcomingHero({ ...upcomingHero, categoryBadge: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Hero Main Title
            </label>
            <input
              type="text"
              value={upcomingHero.title}
              onChange={(e) => setUpcomingHero({ ...upcomingHero, title: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Hero Subtitle / Description
            </label>
            <textarea
              rows={3}
              value={upcomingHero.subtitle}
              onChange={(e) => setUpcomingHero({ ...upcomingHero, subtitle: e.target.value })}
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
                value={upcomingHero.bgImage}
                onChange={(e) => setUpcomingHero({ ...upcomingHero, bgImage: e.target.value })}
                className="flex-1 w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
                placeholder="/images/products-hero-banner.png"
              />
              <label className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 border border-slate-700 shrink-0">
                <Upload className="w-4 h-4 text-[#E31B23]" />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, (url) => setUpcomingHero({ ...upcomingHero, bgImage: url }))}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 4: UPCOMING EVENTS CARDS LIST MANAGER */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-red-600/20 text-[#E31B23] font-black flex items-center justify-center text-sm border border-red-500/30">
              4
            </span>
            <div>
              <h2 className="text-xl font-bold text-white">Upcoming Global Exhibitions 2026 Cards ({upcomingList.length})</h2>
              <p className="text-xs text-slate-400">Add, edit, delete, or update scheduled trade fairs.</p>
            </div>
          </div>

          <button
            onClick={addUpcomingEvent}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Upcoming Event</span>
          </button>
        </div>

        <div className="space-y-6">
          {upcomingList.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#141E36] border border-slate-700/70 rounded-2xl p-6 space-y-6 relative group"
            >
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-[#E31B23] text-xs font-mono font-bold">
                    #{idx + 1} - {item.id}
                  </span>
                  <h3 className="text-sm font-bold text-white truncate max-w-md">{item.title}</h3>
                </div>

                <button
                  onClick={() => deleteUpcomingEvent(idx)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Delete upcoming event card"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={item.category}
                    onChange={(e) => updateUpcomingItem(idx, 'category', e.target.value)}
                    className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Time Status Badge
                  </label>
                  <input
                    type="text"
                    value={item.daysLeft || 'Upcoming 2026'}
                    onChange={(e) => updateUpcomingItem(idx, 'daysLeft', e.target.value)}
                    className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Event ID
                  </label>
                  <input
                    type="text"
                    value={item.id}
                    onChange={(e) => updateUpcomingItem(idx, 'id', e.target.value)}
                    className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateUpcomingItem(idx, 'title', e.target.value)}
                    className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Event Dates
                  </label>
                  <input
                    type="text"
                    value={item.date}
                    onChange={(e) => updateUpcomingItem(idx, 'date', e.target.value)}
                    className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Location & Venue
                  </label>
                  <input
                    type="text"
                    value={item.location}
                    onChange={(e) => updateUpcomingItem(idx, 'location', e.target.value)}
                    className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Reserved Booth Location
                  </label>
                  <input
                    type="text"
                    value={item.booth}
                    onChange={(e) => updateUpcomingItem(idx, 'booth', e.target.value)}
                    className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Primary Exhibition Focus
                  </label>
                  <input
                    type="text"
                    value={item.focusArea}
                    onChange={(e) => updateUpcomingItem(idx, 'focusArea', e.target.value)}
                    className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Overview / Description
                  </label>
                  <textarea
                    rows={3}
                    value={item.overview}
                    onChange={(e) => updateUpcomingItem(idx, 'overview', e.target.value)}
                    className="w-full bg-[#0D1527] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Showcase Tagline 1
                  </label>
                  <input
                    type="text"
                    value={item.tagline1 || 'Official Exhibition Floor Showcase'}
                    onChange={(e) => updateUpcomingItem(idx, 'tagline1', e.target.value)}
                    className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Showcase Tagline 2
                  </label>
                  <input
                    type="text"
                    value={item.tagline2 || 'Confirmed Participation 2026'}
                    onChange={(e) => updateUpcomingItem(idx, 'tagline2', e.target.value)}
                    className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="md:col-span-3 space-y-2">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Event Image URL
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="text"
                      value={item.image}
                      onChange={(e) => updateUpcomingItem(idx, 'image', e.target.value)}
                      className="flex-1 w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                    <label className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 border border-slate-700 shrink-0">
                      <Upload className="w-4 h-4 text-[#E31B23]" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageUpload(e, (url) => updateUpcomingItem(idx, 'image', url))
                        }
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 5: GLOBAL OVERVIEW HERO SETTINGS */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-red-600/20 text-[#E31B23] font-black flex items-center justify-center text-sm border border-red-500/30">
              5
            </span>
            <h2 className="text-xl font-bold text-white">Main Events Overview Page Settings</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">`/events`</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Category Badge
            </label>
            <input
              type="text"
              value={overviewHero.categoryBadge}
              onChange={(e) => setOverviewHero({ ...overviewHero, categoryBadge: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Main Title
            </label>
            <input
              type="text"
              value={overviewHero.title}
              onChange={(e) => setOverviewHero({ ...overviewHero, title: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Subtitle Description
            </label>
            <textarea
              rows={3}
              value={overviewHero.subtitle}
              onChange={(e) => setOverviewHero({ ...overviewHero, subtitle: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl p-4 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
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
            <span>Save All Events Page Changes</span>
          </button>
        </div>
      </div>
    </div>
  )
}

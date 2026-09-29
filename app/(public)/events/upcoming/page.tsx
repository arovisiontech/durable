'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Clock, Award } from 'lucide-react'
import { EventsHeroBanner } from '@/src/components/public/EventsHeroBanner'

const DEFAULT_HERO = {
  categoryBadge: 'Upcoming Fairs 2026',
  title: 'Upcoming Global Exhibitions 2026',
  subtitle: 'Explore our schedule of upcoming international medical trade shows and book a dedicated B2B booth meeting with our executive export team.',
  bgImage: '/images/products-hero-banner.png',
}

const DEFAULT_EVENTS = [
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

export default function UpcomingEventsPage() {
  const [heroData, setHeroData] = useState(DEFAULT_HERO)
  const [eventsList, setEventsList] = useState(DEFAULT_EVENTS)

  const loadData = () => {
    try {
      const savedHero = localStorage.getItem('durable_upcoming_events_hero')
      if (savedHero) setHeroData(JSON.parse(savedHero))

      const savedEvents = localStorage.getItem('durable_upcoming_events_list')
      if (savedEvents) setEventsList(JSON.parse(savedEvents))
    } catch (e) {
      console.error('Error loading upcoming events data:', e)
    }
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('durable_content_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('durable_content_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  return (
    <div className="w-full bg-[#F8FAFC]">
      {/* Hero Banner */}
      <EventsHeroBanner
        title={heroData.title}
        subtitle={heroData.subtitle}
        categoryBadge={heroData.categoryBadge}
        bgImage={heroData.bgImage}
      />

      {/* Main Content */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-16">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/events"
              className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#E31B23] text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              All Events
            </Link>
            <Link
              href="/events/recent"
              className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#E31B23] text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              Recent Events
            </Link>
            <Link
              href="/events/upcoming"
              className="px-5 py-2.5 rounded-full bg-[#E31B23] text-white text-xs font-black uppercase tracking-wider shadow-md"
            >
              Upcoming Events
            </Link>
          </div>

          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Showing Scheduled 2026 Trade Shows
          </div>
        </div>

        {/* Detailed Upcoming Events List */}
        <div className="space-y-12">
          {eventsList.map((event) => (
            <div
              key={event.id}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl p-6 sm:p-8 flex flex-col lg:flex-row gap-8 items-stretch"
            >
              {/* Event Image Banner */}
              <div className="w-full lg:w-5/12 h-72 lg:h-auto rounded-2xl bg-slate-900 overflow-hidden relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={event.image || '/images/dental-clinic-banner.png'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#E31B23] text-white text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{event.daysLeft || 'Upcoming 2026'}</span>
                  </span>
                </div>
              </div>

              {/* Event Information */}
              <div className="w-full lg:w-7/12 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-100 text-[10px] font-extrabold uppercase">
                      {event.category}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                    {event.title}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#E31B23]" />
                      <span>{event.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#E31B23]" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-100 text-xs font-mono font-bold text-[#E31B23] flex items-center justify-between">
                    <span>Reserved Booth Location:</span>
                    <span className="bg-[#E31B23] text-white px-3 py-1 rounded-lg">
                      {event.booth}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {event.overview}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-100 text-xs text-slate-800 font-medium">
                    <span className="font-bold text-[#0B1B3D]">Primary Exhibition Focus: </span>
                    {event.focusArea}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0B1B3D]">
                    <Award className="w-4 h-4 text-[#E31B23]" />
                    <span>{event.tagline1 || 'Official Exhibition Floor Showcase'}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                    {event.tagline2 || 'Confirmed Participation 2026'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

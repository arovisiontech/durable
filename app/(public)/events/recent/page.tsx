'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, CheckCircle2, Users, Globe } from 'lucide-react'
import { EventsHeroBanner } from '@/src/components/public/EventsHeroBanner'

const DEFAULT_HERO = {
  categoryBadge: 'Recent Events Archive',
  title: 'Recent International Events Archive',
  subtitle: 'A look back at our recent trade exhibitions, global convention outcomes, and international distributor partnerships.',
  bgImage: '/images/products-hero-banner.png',
}

const DEFAULT_EVENTS = [
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

export default function RecentEventsPage() {
  const [heroData, setHeroData] = useState(DEFAULT_HERO)
  const [eventsList, setEventsList] = useState(DEFAULT_EVENTS)

  const loadData = () => {
    try {
      const savedHero = localStorage.getItem('durable_recent_events_hero')
      if (savedHero) setHeroData(JSON.parse(savedHero))

      const savedEvents = localStorage.getItem('durable_recent_events_list')
      if (savedEvents) setEventsList(JSON.parse(savedEvents))
    } catch (e) {
      console.error('Error loading recent events data:', e)
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
              className="px-5 py-2.5 rounded-full bg-[#E31B23] text-white text-xs font-black uppercase tracking-wider shadow-md"
            >
              Recent Events
            </Link>
            <Link
              href="/events/upcoming"
              className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#E31B23] text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              Upcoming Events
            </Link>
          </div>

          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Showing Past Trade Fair Highlights
          </div>
        </div>

        {/* Detailed Recent Events List */}
        <div className="space-y-12">
          {eventsList.map((event) => (
            <div
              key={event.id}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg p-6 sm:p-8 flex flex-col lg:flex-row gap-8 items-stretch"
            >
              {/* Event Image */}
              <div className="w-full lg:w-5/12 h-72 lg:h-auto rounded-2xl bg-slate-900 overflow-hidden relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={event.image || '/images/about-surgical-instruments.png'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-[#0B1B3D] text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                    {event.statusBadge || 'Completed Event'}
                  </span>
                </div>
              </div>

              {/* Event Content Details */}
              <div className="w-full lg:w-7/12 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-red-50 text-[#E31B23] border border-red-100 text-[10px] font-extrabold uppercase">
                      {event.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      ID: {event.id}
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

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#E31B23]" />
                      <span>{event.attendees}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#E31B23]" />
                      <span className="truncate">{event.delegates}</span>
                    </div>
                  </div>

                  {event.highlights && event.highlights.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                        Key Event Highlights & Outcomes:
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {event.highlights.map((h: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    Booth Location: {event.booth}
                  </span>

                  <span className="px-4 py-1.5 bg-slate-100 text-[#0B1B3D] text-xs font-extrabold rounded-full">
                    {event.actionText || 'Completed Exhibition Archive'}
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

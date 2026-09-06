import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, MapPin, ArrowRight, ExternalLink, Award, Users, CheckCircle2 } from 'lucide-react'
import { EventsHeroBanner } from '@/src/components/public/EventsHeroBanner'

export const metadata: Metadata = {
  title: 'Global Surgical Events & Trade Exhibitions | Durable Medical',
  description:
    'Join Durable Hospital Supplies at global medical trade fairs including IDS Cologne, MEDICA Germany, Arab Health Dubai, and FIME USA.',
}

const ALL_EVENTS = [
  {
    id: 'EVT-01',
    title: 'IDS Cologne 2026 - 41st International Dental Show',
    type: 'Upcoming',
    date: 'March 24 - 28, 2026',
    location: 'Koelnmesse, Cologne, Germany',
    booth: 'Hall 10.2, Stand B-045',
    category: 'Dental & Maxillofacial',
    image: '/images/dental-clinic-banner.png',
    description:
      'Discover Durable Medical’s latest German-grade stainless steel dental surgical tools, titanium implantology sets, and custom OEM private label solutions.',
    link: '/events/upcoming',
  },
  {
    id: 'EVT-02',
    title: 'Arab Health Dubai 2026',
    type: 'Upcoming',
    date: 'January 26 - 29, 2026',
    location: 'Dubai World Trade Centre, UAE',
    booth: 'Za’abeel Hall 3, Stand Z3.D12',
    category: 'General Surgery & Hospital Supplies',
    image: '/images/surgical-tray-durable.png',
    description:
      'Middle East’s largest healthcare exhibition. Durable Medical will showcase single-use procedure kits, micro-forceps, and CE MDR certified instruments.',
    link: '/events/upcoming',
  },
  {
    id: 'EVT-03',
    title: 'MEDICA Düsseldorf 2025 International Forum',
    type: 'Recent',
    date: 'November 17 - 20, 2025',
    location: 'Messe Düsseldorf, Germany',
    booth: 'Hall 3, Stand C-89',
    category: 'General Surgery',
    image: '/images/about-surgical-instruments.png',
    description:
      'Successfully connected with over 450 global distributors and hospital procurement teams across Europe and Latin America.',
    link: '/events/recent',
  },
  {
    id: 'EVT-04',
    title: 'FIME USA International Medical Expo',
    type: 'Recent',
    date: 'June 18 - 20, 2025',
    location: 'Miami Beach Convention Center, Florida, USA',
    booth: 'Stand 1420',
    category: 'Hospital Supplies',
    image: '/images/precision-healthcare-banner.png',
    description:
      'Showcasing reusable cardiovascular forceps, tungsten carbide scissors, and FDA registered hospital tools.',
    link: '/events/recent',
  },
]

export default function EventsOverviewPage() {
  return (
    <div className="w-full bg-[#F8FAFC]">
      {/* Hero Banner */}
      <EventsHeroBanner
        title="Global Medical Fairs & Trade Events"
        subtitle="Meet Durable Hospital Supplies at leading international surgical trade exhibitions, dental forums, and global healthcare conventions."
        categoryBadge="Global Exhibitions"
      />

      {/* Main Container */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-16">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/events"
              className="px-5 py-2.5 rounded-full bg-[#0B1B3D] text-white text-xs font-black uppercase tracking-wider shadow-md"
            >
              All Events
            </Link>
            <Link
              href="/events/upcoming"
              className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#E31B23] text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              Upcoming Events
            </Link>
            <Link
              href="/events/recent"
              className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#E31B23] text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              Recent Events
            </Link>
          </div>

          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Showing {ALL_EVENTS.length} Global Exhibitions
          </div>
        </div>

        {/* Grid of Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ALL_EVENTS.map((event) => (
            <div
              key={event.id}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Event Image */}
                <div className="relative w-full h-64 bg-slate-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md ${
                        event.type === 'Upcoming'
                          ? 'bg-[#E31B23] text-white'
                          : 'bg-slate-900/80 text-slate-200 backdrop-blur-xs'
                      }`}
                    >
                      {event.type}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/90 text-slate-900 text-[10px] font-extrabold uppercase backdrop-blur-xs shadow-xs">
                      {event.category}
                    </span>
                  </div>
                </div>

                {/* Event Info */}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-[#E31B23] transition-colors leading-snug">
                    {event.title}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-600 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#E31B23]" />
                      <span>{event.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#E31B23]" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-[#0B1B3D]">
                    Booth: {event.booth}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="p-6 pt-0">
                <Link
                  href={event.link}
                  className="w-full py-3 px-4 bg-slate-100 hover:bg-[#0B1B3D] text-slate-800 hover:text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <span>View Event Details</span>
                  <ArrowRight className="w-4 h-4 text-[#E31B23]" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Event Photo Gallery Grid */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#E31B23]">Exhibition Gallery</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B1B3D] uppercase">Trade Show & Exhibition Moments</h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              Highlights from our global booth displays, international trade delegations, and live surgical tool demonstrations across Germany, UAE, and USA.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md group">
              <div className="h-48 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/dental-clinic-banner.png"
                  alt="IDS Cologne Exhibition Booth"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2 left-2 bg-[#0B1B3D] text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                  IDS Cologne 2026
                </span>
              </div>
              <div className="p-4">
                <h4 className="text-xs font-bold text-slate-800">Dental Instrument Showcase</h4>
                <p className="text-[11px] text-slate-500 mt-1">German stainless steel extraction forceps & implantology kits display.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md group">
              <div className="h-48 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/surgical-tray-durable.png"
                  alt="Arab Health Dubai Booth"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2 left-2 bg-[#E31B23] text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                  Arab Health Dubai
                </span>
              </div>
              <div className="p-4">
                <h4 className="text-xs font-bold text-slate-800">Sterile Surgery Trays</h4>
                <p className="text-[11px] text-slate-500 mt-1">Live demo of autoclavable general surgery & cardiovascular trays.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md group">
              <div className="h-48 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/about-surgical-instruments.png"
                  alt="MEDICA Germany Forum"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2 left-2 bg-[#0B1B3D] text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                  MEDICA Germany
                </span>
              </div>
              <div className="p-4">
                <h4 className="text-xs font-bold text-slate-800">European Delegation Forum</h4>
                <p className="text-[11px] text-slate-500 mt-1">Connecting with over 450 global medical buyers & hospital partners.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md group">
              <div className="h-48 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/precision-healthcare-banner.png"
                  alt="FIME USA Expo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2 left-2 bg-[#E31B23] text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                  FIME Miami USA
                </span>
              </div>
              <div className="p-4">
                <h4 className="text-xs font-bold text-slate-800">Precision Micro Tools</h4>
                <p className="text-[11px] text-slate-500 mt-1">Tungsten carbide surgical shears and specialized titanium instruments.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

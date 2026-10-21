'use client'

import Link from 'next/link'
import { ArrowUpRight, Phone, Mail, MapPin } from 'lucide-react'
import { PublicSiteSettings, PublicFooterData } from '@/src/types/public'
import { CategoryItem } from '@/src/types/category'
import { DEFAULT_FOOTER_DATA } from '@/src/data/defaultFooterData'
import { useState, useEffect } from 'react'
import { loadPersistentData } from '@/src/lib/persistentStorage'

interface PublicFooterProps {
  settings: PublicSiteSettings | null
  categories?: CategoryItem[]
  initialData?: PublicFooterData
}

function normalizeCategoryList(cats: (CategoryItem | any)[]): CategoryItem[] {
  if (!Array.isArray(cats) || cats.length === 0) return []

  const mapped = cats.map((c) => {
    if (
      c.slug === 'dental' ||
      c.id === 'cat-dental' ||
      c.name?.toLowerCase() === 'dental' ||
      c.label?.toLowerCase() === 'dental'
    ) {
      return {
        ...c,
        id: 'cat-dental',
        name: 'Dental',
        slug: 'dental',
        is_published: true,
        sort_order: 2,
      }
    }
    if (
      c.slug === 'veterinary-instruments' &&
      (c.name === 'Veterinary-Instruments' || c.label === 'Veterinary-Instruments')
    ) {
      return { ...c, name: 'Veterinary Instruments', label: 'Veterinary Instruments' }
    }
    return c
  })

  // Filter out items explicitly unpublished, except Dental is ALWAYS published
  let published = mapped.filter((c) => {
    if (c.slug === 'dental' || c.id === 'cat-dental') return true
    return c.is_published !== false
  })

  // Guarantee Dental is always in the list
  if (!published.some((c) => c.slug === 'dental' || c.id === 'cat-dental')) {
    published.push({
      id: 'cat-dental',
      parent_id: null,
      name: 'Dental',
      slug: 'dental',
      description: 'Complete Dental Solutions For Every Specialty',
      image_url: '/images/icon-dental.png',
      sort_order: 2,
      is_published: true,
      created_at: '2026-10-14T19:10:28.945Z',
      updated_at: '2026-10-14T19:10:28.945Z',
      product_count: 4,
      level: 0,
    })
  }

  // Exact home page ordering: General Surgery (1), Dental (2), Medical Hollowware (3)...
  published.sort((a, b) => {
    const getOrder = (item: any) => {
      const s = item.slug || ''
      if (s === 'general-surgery') return 1
      if (s === 'dental') return 2
      if (s === 'medical-hollowware') return 3
      if (s === 'ophthalmic') return 4
      if (s === 'hospital-furniture') return 5
      if (s === 'single-use-instruments') return 6
      if (s === 'veterinary-instruments') return 7
      if (s === 'plastic-surgery') return 8
      if (s === 'special-surgical-instruments') return 9
      return item.sort_order ?? 99
    }
    return getOrder(a) - getOrder(b)
  })

  return published
}

export function PublicFooter({ settings, categories = [], initialData }: PublicFooterProps) {
  const [footerData, setFooterData] = useState<PublicFooterData>(initialData || DEFAULT_FOOTER_DATA)
  const [liveCategories, setLiveCategories] = useState<CategoryItem[]>(() => normalizeCategoryList(categories))
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  // Keep liveCategories in sync with categories prop
  useEffect(() => {
    if (categories && categories.length > 0) {
      setLiveCategories(normalizeCategoryList(categories))
    }
  }, [categories])

  // Real-time synchronization from Admin Panel / IndexedDB / Cloud
  useEffect(() => {
    const handleUpdate = () => {
      // Sync footer data
      loadPersistentData<PublicFooterData>(
        'durable_footer_data',
        initialData || DEFAULT_FOOTER_DATA,
        (data) => {
          if (data) {
            const cleanSocials = {
              ...DEFAULT_FOOTER_DATA.socials,
              ...(data.socials || {}),
            }
            if (!cleanSocials.instagram || cleanSocials.instagram === 'https://instagram.com' || cleanSocials.instagram === 'https://instagram.com/') {
              cleanSocials.instagram = 'https://www.instagram.com/durablehospitalsupplies/'
            }
            if (!cleanSocials.facebook || cleanSocials.facebook === 'https://facebook.com' || cleanSocials.facebook === 'https://facebook.com/') {
              cleanSocials.facebook = 'https://www.facebook.com/p/Durable-Hospital-Supplies-100063835312521/'
            }
            if (!cleanSocials.linkedin || cleanSocials.linkedin === 'https://linkedin.com' || cleanSocials.linkedin === 'https://linkedin.com/') {
              cleanSocials.linkedin = 'https://pk.linkedin.com/company/durablehospitalsupplies?trk=public_post_feed-actor-name'
            }

            setFooterData({
              ...DEFAULT_FOOTER_DATA,
              ...data,
              email: data.email?.toLowerCase() || DEFAULT_FOOTER_DATA.email,
              mapUrl: data.mapUrl || DEFAULT_FOOTER_DATA.mapUrl,
              socials: cleanSocials,
            })
          }
        }
      )

      // Sync active categories so Product Range updates automatically
      loadPersistentData<CategoryItem[]>(
        'durable_categories',
        categories || [],
        (data) => {
          if (data && Array.isArray(data) && data.length > 0) {
            setLiveCategories(normalizeCategoryList(data))
          }
        }
      )
    }

    handleUpdate()
    window.addEventListener('durable_content_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      window.removeEventListener('durable_content_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [initialData, categories])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (newsletterEmail.trim()) {
      setSubscribed(true)
      setNewsletterEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  const cleanEmail = (footerData.email || 'info@durablehs.com').trim().toLowerCase()
  const mapUrl = footerData.mapUrl || 'https://maps.app.goo.gl/RGr1xeaZjtdHgCpX8'

  const instagramUrl =
    footerData.socials?.instagram &&
    footerData.socials.instagram !== 'https://instagram.com' &&
    footerData.socials.instagram !== 'https://instagram.com/'
      ? footerData.socials.instagram
      : 'https://www.instagram.com/durablehospitalsupplies/'

  const facebookUrl =
    footerData.socials?.facebook &&
    footerData.socials.facebook !== 'https://facebook.com' &&
    footerData.socials.facebook !== 'https://facebook.com/'
      ? footerData.socials.facebook
      : 'https://www.facebook.com/p/Durable-Hospital-Supplies-100063835312521/'

  const linkedinUrl =
    footerData.socials?.linkedin &&
    footerData.socials.linkedin !== 'https://linkedin.com' &&
    footerData.socials.linkedin !== 'https://linkedin.com/'
      ? footerData.socials.linkedin
      : 'https://pk.linkedin.com/company/durablehospitalsupplies?trk=public_post_feed-actor-name'

  return (
    <footer className="w-full bg-[#181F28] text-slate-200 py-8 sm:py-12 relative overflow-hidden border-t border-slate-800">
      {/* Background Architectural Watermark Image */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none bg-cover bg-center"
        style={{ backgroundImage: `url('/images/about-surgical-instruments.png')` }}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 relative z-10 space-y-6 sm:space-y-8">
        
        {/* Top CTA Banner Block */}
        <div className="flex flex-row items-center justify-between gap-4 pb-3 border-b border-slate-700/60">
          <div className="space-y-1">
            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
              {footerData.bannerSubtitle || 'BUILDING YOUR VISION'}
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight uppercase">
              {footerData.bannerTitle || "LET'S BUILD SOMETHING AMAZING."}
            </h2>
          </div>

          <Link
            href={footerData.bannerButtonLink || '/contact'}
            className="inline-flex items-center gap-2 bg-white text-[#181F28] hover:bg-slate-100 font-extrabold text-xs sm:text-sm tracking-wider uppercase px-5 py-2.5 rounded shadow-sm transition-all shrink-0 group"
          >
            <span>{footerData.bannerButtonText || "LET'S DISCUSS"}</span>
            <ArrowUpRight className="w-4 h-4 text-[#E31B23] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Middle Content Row 1: Brand Logo & Newsletter Subscription */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
          <Link href="/" className="inline-block shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={footerData.logoUrl || '/logo.svg'}
              alt={settings?.company_name || 'Durable Hospital Supplies'}
              className="h-16 sm:h-20 md:h-24 max-w-[280px] sm:max-w-[360px] w-auto object-contain transition-transform hover:scale-102"
            />
          </Link>

          {/* Newsletter Form */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-xs sm:text-sm font-bold tracking-wider text-white uppercase shrink-0">
              {footerData.newsletterTitle || 'SIGN UP FOR NEWSLETTER'}
            </p>
            <form onSubmit={handleSubscribe} className="flex items-center">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={footerData.newsletterPlaceholder || 'your email.....'}
                className="bg-[#10151C] border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm px-4 py-2 rounded-l focus:outline-none focus:border-red-500 w-52 sm:w-64 h-9"
              />
              <button
                type="submit"
                className="bg-[#E31B23] hover:bg-red-700 text-white font-bold text-xs sm:text-sm tracking-wider uppercase px-5 h-9 rounded-r transition-colors shrink-0"
              >
                {footerData.newsletterButtonText || 'SUBSCRIBE'}
              </button>
            </form>
            {subscribed && (
              <p className="text-xs font-bold text-emerald-400">Subscribed!</p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-slate-700/60" />

        {/* Middle Content Row 2: 3 Flat Columns Layout (Matching SS 3) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-1">
          
          {/* Column 1: OUR LOCATIONS (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <h3 className="text-xs sm:text-sm font-extrabold tracking-wider text-white uppercase">
              {footerData.locationTitle || 'OUR LOCATIONS'}
            </h3>

            <div className="space-y-2.5 text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              {/* Clickable Location linking to Google Maps with Red Pin point */}
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-lg p-2.5 -ml-2.5 hover:bg-slate-800/60 transition-all border border-transparent hover:border-red-500/30"
                title="View location on Google Maps"
              >
                <div className="flex items-start gap-2.5">
                  {/* Red Location Main Point Pin */}
                  <div className="mt-0.5 w-6 h-6 rounded-full bg-red-600/20 border border-[#E31B23] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(227,27,35,0.4)] group-hover:scale-110 group-hover:bg-[#E31B23] transition-all">
                    <MapPin className="w-3.5 h-3.5 text-[#E31B23] group-hover:text-white" fill="#E31B23" />
                  </div>
                  <div>
                    <p className="text-white font-bold group-hover:text-[#E31B23] transition-colors leading-snug">
                      {footerData.addressLine1 || 'Noal More, Roras Road P.O. Box 919'}
                    </p>
                    <p className="text-slate-300 text-xs sm:text-sm">
                      {footerData.addressLine2 || 'Sialkot - 51310 Pakistan.'}
                    </p>
                    <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-extrabold text-[#E31B23] tracking-wider uppercase group-hover:underline">
                      <span>View on Google Maps</span>
                      <ArrowUpRight className="w-3 h-3 text-[#E31B23]" />
                    </div>
                  </div>
                </div>
              </a>

              {/* Phone Numbers */}
              <div className="space-y-1 pt-1">
                <p className="flex items-center gap-2 font-semibold text-slate-200">
                  <Phone className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>Phone : {footerData.phone1 || '(+92) 52 3563200'}</span>
                </p>
                {footerData.phone2 && (
                  <p className="pl-6 text-slate-300 text-xs sm:text-sm">
                    Phone: {footerData.phone2}
                  </p>
                )}
              </div>

              {/* Email (Strictly Lowercase: info@durablehs.com) */}
              <p className="flex items-center gap-2 pt-1">
                <Mail className="w-4 h-4 text-slate-300 shrink-0" />
                <span className="text-slate-300">Email:</span>
                <a
                  href={`mailto:${cleanEmail}`}
                  className="font-semibold text-slate-200 hover:text-[#E31B23] transition-colors lowercase tracking-normal"
                >
                  {cleanEmail}
                </a>
              </p>
            </div>

            {/* Social Icons Row */}
            <div className="flex items-center gap-2 pt-2">
              {/* Instagram */}
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-7 h-7 rounded bg-[#0077B5] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              )}

              {/* Facebook */}
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-7 h-7 rounded bg-[#1877F2] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
              )}

              {/* Twitter */}
              {footerData.socials?.twitter && (
                <a
                  href={footerData.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="w-7 h-7 rounded bg-[#1DA1F2] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                </a>
              )}

              {/* LinkedIn */}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-7 h-7 rounded bg-[#0A66C2] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              )}

              {/* Pinterest */}
              {footerData.socials?.pinterest && (
                <a
                  href={footerData.socials.pinterest}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Pinterest"
                  className="w-7 h-7 rounded bg-[#BD081C] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs font-black text-xs"
                >
                  P
                </a>
              )}
            </div>
          </div>

          {/* Column 2: QUICK LINKS (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs sm:text-sm font-extrabold tracking-wider text-white uppercase">
              {footerData.quickLinksTitle || 'QUICK LINKS'}
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200 font-semibold">
              {(
                footerData.quickLinks && footerData.quickLinks.length > 0
                  ? footerData.quickLinks
                  : DEFAULT_FOOTER_DATA.quickLinks
              ).map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    prefetch={true}
                    className="hover:text-[#E31B23] transition-colors flex items-center gap-2"
                  >
                    <span className="text-slate-400">•</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: PRODUCT RANGE (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs sm:text-sm font-extrabold tracking-wider text-white uppercase">
              {footerData.productRangeTitle || 'PRODUCT RANGE'}
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200 font-semibold">
              {normalizeCategoryList(
                liveCategories && liveCategories.length > 0
                  ? liveCategories
                  : (footerData.productRangeLinks && footerData.productRangeLinks.length > 0)
                    ? footerData.productRangeLinks
                    : DEFAULT_FOOTER_DATA.productRangeLinks
              ).map((cat: any, idx: number) => {
                const label = cat.label || cat.name
                const href = cat.href || `/category/${cat.slug}`
                const isHighlight = cat.isHighlight || cat.slug === 'single-use-instruments'
                return (
                  <li key={idx}>
                    <Link
                      href={href}
                      prefetch={true}
                      className={`transition-colors flex items-center gap-2 ${
                        isHighlight
                          ? 'text-[#E31B23] font-bold hover:underline'
                          : 'hover:text-[#E31B23] text-slate-200'
                      }`}
                    >
                      <span className={isHighlight ? 'text-[#E31B23]' : 'text-slate-400'}>•</span>
                      <span>{label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-slate-700/60" />

        {/* Bottom Copyright Bar */}
        <div className="pt-0.5 pb-1 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm font-medium text-slate-400">
          <p>
            {footerData.copyrightText || '© 2026 Durable Hospital Supplies All Rights Reserved'}
          </p>
          <p className="text-slate-400">
            Designed by{' '}
            {footerData.designedByLink && footerData.designedByLink !== '#' ? (
              <a
                href={footerData.designedByLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-white hover:text-[#E31B23] transition-colors"
              >
                {footerData.designedByText || 'Brandie Design Agency'}
              </a>
            ) : (
              <span className="font-bold text-white hover:text-[#E31B23] transition-colors">
                {footerData.designedByText || 'Brandie Design Agency'}
              </span>
            )}
          </p>
        </div>

      </div>
    </footer>
  )
}

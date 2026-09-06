'use client'

import Link from 'next/link'
import { ArrowUpRight, Phone, Mail } from 'lucide-react'
import { PublicSiteSettings } from '@/src/types/public'
import { CategoryItem } from '@/src/types/category'
import { useState } from 'react'

interface PublicFooterProps {
  settings: PublicSiteSettings | null
  categories: CategoryItem[]
}

export function PublicFooter({ settings }: PublicFooterProps) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  return (
    <footer className="w-full bg-[#181F28] text-slate-300 py-6 sm:py-8 relative overflow-hidden border-t border-slate-800">
      {/* Background Architectural Watermark Image matching SS 1 */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none bg-cover bg-center"
        style={{ backgroundImage: `url('/images/about-surgical-instruments.png')` }}
      />

      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 sm:space-y-5">
        {/* Top CTA Banner Block matching SS 1 */}
        <div className="flex flex-row items-center justify-between gap-4 pb-2">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              BUILDING YOUR VISION
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight uppercase">
              LET&apos;S BUILD SOMETHING AMAZING.
            </h2>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 bg-white text-[#181F28] hover:bg-slate-100 font-extrabold text-[11px] tracking-wider uppercase px-4 py-2 rounded shadow-sm transition-all shrink-0 group"
          >
            <span>LET&apos;S DISCUSS</span>
            <ArrowUpRight className="w-4 h-4 text-[#E31B23] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Divider 1 */}
        <div className="w-full h-[1px] bg-slate-700/50" />

        {/* Middle Content Row 1: Logo & Newsletter Subscription matching SS 1 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
          {/* Company Brand Logo Image */}
          <Link href="/" className="inline-block shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/image 237.svg"
              alt={settings?.company_name || 'Durable Hospital Supplies'}
              className="h-10 sm:h-14 w-auto object-contain brightness-0 invert opacity-95"
            />
          </Link>

          {/* Newsletter Form */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-[11px] font-bold tracking-wider text-white uppercase shrink-0">
              SIGN UP FOR NEWSLETTER
            </p>
            <form onSubmit={handleSubscribe} className="flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your email....."
                className="bg-[#10151C] border border-slate-700 text-white placeholder-slate-500 text-xs px-3 py-1.5 rounded-l focus:outline-none focus:border-red-500 w-48 sm:w-64 h-8"
              />
              <button
                type="submit"
                className="bg-[#E31B23] hover:bg-red-700 text-white font-bold text-[11px] tracking-wider uppercase px-4 h-8 rounded-r transition-colors shrink-0"
              >
                SUBSCRIBE
              </button>
            </form>
            {subscribed && (
              <p className="text-[10px] font-bold text-emerald-400">Subscribed!</p>
            )}
          </div>
        </div>

        {/* Divider 2 */}
        <div className="w-full h-[1px] bg-slate-700/50" />

        {/* Middle Content Row 2: 3 Compact Columns Layout matching SS 1 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-1 pb-1">
          {/* Column 1: OUR LOCATIONS (5 cols) */}
          <div className="md:col-span-5 space-y-2">
            <h3 className="text-[11px] font-bold tracking-wider text-white uppercase">
              OUR LOCATIONS
            </h3>
            <div className="space-y-1 text-[11px] text-slate-300 font-normal leading-snug">
              <p>
                Noal More, Roras Road P.O. Box 919 <br />
                Sialkot - 51310 Pakistan.
              </p>

              <div className="space-y-0.5 pt-1">
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span>Phone : (+92) 52 3563200</span>
                </p>
                <p className="pl-5 text-slate-400">
                  Phone: (+92) 52 3553777 | (+92) 523252500
                </p>
              </div>

              <p className="flex items-center gap-1.5 pt-0.5">
                <Mail className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                <a href="mailto:Info@Durablehs.Com" className="hover:text-white transition-colors">
                  Email: Info@Durablehs.Com
                </a>
              </p>
            </div>

            {/* Social Icons Row matching SS 1 */}
            <div className="flex items-center gap-1.5 pt-1">
              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="w-6 h-6 rounded bg-[#0077B5] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="w-6 h-6 rounded bg-[#1877F2] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              {/* Twitter */}
              <a
                href="#"
                aria-label="Twitter"
                className="w-6 h-6 rounded bg-[#1DA1F2] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-6 h-6 rounded bg-[#0A66C2] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>

              {/* Pinterest */}
              <a
                href="#"
                aria-label="Pinterest"
                className="w-6 h-6 rounded bg-[#BD081C] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs font-black text-[10px]"
              >
                P
              </a>
            </div>
          </div>

          {/* Column 2: QUICK LINKS (3 cols) */}
          <div className="md:col-span-3 space-y-2">
            <h3 className="text-[11px] font-bold tracking-wider text-white uppercase">
              QUICK LINKS
            </h3>
            <ul className="space-y-1 text-[11px] text-slate-300 font-medium">
              <li>
                <Link href="/about" prefetch={true} className="hover:text-[#E31B23] transition-colors flex items-center gap-1.5">
                  <span className="text-slate-500">•</span>
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/history" prefetch={true} className="hover:text-[#E31B23] transition-colors flex items-center gap-1.5">
                  <span className="text-slate-500">•</span>
                  <span>History</span>
                </Link>
              </li>
              <li>
                <Link href="/csr" prefetch={true} className="hover:text-[#E31B23] transition-colors flex items-center gap-1.5">
                  <span className="text-slate-500">•</span>
                  <span>CSR</span>
                </Link>
              </li>
              <li>
                <Link href="/compliance" prefetch={true} className="hover:text-[#E31B23] transition-colors flex items-center gap-1.5">
                  <span className="text-slate-500">•</span>
                  <span>Compliance</span>
                </Link>
              </li>
              <li>
                <Link href="/news" prefetch={true} className="hover:text-[#E31B23] transition-colors flex items-center gap-1.5">
                  <span className="text-slate-500">•</span>
                  <span>News</span>
                </Link>
              </li>
              <li>
                <Link href="/quality" prefetch={true} className="hover:text-[#E31B23] transition-colors flex items-center gap-1.5">
                  <span className="text-slate-500">•</span>
                  <span>Quality</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: PRODUCT RANGE (4 cols) */}
          <div className="md:col-span-4 space-y-2">
            <h3 className="text-[11px] font-bold tracking-wider text-white uppercase">
              PRODUCT RANGE
            </h3>
            <ul className="space-y-1 text-[11px] text-slate-300 font-medium">
              <li>
                <Link href="/catalog-showcase#cat-01" prefetch={true} className="hover:text-[#E31B23] transition-colors flex items-center gap-1.5">
                  <span className="text-slate-500">•</span>
                  <span>General Surgery</span>
                </Link>
              </li>
              <li>
                <Link href="/dental-showcase" prefetch={true} className="hover:text-[#E31B23] transition-colors flex items-center gap-1.5">
                  <span className="text-slate-500">•</span>
                  <span>Dental Instruments</span>
                </Link>
              </li>
              <li>
                <Link href="/catalog-showcase#cat-03" prefetch={true} className="hover:text-[#E31B23] transition-colors flex items-center gap-1.5">
                  <span className="text-slate-500">•</span>
                  <span>Diagnostics Instruments</span>
                </Link>
              </li>
              <li>
                <Link href="/catalog-showcase#cat-04" prefetch={true} className="hover:text-[#E31B23] transition-colors flex items-center gap-1.5">
                  <span className="text-slate-500">•</span>
                  <span>Holloware</span>
                </Link>
              </li>
              <li>
                <Link href="/products?category=hospital-furniture" prefetch={true} className="hover:text-[#E31B23] transition-colors flex items-center gap-1.5">
                  <span className="text-slate-500">•</span>
                  <span>Hospital Furniture</span>
                </Link>
              </li>
              <li>
                <Link href="/catalog-showcase#cat-03" prefetch={true} className="hover:text-[#E31B23] transition-colors flex items-center gap-1.5">
                  <span className="text-slate-500">•</span>
                  <span>Laparoscopy Instruments</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider 3 */}
        <div className="w-full h-[1px] bg-slate-700/50" />

        {/* Bottom Copyright Bar matching SS 1 */}
        <div className="pt-0.5 pb-1 text-center sm:text-left text-[11px] font-normal text-slate-400">
          <p>
            © 2026 Durable Hospital Supplies All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  )
}

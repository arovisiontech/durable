'use client'

import Link from 'next/link'
import { ArrowUpRight, Phone, Mail } from 'lucide-react'
import { PublicSiteSettings } from '@/src/types/public'
import { CategoryItem } from '@/src/types/category'
import { useState } from 'react'

interface PublicFooterProps {
  settings: PublicSiteSettings | null
  categories?: CategoryItem[]
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
    <footer className="w-full bg-[#181F28] text-slate-200 py-8 sm:py-12 relative overflow-hidden border-t border-slate-800">
      {/* Background Architectural Watermark Image */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none bg-cover bg-center"
        style={{ backgroundImage: `url('/images/about-surgical-instruments.png')` }}
      />

      {/* Main Container with ~0.5 Inches Left & Right Margin Space (px-8 sm:px-12 lg:px-16 max-w-7xl) */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 relative z-10 space-y-6 sm:space-y-8">
        
        {/* Top CTA Banner Block */}
        <div className="flex flex-row items-center justify-between gap-4 pb-3 border-b border-slate-700/60">
          <div className="space-y-1">
            <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
              BUILDING YOUR VISION
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight uppercase">
              LET&apos;S BUILD SOMETHING AMAZING.
            </h2>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-[#181F28] hover:bg-slate-100 font-extrabold text-xs sm:text-sm tracking-wider uppercase px-5 py-2.5 rounded shadow-sm transition-all shrink-0 group"
          >
            <span>LET&apos;S DISCUSS</span>
            <ArrowUpRight className="w-4 h-4 text-[#E31B23] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Middle Content Row 1: Brand Logo (/logo.svg) & Newsletter Subscription */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
          {/* Company Brand Logo Image - Using /logo.svg */}
          <Link href="/" className="inline-block shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt={settings?.company_name || 'Durable Hospital Supplies'}
              className="h-12 sm:h-14 w-auto object-contain transition-opacity hover:opacity-95"
            />
          </Link>

          {/* Newsletter Form */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-xs sm:text-sm font-bold tracking-wider text-white uppercase shrink-0">
              SIGN UP FOR NEWSLETTER
            </p>
            <form onSubmit={handleSubscribe} className="flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your email....."
                className="bg-[#10151C] border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm px-4 py-2 rounded-l focus:outline-none focus:border-red-500 w-52 sm:w-64 h-9"
              />
              <button
                type="submit"
                className="bg-[#E31B23] hover:bg-red-700 text-white font-bold text-xs sm:text-sm tracking-wider uppercase px-5 h-9 rounded-r transition-colors shrink-0"
              >
                SUBSCRIBE
              </button>
            </form>
            {subscribed && (
              <p className="text-xs font-bold text-emerald-400">Subscribed!</p>
            )}
          </div>
        </div>

        {/* Divider 2 */}
        <div className="w-full h-[1px] bg-slate-700/60" />

        {/* Middle Content Row 2: 3 Flat Columns Layout (Without Dark Card Boxes) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-1">
          
          {/* Column 1: OUR LOCATIONS (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <h3 className="text-xs sm:text-sm font-extrabold tracking-wider text-white uppercase">
              OUR LOCATIONS
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              <p>
                Noal More, Roras Road P.O. Box 919 <br />
                Sialkot - 51310 Pakistan.
              </p>

              <div className="space-y-1 pt-1">
                <p className="flex items-center gap-2 font-semibold text-slate-200">
                  <Phone className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>Phone : (+92) 52 3563200</span>
                </p>
                <p className="pl-6 text-slate-300 text-xs sm:text-sm">
                  Phone: (+92) 52 3553777 | (+92) 523252500
                </p>
              </div>

              <p className="flex items-center gap-2 pt-1">
                <Mail className="w-4 h-4 text-slate-300 shrink-0" />
                <a href="mailto:Info@Durablehs.Com" className="font-semibold text-slate-200 hover:text-white transition-colors">
                  Email: Info@Durablehs.Com
                </a>
              </p>
            </div>

            {/* Social Icons Row */}
            <div className="flex items-center gap-2 pt-2">
              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="w-7 h-7 rounded bg-[#0077B5] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="w-7 h-7 rounded bg-[#1877F2] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              {/* Twitter */}
              <a
                href="#"
                aria-label="Twitter"
                className="w-7 h-7 rounded bg-[#1DA1F2] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-7 h-7 rounded bg-[#0A66C2] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>

              {/* Pinterest */}
              <a
                href="#"
                aria-label="Pinterest"
                className="w-7 h-7 rounded bg-[#BD081C] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs font-black text-xs"
              >
                P
              </a>
            </div>
          </div>

          {/* Column 2: QUICK LINKS (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs sm:text-sm font-extrabold tracking-wider text-white uppercase">
              QUICK LINKS
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200 font-semibold">
              <li>
                <Link href="/about" prefetch={true} className="hover:text-[#E31B23] transition-colors flex items-center gap-2">
                  <span className="text-slate-400">•</span>
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/strengths" prefetch={true} className="hover:text-[#E31B23] transition-colors flex items-center gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Our Strengths</span>
                </Link>
              </li>
              <li>
                <Link href="/history" prefetch={true} className="hover:text-[#E31B23] transition-colors flex items-center gap-2">
                  <span className="text-slate-400">•</span>
                  <span>History</span>
                </Link>
              </li>
              <li>
                <Link href="/csr" prefetch={true} className="hover:text-[#E31B23] transition-colors flex items-center gap-2">
                  <span className="text-slate-400">•</span>
                  <span>CSR</span>
                </Link>
              </li>
              <li>
                <Link href="/compliance" prefetch={true} className="hover:text-[#E31B23] transition-colors flex items-center gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Compliance</span>
                </Link>
              </li>
              <li>
                <Link href="/news" prefetch={true} className="hover:text-[#E31B23] transition-colors flex items-center gap-2">
                  <span className="text-slate-400">•</span>
                  <span>News</span>
                </Link>
              </li>
              <li>
                <Link href="/quality" prefetch={true} className="hover:text-[#E31B23] transition-colors flex items-center gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Quality</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: PRODUCT RANGE (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs sm:text-sm font-extrabold tracking-wider text-white uppercase">
              PRODUCT RANGE
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200 font-semibold">
              <li>
                <Link href="/catalog-showcase#cat-01" prefetch={true} className="hover:text-[#E31B23] transition-colors flex items-center gap-2">
                  <span className="text-slate-400">•</span>
                  <span>General Surgery</span>
                </Link>
              </li>
              <li>
                <Link href="/dental-showcase" prefetch={true} className="hover:text-[#E31B23] transition-colors flex items-center gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Dental Instruments</span>
                </Link>
              </li>
              <li>
                <Link href="/catalog-showcase#cat-03" prefetch={true} className="hover:text-[#E31B23] transition-colors flex items-center gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Diagnostics Instruments</span>
                </Link>
              </li>
              <li>
                <Link href="/catalog-showcase#cat-04" prefetch={true} className="hover:text-[#E31B23] transition-colors flex items-center gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Holloware</span>
                </Link>
              </li>
              <li>
                <Link href="/products?category=hospital-furniture" prefetch={true} className="hover:text-[#E31B23] transition-colors flex items-center gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Hospital Furniture</span>
                </Link>
              </li>
              <li>
                <Link href="/catalog-showcase#cat-03" prefetch={true} className="hover:text-[#E31B23] transition-colors flex items-center gap-2">
                  <span className="text-slate-400">•</span>
                  <span>Laparoscopy Instruments</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider 3 */}
        <div className="w-full h-[1px] bg-slate-700/60" />

        {/* Bottom Copyright Bar */}
        <div className="pt-0.5 pb-1 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm font-medium text-slate-400">
          <p>
            © 2026 Durable Hospital Supplies All Rights Reserved
          </p>
          <p className="text-slate-400">
            Designed by <span className="font-bold text-white hover:text-[#E31B23] transition-colors">Brandie Design Agency</span>
          </p>
        </div>

      </div>
    </footer>
  )
}

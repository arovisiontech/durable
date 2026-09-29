'use client'

import { useState, useEffect } from 'react'
import { ContactHeroBanner } from '@/src/components/public/ContactHeroBanner'
import { ContactForm } from '@/src/components/public/ContactForm'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Award,
  Globe,
  PackageCheck,
} from 'lucide-react'

const DEFAULT_INFO = {
  hqTitle: 'Global Manufacturing HQ',
  addressLine1: 'Noal More, Roras Road P.O. Box 919',
  addressLine2: 'Sialkot - 51310 Pakistan.',
  phoneTitle: 'Direct Phone Support',
  phone1: 'Phone : (+92) 52 3563200',
  phone2: 'Phone: (+92) 52 3553777 | (+92) 523252500',
  emailTitle: 'Email Support',
  email: 'Info@Durablehs.Com',
  hoursTitle: 'Business Hours',
  hoursLine1: 'Monday - Saturday: 8:00 AM - 6:00 PM (PKT)',
  hoursLine2: '24/7 Priority Emergency Export Support',
}

const DEFAULT_WHY_FEATURES = [
  {
    title: 'ISO 13485 & CE',
    desc: 'Certified ISO quality standards',
    icon: 'Award',
  },
  {
    title: 'German Steel',
    desc: 'Medical-grade stainless steel',
    icon: 'ShieldCheck',
  },
  {
    title: 'OEM & Private Label',
    desc: 'Custom logo & laser marking',
    icon: 'PackageCheck',
  },
  {
    title: 'Global Shipping',
    desc: 'Express DHL/FedEx logistics',
    icon: 'Globe',
  },
]

export default function ContactPage() {
  const [infoData, setInfoData] = useState(DEFAULT_INFO)
  const [whyFeatures, setWhyFeatures] = useState(DEFAULT_WHY_FEATURES)

  const loadData = () => {
    try {
      const savedInfo = localStorage.getItem('durable_contact_info_data')
      if (savedInfo) setInfoData(JSON.parse(savedInfo))

      const savedWhy = localStorage.getItem('durable_contact_why_data')
      if (savedWhy) setWhyFeatures(JSON.parse(savedWhy))
    } catch (e) {
      console.error('Error loading contact page data:', e)
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
    <div className="w-full bg-white min-h-screen pb-16 space-y-10">
      {/* 1. Hero Header Banner */}
      <ContactHeroBanner />

      {/* 2. Main Container: Form + Headquarters Info */}
      <div className="max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
          
          {/* Left Column: Partnership Inquiry Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <ContactForm />
          </div>

          {/* Right Column: Headquarters & Direct Lines */}
          <div className="lg:col-span-5 space-y-6">
            {/* Office Info Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <h2 className="text-lg sm:text-xl font-black text-[#0B1B3D] pb-3 border-b border-slate-100">
                Headquarters & Direct Lines
              </h2>

              <div className="space-y-5 text-xs">
                {/* Address */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#E31B23] flex items-center justify-center shrink-0 border border-red-100 shadow-2xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 pt-0.5">
                    <h4 className="font-extrabold text-[#0B1B3D] text-sm">{infoData.hqTitle}</h4>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      {infoData.addressLine1} <br />
                      {infoData.addressLine2}
                    </p>
                  </div>
                </div>

                {/* Phone Lines */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#E31B23] flex items-center justify-center shrink-0 border border-red-100 shadow-2xs">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 pt-0.5">
                    <h4 className="font-extrabold text-[#0B1B3D] text-sm">{infoData.phoneTitle}</h4>
                    <p className="text-slate-600 font-medium">{infoData.phone1}</p>
                    {infoData.phone2 && (
                      <p className="text-slate-600 font-medium">{infoData.phone2}</p>
                    )}
                  </div>
                </div>

                {/* Email Support */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#E31B23] flex items-center justify-center shrink-0 border border-red-100 shadow-2xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 pt-0.5">
                    <h4 className="font-extrabold text-[#0B1B3D] text-sm">{infoData.emailTitle}</h4>
                    <a
                      href={`mailto:${infoData.email}`}
                      className="text-slate-700 font-bold hover:text-[#E31B23] transition-colors block"
                    >
                      Email: {infoData.email}
                    </a>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#E31B23] flex items-center justify-center shrink-0 border border-red-100 shadow-2xs">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 pt-0.5">
                    <h4 className="font-extrabold text-[#0B1B3D] text-sm">{infoData.hoursTitle}</h4>
                    <p className="text-slate-600 font-medium">{infoData.hoursLine1}</p>
                    <p className="text-slate-500 font-semibold text-[11px]">
                      {infoData.hoursLine2}
                    </p>
                  </div>
                </div>

                {/* Social Connect Row */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-extrabold text-[#0B1B3D] uppercase tracking-wider block">
                    Connect With Us
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href="#"
                      aria-label="Instagram"
                      className="w-7 h-7 rounded-lg bg-[#0077B5] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <rect x="2" y="2" width="20" height="20" rx="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </a>

                    <a
                      href="#"
                      aria-label="Facebook"
                      className="w-7 h-7 rounded-lg bg-[#1877F2] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </a>

                    <a
                      href="#"
                      aria-label="Twitter"
                      className="w-7 h-7 rounded-lg bg-[#1DA1F2] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                      </svg>
                    </a>

                    <a
                      href="#"
                      aria-label="LinkedIn"
                      className="w-7 h-7 rounded-lg bg-[#0A66C2] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>

                    <a
                      href="#"
                      aria-label="Pinterest"
                      className="w-7 h-7 rounded-lg bg-[#BD081C] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs font-black text-xs"
                    >
                      P
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Advantages Card */}
            <div className="bg-[#0B1B3D] text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E31B23]">
                Why Choose Durable?
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {whyFeatures.map((feat, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 space-y-1">
                    {feat.icon === 'Award' && <Award className="w-4 h-4 text-emerald-400" />}
                    {feat.icon === 'ShieldCheck' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                    {feat.icon === 'PackageCheck' && <PackageCheck className="w-4 h-4 text-emerald-400" />}
                    {feat.icon === 'Globe' && <Globe className="w-4 h-4 text-emerald-400" />}
                    {!['Award', 'ShieldCheck', 'PackageCheck', 'Globe'].includes(feat.icon) && (
                      <Award className="w-4 h-4 text-emerald-400" />
                    )}
                    <h5 className="font-bold">{feat.title}</h5>
                    <p className="text-[10px] text-slate-400 font-medium">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

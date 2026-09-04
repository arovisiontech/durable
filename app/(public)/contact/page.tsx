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

export const metadata = {
  title: 'Partner With Us | Contact Durable Hospital Supplies',
  description:
    'Get in touch with Durable Hospital Supplies for OEM manufacturing, private labeling, bulk hospital procurement, and custom sterile surgical procedure packs.',
}

export default function ContactPage() {
  return (
    <div className="w-full bg-white min-h-screen pb-16 space-y-10">
      {/* 1. Hero Header Banner matching SS 1 layout and SS 2 image */}
      <ContactHeroBanner />

      {/* 2. Main Container: Form + Headquarters Info matching SS 3 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
          
          {/* Left Column: Partnership Inquiry Form matching SS 1 */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-1 pb-4 border-b border-slate-100">
              <h2 className="text-xl sm:text-2xl font-black text-[#0B1B3D]">Send Us an Inquiry</h2>
              <p className="text-xs text-slate-500 font-medium">
                Fill out the form below to receive immediate quotes, technical catalogs, or sample requests.
              </p>
            </div>

            <ContactForm />
          </div>

          {/* Right Column: Headquarters & Direct Lines matching SS 3 */}
          <div className="lg:col-span-5 space-y-6">
            {/* Office Info Card matching SS 3 */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <h2 className="text-lg sm:text-xl font-black text-[#0B1B3D] pb-3 border-b border-slate-100">
                Headquarters & Direct Lines
              </h2>

              <div className="space-y-5 text-xs">
                {/* Address matching SS 3 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#E31B23] flex items-center justify-center shrink-0 border border-red-100 shadow-2xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 pt-0.5">
                    <h4 className="font-extrabold text-[#0B1B3D] text-sm">Global Manufacturing HQ</h4>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      Noal More, Roras Road P.O. Box 919 <br />
                      Sialkot - 51310 Pakistan.
                    </p>
                  </div>
                </div>

                {/* Phone Lines matching SS 3 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#E31B23] flex items-center justify-center shrink-0 border border-red-100 shadow-2xs">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 pt-0.5">
                    <h4 className="font-extrabold text-[#0B1B3D] text-sm">Direct Phone Support</h4>
                    <p className="text-slate-600 font-medium">Phone : (+92) 52 3563200</p>
                    <p className="text-slate-600 font-medium">
                      Phone: (+92) 52 3553777 | (+92) 523252500
                    </p>
                  </div>
                </div>

                {/* Email Support matching SS 3 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#E31B23] flex items-center justify-center shrink-0 border border-red-100 shadow-2xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 pt-0.5">
                    <h4 className="font-extrabold text-[#0B1B3D] text-sm">Email Support</h4>
                    <a
                      href="mailto:Info@Durablehs.Com"
                      className="text-slate-700 font-bold hover:text-[#E31B23] transition-colors block"
                    >
                      Email: Info@Durablehs.Com
                    </a>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#E31B23] flex items-center justify-center shrink-0 border border-red-100 shadow-2xs">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 pt-0.5">
                    <h4 className="font-extrabold text-[#0B1B3D] text-sm">Business Hours</h4>
                    <p className="text-slate-600 font-medium">Monday - Saturday: 8:00 AM - 6:00 PM (PKT)</p>
                    <p className="text-slate-500 font-semibold text-[11px]">
                      24/7 Priority Emergency Export Support
                    </p>
                  </div>
                </div>

                {/* Social Connect Row matching SS 3 */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-extrabold text-[#0B1B3D] uppercase tracking-wider block">
                    Connect With Us
                  </span>
                  <div className="flex items-center gap-2">
                    {/* Instagram */}
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

                    {/* Facebook */}
                    <a
                      href="#"
                      aria-label="Facebook"
                      className="w-7 h-7 rounded-lg bg-[#1877F2] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </a>

                    {/* Twitter */}
                    <a
                      href="#"
                      aria-label="Twitter"
                      className="w-7 h-7 rounded-lg bg-[#1DA1F2] hover:opacity-90 flex items-center justify-center text-white transition-opacity shadow-xs"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                      </svg>
                    </a>

                    {/* LinkedIn */}
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

                    {/* Pinterest */}
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
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 space-y-1">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <h5 className="font-bold">ISO 13485 & CE</h5>
                  <p className="text-[10px] text-slate-400 font-medium">Certified ISO quality standards</p>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 space-y-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h5 className="font-bold">German Steel</h5>
                  <p className="text-[10px] text-slate-400 font-medium">Medical-grade stainless steel</p>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 space-y-1">
                  <PackageCheck className="w-4 h-4 text-emerald-400" />
                  <h5 className="font-bold">OEM & Private Label</h5>
                  <p className="text-[10px] text-slate-400 font-medium">Custom logo & laser marking</p>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 space-y-1">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <h5 className="font-bold">Global Shipping</h5>
                  <p className="text-[10px] text-slate-400 font-medium">Express DHL/FedEx logistics</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

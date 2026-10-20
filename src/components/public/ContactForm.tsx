'use client'

import { useState, useEffect, useTransition } from 'react'
import { submitContactMessageAction } from '@/app/actions/public'
import { Send, CheckCircle2, AlertCircle, Loader2, MapPin, ExternalLink } from 'lucide-react'

const DEFAULT_FORM_SETTINGS = {
  title: 'Send Us an Inquiry',
  subtitle: 'Fill out the form below to receive immediate quotes, technical catalogs, or sample requests.',
  submitButtonText: 'Send Partnership Inquiry',
  inquiryOptions: [
    'Partnership Inquiry',
    'OEM Manufacturing & Custom Instruments',
    'Private Labeling Services',
    'Bulk Hospital Procurement',
    'Become an International Distributor',
    'General Inquiry',
  ],
}

export function ContactForm() {
  const [formSettings, setFormSettings] = useState(DEFAULT_FORM_SETTINGS)
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Partnership Inquiry',
    message: '',
  })

  const loadData = () => {
    try {
      const saved = localStorage.getItem('durable_contact_form_data')
      if (saved) setFormSettings(JSON.parse(saved))
    } catch (e) {
      console.error('Error loading contact form settings:', e)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)

    startTransition(async () => {
      const res = await submitContactMessageAction(formData)
      setStatus(res)
      if (res.success) {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: formSettings.inquiryOptions[0] || 'Partnership Inquiry',
          message: '',
        })
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 pb-4 border-b border-slate-100">
        <h2 className="text-xl sm:text-2xl font-black text-[#0B1B3D]">{formSettings.title}</h2>
        <p className="text-xs text-slate-500 font-medium">
          {formSettings.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {status && (
          <div
            className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-3 ${
              status.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {status.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{status.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Full Name *</label>
            <input
              type="text"
              required
              placeholder="Dr. John Doe / Jane Smith"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-slate-900 font-medium"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Work Email *</label>
            <input
              type="email"
              required
              placeholder="john@hospital.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-slate-900 font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Phone / WhatsApp */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Phone / WhatsApp</label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-slate-900 font-medium"
            />
          </div>

          {/* Inquiry Type / Subject */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Inquiry Type</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-slate-900 font-medium cursor-pointer"
            >
              {(formSettings.inquiryOptions || DEFAULT_FORM_SETTINGS.inquiryOptions).map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Message / Instrument Requirements *</label>
          <textarea
            required
            rows={4}
            placeholder="Please describe your required instruments, estimated quantities, or custom manufacturing specs..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full text-xs p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 text-slate-900 font-medium resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 px-6 text-xs font-extrabold text-white bg-[#E31B23] hover:bg-[#c9141b] rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sending Inquiry...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{formSettings.submitButtonText || 'Send Partnership Inquiry'}</span>
            </>
          )}
        </button>
      </form>

      {/* Interactive Factory Location Map Section (Directly under Send Inquiry button - SS 2) */}
      <div className="pt-6 border-t border-slate-100 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600/15 border border-[#E31B23] flex items-center justify-center text-[#E31B23] shrink-0 shadow-[0_0_12px_rgba(227,27,35,0.3)]">
              <MapPin className="w-4 h-4 fill-[#E31B23] text-[#E31B23]" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#0B1B3D] uppercase tracking-wider flex items-center gap-2">
                <span>Manufacturing HQ & Export Facility</span>
                <span className="text-[10px] font-bold text-[#E31B23] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  SIALKOT, PAKISTAN
                </span>
              </h4>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                Noal More, Roras Road P.O. Box 919 Sialkot - 51310 Pakistan.
              </p>
            </div>
          </div>

          <a
            href="https://maps.app.goo.gl/RGr1xeaZjtdHgCpX8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E31B23] hover:bg-red-700 text-white text-[11px] font-black uppercase tracking-wider rounded-xl shadow-xs transition-colors shrink-0 group self-start sm:self-auto"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Embedded Interactive Map with Red Point Pin Highlight */}
        <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-200 shadow-xs relative bg-slate-100">
          <iframe
            title="Durable Hospital Supplies Google Maps Location"
            src="https://maps.google.com/maps?q=32.502844,74.520444+(Durable+Hospital+Supplies)&t=&z=15&ie=UTF8&iwloc=B&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
          />
          {/* Main Location Red Pin Indicator Overlay */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl px-3 py-1.5 shadow-md flex items-center gap-2 pointer-events-none">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E31B23] animate-ping" />
            <span className="text-[11px] font-black text-[#0B1B3D]">DURABLE HOSPITAL SUPPLIES MAIN HQ</span>
          </div>
        </div>
      </div>
    </div>
  )
}

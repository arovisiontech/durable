'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Mail,
  Phone,
  Globe,
  Share2,
  Layout,
  Layers,
  ArrowLeft,
  RotateCcw,
} from 'lucide-react'
import { PublicFooterData, FooterLinkItem } from '@/src/types/public'
import { DEFAULT_FOOTER_DATA } from '@/src/data/defaultFooterData'
import { savePersistentData, loadPersistentData } from '@/src/lib/persistentStorage'
import { saveFooterAction } from '@/app/admin/actions/footer'

export default function AdminFooterPage() {
  const [data, setData] = useState<PublicFooterData>(DEFAULT_FOOTER_DATA)
  const [isSaved, setIsSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'location' | 'links' | 'banner' | 'socials' | 'copyright'>('location')

  useEffect(() => {
    loadPersistentData<PublicFooterData>(
      'durable_footer_data',
      DEFAULT_FOOTER_DATA,
      (loaded) => {
        if (loaded) {
          const cleanSocials = {
            ...DEFAULT_FOOTER_DATA.socials,
            ...(loaded.socials || {}),
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

          setData({
            ...DEFAULT_FOOTER_DATA,
            ...loaded,
            email: loaded.email?.toLowerCase() || DEFAULT_FOOTER_DATA.email,
            mapUrl: loaded.mapUrl || DEFAULT_FOOTER_DATA.mapUrl,
            socials: cleanSocials,
          })
        }
      }
    )
  }, [])

  const handleSave = () => {
    const cleanData: PublicFooterData = {
      ...data,
      email: data.email.trim().toLowerCase(),
      mapUrl: data.mapUrl.trim() || 'https://maps.app.goo.gl/RGr1xeaZjtdHgCpX8',
      socials: {
        ...DEFAULT_FOOTER_DATA.socials,
        ...data.socials,
      },
    }

    setData(cleanData)
    savePersistentData('durable_footer_data', cleanData)
    saveFooterAction(cleanData).catch(() => {})
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  const handleReset = () => {
    if (confirm('Reset footer settings to standard default values?')) {
      setData(DEFAULT_FOOTER_DATA)
      savePersistentData('durable_footer_data', DEFAULT_FOOTER_DATA)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    }
  }

  // Quick Links Helpers
  const addQuickLink = () => {
    setData((prev) => ({
      ...prev,
      quickLinks: [...prev.quickLinks, { label: 'New Link', href: '/' }],
    }))
  }

  const updateQuickLink = (index: number, field: keyof FooterLinkItem, val: string) => {
    setData((prev) => {
      const updated = [...prev.quickLinks]
      updated[index] = { ...updated[index], [field]: val }
      return { ...prev, quickLinks: updated }
    })
  }

  const removeQuickLink = (index: number) => {
    setData((prev) => ({
      ...prev,
      quickLinks: prev.quickLinks.filter((_, i) => i !== index),
    }))
  }

  // Product Range Links Helpers
  const addProductRangeLink = () => {
    setData((prev) => ({
      ...prev,
      productRangeLinks: [
        ...prev.productRangeLinks,
        { label: 'New Category', href: '/category/general-surgery', isHighlight: false },
      ],
    }))
  }

  const updateProductRangeLink = (index: number, field: keyof FooterLinkItem, val: any) => {
    setData((prev) => {
      const updated = [...prev.productRangeLinks]
      updated[index] = { ...updated[index], [field]: val }
      return { ...prev, productRangeLinks: updated }
    })
  }

  const removeProductRangeLink = (index: number) => {
    setData((prev) => ({
      ...prev,
      productRangeLinks: prev.productRangeLinks.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 pb-24 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin"
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-extrabold text-[#E31B23] uppercase tracking-wider">
              Footer & Locations
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-[#E31B23]" />
            <span>Footer & Location Settings</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Control the footer location point, Google Maps link, email, phone numbers, quick links, and product range dynamically.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            title="Reset to Default Values"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Website</span>
          </Link>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#E31B23] hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-extrabold text-sm">Footer Settings Saved Successfully!</p>
            <p className="text-xs text-emerald-700">
              Your updates are now live on the public footer across all devices and browsers.
            </p>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 [scrollbar-width:none]">
        <button
          type="button"
          onClick={() => setActiveTab('location')}
          className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'location'
              ? 'bg-[#0B1B3D] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-[#E31B23]" />
          <span>Location, Map & Contacts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('links')}
          className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'links'
              ? 'bg-[#0B1B3D] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>Quick Links & Product Range</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('banner')}
          className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'banner'
              ? 'bg-[#0B1B3D] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layout className="w-3.5 h-3.5 text-amber-400" />
          <span>Top CTA Banner & Newsletter</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('socials')}
          className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'socials'
              ? 'bg-[#0B1B3D] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Share2 className="w-3.5 h-3.5 text-purple-400" />
          <span>Social Media Links</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('copyright')}
          className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'copyright'
              ? 'bg-[#0B1B3D] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>Copyright & Agency Credit</span>
        </button>
      </div>

      {/* Tab 1: Location & Google Maps */}
      {activeTab === 'location' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#E31B23]" />
                <span>Location Address & Interactive Google Map</span>
              </h2>
              <span className="text-xs px-2.5 py-1 bg-red-50 text-[#E31B23] border border-red-200 rounded-full font-bold">
                SS 3 & User Location Specs
              </span>
            </div>

            {/* Live Visual Map Pin Preview */}
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-red-600/20 border border-[#E31B23] flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(227,27,35,0.5)]">
                  <MapPin className="w-4 h-4 text-[#E31B23]" fill="#E31B23" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold tracking-widest text-[#E31B23] uppercase">
                    Red Map Point Pin Preview
                  </span>
                  <p className="font-bold text-sm text-white">{data.addressLine1}</p>
                  <p className="text-xs text-slate-400">{data.addressLine2}</p>
                </div>
              </div>

              <a
                href={data.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#E31B23] hover:bg-red-700 text-white text-xs font-extrabold rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>Test Google Map Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Location Section Heading
                </label>
                <input
                  type="text"
                  value={data.locationTitle}
                  onChange={(e) => setData({ ...data, locationTitle: e.target.value })}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none"
                  placeholder="OUR LOCATIONS"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Google Maps URL (Direct Link to Location)
                </label>
                <input
                  type="url"
                  value={data.mapUrl}
                  onChange={(e) => setData({ ...data, mapUrl: e.target.value })}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none text-slate-800 font-mono text-xs"
                  placeholder="https://maps.app.goo.gl/RGr1xeaZjtdHgCpX8"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Clicking the footer address opens this Google Maps link in a new tab.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Address Line 1 (Street & P.O. Box)
                </label>
                <input
                  type="text"
                  value={data.addressLine1}
                  onChange={(e) => setData({ ...data, addressLine1: e.target.value })}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none"
                  placeholder="Noal More, Roras Road P.O. Box 919"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Address Line 2 (City, Postal Code & Country)
                </label>
                <input
                  type="text"
                  value={data.addressLine2}
                  onChange={(e) => setData({ ...data, addressLine2: e.target.value })}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none"
                  placeholder="Sialkot - 51310 Pakistan."
                />
              </div>
            </div>

            {/* Contact details */}
            <div className="border-t border-slate-100 pt-4 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-600" />
                <span>Phone Numbers & Email Support</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Primary Phone
                  </label>
                  <input
                    type="text"
                    value={data.phone1}
                    onChange={(e) => setData({ ...data, phone1: e.target.value })}
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none"
                    placeholder="(+92) 52 3563200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Secondary Phone Numbers
                  </label>
                  <input
                    type="text"
                    value={data.phone2}
                    onChange={(e) => setData({ ...data, phone2: e.target.value })}
                    className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none"
                    placeholder="(+92) 52 3553777 | (+92) 523252500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center justify-between">
                    <span>Email Address (Must be lowercase)</span>
                    <span className="text-[10px] text-[#E31B23] font-black lowercase">
                      {data.email.toLowerCase()}
                    </span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={data.email}
                      onChange={(e) => setData({ ...data, email: e.target.value.toLowerCase() })}
                      className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none lowercase"
                      placeholder="info@durablehs.com"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Quick Links & Product Range */}
      {activeTab === 'links' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Links Column */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Quick Links (Column 2)</h2>
                <p className="text-xs text-slate-500">Navigation links shown in the middle footer column</p>
              </div>
              <button
                type="button"
                onClick={addQuickLink}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Link</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Column Title
              </label>
              <input
                type="text"
                value={data.quickLinksTitle}
                onChange={(e) => setData({ ...data, quickLinksTitle: e.target.value })}
                className="w-full text-sm px-4 py-2 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none"
                placeholder="QUICK LINKS"
              />
            </div>

            <div className="space-y-2.5 pt-2 max-h-[460px] overflow-y-auto pr-1">
              {data.quickLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <span className="text-xs font-black text-slate-400 w-5 text-center">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => updateQuickLink(idx, 'label', e.target.value)}
                    className="w-1/2 text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-500 font-semibold"
                    placeholder="Link Label"
                  />
                  <input
                    type="text"
                    value={link.href}
                    onChange={(e) => updateQuickLink(idx, 'href', e.target.value)}
                    className="w-1/2 text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-500 font-mono text-[11px]"
                    placeholder="/path"
                  />
                  <button
                    type="button"
                    onClick={() => removeQuickLink(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Product Range Column */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Product Range (Column 3)</h2>
                <p className="text-xs text-slate-500">Categories and products list on the right column</p>
              </div>
              <button
                type="button"
                onClick={addProductRangeLink}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Column Title
              </label>
              <input
                type="text"
                value={data.productRangeTitle}
                onChange={(e) => setData({ ...data, productRangeTitle: e.target.value })}
                className="w-full text-sm px-4 py-2 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none"
                placeholder="PRODUCT RANGE"
              />
            </div>

            <div className="space-y-2.5 pt-2 max-h-[460px] overflow-y-auto pr-1">
              {data.productRangeLinks.map((link, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border ${
                    link.isHighlight
                      ? 'bg-red-50/70 border-red-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="text-xs font-black text-slate-400 w-5 text-center">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => updateProductRangeLink(idx, 'label', e.target.value)}
                    className="w-2/5 text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-500 font-semibold"
                    placeholder="Category Name"
                  />
                  <input
                    type="text"
                    value={link.href}
                    onChange={(e) => updateProductRangeLink(idx, 'href', e.target.value)}
                    className="w-2/5 text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-500 font-mono text-[11px]"
                    placeholder="/category/slug"
                  />
                  <label
                    className="flex items-center gap-1 text-[11px] font-bold text-red-600 shrink-0 cursor-pointer select-none"
                    title="Highlight in Red (like Laparoscopy & Single Use in SS 3)"
                  >
                    <input
                      type="checkbox"
                      checked={!!link.isHighlight}
                      onChange={(e) => updateProductRangeLink(idx, 'isHighlight', e.target.checked)}
                      className="accent-[#E31B23] w-3.5 h-3.5 rounded"
                    />
                    <span>Red</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeProductRangeLink(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Top CTA Banner & Newsletter */}
      {activeTab === 'banner' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900">
              Top Call-To-Action Banner & Newsletter
            </h2>
            <p className="text-xs text-slate-500">
              The high-impact banner and newsletter form sitting directly on top of the footer columns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Banner Tagline / Pre-Title
              </label>
              <input
                type="text"
                value={data.bannerSubtitle}
                onChange={(e) => setData({ ...data, bannerSubtitle: e.target.value })}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none"
                placeholder="BUILDING YOUR VISION"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Banner Main Headline
              </label>
              <input
                type="text"
                value={data.bannerTitle}
                onChange={(e) => setData({ ...data, bannerTitle: e.target.value })}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none"
                placeholder="LET'S BUILD SOMETHING AMAZING."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Banner Button Text
              </label>
              <input
                type="text"
                value={data.bannerButtonText}
                onChange={(e) => setData({ ...data, bannerButtonText: e.target.value })}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none"
                placeholder="LET'S DISCUSS"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Banner Button Link
              </label>
              <input
                type="text"
                value={data.bannerButtonLink}
                onChange={(e) => setData({ ...data, bannerButtonLink: e.target.value })}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none"
                placeholder="/contact"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              Newsletter Section
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Newsletter Title
                </label>
                <input
                  type="text"
                  value={data.newsletterTitle}
                  onChange={(e) => setData({ ...data, newsletterTitle: e.target.value })}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none"
                  placeholder="SIGN UP FOR NEWSLETTER"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Input Placeholder Text
                </label>
                <input
                  type="text"
                  value={data.newsletterPlaceholder}
                  onChange={(e) => setData({ ...data, newsletterPlaceholder: e.target.value })}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none"
                  placeholder="your email....."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Subscribe Button Label
                </label>
                <input
                  type="text"
                  value={data.newsletterButtonText}
                  onChange={(e) => setData({ ...data, newsletterButtonText: e.target.value })}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none"
                  placeholder="SUBSCRIBE"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Social Media Links */}
      {activeTab === 'socials' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900">
              Social Media Channels & Icons
            </h2>
            <p className="text-xs text-slate-500">
              Set links for company social media icons appearing in Column 1 below contact details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                value={data.socials?.instagram || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    socials: { ...data.socials, instagram: e.target.value },
                  })
                }
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none font-mono text-xs"
                placeholder="https://www.instagram.com/durablehospitalsupplies/"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Facebook URL
              </label>
              <input
                type="url"
                value={data.socials?.facebook || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    socials: { ...data.socials, facebook: e.target.value },
                  })
                }
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none font-mono text-xs"
                placeholder="https://www.facebook.com/p/Durable-Hospital-Supplies-100063835312521/"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Twitter / X URL
              </label>
              <input
                type="url"
                value={data.socials?.twitter || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    socials: { ...data.socials, twitter: e.target.value },
                  })
                }
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none font-mono text-xs"
                placeholder="https://twitter.com/durable"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={data.socials?.linkedin || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    socials: { ...data.socials, linkedin: e.target.value },
                  })
                }
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none font-mono text-xs"
                placeholder="https://pk.linkedin.com/company/durablehospitalsupplies?trk=public_post_feed-actor-name"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Pinterest URL
              </label>
              <input
                type="url"
                value={data.socials?.pinterest || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    socials: { ...data.socials, pinterest: e.target.value },
                  })
                }
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none font-mono text-xs"
                placeholder="https://pinterest.com/durable"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Copyright & Agency Credit */}
      {activeTab === 'copyright' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900">
              Bottom Copyright Bar & Branding
            </h2>
            <p className="text-xs text-slate-500">
              Configure the bottom copyright line, agency attribution, and logo graphic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Copyright Text
              </label>
              <input
                type="text"
                value={data.copyrightText}
                onChange={(e) => setData({ ...data, copyrightText: e.target.value })}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none"
                placeholder="© 2026 Durable Hospital Supplies All Rights Reserved"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Footer Logo File Path
              </label>
              <input
                type="text"
                value={data.logoUrl}
                onChange={(e) => setData({ ...data, logoUrl: e.target.value })}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none font-mono text-xs"
                placeholder="/logo.svg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Design Agency Credit Name
              </label>
              <input
                type="text"
                value={data.designedByText}
                onChange={(e) => setData({ ...data, designedByText: e.target.value })}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none"
                placeholder="Brandie Design Agency"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Design Agency Link
              </label>
              <input
                type="text"
                value={data.designedByLink}
                onChange={(e) => setData({ ...data, designedByLink: e.target.value })}
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:outline-none font-mono text-xs"
                placeholder="#"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

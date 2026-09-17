'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Save,
  CheckCircle2,
  Image as ImageIcon,
  Layout,
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  X,
  Check,
} from 'lucide-react'

export interface AdminHeroSlide {
  id: string
  title: string
  subtitle: string
  description: string
  image_url: string
  button_text: string
  button_link: string
  secondary_button_text: string
  secondary_button_link: string
  is_published: boolean
}

const PRESET_HERO_IMAGES = [
  { name: 'Surgical Hero Main', url: '/images/surgical-hero.png' },
  { name: 'Dental Clinic Banner', url: '/images/dental-clinic-banner.png' },
  { name: 'Precision Healthcare Banner', url: '/images/precision-healthcare-banner.png' },
  { name: 'Products Showcase Banner', url: '/images/products-hero-banner.png' },
  { name: 'Company Stats Banner', url: '/images/company-stats-banner.png' },
  { name: 'Surgical Instruments Tray', url: '/images/about-surgical-instruments.png' },
]

export default function AdminContentHomePage() {
  const [isSaved, setIsSaved] = useState(false)
  const [saveMessage, setSaveMessage] = useState('Home Page content & Hero slides updated successfully!')

  // Initial Hero Slides list
  const [heroSlides, setHeroSlides] = useState<AdminHeroSlide[]>([
    {
      id: 'slide-1',
      title: 'EVERY 5 SECONDS, WE MAKE A DIFFERENCE',
      subtitle: 'SINCE 1973 • PRECISION SURGICAL MANUFACTURING',
      description:
        'Durable Hospital Supplies is a trusted global partner for healthcare brands seeking reliable, high-quality surgical manufacturing solutions.',
      image_url: '/images/surgical-hero.png',
      button_text: 'Partner With Us',
      button_link: '/contact',
      secondary_button_text: 'Explore Products',
      secondary_button_link: '/products',
      is_published: true,
    },
    {
      id: 'slide-2',
      title: 'WORLD-CLASS DENTAL & SURGICAL INSTRUMENTS',
      subtitle: 'ISO 13485 CERTIFIED • DENTAL & SURGICAL EXCELLENCE',
      description: 'Engineered for precision surgeons and dental professionals worldwide.',
      image_url: '/images/dental-clinic-banner.png',
      button_text: 'Dental Catalogues',
      button_link: '/catalogues',
      secondary_button_text: 'Contact Sales',
      secondary_button_link: '/contact',
      is_published: true,
    },
    {
      id: 'slide-3',
      title: 'PRECISION SOLUTIONS. TRUSTED QUALITY. BETTER HEALTHCARE.',
      subtitle: 'GLOBAL OEM & PRIVATE LABEL SURGICAL SOLUTIONS',
      description: 'Custom surgical instrument manufacturing for global healthcare brands.',
      image_url: '/images/precision-healthcare-banner.png',
      button_text: 'OEM Services',
      button_link: '/partner-with-us',
      secondary_button_text: 'Our Quality',
      secondary_button_link: '/quality',
      is_published: true,
    },
    {
      id: 'slide-4',
      title: 'COMPREHENSIVE SURGICAL INSTRUMENTATION',
      subtitle: '10,000+ PRECISION SKUS MANUFACTURED IN SIALKOT',
      description:
        'Explore full range technical instrument catalogues featuring sizing dimensions and SKUs.',
      image_url: '/images/products-hero-banner.png',
      button_text: 'Explore Products',
      button_link: '/products',
      secondary_button_text: 'Download PDF',
      secondary_button_link: '/catalogues',
      is_published: true,
    },
  ])

  // Form Modal for Adding or Editing Slide
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null)
  const [slideForm, setSlideForm] = useState<Omit<AdminHeroSlide, 'id'>>({
    title: '',
    subtitle: '',
    description: '',
    image_url: '/images/surgical-hero.png',
    button_text: 'Partner With Us',
    button_link: '/contact',
    secondary_button_text: 'Explore Products',
    secondary_button_link: '/products',
    is_published: true,
  })

  // Preset Image Picker Modal
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false)
  const [activeImagePickerTarget, setActiveImagePickerTarget] = useState<'slideForm' | string>('slideForm')

  // General Page Content Settings
  const [formData, setFormData] = useState({
    catSectionTitle: 'EXPLORE OUR TECHNICAL CATALOGUES',
    catSectionHighlight: 'TECHNICAL CATALOGUES',
    catSectionDesc:
      'Full range product catalogues featuring technical instrument specifications, sizing dimensions, tungsten carbide inserts, and ordering SKUs.',
    ctaPrimaryText: 'Partner With Us',
    ctaPrimaryUrl: '/contact',
    ctaSecondaryText: 'Explore Products',
    ctaSecondaryUrl: '/products',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // Handle Add New Slide
  const handleOpenAddModal = () => {
    setEditingSlideId(null)
    setSlideForm({
      title: 'PRECISION SURGICAL MANUFACTURING',
      subtitle: 'ISO 13485 CERTIFIED • GLOBAL DISTRIBUTION',
      description: 'High-quality medical & surgical instrumentation engineered for excellence.',
      image_url: '/images/surgical-hero.png',
      button_text: 'Partner With Us',
      button_link: '/contact',
      secondary_button_text: 'Explore Products',
      secondary_button_link: '/products',
      is_published: true,
    })
    setIsModalOpen(true)
  }

  // Handle Edit Slide
  const handleOpenEditModal = (slide: AdminHeroSlide) => {
    setEditingSlideId(slide.id)
    setSlideForm({
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description,
      image_url: slide.image_url,
      button_text: slide.button_text,
      button_link: slide.button_link,
      secondary_button_text: slide.secondary_button_text,
      secondary_button_link: slide.secondary_button_link,
      is_published: slide.is_published,
    })
    setIsModalOpen(true)
  }

  // Handle Delete Slide
  const handleDeleteSlide = (id: string) => {
    if (heroSlides.length <= 1) {
      alert('You must keep at least 1 hero banner slide.')
      return
    }
    if (confirm('Are you sure you want to remove this hero section image slide?')) {
      setHeroSlides((prev) => prev.filter((s) => s.id !== id))
      triggerSavedNotification('Hero image slide deleted successfully!')
    }
  }

  // Handle Save Slide Form
  const handleSaveSlideForm = (e: React.FormEvent) => {
    e.preventDefault()

    if (!slideForm.image_url.trim()) {
      alert('Please provide a Hero Image URL.')
      return
    }

    if (editingSlideId) {
      // Update existing slide
      setHeroSlides((prev) =>
        prev.map((s) => (s.id === editingSlideId ? { ...slideForm, id: editingSlideId } : s))
      )
      triggerSavedNotification('Hero image slide updated successfully!')
    } else {
      // Add new slide
      const newSlide: AdminHeroSlide = {
        ...slideForm,
        id: `slide-${Date.now()}`,
      }
      setHeroSlides((prev) => [...prev, newSlide])
      triggerSavedNotification('New hero image slide added successfully!')
    }

    setIsModalOpen(false)
  }

  // Handle Move Slide Up/Down
  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= heroSlides.length) return

    const updated = [...heroSlides]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp
    setHeroSlides(updated)
    triggerSavedNotification('Hero slides re-ordered!')
  }

  // Handle Toggle Published
  const handleTogglePublish = (id: string) => {
    setHeroSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_published: !s.is_published } : s))
    )
  }

  // Quick Change Image for Slide directly
  const handleQuickSelectImage = (imageUrl: string) => {
    if (activeImagePickerTarget === 'slideForm') {
      setSlideForm((prev) => ({ ...prev, image_url: imageUrl }))
    } else {
      // Direct slide edit target
      setHeroSlides((prev) =>
        prev.map((s) => (s.id === activeImagePickerTarget ? { ...s, image_url: imageUrl } : s))
      )
    }
    setIsImagePickerOpen(false)
  }

  const triggerSavedNotification = (msg: string) => {
    setSaveMessage(msg)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 4000)
  }

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault()
    triggerSavedNotification('All Home Page content & Hero section images saved live!')
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span>Website Content</span>
            <span>•</span>
            <span className="text-[#E31B23]">Home Page Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3D] tracking-tight">
            Home Page Content & Hero Images Manager
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Add, update, change, reorder, and remove hero section banner images and dynamic slider content.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <button
            onClick={handleSaveAll}
            className="px-5 py-2.5 text-xs font-extrabold text-white bg-[#E31B23] hover:bg-red-700 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold shadow-xs animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* SECTION 1: HERO SECTION IMAGES & SLIDER MANAGER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#0B1B3D]">1. Hero Section Banner Images & Slider</h2>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-red-100 text-[#E31B23] rounded-full">
                  {heroSlides.length} Images Configured
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Manage hero carousel images. Add new slides, change image URLs, update captions, or delete slides.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-[#0B1B3D] hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Hero Image</span>
          </button>
        </div>

        {/* Hero Image Slides Grid / List */}
        <div className="space-y-4">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                slide.is_published ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-100/50 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left Thumbnail & Info */}
                <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                  <div className="relative w-28 sm:w-36 h-20 rounded-xl overflow-hidden bg-slate-950 border border-slate-300 shrink-0 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.image_url}
                      alt={slide.title}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveImagePickerTarget(slide.id)
                          setIsImagePickerOpen(true)
                        }}
                        className="px-2 py-1 bg-white/90 text-slate-900 text-[10px] font-bold rounded shadow"
                      >
                        Change Image
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-black rounded-md uppercase">
                        Slide {index + 1}
                      </span>
                      {slide.subtitle && (
                        <span className="text-[10px] font-extrabold text-[#E31B23] truncate">
                          {slide.subtitle}
                        </span>
                      )}
                      {!slide.is_published && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                          Draft / Hidden
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs sm:text-sm font-black text-[#0B1B3D] truncate">
                      {slide.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate">{slide.image_url}</p>
                  </div>
                </div>

                {/* Right Action Controls */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200">
                  {/* Move Up */}
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveSlide(index, 'up')}
                    className="p-2 bg-white text-slate-700 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs disabled:opacity-30"
                    title="Move Up"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down */}
                  <button
                    type="button"
                    disabled={index === heroSlides.length - 1}
                    onClick={() => handleMoveSlide(index, 'down')}
                    className="p-2 bg-white text-slate-700 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs disabled:opacity-30"
                    title="Move Down"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Toggle Visibility */}
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(slide.id)}
                    className={`p-2 rounded-lg border text-xs ${
                      slide.is_published
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                    }`}
                    title={slide.is_published ? 'Hide Slide' : 'Show Slide'}
                  >
                    {slide.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  {/* Edit Slide */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(slide)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  {/* Delete Slide */}
                  <button
                    type="button"
                    onClick={() => handleDeleteSlide(slide.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg transition-colors"
                    title="Delete Hero Image Slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: ADDITIONAL HOMEPAGE CONTENT SETTINGS */}
      <form onSubmit={handleSaveAll} className="space-y-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0B1B3D]">2. Technical Catalogues & Call-To-Action Settings</h2>
              <p className="text-xs text-slate-500">Configure global section headers, badges, and default action buttons.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Catalogue Section Header Title
              </label>
              <input
                type="text"
                name="catSectionTitle"
                value={formData.catSectionTitle}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Badge Highlight Sub-Text
              </label>
              <input
                type="text"
                name="catSectionHighlight"
                value={formData.catSectionHighlight}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Catalogue Section Description
              </label>
              <textarea
                name="catSectionDesc"
                rows={2}
                value={formData.catSectionDesc}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Primary Button Label
              </label>
              <input
                type="text"
                name="ctaPrimaryText"
                value={formData.ctaPrimaryText}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#E31B23]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Primary Button Target URL
              </label>
              <input
                type="text"
                name="ctaPrimaryUrl"
                value={formData.ctaPrimaryUrl}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#E31B23]"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="submit"
            className="px-8 py-3.5 bg-[#E31B23] hover:bg-red-700 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save All Home Content Changes</span>
          </button>
        </div>
      </form>

      {/* MODAL: ADD / EDIT HERO SLIDE IMAGE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E31B23] text-white flex items-center justify-center font-bold">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0B1B3D]">
                    {editingSlideId ? 'Edit Hero Banner Image & Slide' : 'Add New Hero Banner Image'}
                  </h3>
                  <p className="text-xs text-slate-500">Configure hero background image URL, title, and button targets.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlideForm} className="space-y-5">
              {/* Image URL & Quick Select */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                  <span>Hero Background Image URL</span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveImagePickerTarget('slideForm')
                      setIsImagePickerOpen(true)
                    }}
                    className="text-[11px] text-[#E31B23] font-bold hover:underline"
                  >
                    Select from Preset Banners
                  </button>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={slideForm.image_url}
                    onChange={(e) => setSlideForm({ ...slideForm, image_url: e.target.value })}
                    placeholder="/images/surgical-hero.png"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#E31B23]"
                  />
                </div>
              </div>

              {/* Image Live Preview */}
              {slideForm.image_url && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Image Preview</span>
                  <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-950 border border-slate-300 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slideForm.image_url}
                      alt="Hero Image Preview"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>
              )}

              {/* Slide Title */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Main Hero Title
                </label>
                <input
                  type="text"
                  required
                  value={slideForm.title}
                  onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                  placeholder="EVERY 5 SECONDS, WE MAKE A DIFFERENCE"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#E31B23]"
                />
              </div>

              {/* Subtitle / Badge */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Hero Badge Tagline / Subtitle
                </label>
                <input
                  type="text"
                  value={slideForm.subtitle}
                  onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                  placeholder="SINCE 1973 • PRECISION SURGICAL MANUFACTURING"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#E31B23]"
                />
              </div>

              {/* Buttons Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={slideForm.button_text}
                    onChange={(e) => setSlideForm({ ...slideForm, button_text: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Primary Button Link
                  </label>
                  <input
                    type="text"
                    value={slideForm.button_link}
                    onChange={(e) => setSlideForm({ ...slideForm, button_link: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Secondary Button Text
                  </label>
                  <input
                    type="text"
                    value={slideForm.secondary_button_text}
                    onChange={(e) => setSlideForm({ ...slideForm, secondary_button_text: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Secondary Button Link
                  </label>
                  <input
                    type="text"
                    value={slideForm.secondary_button_link}
                    onChange={(e) => setSlideForm({ ...slideForm, secondary_button_link: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#E31B23] hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingSlideId ? 'Update Hero Image Slide' : 'Save New Hero Image Slide'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PRESET HERO IMAGE PICKER */}
      {isImagePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-[#0B1B3D]">Select Hero Banner Image</h3>
                <p className="text-xs text-slate-500">Choose from pre-loaded surgical & dental banner artwork.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsImagePickerOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1">
              {PRESET_HERO_IMAGES.map((item) => (
                <button
                  key={item.url}
                  type="button"
                  onClick={() => handleQuickSelectImage(item.url)}
                  className="group flex flex-col bg-slate-50 border border-slate-200 hover:border-[#E31B23] rounded-2xl overflow-hidden transition-all text-left hover:shadow-lg"
                >
                  <div className="w-full h-28 bg-slate-950 relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-3 bg-white space-y-0.5">
                    <span className="text-xs font-extrabold text-[#0B1B3D] block truncate">{item.name}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{item.url}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

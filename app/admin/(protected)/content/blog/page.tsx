'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Newspaper,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  ArrowLeft,
  Upload,
  Search,
  ExternalLink,
} from 'lucide-react'
import { BLOGS_DATA, BlogItem } from '@/src/data/blogsData'

const DEFAULT_HERO = {
  categoryBadge: 'OUR BLOG & INSIGHTS',
  title: 'INSIGHTS FROM OUR LATEST BLOGS',
  subtitle:
    'Stay updated with the latest trends, technological innovations, international compliance standards, and expert insights in surgical & dental instrument manufacturing.',
  bgImage: '/images/products-hero-banner.png',
}

const DEFAULT_HEADER = {
  line1: 'Insights From Our',
  line2: 'Latest Blogs',
  subtitle:
    'Stay Updated With The Latest Trends, Innovations, And Expert Insights In The Manufacturing And Industrial Sectors',
}

export default function AdminBlogContentPage() {
  const [heroData, setHeroData] = useState(DEFAULT_HERO)
  const [headerData, setHeaderData] = useState(DEFAULT_HEADER)
  const [blogsList, setBlogsList] = useState<BlogItem[]>(BLOGS_DATA)

  const [searchTerm, setSearchTerm] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedHero = localStorage.getItem('durable_blog_hero_data')
      if (savedHero) setHeroData(JSON.parse(savedHero))

      const savedHeader = localStorage.getItem('durable_blog_section_header')
      if (savedHeader) setHeaderData(JSON.parse(savedHeader))

      const savedBlogs = localStorage.getItem('durable_blogs_list')
      if (savedBlogs) setBlogsList(JSON.parse(savedBlogs))
    } catch (e) {
      console.error('Error reading blog content from localStorage:', e)
    }
  }, [])

  // Save changes handler
  const handleSaveAll = () => {
    try {
      localStorage.setItem('durable_blog_hero_data', JSON.stringify(heroData))
      localStorage.setItem('durable_blog_section_header', JSON.stringify(headerData))
      localStorage.setItem('durable_blogs_list', JSON.stringify(blogsList))

      // Trigger custom window event so open website tabs update live
      window.dispatchEvent(new Event('durable_content_updated'))

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 4000)
    } catch (e) {
      console.error('Error saving blog content:', e)
      alert('Failed to save changes. Please try again.')
    }
  }

  // File upload helper
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setter(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // CRUD Helpers for Blog Items
  const updateBlogItem = (index: number, field: string, value: any) => {
    const updated = [...blogsList]
    updated[index] = { ...updated[index], [field]: value }
    setBlogsList(updated)
  }

  const addBlogArticle = () => {
    const newId = `blog-${Date.now()}`
    const defaultTitle = 'New Innovations in Surgical Instrument Manufacturing 2026'
    const defaultSlug = defaultTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    setBlogsList([
      {
        id: newId,
        title: defaultTitle,
        slug: defaultSlug,
        image: '/images/blog-instruments-tray.png',
        category: 'SURGICAL TECH',
        date: 'September 2026',
        readTime: '5 min read',
        excerpt:
          'Discover our latest engineering breakthroughs in hand-forged titanium instruments and high-durability surgical steel alloys.',
        content: [
          'In high-stakes surgical procedures, instrument precision is essential.',
          'At Durable Hospital Supplies, our metallurgical processes ensure optimal performance.',
        ],
      },
      ...blogsList,
    ])
  }

  const deleteBlogArticle = (index: number) => {
    if (confirm('Are you sure you want to delete this blog article?')) {
      setBlogsList(blogsList.filter((_, i) => i !== index))
    }
  }

  // Filtered blogs for search inside Admin
  const filteredBlogs = blogsList.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 bg-[#090F1E] text-slate-100 min-h-screen">
      {/* Top Header Card */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[#E31B23] text-xs font-black uppercase tracking-wider">
              Website Content Module
            </span>
            <span className="text-xs text-slate-400 font-mono">/admin/content/blog</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-[#E31B23]" />
            <span>Blog Page Content Manager</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Manage Blog Hero Banner, Section Headings, and all 6+ Blog Articles with live browser refresh persistence.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <button
            onClick={handleSaveAll}
            className="px-6 py-2.5 rounded-xl bg-[#E31B23] hover:bg-red-700 text-white text-xs font-black tracking-wider uppercase transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>✓ All Blog Changes Saved Successfully! Your website blog page has been updated live.</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: BLOG HERO BANNER SETTINGS */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-red-600/20 text-[#E31B23] font-black flex items-center justify-center text-sm border border-red-500/30">
              1
            </span>
            <h2 className="text-xl font-bold text-white">Blog Hero Banner Settings</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">`/blog` Banner</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Hero Pill Badge Text
            </label>
            <input
              type="text"
              value={heroData.categoryBadge}
              onChange={(e) => setHeroData({ ...heroData, categoryBadge: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Hero Main Title
            </label>
            <input
              type="text"
              value={heroData.title}
              onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Hero Subtitle / Description
            </label>
            <textarea
              rows={3}
              value={heroData.subtitle}
              onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl p-4 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="md:col-span-2 space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#E31B23]" />
              <span>Hero Background Image URL</span>
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="text"
                value={heroData.bgImage}
                onChange={(e) => setHeroData({ ...heroData, bgImage: e.target.value })}
                className="flex-1 w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
                placeholder="/images/products-hero-banner.png"
              />
              <label className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 border border-slate-700 shrink-0">
                <Upload className="w-4 h-4 text-[#E31B23]" />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, (url) => setHeroData({ ...heroData, bgImage: url }))}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2: BLOG GRID HEADER SETTINGS */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-red-600/20 text-[#E31B23] font-black flex items-center justify-center text-sm border border-red-500/30">
              2
            </span>
            <h2 className="text-xl font-bold text-white">Blog Section Header Settings</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Grid Header</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Header Line 1
            </label>
            <input
              type="text"
              value={headerData.line1}
              onChange={(e) => setHeaderData({ ...headerData, line1: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Header Line 2 (Highlight)
            </label>
            <input
              type="text"
              value={headerData.line2}
              onChange={(e) => setHeaderData({ ...headerData, line2: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Right Subtitle Description
            </label>
            <textarea
              rows={2}
              value={headerData.subtitle}
              onChange={(e) => setHeaderData({ ...headerData, subtitle: e.target.value })}
              className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl p-4 text-xs font-semibold text-white focus:outline-none focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 3: BLOG ARTICLES LIST MANAGER (CRUD) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#0D1527] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-red-600/20 text-[#E31B23] font-black flex items-center justify-center text-sm border border-red-500/30">
              3
            </span>
            <div>
              <h2 className="text-xl font-bold text-white">
                Blog Articles Manager ({blogsList.length})
              </h2>
              <p className="text-xs text-slate-400">Add, edit, delete, or update blog posts and insights.</p>
            </div>
          </div>

          <button
            onClick={addBlogArticle}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Blog Article</span>
          </button>
        </div>

        {/* Search Bar inside Admin */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles by title or category..."
            className="w-full bg-[#141E36] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-white focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Blog Cards List */}
        <div className="space-y-6">
          {filteredBlogs.length === 0 ? (
            <div className="p-8 text-center bg-[#141E36] rounded-2xl border border-slate-700 text-slate-400 text-xs font-medium">
              No articles found matching &quot;{searchTerm}&quot;.
            </div>
          ) : (
            filteredBlogs.map((blog) => {
              const actualIndex = blogsList.findIndex((b) => b.id === blog.id)

              return (
                <div
                  key={blog.id}
                  className="bg-[#141E36] border border-slate-700/80 rounded-2xl p-6 space-y-6 relative group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700/60 pb-3 gap-3">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-[#E31B23] text-[11px] font-mono font-bold">
                        {blog.category}
                      </span>
                      <h3 className="text-sm font-bold text-white truncate max-w-md">{blog.title}</h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <span>Preview</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#E31B23]" />
                      </Link>

                      <button
                        onClick={() => deleteBlogArticle(actualIndex)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Category Tag
                      </label>
                      <input
                        type="text"
                        value={blog.category}
                        onChange={(e) => updateBlogItem(actualIndex, 'category', e.target.value)}
                        className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Publish Date
                      </label>
                      <input
                        type="text"
                        value={blog.date}
                        onChange={(e) => updateBlogItem(actualIndex, 'date', e.target.value)}
                        className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Read Time
                      </label>
                      <input
                        type="text"
                        value={blog.readTime}
                        onChange={(e) => updateBlogItem(actualIndex, 'readTime', e.target.value)}
                        className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Article Title
                      </label>
                      <input
                        type="text"
                        value={blog.title}
                        onChange={(e) => updateBlogItem(actualIndex, 'title', e.target.value)}
                        className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={blog.slug}
                        onChange={(e) => updateBlogItem(actualIndex, 'slug', e.target.value)}
                        className="w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="md:col-span-3 space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Excerpt Summary
                      </label>
                      <textarea
                        rows={3}
                        value={blog.excerpt}
                        onChange={(e) => updateBlogItem(actualIndex, 'excerpt', e.target.value)}
                        className="w-full bg-[#0D1527] border border-slate-700 rounded-xl p-3.5 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="md:col-span-3 space-y-2">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Cover Image URL
                      </label>
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <input
                          type="text"
                          value={blog.image}
                          onChange={(e) => updateBlogItem(actualIndex, 'image', e.target.value)}
                          className="flex-1 w-full bg-[#0D1527] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                        />
                        <label className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 border border-slate-700 shrink-0">
                          <Upload className="w-4 h-4 text-[#E31B23]" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageUpload(e, (url) => updateBlogItem(actualIndex, 'image', url))
                            }
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Bottom Save Action Bar */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={handleSaveAll}
            className="px-8 py-3.5 rounded-xl bg-[#E31B23] hover:bg-red-700 text-white text-xs font-black tracking-wider uppercase transition-all shadow-xl shadow-red-600/30 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-5 h-5" />
            <span>Save All Blog Page Changes</span>
          </button>
        </div>
      </div>
    </div>
  )
}

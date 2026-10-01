'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Search,
  ArrowLeft,
  X,
  Save,
  Newspaper,
} from 'lucide-react'
import { BLOGS_DATA, BlogItem } from '@/src/data/blogsData'
import { AdminMediaUploadPlaceholder } from '@/src/components/admin/AdminMediaUploadPlaceholder'

export interface BlogPost extends BlogItem {}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>(BLOGS_DATA)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [toastMessage, setToastMessage] = useState('Blog articles updated & saved successfully!')

  const [newBlog, setNewBlog] = useState({
    title: '',
    slug: '',
    category: 'SURGICAL TECH',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    readTime: '5 min read',
    excerpt: '',
    image: '/images/blog-instruments-tray.png',
  })

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('durable_blogs_list')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBlogs(parsed)
          return
        }
      }
      setBlogs(BLOGS_DATA)
    } catch (e) {
      console.error('Error reading durable_blogs_list from localStorage:', e)
      setBlogs(BLOGS_DATA)
    }
  }, [])

  const saveToStorage = (updatedBlogs: BlogPost[], msg?: string) => {
    try {
      localStorage.setItem('durable_blogs_list', JSON.stringify(updatedBlogs))
      window.dispatchEvent(new Event('durable_content_updated'))
      setToastMessage(msg || 'Blog articles list saved and published live!')
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 4000)
    } catch (e) {
      console.error('Error saving durable_blogs_list to localStorage:', e)
    }
  }

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenAddModal = () => {
    setEditingBlog(null)
    setNewBlog({
      title: '',
      slug: '',
      category: 'SURGICAL TECH',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: '5 min read',
      excerpt: '',
      image: '/images/blog-instruments-tray.png',
    })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (blog: BlogPost) => {
    setEditingBlog(blog)
    setNewBlog({
      title: blog.title,
      slug: blog.slug,
      category: blog.category,
      date: blog.date,
      readTime: blog.readTime || '5 min read',
      excerpt: blog.excerpt,
      image: blog.image,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this blog article?')) {
      const updated = blogs.filter((b) => b.id !== id)
      setBlogs(updated)
      saveToStorage(updated, 'Blog article deleted & published live!')
    }
  }

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBlog.title.trim()) return

    const slugified =
      newBlog.slug.trim() ||
      newBlog.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    let updated: BlogPost[]
    if (editingBlog) {
      updated = blogs.map((b) =>
        b.id === editingBlog.id
          ? {
              ...b,
              title: newBlog.title,
              slug: slugified,
              category: newBlog.category,
              date: newBlog.date,
              readTime: newBlog.readTime,
              excerpt: newBlog.excerpt,
              image: newBlog.image,
            }
          : b
      )
    } else {
      const createdPost: BlogPost = {
        id: `blog-${Date.now()}`,
        title: newBlog.title,
        slug: slugified,
        category: newBlog.category,
        date: newBlog.date,
        readTime: newBlog.readTime,
        excerpt: newBlog.excerpt,
        image: newBlog.image,
        content: [
          newBlog.excerpt,
          'At Durable Hospital Supplies, our manufacturing and metallurgical engineering processes guarantee maximum reliability and precision across all surgical instruments.',
        ],
      }
      updated = [createdPost, ...blogs]
    }

    setBlogs(updated)
    saveToStorage(updated, editingBlog ? 'Blog article updated & saved!' : 'New blog article added & published live!')
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 px-4 sm:px-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Website Management</span>
            <span>•</span>
            <span className="text-[#E31B23] font-black">Blog Articles Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1B3D] tracking-tight flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-[#E31B23]" />
            <span>Blogs & News Article Manager</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium max-w-2xl">
            Create, edit, modify, delete, and publish blog articles. Changes save permanently with full browser refresh persistence and reflect live on the website homepage & blog pages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin"
            className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          <button
            type="button"
            onClick={() => saveToStorage(blogs, 'All blog article changes saved successfully!')}
            className="px-5 py-2.5 text-xs font-black text-white bg-[#0B1B3D] hover:bg-slate-900 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 text-xs font-black text-white bg-[#E31B23] hover:bg-red-700 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Article</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 text-emerald-800 text-xs font-bold shadow-xs animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider bg-emerald-200/80 px-2 py-0.5 rounded-md text-emerald-900 font-black">
            SAVED LIVE
          </span>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search articles by title, category, or summary..."
          className="w-full text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs font-bold text-slate-400 hover:text-slate-700"
          >
            Clear
          </button>
        )}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={blog.image || '/images/blog-instruments-tray.png'}
                  alt={blog.title}
                  className="w-full h-full object-cover opacity-90"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#0B1B3D]/90 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider rounded-md">
                  {blog.category}
                </span>
              </div>

              <div className="p-6 space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>{blog.date}</span>
                  <span>•</span>
                  <span>{blog.readTime || '5 min read'}</span>
                </div>
                <h3 className="text-base font-black text-[#0B1B3D] leading-snug line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {blog.excerpt}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
              <Link
                href={`/blog/${blog.slug}`}
                target="_blank"
                className="text-xs font-bold text-[#E31B23] hover:underline"
              >
                Preview Article →
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(blog)}
                  className="p-2 text-slate-700 hover:text-[#0B1B3D] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  title="Edit Article"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(blog.id)}
                  className="p-2 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer border border-red-200/60"
                  title="Delete Article"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-[#0B1B3D]">
                {editingBlog ? 'Edit Blog Article' : 'Create New Article'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Article Title <span className="text-[#E31B23]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                  placeholder="e.g. Innovations & Quality Standards in Reusable Surgical Instruments"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-[#0B1B3D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Category Tag <span className="text-[#E31B23]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newBlog.category}
                    onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                    placeholder="e.g. SURGICAL TECH"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#0B1B3D]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={newBlog.readTime}
                    onChange={(e) => setNewBlog({ ...newBlog, readTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#0B1B3D]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Publish Date
                </label>
                <input
                  type="text"
                  value={newBlog.date}
                  onChange={(e) => setNewBlog({ ...newBlog, date: e.target.value })}
                  placeholder="e.g. August 28, 2026"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#0B1B3D]"
                />
              </div>

              <div className="space-y-1.5">
                <AdminMediaUploadPlaceholder
                  label="Cover Image"
                  value={newBlog.image}
                  onChange={(url) => setNewBlog({ ...newBlog, image: url })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Excerpt Summary <span className="text-[#E31B23]">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={newBlog.excerpt}
                  onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                  placeholder="Enter short article summary that will display on the blog card..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-[#0B1B3D]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-black text-white bg-[#E31B23] hover:bg-red-700 rounded-xl shadow-md cursor-pointer"
                >
                  {editingBlog ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

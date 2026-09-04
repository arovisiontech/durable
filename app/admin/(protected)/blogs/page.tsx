'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  FileText,
  Search,
  ArrowLeft,
  X,
  Image as ImageIcon,
} from 'lucide-react'

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  author: string
  date: string
  category: string
  image: string
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([
    {
      id: 'blog-1',
      slug: 'understanding-surgical-steel-grades',
      title: 'Understanding AISI 420 vs AISI 316L Surgical Stainless Steel',
      excerpt:
        'A comprehensive metallurgical breakdown of high-carbon martensitic vs austenitic stainless steel alloys used in operating room scissors, needle holders, and forceps.',
      author: 'Dr. M. Arshad (Head of QA)',
      date: 'Aug 28, 2026',
      category: 'Metallurgy & Quality',
      image: '/images/blog-surgeon-scalpel.png',
    },
    {
      id: 'blog-2',
      slug: 'ce-mdr-compliance-guide-2026',
      title: 'Navigating EU-MDR 2017/745 Compliance for Surgical Exporters',
      excerpt:
        'Key insights into technical file requirements, UDI barcode assignments, and biocompatibility evaluations for medical device manufacturers in Sialkot.',
      author: 'Compliance Team',
      date: 'Aug 14, 2026',
      category: 'Regulatory Standards',
      image: '/images/about-surgical-instruments.png',
    },
    {
      id: 'blog-3',
      slug: 'tungsten-carbide-jaw-inserts-longevity',
      title: 'How Gold-Handle Tungsten Carbide Inserts Extend Instrument Lifespan',
      excerpt:
        'Why gold-plated handles designate precision TC jaw inserts, providing 5x extended cutting sharpness and non-slip needle holding capability.',
      author: 'Master Artisan Team',
      date: 'Jul 30, 2026',
      category: 'Surgical Innovations',
      image: '/images/blog-instruments-tray.png',
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  const [newBlog, setNewBlog] = useState({
    title: '',
    slug: '',
    excerpt: '',
    author: 'Editorial Team',
    category: 'Surgical Innovations',
    image: '/images/blog-surgeon-scalpel.png',
  })

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenAddModal = () => {
    setEditingBlog(null)
    setNewBlog({
      title: '',
      slug: '',
      excerpt: '',
      author: 'Editorial Team',
      category: 'Surgical Innovations',
      image: '/images/blog-surgeon-scalpel.png',
    })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (blog: BlogPost) => {
    setEditingBlog(blog)
    setNewBlog({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      author: blog.author,
      category: blog.category,
      image: blog.image,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this blog article?')) {
      setBlogs((prev) => prev.filter((b) => b.id !== id))
      triggerToast()
    }
  }

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBlog.title.trim()) return

    const slugified = newBlog.slug.trim() || newBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    if (editingBlog) {
      setBlogs((prev) =>
        prev.map((b) =>
          b.id === editingBlog.id
            ? {
                ...b,
                title: newBlog.title,
                slug: slugified,
                excerpt: newBlog.excerpt,
                author: newBlog.author,
                category: newBlog.category,
                image: newBlog.image,
              }
            : b
        )
      )
    } else {
      const createdPost: BlogPost = {
        id: `blog-${Date.now()}`,
        title: newBlog.title,
        slug: slugified,
        excerpt: newBlog.excerpt,
        author: newBlog.author,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        category: newBlog.category,
        image: newBlog.image,
      }
      setBlogs((prev) => [createdPost, ...prev])
    }

    setIsModalOpen(false)
    triggerToast()
  }

  const triggerToast = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 4000)
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span>Website Management</span>
            <span>•</span>
            <span className="text-[#E31B23]">Blogs & Articles Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3D] tracking-tight">
            Blogs & News Article Manager
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Create, edit, modify, and delete news articles, metallurgical insights, and blog posts.
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
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 text-xs font-extrabold text-white bg-[#E31B23] hover:bg-red-700 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Article</span>
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold shadow-xs animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Blog articles list successfully updated and published!</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search articles by title or category..."
          className="w-full text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover opacity-90" />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#0B1B3D] text-white text-[10px] font-mono font-bold rounded-md">
                  {blog.category}
                </span>
              </div>

              <div className="p-6 space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {blog.date} • {blog.author}
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
                Preview Live →
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(blog)}
                  className="p-2 text-slate-700 hover:text-[#E31B23] bg-slate-100 hover:bg-red-50 rounded-lg"
                  title="Edit Post"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="p-2 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg"
                  title="Delete Post"
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-[#0B1B3D]">
                {editingBlog ? 'Edit Blog Article' : 'Create New Article'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                  placeholder="e.g. Passivation Standards for Autoclave Sterilization"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={newBlog.category}
                    onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={newBlog.author}
                    onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={newBlog.image}
                  onChange={(e) => setNewBlog({ ...newBlog, image: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Excerpt Summary
                </label>
                <textarea
                  required
                  rows={3}
                  value={newBlog.excerpt}
                  onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                  placeholder="Enter short article summary..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-black text-white bg-[#E31B23] hover:bg-red-700 rounded-xl shadow-md"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

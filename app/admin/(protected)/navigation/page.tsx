'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Compass,
  ArrowLeft,
  X,
  ExternalLink,
} from 'lucide-react'

export interface NavLinkItem {
  id: string
  label: string
  url: string
  location: 'header' | 'footer'
  order: number
}

export default function AdminNavigationPage() {
  const [navLinks, setNavLinks] = useState<NavLinkItem[]>([
    { id: 'nav-1', label: 'Home', url: '/', location: 'header', order: 1 },
    { id: 'nav-2', label: 'About', url: '/about', location: 'header', order: 2 },
    { id: 'nav-3', label: 'Products', url: '/products', location: 'header', order: 3 },
    { id: 'nav-4', label: 'Catalogues', url: '/catalogues', location: 'header', order: 4 },
    { id: 'nav-5', label: 'Blog', url: '/blog', location: 'header', order: 5 },
    { id: 'nav-6', label: "FAQ's", url: '/faqs', location: 'header', order: 6 },
    { id: 'nav-7', label: 'Contact', url: '/contact', location: 'header', order: 7 },
    { id: 'nav-8', label: 'History', url: '/history', location: 'footer', order: 1 },
    { id: 'nav-9', label: 'CSR', url: '/csr', location: 'footer', order: 2 },
    { id: 'nav-10', label: 'Compliance', url: '/compliance', location: 'footer', order: 3 },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<NavLinkItem | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  const [newLink, setNewLink] = useState({
    label: '',
    url: '',
    location: 'header' as 'header' | 'footer',
    order: 1,
  })

  const handleOpenAddModal = () => {
    setEditingLink(null)
    setNewLink({ label: '', url: '', location: 'header', order: navLinks.length + 1 })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (item: NavLinkItem) => {
    setEditingLink(item)
    setNewLink({ ...item })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this navigation link?')) {
      setNavLinks((prev) => prev.filter((n) => n.id !== id))
      triggerToast()
    }
  }

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLink.label.trim() || !newLink.url.trim()) return

    if (editingLink) {
      setNavLinks((prev) => prev.map((n) => (n.id === editingLink.id ? { ...n, ...newLink } : n)))
    } else {
      const createdItem: NavLinkItem = {
        id: `nav-${Date.now()}`,
        ...newLink,
      }
      setNavLinks((prev) => [...prev, createdItem])
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
            <span>Company Management</span>
            <span>•</span>
            <span className="text-[#E31B23]">Site Navigation Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3D] tracking-tight">
            Header & Footer Navigation Links
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage navigation items, header links, footer quick links, and link order.
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
            <span>Add Nav Link</span>
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold shadow-xs animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Site navigation links updated and saved live!</span>
        </div>
      )}

      {/* Nav Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Header Links */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-black text-[#0B1B3D]">Desktop & Mobile Header Links</h2>
            <span className="px-2.5 py-0.5 bg-slate-900 text-white font-mono text-[10px] font-bold rounded-md">
              {navLinks.filter((n) => n.location === 'header').length} LINKS
            </span>
          </div>

          <div className="space-y-2">
            {navLinks
              .filter((n) => n.location === 'header')
              .map((link) => (
                <div key={link.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between gap-3 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 font-mono text-xs font-bold flex items-center justify-center">
                      {link.order}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{link.label}</div>
                      <div className="text-[10px] font-mono text-slate-500">{link.url}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button onClick={() => handleOpenEditModal(link)} className="p-1.5 text-slate-700 hover:text-[#E31B23]">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(link.id)} className="p-1.5 text-red-600 hover:text-red-800">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-black text-[#0B1B3D]">Footer Quick Links</h2>
            <span className="px-2.5 py-0.5 bg-[#E31B23] text-white font-mono text-[10px] font-bold rounded-md">
              {navLinks.filter((n) => n.location === 'footer').length} LINKS
            </span>
          </div>

          <div className="space-y-2">
            {navLinks
              .filter((n) => n.location === 'footer')
              .map((link) => (
                <div key={link.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between gap-3 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 font-mono text-xs font-bold flex items-center justify-center">
                      {link.order}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{link.label}</div>
                      <div className="text-[10px] font-mono text-slate-500">{link.url}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button onClick={() => handleOpenEditModal(link)} className="p-1.5 text-slate-700 hover:text-[#E31B23]">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(link.id)} className="p-1.5 text-red-600 hover:text-red-800">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-[#0B1B3D]">
                {editingLink ? 'Edit Navigation Link' : 'Add Navigation Link'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLink} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Link Label</label>
                <input
                  type="text"
                  required
                  value={newLink.label}
                  onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                  placeholder="e.g. Products or About Us"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Target URL Path</label>
                <input
                  type="text"
                  required
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  placeholder="e.g. /products or /about"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Location</label>
                  <select
                    value={newLink.location}
                    onChange={(e) => setNewLink({ ...newLink, location: e.target.value as 'header' | 'footer' })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  >
                    <option value="header">Header Nav</option>
                    <option value="footer">Footer Quick Links</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Display Order</label>
                  <input
                    type="number"
                    value={newLink.order}
                    onChange={(e) => setNewLink({ ...newLink, order: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 text-xs font-black text-white bg-[#E31B23] hover:bg-red-700 rounded-xl shadow-md">
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

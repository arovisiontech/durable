'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  BarChart3,
  ArrowLeft,
  X,
  TrendingUp,
} from 'lucide-react'

export interface StatItem {
  id: string
  number: string
  label: string
  category: string
}

export default function AdminStatisticsPage() {
  const [stats, setStats] = useState<StatItem[]>([
    { id: 'stat-1', number: '20,000+', label: 'Products Manufactured', category: 'Catalog' },
    { id: 'stat-2', number: '6+', label: 'Production Facilities', category: 'Infrastructure' },
    { id: 'stat-3', number: '300+', label: 'Skilled Workers', category: 'Team' },
    { id: 'stat-4', number: '1 Million+', label: 'Patients Treated Every Year', category: 'Healthcare Impact' },
    { id: 'stat-5', number: '15+', label: 'Export Countries Served', category: 'Global Reach' },
    { id: 'stat-6', number: '53+', label: 'Years of Master Craftsmanship', category: 'Heritage' },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStat, setEditingStat] = useState<StatItem | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  const [newStat, setNewStat] = useState({
    number: '',
    label: '',
    category: 'General',
  })

  const handleOpenAddModal = () => {
    setEditingStat(null)
    setNewStat({ number: '', label: '', category: 'General' })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (stat: StatItem) => {
    setEditingStat(stat)
    setNewStat({ number: stat.number, label: stat.label, category: stat.category })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this key performance statistic?')) {
      setStats((prev) => prev.filter((s) => s.id !== id))
      triggerToast()
    }
  }

  const handleSaveStat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStat.number.trim() || !newStat.label.trim()) return

    if (editingStat) {
      setStats((prev) =>
        prev.map((s) => (s.id === editingStat.id ? { ...s, ...newStat } : s))
      )
    } else {
      const createdItem: StatItem = {
        id: `stat-${Date.now()}`,
        ...newStat,
      }
      setStats((prev) => [createdItem, ...prev])
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
            <span className="text-[#E31B23]">Key Performance Statistics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3D] tracking-tight">
            Key Statistics & Metrics
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage company achievement counters, production capacity numbers, and global impact stats.
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
            <span>Add New Metric Stat</span>
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold shadow-xs animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Key Statistics list successfully updated!</span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 bg-slate-900 text-white font-mono text-[10px] font-bold rounded-md uppercase">
                {stat.category}
              </span>
              <div className="text-3xl font-black text-[#0B1B3D] tracking-tight">{stat.number}</div>
              <div className="text-xs font-bold text-slate-600 leading-snug">{stat.label}</div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button onClick={() => handleOpenEditModal(stat)} className="p-2 text-slate-700 hover:text-[#E31B23] bg-slate-100 rounded-lg">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(stat.id)} className="p-2 text-red-600 hover:text-red-800 bg-red-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-[#0B1B3D]">
                {editingStat ? 'Edit Metric Stat' : 'Add Metric Stat'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStat} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Counter Number / Value
                </label>
                <input
                  type="text"
                  required
                  value={newStat.number}
                  onChange={(e) => setNewStat({ ...newStat, number: e.target.value })}
                  placeholder="e.g. 20,000+ or 53+"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-[#0B1B3D]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Metric Label / Title
                </label>
                <input
                  type="text"
                  required
                  value={newStat.label}
                  onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
                  placeholder="e.g. Products Manufactured"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Category Group
                </label>
                <input
                  type="text"
                  value={newStat.category}
                  onChange={(e) => setNewStat({ ...newStat, category: e.target.value })}
                  placeholder="e.g. Infrastructure, Heritage, Team"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 text-xs font-black text-white bg-[#E31B23] hover:bg-red-700 rounded-xl shadow-md">
                  Save Stat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

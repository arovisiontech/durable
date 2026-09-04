'use client'

import { useState } from 'react'
import {
  Mail,
  Search,
  Plus,
  Trash2,
  CheckCircle,
  Download,
  UserCheck,
  UserX,
  Send,
  X,
} from 'lucide-react'

interface Subscriber {
  id: string
  email: string
  name: string
  country: string
  subscribedDate: string
  status: 'Active' | 'Unsubscribed'
  source: 'Footer Form' | 'Catalog Download' | 'Checkout'
}

const INITIAL_SUBSCRIBERS: Subscriber[] = [
  {
    id: 'SUB-101',
    email: 'purchasing@londondental.co.uk',
    name: 'London Dental Centre',
    country: 'United Kingdom',
    subscribedDate: '2026-09-01',
    status: 'Active',
    source: 'Footer Form',
  },
  {
    id: 'SUB-102',
    email: 'info@surgiclinic.de',
    name: 'Berlin SurgiClinic GmbH',
    country: 'Germany',
    subscribedDate: '2026-08-28',
    status: 'Active',
    source: 'Catalog Download',
  },
  {
    id: 'SUB-103',
    email: 'dr.hassan@dubaihealth.ae',
    name: 'Dr. Hassan Al-Maktoum',
    country: 'UAE',
    subscribedDate: '2026-08-15',
    status: 'Active',
    source: 'Checkout',
  },
  {
    id: 'SUB-104',
    email: 'contact@tokyodental.jp',
    name: 'Tokyo Surgical Supplies',
    country: 'Japan',
    subscribedDate: '2026-07-30',
    status: 'Unsubscribed',
    source: 'Footer Form',
  },
  {
    id: 'SUB-105',
    email: 'admin@sialkotmed.com',
    name: 'Sialkot Medical Traders',
    country: 'Pakistan',
    subscribedDate: '2026-07-12',
    status: 'Active',
    source: 'Catalog Download',
  },
]

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(INITIAL_SUBSCRIBERS)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Unsubscribed'>('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Add subscriber form state
  const [newEmail, setNewEmail] = useState('')
  const [newName, setNewName] = useState('')
  const [newCountry, setNewCountry] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const filteredSubscribers = subscribers.filter((s) => {
    const matchesSearch =
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.country.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'All' || s.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail.trim()) return

    const newSub: Subscriber = {
      id: `SUB-${Date.now().toString().slice(-4)}`,
      email: newEmail.trim(),
      name: newName.trim() || 'Anonymous Buyer',
      country: newCountry.trim() || 'International',
      subscribedDate: new Date().toISOString().slice(0, 10),
      status: 'Active',
      source: 'Footer Form',
    }

    setSubscribers([newSub, ...subscribers])
    setNewEmail('')
    setNewName('')
    setNewCountry('')
    setShowAddModal(false)
    showToast('New subscriber added successfully!')
  }

  const toggleStatus = (id: string) => {
    setSubscribers((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: s.status === 'Active' ? 'Unsubscribed' : 'Active',
            }
          : s
      )
    )
    showToast('Subscriber status updated.')
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this subscriber email?')) {
      setSubscribers((prev) => prev.filter((s) => s.id !== id))
      showToast('Subscriber deleted.')
    }
  }

  const exportCSV = () => {
    const headers = 'ID,Email,Name,Country,Subscribed Date,Status,Source\n'
    const rows = subscribers
      .map(
        (s) =>
          `"${s.id}","${s.email}","${s.name}","${s.country}","${s.subscribedDate}","${s.status}","${s.source}"`
      )
      .join('\n')
    const csvContent = 'data:text/csv;charset=utf-8,' + headers + rows
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute(
      'download',
      `durable-subscribers-${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Subscriber list exported as CSV file!')
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-[#0B1B3D] px-5 py-3 text-white shadow-2xl transition-all">
          <CheckCircle className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      {/* Top Title Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E31B23]">
            <span>Customer Engagement</span>
            <span>•</span>
            <span>Newsletter Marketing</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Newsletter Subscribers
          </h1>
          <p className="text-sm text-gray-600">
            Manage subscribed clients, export mailing lists for campaigns, and track lead origins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-[#0B1B3D] px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-[#E31B23]"
          >
            <Plus className="h-4 w-4" />
            Add Subscriber
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase">Total Subscribers</span>
            <Mail className="h-5 w-5 text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{subscribers.length}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase">Active Subscribers</span>
            <UserCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {subscribers.filter((s) => s.status === 'Active').length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase">Unsubscribed</span>
            <UserX className="h-5 w-5 text-gray-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-500">
            {subscribers.filter((s) => s.status === 'Unsubscribed').length}
          </p>
        </div>
      </div>

      {/* Filter and Table Card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Search Bar */}
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between bg-gray-50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search subscriber email, client name, country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-[#E31B23] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterStatus('All')}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${
                filterStatus === 'All'
                  ? 'bg-[#0B1B3D] text-white'
                  : 'bg-white border border-gray-200 text-gray-700'
              }`}
            >
              All ({subscribers.length})
            </button>

            <button
              onClick={() => setFilterStatus('Active')}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${
                filterStatus === 'Active'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700'
              }`}
            >
              Active ({subscribers.filter((s) => s.status === 'Active').length})
            </button>

            <button
              onClick={() => setFilterStatus('Unsubscribed')}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${
                filterStatus === 'Unsubscribed'
                  ? 'bg-gray-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700'
              }`}
            >
              Unsubscribed (
              {subscribers.filter((s) => s.status === 'Unsubscribed').length})
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-100/80 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-3">Subscriber Email</th>
                <th className="px-6 py-3">Client / Organization</th>
                <th className="px-6 py-3">Country</th>
                <th className="px-6 py-3">Subscribed Date</th>
                <th className="px-6 py-3">Source</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    No subscribers matching your filters.
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/60 transition">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {sub.email}
                    </td>
                    <td className="px-6 py-4">{sub.name}</td>
                    <td className="px-6 py-4">{sub.country}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {sub.subscribedDate}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                        {sub.source}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(sub.id)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                          sub.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {sub.status === 'Active' ? (
                          <>
                            <UserCheck className="h-3 w-3" /> Active
                          </>
                        ) : (
                          <>
                            <UserX className="h-3 w-3" /> Unsubscribed
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                        title="Delete Subscriber"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Subscriber Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">
                Add Newsletter Subscriber
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubscriber} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="client@clinic.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-[#E31B23] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                  Client / Organization Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Zurich Medical Import Ltd"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-[#E31B23] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  placeholder="e.g. Switzerland"
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-[#E31B23] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-[#0B1B3D] px-4 py-2 text-xs font-semibold text-white shadow hover:bg-[#E31B23]"
                >
                  Save Subscriber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

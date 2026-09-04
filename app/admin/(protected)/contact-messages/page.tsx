'use client'

import { useState } from 'react'
import {
  Mail,
  Search,
  Trash2,
  CheckCircle,
  Star,
  Eye,
  Download,
  Filter,
  RefreshCw,
  User,
  Phone,
  Building,
  Globe,
  Clock,
  ArrowLeft,
  Check,
  Send,
} from 'lucide-react'

interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string
  company: string
  country: string
  category: 'Dental' | 'Surgical' | 'Manicure' | 'Custom OEM' | 'General Inquiry'
  subject: string
  message: string
  date: string
  status: 'Unread' | 'Read' | 'Replied'
  starred: boolean
}

const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'MSG-8901',
    name: 'Dr. Alexander Vance',
    email: 'a.vance@genevadental.ch',
    phone: '+41 22 849 9000',
    company: 'Geneva Dental Clinic Group',
    country: 'Switzerland',
    category: 'Dental',
    subject: 'Bulk Order Quotation for Titanium Implant Instruments',
    message: 'Greetings, We are interested in procuring 250 sets of titanium dental surgical kits for our Swiss clinics. Please send catalog specifications, bulk pricing tiers, and CE MDR compliance documents.',
    date: '2026-09-04 14:32',
    status: 'Unread',
    starred: true,
  },
  {
    id: 'MSG-8902',
    name: 'Sarah Lin',
    email: 'slin@medtech-imports.com.sg',
    phone: '+65 6743 2100',
    company: 'MedTech Singapore Pte',
    country: 'Singapore',
    category: 'Custom OEM',
    subject: 'Custom OEM Stamping & Laser Etching Capabilities',
    message: 'We are seeking an established manufacturer in Sialkot for private label scissors and forceps with custom barcode etching. Could you confirm your monthly production capacity and lead times?',
    date: '2026-09-04 11:15',
    status: 'Unread',
    starred: false,
  },
  {
    id: 'MSG-8899',
    name: 'Prof. Marcus Holloway',
    email: 'mholloway@berlinmed.de',
    phone: '+49 30 5512 890',
    company: 'Charité University Hospital',
    country: 'Germany',
    category: 'Surgical',
    subject: 'Micro-Surgical Forceps Sample Request',
    message: 'We received your product catalog. We would like to request 3 sample pieces of micro spring forceps for evaluation in our cardiovascular surgery dept.',
    date: '2026-09-03 16:45',
    status: 'Replied',
    starred: true,
  },
  {
    id: 'MSG-8895',
    name: 'Elena Rostova',
    email: 'elena@beautycraft.eu',
    phone: '+33 1 45 68 20 11',
    company: 'Rostova Beauty Supplies',
    country: 'France',
    category: 'Manicure',
    subject: 'Cuticle Nippers & Beauty Tooling Catalog',
    message: 'Hello Durable Medical team, Please send us your full manicure & pedicure instruments price list for wholesale distributors in France.',
    date: '2026-09-02 09:20',
    status: 'Read',
    starred: false,
  },
]

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>(INITIAL_MESSAGES)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('All')
  const [filterStatus, setFilterStatus] = useState<string>('All')
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null)
  const [replyText, setReplyText] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.company.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase())
    const matchesCat = filterCategory === 'All' || m.category === filterCategory
    const matchesStatus =
      filterStatus === 'All'
        ? true
        : filterStatus === 'Starred'
        ? m.starred
        : m.status === filterStatus
    return matchesSearch && matchesCat && matchesStatus
  })

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m))
    )
    showToast('Starred status updated!')
  }

  const markAsRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'Read' } : m))
    )
  }

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (confirm('Are you sure you want to delete this contact message?')) {
      setMessages((prev) => prev.filter((m) => m.id !== id))
      if (selectedMsg?.id === id) setSelectedMsg(null)
      showToast('Message deleted successfully.')
    }
  }

  const handleOpenMsg = (msg: ContactMessage) => {
    setSelectedMsg(msg)
    if (msg.status === 'Unread') {
      markAsRead(msg.id)
    }
  }

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedMsg) return
    setMessages((prev) =>
      prev.map((m) => (m.id === selectedMsg.id ? { ...m, status: 'Replied' } : m))
    )
    setSelectedMsg({ ...selectedMsg, status: 'Replied' })
    setReplyText('')
    showToast(`Reply sent successfully to ${selectedMsg.email}`)
  }

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(messages, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `durable-contact-messages-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    showToast('Messages exported to JSON file!')
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
            <span>Inquiries Inbox</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Contact Messages & Buyer Inquiries
          </h1>
          <p className="text-sm text-gray-600">
            Manage incoming inquiries, request quotes, and OEM questions from global healthcare buyers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportJSON}
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export Messages
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase">Total Messages</span>
            <Mail className="h-5 w-5 text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{messages.length}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase">Unread</span>
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {messages.filter((m) => m.status === 'Unread').length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase">Replied</span>
            <CheckCircle className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {messages.filter((m) => m.status === 'Replied').length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase">Starred</span>
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-600">
            {messages.filter((m) => m.starred).length}
          </p>
        </div>
      </div>

      {/* Main Content View (List + Detail Modal/Drawer) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Messages List Column */}
        <div className={selectedMsg ? 'lg:col-span-6' : 'lg:col-span-12'}>
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {/* Filters Bar */}
            <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between bg-gray-50">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search buyer name, email, company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-[#E31B23] focus:outline-none focus:ring-1 focus:ring-[#E31B23]"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="Dental">Dental</option>
                  <option value="Surgical">Surgical</option>
                  <option value="Manicure">Manicure</option>
                  <option value="Custom OEM">Custom OEM</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Unread">Unread</option>
                  <option value="Read">Read</option>
                  <option value="Replied">Replied</option>
                  <option value="Starred">Starred</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-100 max-h-[650px] overflow-y-auto">
              {filteredMessages.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <Mail className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                  <p className="font-semibold text-gray-700">No contact messages found</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Try adjusting your search criteria or category filter.
                  </p>
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const isSelected = selectedMsg?.id === msg.id
                  return (
                    <div
                      key={msg.id}
                      onClick={() => handleOpenMsg(msg)}
                      className={`group flex cursor-pointer items-start justify-between gap-4 p-4 transition ${
                        isSelected
                          ? 'bg-red-50/70 border-l-4 border-[#E31B23]'
                          : msg.status === 'Unread'
                          ? 'bg-blue-50/40 font-semibold hover:bg-gray-50'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <button
                          onClick={(e) => toggleStar(msg.id, e)}
                          className="mt-1 text-gray-300 hover:text-amber-400 transition"
                        >
                          <Star
                            className={`h-4 w-4 ${
                              msg.starred ? 'fill-amber-400 text-amber-400' : ''
                            }`}
                          />
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-bold text-gray-900">
                              {msg.name}
                            </span>
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                              {msg.category}
                            </span>
                            {msg.status === 'Unread' && (
                              <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                                New
                              </span>
                            )}
                          </div>
                          <p className="truncate text-xs text-gray-600 font-medium mt-0.5">
                            {msg.company} ({msg.country})
                          </p>
                          <p className="truncate text-xs font-semibold text-gray-800 mt-1">
                            {msg.subject}
                          </p>
                          <p className="line-clamp-1 text-xs text-gray-500 mt-0.5">
                            {msg.message}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 text-right shrink-0">
                        <span className="text-[11px] text-gray-400">{msg.date}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={(e) => handleDelete(msg.id, e)}
                            className="rounded-lg p-1 text-gray-400 hover:bg-red-100 hover:text-red-600"
                            title="Delete inquiry"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Selected Message Detail Drawer */}
        {selectedMsg && (
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sticky top-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-[#E31B23]">
                    {selectedMsg.category} Inquiry
                  </span>
                  <h2 className="mt-2 text-lg font-bold text-gray-900">
                    {selectedMsg.subject}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Received on {selectedMsg.date}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedMsg(null)}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-2 text-gray-500 hover:bg-gray-100"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Sender Details Box */}
              <div className="rounded-xl bg-gray-50 p-4 space-y-2 text-xs text-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-semibold text-gray-900 text-sm">
                      {selectedMsg.name}
                    </span>
                  </div>
                  <span className="rounded-md bg-white border border-gray-200 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                    {selectedMsg.id}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200/60">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                    <a
                      href={`mailto:${selectedMsg.email}`}
                      className="text-blue-600 hover:underline truncate"
                    >
                      {selectedMsg.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    <span>{selectedMsg.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Building className="h-3.5 w-3.5 text-gray-400" />
                    <span className="font-medium">{selectedMsg.company}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Globe className="h-3.5 w-3.5 text-gray-400" />
                    <span>{selectedMsg.country}</span>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Inquiry Message Content
                </h3>
                <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-800 leading-relaxed font-sans whitespace-pre-line">
                  {selectedMsg.message}
                </div>
              </div>

              {/* Reply Box */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Quick Reply to Client
                  </h3>
                  {selectedMsg.status === 'Replied' && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <Check className="h-3.5 w-3.5" /> Replied
                    </span>
                  )}
                </div>

                <textarea
                  rows={4}
                  placeholder={`Write your response to ${selectedMsg.email}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#E31B23] focus:outline-none focus:ring-1 focus:ring-[#E31B23]"
                />

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleDelete(selectedMsg.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete Message
                  </button>

                  <button
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    className="flex items-center gap-2 rounded-xl bg-[#0B1B3D] px-4 py-2 text-xs font-bold text-white shadow transition hover:bg-[#E31B23] disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" /> Send Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

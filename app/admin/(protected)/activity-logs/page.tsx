'use client'

import { useState } from 'react'
import {
  Activity,
  Search,
  Trash2,
  CheckCircle,
  Download,
  Filter,
  RefreshCw,
  ShieldAlert,
  Info,
  Clock,
  User,
} from 'lucide-react'

interface ActivityLog {
  id: string
  timestamp: string
  user: string
  action: string
  module: 'Products' | 'Blogs' | 'Settings' | 'Users' | 'Navigation' | 'Certifications'
  severity: 'Info' | 'Warning' | 'Security'
  ip: string
}

const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'LOG-901',
    timestamp: '2026-09-04 23:04:12',
    user: 'aromashshzadi72@gmail.com',
    action: 'Updated Home Page Hero Banner subtitle content',
    module: 'Settings',
    severity: 'Info',
    ip: '192.168.1.104',
  },
  {
    id: 'LOG-902',
    timestamp: '2026-09-04 22:45:00',
    user: 'production@durablemedical.com',
    action: 'Added new Dental Extracting Forceps product item [DEN-EXT-04]',
    module: 'Products',
    severity: 'Info',
    ip: '192.168.1.112',
  },
  {
    id: 'LOG-903',
    timestamp: '2026-09-04 21:12:30',
    user: 'aromashshzadi72@gmail.com',
    action: 'Published new news article: CE MDR 2026 Certification Standard Update',
    module: 'Blogs',
    severity: 'Info',
    ip: '192.168.1.104',
  },
  {
    id: 'LOG-904',
    timestamp: '2026-09-04 19:30:15',
    user: 'System Admin',
    action: 'Failed login attempt from unrecognised IP location',
    module: 'Users',
    severity: 'Security',
    ip: '45.12.89.201',
  },
  {
    id: 'LOG-905',
    timestamp: '2026-09-03 16:20:00',
    user: 'exports@durablemedical.com',
    action: 'Updated international shipping terms in Website Settings',
    module: 'Settings',
    severity: 'Warning',
    ip: '192.168.1.108',
  },
  {
    id: 'LOG-906',
    timestamp: '2026-09-03 14:05:44',
    user: 'aromashshzadi72@gmail.com',
    action: 'Uploaded new ISO 13485 compliance PDF certificate',
    module: 'Certifications',
    severity: 'Info',
    ip: '192.168.1.104',
  },
]

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>(INITIAL_LOGS)
  const [search, setSearch] = useState('')
  const [filterSeverity, setFilterSeverity] = useState<string>('All')
  const [filterModule, setFilterModule] = useState<string>('All')
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.user.toLowerCase().includes(search.toLowerCase()) ||
      l.ip.includes(search)
    const matchesSev = filterSeverity === 'All' || l.severity === filterSeverity
    const matchesMod = filterModule === 'All' || l.module === filterModule
    return matchesSearch && matchesSev && matchesMod
  })

  const handleClearLogs = () => {
    if (confirm('Are you sure you want to flush system activity log records?')) {
      setLogs([])
      showToast('Activity logs cleared.')
    }
  }

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `durable-audit-logs-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    showToast('Activity logs exported to file!')
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

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E31B23]">
            <span>Audit & Security Compliance</span>
            <span>•</span>
            <span>System Logs</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            System Activity & Audit Logs
          </h1>
          <p className="text-sm text-gray-600">
            Real-time audit trail recording admin actions, content edits, and system security events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportJSON}
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export Log File
          </button>

          <button
            onClick={handleClearLogs}
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
            Flush Logs
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase">Total Logged Actions</span>
            <Activity className="h-5 w-5 text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900">{logs.length}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase">Security Alerts</span>
            <ShieldAlert className="h-5 w-5 text-red-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {logs.filter((l) => l.severity === 'Security').length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase">Info Updates</span>
            <Info className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {logs.filter((l) => l.severity === 'Info').length}
          </p>
        </div>
      </div>

      {/* Logs Table Card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between bg-gray-50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search action description, admin email, IP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-[#E31B23] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 focus:outline-none"
            >
              <option value="All">All Severities</option>
              <option value="Info">Info</option>
              <option value="Warning">Warning</option>
              <option value="Security">Security Alert</option>
            </select>

            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 focus:outline-none"
            >
              <option value="All">All Modules</option>
              <option value="Products">Products</option>
              <option value="Blogs">Blogs</option>
              <option value="Settings">Settings</option>
              <option value="Users">Users</option>
              <option value="Navigation">Navigation</option>
              <option value="Certifications">Certifications</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-100/80 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">User Email</th>
                <th className="px-6 py-3">Action Details</th>
                <th className="px-6 py-3">Target Module</th>
                <th className="px-6 py-3">Severity</th>
                <th className="px-6 py-3 font-mono">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    No activity log entries found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50/60 transition">
                    <td className="px-6 py-4 text-xs font-mono text-gray-500">
                      {l.timestamp}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {l.user}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {l.action}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                        {l.module}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          l.severity === 'Security'
                            ? 'bg-red-100 text-red-700'
                            : l.severity === 'Warning'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {l.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-500">
                      {l.ip}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

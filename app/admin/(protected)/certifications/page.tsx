'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Award,
  ShieldCheck,
  ArrowLeft,
  X,
  FileCheck,
} from 'lucide-react'

export interface CertificationItem {
  id: string
  code: string
  title: string
  issuer: string
  validUntil: string
  detail: string
  documentUrl: string
}

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<CertificationItem[]>([
    {
      id: 'cert-1',
      code: 'ISO 13485:2016',
      title: 'Medical Devices Quality Management System',
      issuer: 'TÜV NORD / BSI Certification',
      validUntil: 'Dec 2028',
      detail:
        'Audited and certified for precision manufacturing, cleanroom packaging, and surgical risk management compliance.',
      documentUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    },
    {
      id: 'cert-2',
      code: 'CE MDR EU 2017/745',
      title: 'European Medical Device Regulation',
      issuer: 'EU Notified Body',
      validUntil: 'Nov 2029',
      detail:
        'Full Technical File documentation, UDI barcode identification, and clinical evaluation compliance.',
      documentUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    },
    {
      id: 'cert-3',
      code: 'US FDA 21 CFR 820',
      title: 'US FDA Quality System Regulation (QSR)',
      issuer: 'US Food & Drug Administration',
      validUntil: 'Annual Renewal 2027',
      detail:
        'Registered medical device establishment with complete device history records (DHR) and biocompatibility clearance.',
      documentUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCert, setEditingCert] = useState<CertificationItem | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  const [newCert, setNewCert] = useState({
    code: '',
    title: '',
    issuer: '',
    validUntil: '',
    detail: '',
    documentUrl: '/pdf/general-surgical-instruments-catalogue.pdf',
  })

  const handleOpenAddModal = () => {
    setEditingCert(null)
    setNewCert({ code: '', title: '', issuer: '', validUntil: '', detail: '', documentUrl: '/pdf/general-surgical-instruments-catalogue.pdf' })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (cert: CertificationItem) => {
    setEditingCert(cert)
    setNewCert({
      code: cert.code,
      title: cert.title,
      issuer: cert.issuer,
      validUntil: cert.validUntil,
      detail: cert.detail,
      documentUrl: cert.documentUrl,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this certification?')) {
      setCertifications((prev) => prev.filter((c) => c.id !== id))
      triggerToast()
    }
  }

  const handleSaveCert = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCert.code.trim() || !newCert.title.trim()) return

    if (editingCert) {
      setCertifications((prev) =>
        prev.map((c) =>
          c.id === editingCert.id
            ? { ...c, ...newCert }
            : c
        )
      )
    } else {
      const createdItem: CertificationItem = {
        id: `cert-${Date.now()}`,
        ...newCert,
      }
      setCertifications((prev) => [createdItem, ...prev])
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
            <span className="text-[#E31B23]">Certifications & Compliance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3D] tracking-tight">
            ISO & Regulatory Certifications
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage quality certifications, ISO 13485 documents, CE MDR approvals, and FDA registration records.
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
            <span>Add Certification</span>
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold shadow-xs animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Certifications list successfully updated!</span>
        </div>
      )}

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-slate-900 text-white font-mono text-xs font-bold rounded-lg">
                  {cert.code}
                </span>
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-base font-black text-[#0B1B3D] leading-snug">{cert.title}</h3>
              <p className="text-xs text-slate-500 font-semibold">{cert.issuer} • Valid: {cert.validUntil}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{cert.detail}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <a href={cert.documentUrl} target="_blank" className="text-xs font-bold text-[#E31B23] hover:underline flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5" />
                <span>View PDF</span>
              </a>

              <div className="flex items-center gap-2">
                <button onClick={() => handleOpenEditModal(cert)} className="p-2 text-slate-700 hover:text-[#E31B23] bg-slate-100 rounded-lg">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(cert.id)} className="p-2 text-red-600 hover:text-red-800 bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-[#0B1B3D]">
                {editingCert ? 'Edit Certification' : 'Add New Certification'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCert} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Cert Standard Code
                  </label>
                  <input
                    type="text"
                    required
                    value={newCert.code}
                    onChange={(e) => setNewCert({ ...newCert, code: e.target.value })}
                    placeholder="e.g. ISO 13485:2016"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Valid Until / Expiry
                  </label>
                  <input
                    type="text"
                    value={newCert.validUntil}
                    onChange={(e) => setNewCert({ ...newCert, validUntil: e.target.value })}
                    placeholder="e.g. Dec 2028"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Certification Title
                </label>
                <input
                  type="text"
                  required
                  value={newCert.title}
                  onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                  placeholder="e.g. Medical Devices Quality System"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Issuing Authority / Body
                </label>
                <input
                  type="text"
                  value={newCert.issuer}
                  onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                  placeholder="e.g. TÜV NORD / BSI"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Detailed Explanation
                </label>
                <textarea
                  rows={3}
                  value={newCert.detail}
                  onChange={(e) => setNewCert({ ...newCert, detail: e.target.value })}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 text-xs font-black text-white bg-[#E31B23] hover:bg-red-700 rounded-xl shadow-md">
                  Save Certification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

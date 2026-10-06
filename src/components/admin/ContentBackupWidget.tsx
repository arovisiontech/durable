'use client'

import { useState } from 'react'
import { Download, Upload, CheckCircle2, AlertCircle, RefreshCw, Database } from 'lucide-react'
import { exportFullBackupJSON, importFullBackupJSON } from '@/src/lib/backupManager'

export function ContentBackupWidget() {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleExport = async () => {
    try {
      setIsExporting(true)
      setStatusMsg(null)
      await exportFullBackupJSON()
      setStatusMsg({
        type: 'success',
        text: 'Site content backup (.json) exported successfully! Send this file to the developer to sync cross-device.',
      })
    } catch (err) {
      console.error(err)
      setStatusMsg({ type: 'error', text: 'Failed to export backup file.' })
    } finally {
      setIsExporting(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsImporting(true)
      setStatusMsg(null)
      const count = await importFullBackupJSON(file)
      setStatusMsg({
        type: 'success',
        text: `Successfully imported & restored ${count} content sections! All client uploads are now live on this device.`,
      })
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (err) {
      console.error(err)
      setStatusMsg({ type: 'error', text: 'Failed to import backup file. Ensure valid .json format.' })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#0B1B3D]">Cross-Device Content Sync & Backup Manager</h3>
            <p className="text-xs text-slate-500">
              Export client uploads from one browser & import into another device to sync all uploaded text, images, products & PDFs.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Export Button */}
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2.5 text-xs font-black text-white bg-[#0B1B3D] hover:bg-slate-900 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Exporting...' : 'Export Content Backup (JSON)'}</span>
          </button>

          {/* Import File Input */}
          <label className="px-4 py-2.5 text-xs font-black text-white bg-[#E31B23] hover:bg-red-700 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>{isImporting ? 'Importing...' : 'Import Backup JSON File'}</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              disabled={isImporting}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}
    </div>
  )
}

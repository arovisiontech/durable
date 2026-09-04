'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { MediaItem, MediaUsageCheckResult } from '@/src/types/media'
import { checkMediaUsageAction, deleteMediaRecordAction } from '@/app/admin/actions/media'

interface MediaDeleteDialogProps {
  media: MediaItem | null
  onClose: () => void
  onSuccess: () => void
}

export function MediaDeleteDialog({ media, onClose, onSuccess }: MediaDeleteDialogProps) {
  const [isChecking, setIsChecking] = useState(true)
  const [usageInfo, setUsageInfo] = useState<MediaUsageCheckResult | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!media) return

    let isMounted = true
    setIsChecking(true)

    checkMediaUsageAction(media.file_path).then((res) => {
      if (isMounted) {
        setUsageInfo(res.result)
        setIsChecking(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [media])

  if (!media) return null

  const handleDelete = async () => {
    setIsDeleting(true)
    const res = await deleteMediaRecordAction(media.id, media.file_path)
    setIsDeleting(false)

    if (res.success) {
      toast.success(`Deleted ${media.filename}`)
      onSuccess()
      onClose()
    } else {
      toast.error(res.error || 'Failed to delete file')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Window */}
      <div className="relative bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shadow-xs shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 leading-tight">
            Delete Media Asset?
          </h3>
          <p className="text-xs text-slate-600">
            Are you sure you want to permanently delete{' '}
            <strong className="text-slate-900">{media.filename}</strong>? This file will be removed from Supabase storage and the database.
          </p>
        </div>

        {/* Checking Usage Loader */}
        {isChecking ? (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            <span>Checking if file is referenced in site content...</span>
          </div>
        ) : (
          usageInfo?.isReferenced && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2 text-amber-900 text-xs">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Warning: Asset Currently In Use!</span>
              </div>
              <p className="text-amber-800 leading-relaxed">
                This media file appears to be linked in the following content sections:
              </p>
              <ul className="list-disc list-inside space-y-1 font-semibold text-amber-900 pt-1">
                {usageInfo.references.map((ref, idx) => (
                  <li key={idx}>
                    <span className="capitalize">{ref.tableName}</span> ({ref.count} record(s))
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-amber-700 pt-1 italic">
                Deleting this file will result in broken image or download links on the website.
              </p>
            </div>
          )
        )}

        {/* Dialog Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting || isChecking}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors shadow-xs"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Permanently Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

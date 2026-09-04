'use client'

import { useState } from 'react'
import { AlertTriangle, Trash2, X, Loader2, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { CatalogueItem } from '@/src/types/catalogue'
import { deleteCatalogueAction } from '@/app/admin/actions/catalogues'

interface CatalogueDeleteDialogProps {
  catalogue: CatalogueItem | null
  onClose: () => void
  onSuccess: () => void
}

export function CatalogueDeleteDialog({
  catalogue,
  onClose,
  onSuccess,
}: CatalogueDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  if (!catalogue) return null

  // Extract PDF filename for display
  const pdfFilename = catalogue.pdf_url.split('/').pop() || 'Catalogue.pdf'

  const handleDelete = async () => {
    setIsDeleting(true)
    const res = await deleteCatalogueAction(catalogue.id)
    setIsDeleting(false)

    if (res.success) {
      toast.success(`Deleted catalogue "${catalogue.title}"`)
      onSuccess()
      onClose()
    } else {
      toast.error(res.error || 'Failed to delete catalogue')
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
            Delete Catalogue & PDF?
          </h3>
          <p className="text-xs text-slate-600">
            You are about to delete{' '}
            <strong className="text-slate-900">&quot;{catalogue.title}&quot;</strong>.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-2 font-mono text-[11px] font-semibold text-slate-800 bg-white p-2 rounded-xl border border-slate-200 truncate">
            <FileText className="w-4 h-4 text-red-600 shrink-0" />
            <span className="truncate">{pdfFilename}</span>
          </div>
          <p className="text-slate-500">
            This will permanently delete the PDF file from the <strong className="text-slate-800">catalogues</strong> storage bucket and remove the database entry. Shared cover images in the Media Library will not be deleted.
          </p>
        </div>

        {/* Dialog Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-40 transition-colors shadow-xs"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Catalogue
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

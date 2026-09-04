'use client'

import { useState } from 'react'
import {
  Edit2,
  Trash2,
  Image as ImageIcon,
  FileText,
  ExternalLink,
  Copy,
  Download,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'
import { CatalogueItem } from '@/src/types/catalogue'

interface CatalogueCardProps {
  catalogue: CatalogueItem
  onEdit: (catalogue: CatalogueItem) => void
  onDelete: (catalogue: CatalogueItem) => void
  onToggleStatus: (id: string, currentStatus: boolean) => void
}

export function CatalogueCard({
  catalogue,
  onEdit,
  onDelete,
  onToggleStatus,
}: CatalogueCardProps) {
  const [isToggling, setIsToggling] = useState(false)
  const [hasCopied, setHasCopied] = useState(false)

  const pdfFilename = catalogue.pdf_url.split('/').pop() || 'Catalogue.pdf'

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(catalogue.pdf_url)
    setHasCopied(true)
    toast.success('Copied PDF URL!')
    setTimeout(() => setHasCopied(false), 2000)
  }

  const handleStatusToggle = async () => {
    setIsToggling(true)
    await onToggleStatus(catalogue.id, !catalogue.is_published)
    setIsToggling(false)
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
      {/* Header Info */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-14 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
          {catalogue.cover_image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={catalogue.cover_image}
              alt={catalogue.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-5 h-5 text-slate-400" />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
            {catalogue.title}
          </h4>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            {catalogue.category_name && (
              <span className="font-semibold px-2 py-0.2 rounded-full bg-red-50 text-red-700 border border-red-100">
                {catalogue.category_name}
              </span>
            )}
            <a
              href={catalogue.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-red-600 hover:underline flex items-center gap-1 truncate max-w-[140px]"
            >
              <FileText className="w-3 h-3 shrink-0" />
              <span className="truncate">{pdfFilename}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Status & Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <button
          onClick={handleStatusToggle}
          disabled={isToggling}
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border cursor-pointer ${
            catalogue.is_published
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {catalogue.is_published ? 'Published' : 'Draft'}
        </button>

        <div className="flex items-center gap-1">
          <a
            href={catalogue.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
            title="Open PDF"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={handleCopyUrl}
            className="p-2 rounded-lg bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-600 border border-slate-200"
            title="Copy URL"
          >
            {hasCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
          <a
            href={catalogue.pdf_url}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-200"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
          </a>
          <button
            onClick={() => onEdit(catalogue)}
            className="p-2 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(catalogue)}
            className="p-2 rounded-lg bg-slate-50 text-slate-700 hover:bg-red-50 hover:text-red-600 border border-slate-200"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

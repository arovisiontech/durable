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
  Eye,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { CatalogueItem } from '@/src/types/catalogue'

interface CatalogueTableRowProps {
  catalogue: CatalogueItem
  onEdit: (catalogue: CatalogueItem) => void
  onDelete: (catalogue: CatalogueItem) => void
  onToggleStatus: (id: string, currentStatus: boolean) => void
}

export function CatalogueTableRow({
  catalogue,
  onEdit,
  onDelete,
  onToggleStatus,
}: CatalogueTableRowProps) {
  const [isToggling, setIsToggling] = useState(false)
  const [hasCopied, setHasCopied] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)

  const pdfFilename = catalogue.pdf_url.split('/').pop() || 'Catalogue.pdf'

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(catalogue.pdf_url)
    setHasCopied(true)
    toast.success('Copied PDF URL to clipboard!')
    setTimeout(() => setHasCopied(false), 2000)
  }

  const handleStatusToggle = async () => {
    setIsToggling(true)
    await onToggleStatus(catalogue.id, !catalogue.is_published)
    setIsToggling(false)
  }

  return (
    <>
      <tr className="hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-0 text-xs">
        {/* Cover Image & Title */}
        <td className="py-3.5 px-4 font-medium text-slate-900">
          <div className="flex items-center gap-3">
            {/* Cover Thumbnail with View Trigger */}
            <div
              onClick={() => catalogue.cover_image && setShowImageModal(true)}
              className={`relative group w-10 h-12 rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs ${
                catalogue.cover_image ? 'cursor-pointer' : 'bg-slate-100'
              }`}
              title="Click to view cover image"
            >
              {catalogue.cover_image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={catalogue.cover_image}
                    alt={catalogue.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Eye className="w-3.5 h-3.5 text-white" />
                  </div>
                </>
              ) : (
                <ImageIcon className="w-5 h-5 text-slate-400" />
              )}
            </div>

            <div className="min-w-0">
              <p className="font-bold text-slate-900 truncate">{catalogue.title}</p>
              <p className="text-[11px] font-mono text-slate-500 truncate">
                /{catalogue.slug}
              </p>
            </div>
          </div>
        </td>

        {/* Category */}
        <td className="py-3.5 px-4 text-slate-600">
          {catalogue.category_name ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-100">
              {catalogue.category_name}
            </span>
          ) : (
            <span className="text-slate-400 italic text-[11px]">General</span>
          )}
        </td>

        {/* PDF Link */}
        <td className="py-3.5 px-4">
          <a
            href={catalogue.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-red-600 hover:underline max-w-[160px] truncate"
            title="Open PDF in new tab"
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{pdfFilename}</span>
          </a>
        </td>

        {/* Published / Draft Status Toggle */}
        <td className="py-3.5 px-4">
          <button
            onClick={handleStatusToggle}
            disabled={isToggling}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-50 ${
              catalogue.is_published
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
            }`}
            title="Click to toggle status"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                catalogue.is_published ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            {catalogue.is_published ? 'Published' : 'Draft'}
          </button>
        </td>

        {/* Sort Order */}
        <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
          #{catalogue.sort_order}
        </td>

        {/* Created Date */}
        <td className="py-3.5 px-4 text-slate-500 text-[11px]">
          {new Date(catalogue.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </td>

        {/* Actions */}
        <td className="py-3.5 px-4 text-right">
          <div className="flex items-center justify-end gap-1">
            {catalogue.cover_image && (
              <button
                onClick={() => setShowImageModal(true)}
                className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                title="View Cover Image"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}

            {/* Open PDF */}
            <a
              href={catalogue.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Open PDF in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Copy URL */}
            <button
              onClick={handleCopyUrl}
              className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="Copy PDF URL"
            >
              {hasCopied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>

            {/* Download PDF */}
            <a
              href={catalogue.pdf_url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </a>

            {/* Edit */}
            <button
              onClick={() => onEdit(catalogue)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Edit Catalogue"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            {/* Delete */}
            <button
              onClick={() => onDelete(catalogue)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Delete Catalogue"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      {/* Catalogue Cover Lightbox Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full space-y-4 text-center">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">{catalogue.title}</h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="p-1 rounded bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full h-72 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={catalogue.cover_image!}
                alt={catalogue.title}
                className="w-full h-full object-contain p-2"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono">/{catalogue.slug}</span>
              <button
                onClick={() => {
                  setShowImageModal(false)
                  onEdit(catalogue)
                }}
                className="font-bold text-red-600 hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" /> Change Cover Image
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

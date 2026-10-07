'use client'

import React, { useRef } from 'react'
import { Bold, Italic, List, HelpCircle, Eye } from 'lucide-react'
import { RichText } from '@/src/components/ui/RichText'

interface RichTextToolbarProps {
  label?: string
  value: string
  onChange: (newValue: string) => void
  helperText?: string
}

export function RichTextToolbar({ label, value, onChange, helperText }: RichTextToolbarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const applyFormat = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)

    let updatedValue = ''
    let newCursorPos = start

    if (prefix === '• ') {
      // Bullet list handling
      if (selectedText.length > 0) {
        const lines = selectedText.split('\n')
        const bulleted = lines.map((line) => (line.startsWith('• ') ? line : `• ${line}`)).join('\n')
        updatedValue = value.substring(0, start) + bulleted + value.substring(end)
        newCursorPos = start + bulleted.length
      } else {
        const lineStart = value.lastIndexOf('\n', start - 1) + 1
        updatedValue = value.substring(0, lineStart) + '• ' + value.substring(lineStart)
        newCursorPos = start + 2
      }
    } else {
      // Bold or Italic wrapping
      if (selectedText.length > 0) {
        updatedValue = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end)
        newCursorPos = end + prefix.length + suffix.length
      } else {
        const placeholder = prefix === '**' ? 'bold text' : 'italic text'
        updatedValue = value.substring(0, start) + prefix + placeholder + suffix + value.substring(end)
        newCursorPos = start + prefix.length + placeholder.length + suffix.length
      }
    }

    onChange(updatedValue)

    // Restore focus and cursor position after state update
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
      }
    }, 0)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        {label && (
          <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            {label}
          </label>
        )}

        {/* Formatting Toolbar Buttons (Bold, Italic, Bullet List) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs shadow-2xs">
          <span className="text-[10px] font-black uppercase text-slate-400 px-1.5">Format:</span>

          <button
            type="button"
            onClick={() => applyFormat('**', '**')}
            className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-900 font-black rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer border border-slate-200"
            title="Highlight text and click Bold"
          >
            <Bold className="w-3.5 h-3.5 text-[#0B1B3D]" />
            <span>Bold</span>
          </button>

          <button
            type="button"
            onClick={() => applyFormat('*', '*')}
            className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-900 font-bold italic rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer border border-slate-200"
            title="Highlight text and click Italic"
          >
            <Italic className="w-3.5 h-3.5 text-[#E31B23]" />
            <span>Italic</span>
          </button>

          <button
            type="button"
            onClick={() => applyFormat('• ')}
            className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-900 font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer border border-slate-200"
            title="Insert Bullet Point"
          >
            <List className="w-3.5 h-3.5 text-slate-700" />
            <span>Bullet</span>
          </button>
        </div>
      </div>

      {/* Main Textarea */}
      <textarea
        ref={textareaRef}
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type text here... Highlight text and click Bold, Italic, or Bullet above to format."
        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#E31B23] focus:ring-1 focus:ring-[#E31B23]/30 leading-relaxed font-sans"
      />

      <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium px-1">
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-3 h-3 text-[#E31B23] shrink-0" />
          <span>
            {helperText || 'Highlight text & click Bold, Italic, or Bullet above. Changes save & update live.'}
          </span>
        </div>
      </div>

      {/* Live Formatted Output Preview Box */}
      {value && (
        <div className="bg-slate-900 text-white rounded-xl p-3.5 space-y-1.5 border border-slate-800 shadow-inner">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-red-400 tracking-wider pb-1 border-b border-slate-800">
            <Eye className="w-3 h-3" />
            <span>Live Formatted Preview:</span>
          </div>
          <RichText content={value} className="text-xs text-slate-200 leading-relaxed" />
        </div>
      )}
    </div>
  )
}

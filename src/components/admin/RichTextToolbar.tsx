'use client'

import React, { useRef, useEffect } from 'react'
import { Bold, Italic, List, HelpCircle, Eye } from 'lucide-react'
import { RichText } from '@/src/components/ui/RichText'

interface RichTextToolbarProps {
  label?: string
  value: string
  onChange: (newValue: string) => void
  helperText?: string
}

// Convert markdown to clean HTML for visual editor initial display
function convertMarkdownToHtml(text: string): string {
  if (!text) return ''
  // If already HTML, return directly
  if (/<[a-z][\s\S]*>/i.test(text)) return text

  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.*?)\*/g, '<i>$1</i>')
    .replace(/•\s*(.*?)(\n|$)/g, '<li>$1</li>')
    .replace(/\n/g, '<br>')

  if (html.includes('<li>')) {
    html = `<ul>${html}</ul>`
  }
  return html
}

export function RichTextToolbar({ label, value, onChange, helperText }: RichTextToolbarProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const isInternalChangeRef = useRef(false)

  // Sync value to editor innerHTML on initial load or external update
  useEffect(() => {
    if (editorRef.current && !isInternalChangeRef.current) {
      const formattedHtml = convertMarkdownToHtml(value)
      if (editorRef.current.innerHTML !== formattedHtml) {
        editorRef.current.innerHTML = formattedHtml
      }
    }
    isInternalChangeRef.current = false
  }, [value])

  const handleInput = () => {
    if (!editorRef.current) return
    isInternalChangeRef.current = true
    const currentHtml = editorRef.current.innerHTML
    onChange(currentHtml)
  }

  const execCmd = (command: string, valueArg: string | undefined = undefined) => {
    if (!editorRef.current) return
    editorRef.current.focus()
    document.execCommand(command, false, valueArg)
    handleInput()
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        {label && (
          <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            {label}
          </label>
        )}

        {/* Visual Formatting Toolbar (B Bold, I Italic, Bullet List) */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs shadow-2xs">
          <span className="text-[10px] font-black uppercase text-slate-500 px-1">FORMAT:</span>

          {/* BOLD BUTTON */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault()
              execCmd('bold')
            }}
            className="px-3 py-1 bg-white hover:bg-slate-200 text-slate-900 font-black rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer border border-slate-200"
            title="Make selected text BOLD"
          >
            <Bold className="w-3.5 h-3.5 text-[#0B1B3D]" />
            <span className="font-extrabold">B Bold</span>
          </button>

          {/* ITALIC BUTTON */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault()
              execCmd('italic')
            }}
            className="px-3 py-1 bg-white hover:bg-slate-200 text-slate-900 font-bold italic rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer border border-slate-200"
            title="Make selected text ITALIC"
          >
            <Italic className="w-3.5 h-3.5 text-[#E31B23]" />
            <span className="italic font-bold">I Italic</span>
          </button>

          {/* BULLET LIST BUTTON */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault()
              execCmd('insertUnorderedList')
            }}
            className="px-3 py-1 bg-white hover:bg-slate-200 text-slate-900 font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer border border-slate-200"
            title="Create Bulleted List"
          >
            <List className="w-3.5 h-3.5 text-slate-700" />
            <span>: Bullet</span>
          </button>
        </div>
      </div>

      {/* Visual ContentEditable Rich Text Editor Input Box */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        className="w-full min-h-[120px] p-4 bg-white border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#E31B23] focus:ring-2 focus:ring-[#E31B23]/20 leading-relaxed font-sans shadow-inner overflow-y-auto [&_b]:font-black [&_b]:text-[#0B1B3D] [&_strong]:font-black [&_strong]:text-[#0B1B3D] [&_i]:italic [&_i]:text-[#E31B23] [&_em]:italic [&_em]:text-[#E31B23] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:text-slate-800"
        style={{ minHeight: '120px' }}
      />

      <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium px-1">
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-[#E31B23] shrink-0" />
          <span>
            {helperText || 'Highlight text & click B Bold or I Italic. Text will format visually inside the box.'}
          </span>
        </div>
      </div>

      {/* Live Formatted Output Preview Box */}
      {value && (
        <div className="bg-slate-900 text-white rounded-xl p-3.5 space-y-1.5 border border-slate-800 shadow-inner">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-red-400 tracking-wider pb-1 border-b border-slate-800">
            <Eye className="w-3 h-3" />
            <span>Live Output Preview on Website:</span>
          </div>
          <RichText content={value} className="text-xs text-slate-200 leading-relaxed" />
        </div>
      )}
    </div>
  )
}

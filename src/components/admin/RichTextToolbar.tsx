import React from 'react'
import { Bold, Italic, List, HelpCircle } from 'lucide-react'

interface RichTextToolbarProps {
  label?: string
  value: string
  onChange: (newValue: string) => void
  helperText?: string
}

export function RichTextToolbar({ label, value, onChange, helperText }: RichTextToolbarProps) {
  const insertFormatting = (prefix: string, suffix: string = '') => {
    if (!prefix) return
    const selection = window.getSelection()?.toString() || 'Sample Text'
    const newText = value ? `${value}\n${prefix}${selection}${suffix}` : `${prefix}${selection}${suffix}`
    onChange(newText)
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        {label && (
          <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            {label}
          </label>
        )}

        {/* Formatting Toolbar Buttons (Bold, Italic, Bullet List) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <span className="text-[10px] font-black uppercase text-slate-400 px-1.5">Format:</span>
          
          <button
            type="button"
            onClick={() => insertFormatting('**', '**')}
            className="px-2 py-1 bg-white hover:bg-slate-200 text-slate-800 font-extrabold rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
            title="Add Bold text (**text**)"
          >
            <Bold className="w-3 h-3 text-[#0B1B3D]" />
            <span>Bold</span>
          </button>

          <button
            type="button"
            onClick={() => insertFormatting('*', '*')}
            className="px-2 py-1 bg-white hover:bg-slate-200 text-slate-800 font-semibold italic rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
            title="Add Italic text (*text*)"
          >
            <Italic className="w-3 h-3 text-[#E31B23]" />
            <span>Italic</span>
          </button>

          <button
            type="button"
            onClick={() => insertFormatting('• ')}
            className="px-2 py-1 bg-white hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
            title="Add Bullet Point (• item)"
          >
            <List className="w-3 h-3 text-slate-700" />
            <span>Bullet</span>
          </button>
        </div>
      </div>

      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type text here... Use **text** for bold, *text* for italic, or • for bullet points."
        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#E31B23] focus:ring-1 focus:ring-[#E31B23]/30 leading-relaxed font-sans"
      />

      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
        <HelpCircle className="w-3 h-3 text-[#E31B23] shrink-0" />
        <span>
          {helperText || 'Use **bold**, *italic*, or start lines with • for bullet lists. Supports multi-paragraph text.'}
        </span>
      </div>
    </div>
  )
}

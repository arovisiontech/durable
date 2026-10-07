import React from 'react'

interface RichTextProps {
  content?: string
  className?: string
}

export function RichText({ content, className = '' }: RichTextProps) {
  if (!content) return null

  // If content contains raw HTML tags (e.g. <b>, <i>, <ul>, <strong>, <em>), render raw HTML safely with rich styling
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return (
      <div
        className={`leading-relaxed [&_b]:font-black [&_b]:text-[#0B1B3D] [&_strong]:font-black [&_strong]:text-[#0B1B3D] [&_i]:italic [&_i]:font-bold [&_i]:text-[#E31B23] [&_em]:italic [&_em]:font-bold [&_em]:text-[#E31B23] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:my-2 [&_li]:text-slate-700 ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  // Otherwise parse Markdown style syntax:
  // **bold**, *italic*, \n line breaks, and bullet items starting with •, -, or *
  const lines = content.split('\n')

  return (
    <div className={`space-y-2 ${className}`}>
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={lineIdx} className="h-1.5" />

        const isBullet = trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ')
        const cleanText = isBullet ? trimmed.replace(/^[•\-\*]\s*/, '') : trimmed

        // Parse **bold** and *italic*
        const parts = cleanText.split(/(\*\*.*?\*\*|\*.*?\*)/g)
        const parsedElements = parts.map((part, partIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={partIdx} className="font-extrabold text-[#0B1B3D]">
                {part.slice(2, -2)}
              </strong>
            )
          }
          if (part.startsWith('*') && part.endsWith('*')) {
            return (
              <em key={partIdx} className="italic font-bold text-[#E31B23]">
                {part.slice(1, -1)}
              </em>
            )
          }
          return part
        })

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-2">
              <span className="text-[#E31B23] font-black text-sm leading-none shrink-0">•</span>
              <span className="flex-1 text-slate-600 leading-relaxed font-medium">{parsedElements}</span>
            </div>
          )
        }

        return (
          <p key={lineIdx} className="text-slate-600 leading-relaxed font-medium">
            {parsedElements}
          </p>
        )
      })}
    </div>
  )
}

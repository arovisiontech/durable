import Link from 'next/link'
import { ArrowLeft, Clock, Layers } from 'lucide-react'

interface ComingSoonPlaceholderProps {
  title: string
  description?: string
  category?: string
}

export function ComingSoonPlaceholder({
  title,
  description = 'This feature module is scheduled for implementation in the next phase of development.',
  category = 'Admin Module',
}: ComingSoonPlaceholderProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
              {category}
            </span>
            <span className="text-xs text-slate-500">• Phase 2 Roadmap</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h1>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-xs text-center max-w-3xl mx-auto my-8 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto shadow-sm">
          <Clock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {title} Module Coming Soon
          </h2>
          <p className="text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Database Tables Ready</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>RLS Protected</span>
          </div>
        </div>
      </div>
    </div>
  )
}

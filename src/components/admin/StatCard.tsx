import Link from 'next/link'
import { LucideIcon, ArrowUpRight } from 'lucide-react'

interface StatCardProps {
  title: string
  count: number
  icon: LucideIcon
  href: string
  description?: string
  accentColor?: string
}

export function StatCard({
  title,
  count,
  icon: Icon,
  href,
  description = 'Total active items',
}: StatCardProps) {
  return (
    <Link
      href={href}
      className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
    >
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-red-50 text-slate-700 group-hover:text-red-600 border border-slate-200 group-hover:border-red-100 flex items-center justify-center transition-colors">
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-slate-400 group-hover:text-red-600 transition-colors p-1">
          <ArrowUpRight className="w-5 h-5" />
        </span>
      </div>

      <div className="mt-4 space-y-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {count.toLocaleString()}
          </span>
        </div>
        <p className="text-xs text-slate-500 pt-1">{description}</p>
      </div>
    </Link>
  )
}

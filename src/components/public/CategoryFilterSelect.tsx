'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filter } from 'lucide-react'

interface CategoryOption {
  id: string
  name: string
  slug: string
}

interface CategoryFilterSelectProps {
  categories: CategoryOption[]
  currentCategory: string
  basePath: string
}

export function CategoryFilterSelect({
  categories,
  currentCategory,
  basePath,
}: CategoryFilterSelectProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    const params = new URLSearchParams(searchParams.toString())

    if (val === 'all') {
      params.delete('category')
    } else {
      params.set('category', val)
    }

    const queryString = params.toString()
    router.push(queryString ? `${basePath}?${queryString}` : basePath)
  }

  return (
    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700">
      <Filter className="w-3.5 h-3.5 text-slate-400" />
      <select
        value={currentCategory}
        onChange={handleChange}
        className="bg-transparent focus:outline-none font-semibold text-slate-900 cursor-pointer max-w-[160px] truncate"
      >
        <option value="all">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  )
}

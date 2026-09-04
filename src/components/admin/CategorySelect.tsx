'use client'

import { CategoryItem } from '@/src/types/category'

interface CategorySelectProps {
  value: string | null | undefined
  onChange: (value: string | null) => void
  categories: CategoryItem[]
  disabled?: boolean
  placeholder?: string
  excludeId?: string
}

export function CategorySelect({
  value,
  onChange,
  categories,
  disabled = false,
  placeholder = 'Select Category (Optional Parent)',
  excludeId,
}: CategorySelectProps) {
  // Filter out excluded ID (e.g. self)
  const availableCategories = excludeId
    ? categories.filter((c) => c.id !== excludeId)
    : categories

  // Format hierarchy with prefix indentation
  const getIndentPrefix = (level?: number) => {
    if (!level || level === 0) return ''
    return '  '.repeat(level) + '└─ '
  }

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value === '' ? null : e.target.value)}
      disabled={disabled}
      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-900 disabled:opacity-50 font-medium"
    >
      <option value="">{placeholder}</option>
      {availableCategories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {getIndentPrefix(cat.level)}{cat.name}
        </option>
      ))}
    </select>
  )
}

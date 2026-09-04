'use client'

import { useState, useRef, useEffect } from 'react'
import { User, LogOut, ChevronDown, ShieldCheck } from 'lucide-react'
import { logoutAction } from '@/app/admin/actions'

interface UserDropdownProps {
  email?: string
  fullName?: string
  role?: string
}

export function UserDropdown({ email, fullName, role = 'editor' }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 text-left"
        aria-label="User Menu"
      >
        <div className="w-8 h-8 rounded-lg bg-red-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
          {fullName ? fullName.charAt(0).toUpperCase() : email ? email.charAt(0).toUpperCase() : 'A'}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[140px]">
            {fullName || email}
          </p>
          <span className="text-[10px] font-semibold text-slate-500 capitalize block">
            {role}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-3">
            <p className="text-xs text-slate-500 font-medium">Signed in as</p>
            <p className="text-sm font-bold text-slate-900 truncate mt-0.5">{email}</p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-100">
                <ShieldCheck className="w-3 h-3 text-red-600" />
                {role}
              </span>
            </div>
          </div>

          <div className="py-1">
            <div className="px-4 py-2 text-xs text-slate-500 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{fullName || 'Administrator'}</span>
            </div>
          </div>

          <div className="pt-1">
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full px-4 py-2.5 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4 text-red-600" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

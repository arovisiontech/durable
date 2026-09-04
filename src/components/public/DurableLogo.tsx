'use client'

import Link from 'next/link'

interface DurableLogoProps {
  className?: string
}

export function DurableLogo({ className = '' }: DurableLogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      <div className="flex flex-col">
        {/* Heartbeat / ECG Wave Graphic above text */}
        <div className="flex items-center gap-1 -mb-1">
          <svg
            className="w-12 h-3 text-red-600 shrink-0"
            viewBox="0 0 100 25"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 0 15 L 25 15 L 35 3 L 45 22 L 55 8 L 65 15 L 100 15" />
          </svg>
        </div>

        {/* Brand Main Text */}
        <div className="flex flex-col leading-none">
          <span className="font-black text-xl sm:text-2xl tracking-tighter text-[#0B1B3D] flex items-center">
            <span className="text-[#E31B23]">DUR</span>ABLE
          </span>
          <span className="font-extrabold text-[9px] sm:text-[10px] tracking-wider text-[#E31B23] uppercase mt-0.5">
            HOSPITAL SUPPLIES
          </span>
          <span className="text-[8px] font-semibold text-slate-500 italic mt-0.5">
            Serve Life - Our Aim
          </span>
        </div>
      </div>
    </Link>
  )
}

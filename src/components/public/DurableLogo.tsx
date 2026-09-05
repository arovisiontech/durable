'use client'

import Link from 'next/link'

interface DurableLogoProps {
  className?: string
  heightClass?: string
}

export function DurableLogo({ className = '', heightClass = 'h-10 sm:h-12' }: DurableLogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center group ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.svg"
        alt="Durable Medical"
        className={`${heightClass} w-auto object-contain transition-opacity hover:opacity-95`}
      />
    </Link>
  )
}

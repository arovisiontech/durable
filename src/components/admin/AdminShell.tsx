'use client'

import { useState } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { ToasterProvider } from './ToasterProvider'

interface AdminShellProps {
  children: React.ReactNode
  email?: string
  fullName?: string
  role?: string
}

export function AdminShell({ children, email, fullName, role }: AdminShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased selection:bg-red-500 selection:text-white">
      <ToasterProvider />

      {/* Sidebar Navigation */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Layout Wrapper */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}
      >
        {/* Sticky Header */}
        <AdminHeader
          email={email}
          fullName={fullName}
          role={role}
          onOpenMobile={() => setIsMobileOpen(true)}
        />

        {/* Content Body Area - Responsive from Mobile up to 64-Inch 4K TV Displays */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 w-full max-w-7xl 2xl:max-w-[1680px] [@media(min-width:1920px)]:max-w-[1880px] [@media(min-width:2560px)]:max-w-[2500px] [@media(min-width:3400px)]:max-w-[3300px] mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}

'use client'

import { usePathname } from 'next/navigation'
import { Menu, Shield } from 'lucide-react'
import { UserDropdown } from './UserDropdown'

interface AdminHeaderProps {
  email?: string
  fullName?: string
  role?: string
  onOpenMobile: () => void
}

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard Overview',
  '/admin/content/home': 'Home Page Content',
  '/admin/content/about': 'About Us Content',
  '/admin/content/contact': 'Contact Page Content',
  '/admin/content/faqs': 'Frequently Asked Questions',
  '/admin/products': 'Product Catalog Management',
  '/admin/categories': 'Product Categories',
  '/admin/catalogues': 'PDF Catalogues & Brochures',
  '/admin/blogs': 'Blogs & News Articles',
  '/admin/media': 'Media Assets Library',
  '/admin/certifications': 'Medical Certifications',
  '/admin/statistics': 'Key Performance Metrics',
  '/admin/process-steps': 'Manufacturing Process Steps',
  '/admin/navigation': 'Website Navigation Items',
  '/admin/contact-messages': 'Customer Contact Messages',
  '/admin/newsletter': 'Newsletter Subscribers',
  '/admin/settings': 'Website Configuration & Settings',
  '/admin/users': 'User Accounts & Access Control',
  '/admin/activity-logs': 'System Activity Audit Logs',
}

export function AdminHeader({
  email,
  fullName,
  role = 'editor',
  onOpenMobile,
}: AdminHeaderProps) {
  const pathname = usePathname()
  const pageTitle = pageTitles[pathname] || 'Administration Panel'

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left side: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight line-clamp-1">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right side: Role badge & User Dropdown */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-100 text-xs font-bold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5 text-red-600" />
          <span>{role}</span>
        </div>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        <UserDropdown email={email} fullName={fullName} role={role} />
      </div>
    </header>
  )
}

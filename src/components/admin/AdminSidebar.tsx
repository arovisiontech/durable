'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Globe,
  Home,
  Info,
  Phone,
  HelpCircle,
  Package,
  FolderTree,
  FileText,
  Newspaper,
  Image,
  Award,
  BarChart3,
  ListOrdered,
  Navigation,
  MessageSquare,
  Mail,
  Settings,
  Users,
  History,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Cross,
} from 'lucide-react'

interface AdminSidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  isMobileOpen: boolean
  onCloseMobile: () => void
}

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
}

interface NavGroup {
  name: string
  icon: React.ElementType
  items: NavItem[]
}

const mainNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
]

const contentNavGroup: NavGroup = {
  name: 'Website Content',
  icon: Globe,
  items: [
    { name: 'Home Page', href: '/admin/content/home', icon: Home },
    { name: 'About Us', href: '/admin/content/about', icon: Info },
    { name: 'Contact Page', href: '/admin/content/contact', icon: Phone },
    { name: 'FAQs', href: '/admin/content/faqs', icon: HelpCircle },
  ],
}

const catalogNavItems: NavItem[] = [
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: FolderTree },
  { name: 'Catalogues', href: '/admin/catalogues', icon: FileText },
  { name: 'Blogs', href: '/admin/blogs', icon: Newspaper },
  { name: 'Media Library', href: '/admin/media', icon: Image },
]

const companyNavItems: NavItem[] = [
  { name: 'Certifications', href: '/admin/certifications', icon: Award },
  { name: 'Statistics', href: '/admin/statistics', icon: BarChart3 },
  { name: 'Process Steps', href: '/admin/process-steps', icon: ListOrdered },
  { name: 'Navigation', href: '/admin/navigation', icon: Navigation },
]

const engagementNavItems: NavItem[] = [
  { name: 'Contact Messages', href: '/admin/contact-messages', icon: MessageSquare },
  { name: 'Newsletter', href: '/admin/newsletter', icon: Mail },
]

const systemNavItems: NavItem[] = [
  { name: 'Website Settings', href: '/admin/settings', icon: Settings },
  { name: 'Users & Roles', href: '/admin/users', icon: Users },
  { name: 'Activity Logs', href: '/admin/activity-logs', icon: History },
]

export function AdminSidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname()
  const isContentActive = pathname.startsWith('/admin/content')
  const [isContentOpen, setIsContentOpen] = useState(isContentActive)

  const renderNavItem = (item: NavItem) => {
    const isActive = pathname === item.href
    const Icon = item.icon

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onCloseMobile}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
          isActive
            ? 'bg-red-600 text-white shadow-md shadow-red-600/20 font-bold'
            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
        } ${isCollapsed ? 'justify-center px-2' : ''}`}
        title={isCollapsed ? item.name : undefined}
      >
        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
        {!isCollapsed && <span className="truncate">{item.name}</span>}
      </Link>
    )
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0D1527] text-slate-200 border-r border-slate-800/80">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 shrink-0">
        <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center font-black text-white shadow-md shadow-red-600/20 text-base shrink-0">
            <Cross className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <span className="font-extrabold text-sm text-white block leading-tight tracking-tight truncate">
                DURABLE
              </span>
              <span className="text-[10px] font-semibold text-red-400 block tracking-widest uppercase truncate">
                Medical Admin
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>

        {/* Mobile Close Trigger */}
        <button
          onClick={onCloseMobile}
          className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links Scroll Container */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {/* Main Dashboard */}
        <div className="space-y-1">
          {!isCollapsed && (
            <span className="px-3 text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block mb-1">
              Overview
            </span>
          )}
          {mainNavItems.map(renderNavItem)}
        </div>

        {/* Website Content Group */}
        <div className="space-y-1">
          {!isCollapsed && (
            <span className="px-3 text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block mb-1">
              Pages
            </span>
          )}
          {isCollapsed ? (
            contentNavGroup.items.map(renderNavItem)
          ) : (
            <div>
              <button
                onClick={() => setIsContentOpen(!isContentOpen)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors text-slate-300 hover:bg-slate-800/60 hover:text-white ${
                  isContentActive ? 'text-white font-bold bg-slate-800/40' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">Website Content</span>
                </div>
                {isContentOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
              </button>
              {isContentOpen && (
                <div className="mt-1 ml-4 pl-2 border-l border-slate-800 space-y-1">
                  {contentNavGroup.items.map(renderNavItem)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Catalog & Media */}
        <div className="space-y-1">
          {!isCollapsed && (
            <span className="px-3 text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block mb-1">
              Catalog & Media
            </span>
          )}
          {catalogNavItems.map(renderNavItem)}
        </div>

        {/* Company & Info */}
        <div className="space-y-1">
          {!isCollapsed && (
            <span className="px-3 text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block mb-1">
              Company
            </span>
          )}
          {companyNavItems.map(renderNavItem)}
        </div>

        {/* Engagement */}
        <div className="space-y-1">
          {!isCollapsed && (
            <span className="px-3 text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block mb-1">
              Engagement
            </span>
          )}
          {engagementNavItems.map(renderNavItem)}
        </div>

        {/* System Administration */}
        <div className="space-y-1">
          {!isCollapsed && (
            <span className="px-3 text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block mb-1">
              System
            </span>
          )}
          {systemNavItems.map(renderNavItem)}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block fixed top-0 left-0 bottom-0 z-40 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 max-w-xs w-full bg-[#0D1527] h-full shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}

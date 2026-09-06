'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
} from 'lucide-react'
import { PublicSiteSettings, PublicNavigationItem } from '@/src/types/public'
import { CategoryItem } from '@/src/types/category'
import { DurableLogo } from './DurableLogo'
import { PublicSearchModal } from './PublicSearchModal'

interface PublicHeaderProps {
  settings?: PublicSiteSettings | null
  navigation?: PublicNavigationItem[]
  categories?: CategoryItem[]
}

interface NavItem {
  label: string
  url: string
  children?: { label: string; url: string }[]
}

export function PublicHeader({ navigation = [] }: PublicHeaderProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isEventsDropdownOpen, setIsEventsDropdownOpen] = useState(false)
  const [isMobileEventsOpen, setIsMobileEventsOpen] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Standard Navigation Links with Events Sub-menu
  const defaultNavLinks: NavItem[] = [
    { label: 'Home', url: '/' },
    { label: 'About', url: '/about' },
    { label: 'Products', url: '/products' },
    {
      label: 'Events',
      url: '/events',
      children: [
        { label: 'Recent Events', url: '/events/recent' },
        { label: 'Upcoming Events', url: '/events/upcoming' },
      ],
    },
    { label: "FAQ's", url: '/faqs' },
    { label: 'Blog', url: '/blog' },
    { label: 'Contact', url: '/contact' },
  ]

  const linksToRender = defaultNavLinks

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsEventsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="w-full relative z-50 bg-white shadow-xs">
      {/* Top Accent Line */}
      <div className="h-1.5 bg-[#051026] w-full" />

      {/* Main Header Container */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <DurableLogo />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-8 text-sm font-bold text-[#1E293B]">
            {linksToRender.map((nav) => {
              const isEvents = nav.url === '/events'
              const isActive =
                nav.url === '/' ? pathname === '/' : pathname.startsWith(nav.url)

              if (isEvents) {
                return (
                  <div
                    key={nav.url}
                    ref={dropdownRef}
                    className="relative py-1"
                    onMouseEnter={() => setIsEventsDropdownOpen(true)}
                    onMouseLeave={() => setIsEventsDropdownOpen(false)}
                  >
                    <button
                      onClick={() => setIsEventsDropdownOpen(!isEventsDropdownOpen)}
                      className={`hover:text-[#E31B23] transition-colors relative py-1 inline-flex items-center gap-1 cursor-pointer uppercase ${
                        isActive ? 'text-[#E31B23] font-black' : 'text-slate-800 font-bold'
                      }`}
                    >
                      <span>{nav.label}</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#E31B23] rounded-full" />
                      )}
                    </button>

                    {/* Floating Dropdown Card (Matching SS 1) */}
                    {isEventsDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-2xl border border-slate-100 shadow-2xl py-3 px-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                        {nav.children?.map((child) => {
                          const isChildActive = pathname === child.url
                          return (
                            <Link
                              key={child.url}
                              href={child.url}
                              prefetch={true}
                              onClick={() => setIsEventsDropdownOpen(false)}
                              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                isChildActive
                                  ? 'bg-red-50 text-[#E31B23]'
                                  : 'text-slate-800 hover:bg-slate-50 hover:text-[#E31B23]'
                              }`}
                            >
                              <span className="w-2 h-2 rounded-full bg-[#E31B23] shrink-0" />
                              <span>{child.label}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={nav.url}
                  href={nav.url}
                  prefetch={true}
                  className={`hover:text-[#E31B23] transition-colors relative py-1 uppercase ${
                    isActive ? 'text-[#0B1B3D] font-extrabold' : 'text-slate-800 font-bold'
                  }`}
                >
                  <span>{nav.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#E31B23] rounded-full" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right Header Controls (Search, Cart, Partner Button) */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-slate-700 hover:text-[#E31B23] transition-colors"
              title="Search Products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Shopping Cart Icon with Badge */}
            <Link
              href="/products"
              prefetch={true}
              className="p-2 text-slate-700 hover:text-[#E31B23] transition-colors relative"
              title="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#0B1B3D] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Partner With Us Dark Navy Pill Button */}
            <Link
              href="/contact"
              prefetch={true}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B1B3D] hover:bg-[#051026] text-white text-xs font-extrabold rounded-full transition-all shadow-md hover:shadow-lg"
            >
              <span>Partner With Us</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Navigation Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-800 hover:text-[#E31B23] transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3 font-semibold text-slate-800 text-sm">
            {linksToRender.map((nav) => {
              if (nav.children) {
                return (
                  <div key={nav.url} className="space-y-2 border-b border-slate-100 pb-2">
                    <button
                      onClick={() => setIsMobileEventsOpen(!isMobileEventsOpen)}
                      className="w-full flex items-center justify-between text-left font-bold text-slate-900 py-1"
                    >
                      <span className="uppercase">{nav.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isMobileEventsOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isMobileEventsOpen && (
                      <div className="pl-4 space-y-2 border-l-2 border-red-500">
                        {nav.children.map((child) => (
                          <Link
                            key={child.url}
                            href={child.url}
                            prefetch={true}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#E31B23] py-1"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]" />
                            <span>{child.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={nav.url}
                  href={nav.url}
                  prefetch={true}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-1 border-b border-slate-100 hover:text-[#E31B23] uppercase font-bold"
                >
                  {nav.label}
                </Link>
              )
            })}
          </nav>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-3">
            <Link
              href="/contact"
              prefetch={true}
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 text-center text-xs font-bold text-white bg-[#0B1B3D] rounded-full shadow-md"
            >
              Partner With Us →
            </Link>
          </div>
        </div>
      )}

      {/* Live Search Modal */}
      <PublicSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  )
}

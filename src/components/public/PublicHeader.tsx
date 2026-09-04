'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ArrowRight,
} from 'lucide-react'
import { PublicSiteSettings, PublicNavigationItem } from '@/src/types/public'
import { CategoryItem } from '@/src/types/category'
import { DurableLogo } from './DurableLogo'
import { PublicSearchModal } from './PublicSearchModal'

interface PublicHeaderProps {
  settings: PublicSiteSettings | null
  navigation: PublicNavigationItem[]
  categories: CategoryItem[]
}

export function PublicHeader({ navigation }: PublicHeaderProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const navLinks = [
    { label: 'Home', url: '/' },
    { label: 'About', url: '/about' },
    { label: 'Products', url: '/products' },
    { label: 'Strengths', url: '/strengths' },
    { label: "FAQ's", url: '/faqs' },
    { label: 'Blog', url: '/blog' },
    { label: 'Contact', url: '/contact' },
  ]

  // Use dynamic nav links if provided or fall back to standard links
  const linksToRender = navigation.length > 0 ? navigation : navLinks

  return (
    <header className="w-full relative z-40 bg-white shadow-xs">
      {/* Top Accent Line */}
      <div className="h-1 bg-[#051026] w-full" />

      {/* Main Header Container */}
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <DurableLogo />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-bold text-[#1E293B]">
            {linksToRender.map((nav) => {
              const isActive =
                nav.url === '/' ? pathname === '/' : pathname.startsWith(nav.url)

              return (
                <Link
                  key={nav.url}
                  href={nav.url}
                  prefetch={true}
                  className={`hover:text-[#E31B23] transition-colors relative py-1 ${
                    isActive ? 'text-[#0B1B3D] font-extrabold' : 'text-slate-700 font-semibold'
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
            {linksToRender.map((nav) => (
              <Link
                key={nav.url}
                href={nav.url}
                prefetch={true}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 border-b border-slate-100 hover:text-[#E31B23]"
              >
                {nav.label}
              </Link>
            ))}
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

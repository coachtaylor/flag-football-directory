// components/Navbar.tsx
'use client'
import Link from 'next/link'
import { useState } from 'react'

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const scrollToExplore = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const exploreSection = document.getElementById('explore-states')
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setMobileMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#001f3d] flex items-center justify-center text-white font-bold text-xl shadow-lg">
              FF
            </div>
            <span className="font-bold text-2xl text-[#001f3d]">FlagFootball</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link 
              href="/teams" 
              className="px-5 py-2.5 text-[#345c72] hover:text-[#001f3d] font-semibold rounded-xl hover:bg-[#f6f6f6]"
            >
              Teams
            </Link>
            <Link 
              href="/leagues" 
              className="px-5 py-2.5 text-[#345c72] hover:text-[#001f3d] font-semibold rounded-xl hover:bg-[#f6f6f6]"
            >
              Leagues
            </Link>
            <Link 
              href="/clinics" 
              className="px-5 py-2.5 text-[#345c72] hover:text-[#001f3d] font-semibold rounded-xl hover:bg-[#f6f6f6]"
            >
              Clinics
            </Link>
            <Link 
              href="/tournaments" 
              className="px-5 py-2.5 text-[#345c72] hover:text-[#001f3d] font-semibold rounded-xl hover:bg-[#f6f6f6]"
            >
              Tournaments
            </Link>
            <a 
              href="#explore-states" 
              onClick={scrollToExplore}
              className="px-5 py-2.5 text-[#345c72] hover:text-[#001f3d] font-semibold rounded-xl hover:bg-[#f6f6f6]"
            >
              Explore
            </a>
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden md:block">
            <Link 
              href="/add-program" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#e87a00] text-white font-bold rounded-xl hover:opacity-90 shadow-lg"
            >
              <PlusIcon />
              Add Program
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#345c72] hover:text-[#001f3d] hover:bg-[#f6f6f6] rounded-xl"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-lg">
          <div className="container max-w-7xl mx-auto px-4 py-6 space-y-2">
            <Link 
              href="/teams" 
              className="block px-5 py-3 text-[#345c72] hover:text-[#001f3d] font-semibold rounded-xl hover:bg-[#f6f6f6]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Teams
            </Link>
            <Link 
              href="/leagues" 
              className="block px-5 py-3 text-[#345c72] hover:text-[#001f3d] font-semibold rounded-xl hover:bg-[#f6f6f6]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Leagues
            </Link>
            <Link 
              href="/clinics" 
              className="block px-5 py-3 text-[#345c72] hover:text-[#001f3d] font-semibold rounded-xl hover:bg-[#f6f6f6]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Clinics
            </Link>
            <Link 
              href="/tournaments" 
              className="block px-5 py-3 text-[#345c72] hover:text-[#001f3d] font-semibold rounded-xl hover:bg-[#f6f6f6]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tournaments
            </Link>
            <a 
              href="#explore-states" 
              onClick={scrollToExplore}
              className="block px-5 py-3 text-[#345c72] hover:text-[#001f3d] font-semibold rounded-xl hover:bg-[#f6f6f6]"
            >
              Explore
            </a>
            
            {/* Mobile CTA */}
            <div className="pt-4">
              <Link 
                href="/add-program" 
                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-[#e87a00] text-white font-bold rounded-xl shadow-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <PlusIcon />
                Add Program
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
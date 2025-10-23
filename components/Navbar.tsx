'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '/teams', label: 'Teams', icon: '👥' },
  { href: '/leagues', label: 'Leagues', icon: '🏆' },
  { href: '/clinics', label: 'Clinics', icon: '📚' },
  { href: '/tournaments', label: 'Tournaments', icon: '⚡' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const isHome = pathname === '/'
  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <>
      <header 
        className={`
          sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md
          transition-all duration-200
          ${scrolled ? 'shadow-md' : 'border-[hsl(var(--border-subtle))]'}
        `}
      >
        <nav className="container">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-3 group"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] bg-gradient-to-br from-green-500 to-blue-600 shadow-sm group-hover:shadow-md transition-shadow duration-200">
                <span className="text-xl">🏈</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-lg text-[hsl(var(--neutral-900))] leading-tight">
                  FlagFootball
                </div>
                <div className="text-xs text-[hsl(var(--neutral-500))] leading-tight">
                  Directory
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            {!isHome && (
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium
                      transition-all duration-200 flex items-center gap-2
                      ${isActive(link.href)
                        ? 'bg-green-50 text-[hsl(var(--brand-primary))]'
                        : 'text-[hsl(var(--neutral-700))] hover:bg-[hsl(var(--neutral-100))] hover:text-[hsl(var(--neutral-900))]'
                      }
                    `}
                  >
                    <span className="text-base">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link 
                href="/add-program" 
                className="btn btn-primary btn-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Program
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-[var(--radius-md)] hover:bg-[hsl(var(--neutral-100))] transition-colors duration-200"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg 
                className="w-6 h-6 text-[hsl(var(--neutral-700))]" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Menu Panel */}
          <div className="fixed top-16 left-0 right-0 bottom-0 bg-white z-40 md:hidden animate-slide-down overflow-y-auto">
            <div className="container py-6">
              {/* Navigation Links */}
              {!isHome && (
                <div className="space-y-1 mb-6">
                  <div className="text-xs font-semibold text-[hsl(var(--neutral-500))] uppercase tracking-wide mb-3 px-3">
                    Browse
                  </div>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`
                        flex items-center gap-3 px-3 py-3 rounded-[var(--radius-md)]
                        text-base font-medium transition-colors duration-150
                        ${isActive(link.href)
                          ? 'bg-green-50 text-[hsl(var(--brand-primary))]'
                          : 'text-[hsl(var(--neutral-700))] active:bg-[hsl(var(--neutral-100))]'
                        }
                      `}
                    >
                      <span className="text-2xl">{link.icon}</span>
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}

              {/* Primary Actions */}
              <div className="space-y-3">
                <Link 
                  href="/add-program" 
                  className="btn btn-primary btn-lg w-full"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Your Program
                </Link>
                
                <Link 
                  href="/" 
                  className="btn btn-secondary btn-lg w-full"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Back to Home
                </Link>
              </div>

              {/* Footer Info */}
              <div className="mt-8 pt-6 border-t border-[hsl(var(--border-subtle))]">
                <p className="text-sm text-[hsl(var(--neutral-600))] text-center">
                  Connecting players and programs nationwide
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
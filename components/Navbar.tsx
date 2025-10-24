// components/Navbar.tsx
'use client'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

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
  const pathname = usePathname()
  const onHome = pathname === '/'

  const scrollToExplore = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const exploreSection = document.getElementById('explore-states')
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-6 rounded-3xl border border-gray-200 bg-white px-4 py-3 shadow-md shadow-gray-200/60">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#001f3d] text-lg font-bold text-white shadow-md shadow-[#001f3d]/25">
                FF
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-semibold text-[#001f3d]">FlagFootball</span>
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#345c72]">Directory</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-[#345c72]">
              <Link href="/teams" className="rounded-full px-4 py-2 transition-all hover:bg-[#001f3d]/5 hover:text-[#001f3d]">
                Teams
              </Link>
              <Link href="/leagues" className="rounded-full px-4 py-2 transition-all hover:bg-[#001f3d]/5 hover:text-[#001f3d]">
                Leagues
              </Link>
              <Link href="/clinics" className="rounded-full px-4 py-2 transition-all hover:bg-[#001f3d]/5 hover:text-[#001f3d]">
                Clinics
              </Link>
              <Link href="/tournaments" className="rounded-full px-4 py-2 transition-all hover:bg-[#001f3d]/5 hover:text-[#001f3d]">
                Tournaments
              </Link>
              {onHome && (
                <a
                  href="#explore-states"
                  onClick={scrollToExplore}
                  className="rounded-full px-4 py-2 transition-all hover:bg-[#001f3d]/5 hover:text-[#001f3d]"
                >
                  Explore
                </a>
              )}
            </nav>

            <div className="hidden md:block">
              <Link
                href="/add-program"
                className="inline-flex items-center gap-2 rounded-full bg-[#e87a00] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#e87a00]/20 transition-transform hover:-translate-y-0.5"
              >
                <PlusIcon />
                Add Program
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-2xl p-2 text-[#345c72] transition hover:bg-[#001f3d]/5 hover:text-[#001f3d]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden">
            <div className="mx-auto mt-2 max-w-6xl px-4">
            <div className="rounded-3xl border border-gray-200 bg-white px-4 py-6 shadow-lg shadow-gray-200/40">
              <div className="space-y-2 text-sm font-semibold text-[#345c72]">
                <Link href="/teams" className="block rounded-2xl px-4 py-3 hover:bg-[#001f3d]/5" onClick={() => setMobileMenuOpen(false)}>
                  Teams
                </Link>
                <Link href="/leagues" className="block rounded-2xl px-4 py-3 hover:bg-[#001f3d]/5" onClick={() => setMobileMenuOpen(false)}>
                  Leagues
                </Link>
                <Link href="/clinics" className="block rounded-2xl px-4 py-3 hover:bg-[#001f3d]/5" onClick={() => setMobileMenuOpen(false)}>
                  Clinics
                </Link>
                <Link href="/tournaments" className="block rounded-2xl px-4 py-3 hover:bg-[#001f3d]/5" onClick={() => setMobileMenuOpen(false)}>
                  Tournaments
                </Link>
                {onHome && (
                  <a
                    href="#explore-states"
                    onClick={(e) => {
                      scrollToExplore(e)
                      setMobileMenuOpen(false)
                    }}
                    className="block rounded-2xl px-4 py-3 hover:bg-[#001f3d]/5"
                  >
                    Explore
                  </a>
                )}
              </div>
              <div className="mt-4">
                <Link
                  href="/add-program"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#e87a00] px-5 py-3 font-semibold text-white shadow-lg shadow-[#e87a00]/20"
                >
                  <PlusIcon />
                  Add Program
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

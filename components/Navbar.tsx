'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
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

const ChevronDownIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [desktopMenuOpen, setDesktopMenuOpen] = useState<string | null>(null)
  const [activeMobileSection, setActiveMobileSection] = useState<string | null>(null)
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const pathname = usePathname()

  const baseLinkClasses =
    'rounded-full px-4 py-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-primary-100 hover:to-accent-100 hover:text-primary-700 hover:shadow-sm'
  const activeLinkClasses = 'bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 shadow-sm'

  const navSections = [
    {
      label: 'Adult',
      href: '/',
      items: [
        { label: 'Teams', href: '/adult/teams' },
      ],
    },
    {
      label: 'Youth',
      href: '/youth',
      items: [
        { label: 'Teams', href: '/teams' },
        { label: 'Leagues', href: '/leagues' },
        { label: 'Clinics', href: '/clinics' },
        { label: 'Tournaments', href: '/tournaments' },
      ],
    },
  ]

  const isPathActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`)

  useEffect(() => {
    if (!desktopMenuOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const container = dropdownRefs.current[desktopMenuOpen]
      if (container && !container.contains(event.target as Node)) {
        setDesktopMenuOpen(null)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDesktopMenuOpen(null)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [desktopMenuOpen])

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-6 rounded-3xl border border-primary-200 bg-gradient-to-r from-white via-primary-50/20 to-accent-50/10 px-4 py-3 shadow-lg shadow-primary-200/20">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-lg bg-gradient-to-br from-secondary-800 to-secondary-900 group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-300">
                FF
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-semibold text-secondary-900 group-hover:text-primary-700 transition-colors">FlagFootball</span>
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent-600">Directory</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
              {navSections.map((section) => {
                const hasItems = section.items && section.items.length > 0
                const sectionActive = hasItems
                  ? section.items.some((item) => isPathActive(item.href))
                  : section.href
                  ? isPathActive(section.href)
                  : false

                if (hasItems) {
                  const isOpen = desktopMenuOpen === section.label
                  const triggerActive = sectionActive || isOpen
                  return (
                    <div
                      key={section.label}
                      className="relative"
                      ref={(el) => {
                        dropdownRefs.current[section.label] = el
                      }}
                      onMouseEnter={() => setDesktopMenuOpen(section.label)}
                      onMouseLeave={() => setDesktopMenuOpen(null)}
                    >
                      <button
                        type="button"
                        className={`${baseLinkClasses} inline-flex items-center gap-1.5 ${
                          triggerActive ? activeLinkClasses : 'text-secondary-700'
                        } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300`}
                        aria-label={section.label}
                        aria-haspopup="true"
                        aria-expanded={isOpen}
                        onClick={() => setDesktopMenuOpen(isOpen ? null : section.label)}
                      >
                        {section.label}
                        <ChevronDownIcon
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`absolute left-0 top-full mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-xl transition-all duration-200 ${
                          isOpen ? 'pointer-events-auto opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-1'
                        }`}
                      >
                        <div className="py-2">
                          {section.items.map((item) => {
                            const itemActive = isPathActive(item.href)
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setDesktopMenuOpen(null)}
                                className={`block px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
                                  itemActive
                                    ? 'bg-orange-50 text-[#e87a00]'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#e87a00]'
                                }`}
                              >
                                {item.label}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                }

                if (section.href) {
                  return (
                    <Link
                      key={section.label}
                      href={section.href}
                      className={`${baseLinkClasses} ${sectionActive ? activeLinkClasses : 'text-secondary-700'}`}
                      onMouseEnter={() => setDesktopMenuOpen(null)}
                      onFocus={() => setDesktopMenuOpen(null)}
                    >
                      {section.label}
                    </Link>
                  )
                }

                return null
              })}
            </nav>

            <div className="hidden md:block">
              <Link
                href="/add-program"
                className="btn btn-primary shadow-lg shadow-primary-600/30 hover:shadow-xl hover:shadow-primary-600/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                <PlusIcon />
                Add Program
              </Link>
            </div>

            <button
              onClick={() => {
                if (mobileMenuOpen) {
                  setActiveMobileSection(null)
                }
                setMobileMenuOpen(!mobileMenuOpen)
              }}
              className="md:hidden rounded-2xl p-2 transition-all duration-300 text-secondary-700 hover:bg-gradient-to-r hover:from-primary-100 hover:to-accent-100 hover:text-primary-700"
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
            <div className="rounded-3xl border border-base bg-surface px-4 py-6 shadow-lg">
              <div className="space-y-2 text-sm font-semibold" style={{ color: 'rgb(var(--color-accent-600))' }}>
                {navSections.map((section) => {
                  const hasItems = section.items && section.items.length > 0

                  if (hasItems) {
                    const expanded = activeMobileSection === section.label
                    const panelId = `mobile-${section.label.toLowerCase().replace(/\s+/g, '-')}`
                    return (
                      <div key={section.label} className="rounded-2xl border border-primary-50 bg-white/60">
                        <div className="flex items-stretch overflow-hidden rounded-2xl">
                          {section.href ? (
                            <Link
                              href={section.href}
                              className="flex-1 px-4 py-3 text-left transition-colors duration-200 hover:bg-secondary-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300"
                              onClick={() => {
                                setMobileMenuOpen(false)
                                setActiveMobileSection(null)
                              }}
                            >
                              {section.label}
                            </Link>
                          ) : (
                            <span className="flex-1 px-4 py-3 text-left">{section.label}</span>
                          )}
                          <button
                            type="button"
                            onClick={() => setActiveMobileSection(expanded ? null : section.label)}
                            className="px-4 py-3 text-secondary-500 transition-colors duration-200 hover:text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300"
                            aria-expanded={expanded}
                            aria-controls={panelId}
                            aria-label={`Toggle ${section.label} menu`}
                          >
                            <ChevronDownIcon
                              className={`w-4 h-4 transition-transform duration-200 ${
                                expanded ? 'rotate-180 text-primary-700' : 'text-secondary-500'
                              }`}
                            />
                          </button>
                        </div>
                        {expanded && (
                          <div id={panelId} className="space-y-1 px-2 pb-3 pt-2">
                            {section.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => {
                                  setMobileMenuOpen(false)
                                  setActiveMobileSection(null)
                                }}
                                className="block rounded-xl px-3 py-2 text-secondary-600 transition-colors duration-200 hover:bg-secondary-100 hover:text-primary-700"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  }

                  if (section.href) {
                    return (
                      <Link
                        key={section.label}
                        href={section.href}
                        className="block rounded-2xl px-4 py-3 hover:bg-secondary-100"
                        onClick={() => {
                          setMobileMenuOpen(false)
                          setActiveMobileSection(null)
                        }}
                      >
                        {section.label}
                      </Link>
                    )
                  }

                  return null
                })}
              </div>
              <div className="mt-4">
                <Link
                  href="/add-program"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary w-full justify-center"
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

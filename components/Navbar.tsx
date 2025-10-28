'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

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

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [desktopMenuOpen, setDesktopMenuOpen] = useState<string | null>(null)
  const [activeMobileSection, setActiveMobileSection] = useState<string | null>(null)
  const [signingOut, setSigningOut] = useState(false)
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()

  const baseLinkClasses =
    'rounded-full px-4 py-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-primary-100 hover:to-accent-100 hover:text-primary-700 hover:shadow-sm'
  const activeLinkClasses = 'bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 shadow-sm'

  const navSections = [
    {
      label: 'Adult',
      href: '/adult',
      items: [
        { label: 'Teams', href: '/adult/teams' },
        { label: 'Leagues', href: '/adult/leagues' },
        { label: 'Clinics', href: '/adult/clinics' },
        { label: 'Tournaments', href: '/adult/tournaments' },
        { label: 'Free Agents', href: '/adult/free-agents' },
      ],
    },
    {
      label: 'Youth',
      href: '/youth',
      items: [
        { label: 'Teams', href: '/youth/teams' },
        { label: 'Leagues', href: '/youth/leagues' },
        { label: 'Clinics', href: '/youth/clinics' },
        { label: 'Tournaments', href: '/youth/tournaments' },
        { label: 'Free Agents', href: '/youth/free-agents' },
      ],
    },
  ]

  const isPathActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`)
  const displayName =
    (user?.user_metadata?.first_name as string | undefined)?.trim()
      ? `${(user.user_metadata.first_name as string).split(' ')[0]}${user.user_metadata.last_name ? ` ${(user.user_metadata.last_name as string).charAt(0)}.` : ''}`
      : user?.email?.split('@')[0] ?? 'Account'
  const addProgramHref = user ? '/add-program' : '/login'

  const handleSignOut = async () => {
    try {
      setSigningOut(true)
      await signOut()
      setMobileMenuOpen(false)
      router.push('/')
    } catch (error) {
      console.error('Failed to sign out', error)
    } finally {
      setSigningOut(false)
    }
  }

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
                
                // Check if any child item is active OR if we're on the section's main page
                let sectionActive = false
                if (hasItems) {
                  sectionActive = section.items.some((item) => isPathActive(item.href))
                  // Also check if we're on the section's main landing page
                  if (section.href && isPathActive(section.href)) {
                    sectionActive = true
                  }
                } else if (section.href) {
                  sectionActive = isPathActive(section.href)
                }

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
                      <div className="flex items-center">
                        {section.href ? (
                          <Link
                            href={section.href}
                            className={`${baseLinkClasses} inline-flex items-center gap-1.5 ${
                              triggerActive ? activeLinkClasses : 'text-secondary-700'
                            } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300`}
                            aria-label={section.label}
                            onClick={(e) => {
                              if (!isOpen) {
                                e.preventDefault()
                                setDesktopMenuOpen(section.label)
                              }
                            }}
                          >
                            {section.label}
                            <ChevronDownIcon
                              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </Link>
                        ) : (
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
                        )}
                      </div>
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

            <div className="hidden md:flex items-center gap-3">
              <Link
                href={addProgramHref}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#001f3d] px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-blue-50 hover:text-[#001f3d] hover:-translate-y-0.5 hover:shadow-xl"
              >
                <PlusIcon />
                Add Program
              </Link>

              {user ? (
                <div
                  className="relative"
                  ref={(el) => {
                    dropdownRefs.current['user-menu'] = el
                  }}
                  onMouseEnter={() => setDesktopMenuOpen('user-menu')}
                  onMouseLeave={() => setDesktopMenuOpen(null)}
                >
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-secondary-700 shadow-sm transition-all duration-300 hover:border-[#e87a00] hover:shadow-md"
                    aria-label="User menu"
                    aria-haspopup="true"
                    aria-expanded={desktopMenuOpen === 'user-menu'}
                  >
                    <UserIcon />
                    <span>{displayName}</span>
                    <ChevronDownIcon
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        desktopMenuOpen === 'user-menu' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`absolute right-0 top-full mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-xl transition-all duration-200 ${
                      desktopMenuOpen === 'user-menu'
                        ? 'pointer-events-auto opacity-100 translate-y-0'
                        : 'pointer-events-none opacity-0 -translate-y-1'
                    }`}
                  >
                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setDesktopMenuOpen(null)}
                        className={`block px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
                          pathname === '/dashboard'
                            ? 'bg-orange-50 text-[#e87a00]'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-[#e87a00]'
                        }`}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setDesktopMenuOpen(null)
                          handleSignOut()
                        }}
                        disabled={signingOut}
                        className="block w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {signingOut ? 'Signing out…' : 'Sign Out'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="rounded-2xl px-6 py-2.5 text-sm font-semibold text-white bg-[#001f3d] hover:bg-blue-50 hover:text-[#001f3d] shadow-lg transition-all duration-300"
                >
                  Login
                </Link>
              )}
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
              <div className="mt-6 space-y-3">
                <Link
                  href={addProgramHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full rounded-2xl px-6 py-3 text-center text-sm font-semibold text-white bg-[#001f3d] hover:bg-blue-50 hover:text-[#001f3d] shadow-lg transition-all duration-300"
                >
                  <span className="inline-flex items-center gap-2">
                    <PlusIcon />
                    Add Program
                  </span>
                </Link>
                
                {user ? (
                  <>
                    <div className="pt-3 border-t border-gray-200">
                      <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Account</p>
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#e87a00] transition-all duration-300"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleSignOut}
                        disabled={signingOut}
                        className="block w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {signingOut ? 'Signing out…' : 'Sign Out'}
                      </button>
                    </div>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full rounded-2xl px-6 py-3 text-center text-sm font-semibold text-white bg-[#001f3d] hover:bg-blue-50 hover:text-[#001f3d] shadow-lg transition-all duration-300"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

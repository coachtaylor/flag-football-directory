'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { US_STATES } from '@/lib/states'

const SearchIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const UsersIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
)

const FlagIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
  </svg>
)

const TrophyIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
)

const AcademicCapIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01-.665-6.479L12 14z" />
  </svg>
)

type CategoryType = 'teams' | 'leagues' | 'clinics' | 'tournaments'

const CATEGORIES: Array<{
  key: CategoryType
  label: string
  description: string
  icon: () => JSX.Element
  accent: string
  bgAccent: string
}> = [
  { key: 'teams', label: 'Teams', description: 'Adult squads', icon: UsersIcon, accent: 'rgb(var(--color-secondary-900))', bgAccent: 'rgb(var(--color-secondary-100))' },
  { key: 'leagues', label: 'Leagues', description: 'Season-long play', icon: FlagIcon, accent: 'rgb(var(--color-secondary-900))', bgAccent: 'rgb(var(--color-secondary-100))' },
  { key: 'clinics', label: 'Clinics', description: 'Skills & training', icon: AcademicCapIcon, accent: 'rgb(var(--color-secondary-900))', bgAccent: 'rgb(var(--color-secondary-100))' },
  { key: 'tournaments', label: 'Tournaments', description: 'Travel competition', icon: TrophyIcon, accent: 'rgb(var(--color-secondary-900))', bgAccent: 'rgb(var(--color-secondary-100))' },
]

const FEATURED_ITEMS = [
  {
    title: 'Chicago Co-Ed League',
    subtitle: 'Chicago, IL',
    accent: 'rgb(var(--color-secondary-900))',
    background: 'rgb(var(--color-secondary-50))',
    href: '/leagues?age=ADULT',
  },
  {
    title: 'Vegas Championship',
    subtitle: 'Las Vegas, NV',
    accent: 'rgb(var(--color-primary-600))',
    background: 'rgb(var(--color-primary-50))',
    href: '/tournaments?age=ADULT',
  },
  {
    title: 'NYC Adult League',
    subtitle: 'Starting Spring 2026',
    accent: 'rgb(var(--color-accent-600))',
    background: 'rgb(var(--color-accent-50))',
    href: '/leagues?age=ADULT',
  },
]

export default function HomePage() {
  const router = useRouter()
  const [category, setCategory] = useState<CategoryType>('leagues')
  const [query, setQuery] = useState('')
  const [stateFilter, setStateFilter] = useState('')

  const categoryMeta = useMemo(() => CATEGORIES.find((c) => c.key === category)!, [category])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (stateFilter) params.set('state', stateFilter)
    params.set('age', 'ADULT')
    router.push(`/${category}?${params.toString()}`)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-8 lg:px-12">
          <div className="space-y-8">
            <div className="space-y-6">
              {/* Trust badge */}
              <span className="inline-flex items-center gap-3 rounded-full border border-[#001f3d]/10 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-secondary-800">
                <span className="h-2 w-2 rounded-full bg-[#e87a00]"></span>
                Adult Flag Football Directory
              </span>

              <div className="space-y-6">
                {/* Headline */}
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl xl:text-[3.5rem] xl:leading-[1.05] text-[#001f3d]">
                  Find adult flag football programs{' '}
                  <span className="text-[#e87a00] whitespace-nowrap">near you</span>
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed sm:text-xl text-[#345c72]">
                  Search leagues, teams, tournaments, and clinics designed for adult players. Filter by location, skill level, and format.
                </p>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/10 bg-white px-3 py-1.5">
                  <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#e87a00]" />
                  Updated daily
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/10 bg-white px-3 py-1.5">
                  <span aria-hidden className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-green-600 text-white text-xs font-bold">✓</span>
                  Verified
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/10 bg-white px-3 py-1.5">
                  <span aria-hidden className="relative h-2.5 w-2.5 rounded-full bg-[#345c72]">
                    <span className="absolute inset-1 rounded-full bg-white" />
                  </span>
                  Nationwide coverage
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center">
                <span className="text-xs uppercase tracking-[0.3em] text-accent-600/70">Switch categories to refine your search</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {CATEGORIES.map((item) => {
                  const isActive = category === item.key
                  const Icon = item.icon
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setCategory(item.key)}
                      className={`group flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
                        isActive 
                          ? 'border-[#e87a00] bg-white shadow-lg ring-2 ring-[#e87a00]/20 transform scale-[1.02]' 
                          : 'border-[#001f3d]/10 bg-white hover:border-[#e87a00]/50 hover:shadow-md hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span 
                          className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 ${
                            isActive ? 'bg-[#001f3d] text-white' : 'bg-gray-100 text-[#001f3d]'
                          }`}
                        >
                          <Icon />
                        </span>
                        <div>
                          <p className={`text-sm font-semibold uppercase tracking-[0.18em] transition-colors ${
                            isActive ? 'text-[#001f3d]' : 'text-[#001f3d]'
                          }`}>{item.label}</p>
                          <p className={`text-xs transition-colors ${
                            isActive ? 'text-[#345c72]' : 'text-[#345c72]/80'
                          }`}>{item.description}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold transition-all duration-300 ${
                        isActive ? 'text-[#e87a00] transform translate-x-0.5' : 'text-[#345c72]/60 group-hover:text-[#e87a00]'
                      }`}>→</span>
                    </button>
                  )
                })}
              </div>

              <form className="grid gap-3 rounded-[22px] border border-[#001f3d]/10 bg-white p-5 shadow-lg sm:grid-cols-[1fr,auto,auto] sm:items-center" onSubmit={handleSearch}>
                <label className="flex grow items-center gap-3 rounded-2xl border border-[#001f3d]/15 bg-white px-4 py-3 focus-within:border-[#e87a00] focus-within:ring-2 focus-within:ring-[#e87a00]/25 transition-all duration-200">
                  <SearchIcon />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Search ${categoryMeta.label.toLowerCase()}...`}
                    className="w-full text-sm font-medium focus:outline-none placeholder:text-[#345c72]/60 text-[#001f3d]"
                  />
                </label>
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="w-full rounded-2xl border border-[#001f3d]/15 bg-white px-3 py-3 text-sm font-medium focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25 transition-all duration-200 text-[#001f3d] sm:w-40"
                >
                  <option value="">All states</option>
                  {US_STATES.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-2xl bg-[#e87a00] px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#e87a00]/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#e87a00]/40"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs Section */}
      <section className="relative w-full bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        </div>
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
          <div className="space-y-16">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'rgb(var(--color-secondary-900))' }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgb(var(--color-primary-600))' }}></span>
                Featured Adult Programs
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl" style={{ color: 'rgb(var(--color-secondary-900))' }}>
                  Popular Adult Programs
                </h2>
                <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgb(var(--color-accent-600) / 0.9)' }}>
                  Discover top-rated leagues, teams, and tournaments for adult flag football players
                </p>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
              {FEATURED_ITEMS.map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group relative overflow-hidden rounded-2xl bg-surface border border-base hover:border-secondary-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl w-full max-w-sm"
                >
                  {/* Subtle color accent bar */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: card.accent }}
                  />
                  
                  <div className="p-6 pt-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: 'rgb(var(--color-accent-600) / 0.7)' }}>Featured</p>
                        <h3 className="text-xl font-semibold mb-1" style={{ color: 'rgb(var(--color-secondary-900))' }}>{card.title}</h3>
                        <p className="text-sm" style={{ color: 'rgb(var(--color-accent-600))' }}>{card.subtitle}</p>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                          <span className="text-sm font-medium group-hover:text-white transition-colors" style={{ color: 'rgb(var(--color-secondary-900))' }}>→</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div
                        className="h-32 rounded-xl border-2 border-dashed flex items-center justify-center"
                        style={{ 
                          borderColor: `${card.accent}40`, 
                          backgroundColor: card.background 
                        }}
                      >
                        <div className="text-center">
                          <div 
                            className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                            style={{ backgroundColor: card.accent }}
                          >
                            <span className="text-white font-semibold text-lg">FF</span>
                          </div>
                          <p className="text-xs font-medium" style={{ color: 'rgb(var(--color-accent-600) / 0.8)' }}>Program Preview</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center text-sm font-medium group-hover:text-primary-600 transition-colors" style={{ color: 'rgb(var(--color-accent-600) / 0.7)' }}>
                      <span>Explore details</span>
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative w-full bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        </div>
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
          <div className="rounded-3xl border border-[#001f3d]/10 bg-white p-12 text-center shadow-sm">
            <h2 className="text-3xl font-semibold text-[#001f3d] sm:text-4xl mb-4">
              Run an adult flag football program?
            </h2>
            <p className="text-lg text-[#345c72] mb-8 max-w-2xl mx-auto">
              List your team, league, tournament, or clinic to reach thousands of adult players nationwide
            </p>
            <Link
              href="/add-program"
              className="inline-flex items-center justify-center rounded-2xl border border-[#001f3d]/15 bg-white px-8 py-4 text-base font-semibold text-[#001f3d] shadow-sm transition hover:border-[#e87a00] hover:text-[#e87a00] hover:shadow-md"
            >
              Add Your Program
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

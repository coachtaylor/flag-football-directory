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
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
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
}> = [
  { key: 'teams', label: 'Teams', description: 'Youth & adult squads', icon: UsersIcon, accent: '#001f3d' },
  { key: 'leagues', label: 'Leagues', description: 'Season-long play', icon: FlagIcon, accent: '#e87a00' },
  { key: 'clinics', label: 'Clinics', description: 'Skills & training', icon: AcademicCapIcon, accent: '#345c72' },
  { key: 'tournaments', label: 'Tournaments', description: 'Travel competition', icon: TrophyIcon, accent: '#123a55' },
]

const COLLAGE_ITEMS = [
  {
    title: '7v7 Nationals',
    subtitle: 'Las Vegas, NV',
    accent: '#001f3d',
    background: '#f6f8fb',
    href: '/tournaments',
  },
  {
    title: 'Elite Youth Camp',
    subtitle: 'Atlanta, GA',
    accent: '#e87a00',
    background: '#fff3e5',
    href: '/clinics',
  },
  {
    title: 'Phoenix HS League',
    subtitle: 'Coming Feb 2026',
    accent: '#345c72',
    background: '#eef3f8',
    href: '/leagues',
  },
]

export default function Hero() {
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
    router.push(`/${category}?${params.toString()}`)
  }

  return (
    <section className="relative w-full overflow-hidden bg-gray-50">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-50 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-8 lg:px-12">
        <div className="space-y-8">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-3 rounded-full border border-[#001f3d]/10 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#001f3d]">
                Trusted by coaches & families nationwide
              </span>

              <div className="space-y-6">
                <h1 className="text-4xl font-semibold tracking-tight text-[#001f3d] sm:text-5xl xl:text-[3.5rem] xl:leading-[1.05]">
                  Discover flag football programs that raise the{' '}
                  <span className="relative inline-block">
                    game
                    <span className="absolute inset-x-0 bottom-1 -z-10 h-3 rounded-full bg-[#e87a00]/45" />
                  </span>
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-[#123a55]/90 sm:text-xl">
                  Browse curated teams, leagues, clinics, and tournaments with verified details, modern design, and zero gatekeeping.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-[#345c72]">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-white/80 px-3 py-1">
                  <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#e87a00]" />
                  Updated daily
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-white/80 px-3 py-1">
                  <span aria-hidden className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#001f3d]">✓</span>
                  Verified
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-white/80 px-3 py-1">
                  <span aria-hidden className="relative h-2.5 w-2.5 rounded-full bg-[#345c72]">
                    <span className="absolute inset-1 rounded-full bg-white" />
                  </span>
                  12,000+ searches
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center">
                <span className="text-xs uppercase tracking-[0.3em] text-[#345c72]/70">Switch categories to refine your search</span>
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
                      className={`group flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                        isActive 
                          ? 'border-[#e87a00] bg-white shadow-[0_16px_32px_-24px_rgba(232,122,0,0.3)] ring-2 ring-[#e87a00]/20' 
                          : 'border-[#001f3d]/10 bg-white/80 hover:border-[#001f3d]/25 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span 
                          className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                            isActive ? 'ring-2 ring-[#e87a00]/30' : ''
                          }`} 
                          style={{ 
                            backgroundColor: isActive ? item.accent : `${item.accent}1A`, 
                            color: isActive ? 'white' : item.accent 
                          }}
                        >
                          <Icon />
                        </span>
                        <div>
                          <p className={`text-sm font-semibold uppercase tracking-[0.18em] transition ${
                            isActive ? 'text-[#e87a00]' : 'text-[#001f3d]'
                          }`}>{item.label}</p>
                          <p className={`text-xs transition ${
                            isActive ? 'text-[#e87a00]/80' : 'text-[#345c72]/80'
                          }`}>{item.description}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold transition ${
                        isActive ? 'text-[#e87a00]' : 'text-[#345c72]/60'
                      }`}>→</span>
                    </button>
                  )
                })}
              </div>

              <form className="grid gap-3 rounded-[22px] border border-[#001f3d]/10 bg-white/95 p-5 shadow-[0_18px_45px_-32px_rgba(0,31,61,0.38)] sm:grid-cols-[1fr,auto,auto] sm:items-center" onSubmit={handleSearch}>
                <label className="flex grow items-center gap-3 rounded-2xl border border-[#001f3d]/15 bg-white px-4 py-3 focus-within:border-[#e87a00] focus-within:ring-2 focus-within:ring-[#e87a00]/25">
                  <SearchIcon />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Search ${categoryMeta.label.toLowerCase()}...`}
                    className="w-full text-sm font-medium text-[#001f3d] placeholder:text-[#345c72]/60 focus:outline-none"
                  />
                </label>
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="w-full rounded-2xl border border-[#001f3d]/15 bg-white px-3 py-3 text-sm font-medium text-[#001f3d] focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25 sm:w-40"
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
                  className="inline-flex items-center justify-center rounded-2xl bg-[#e87a00] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_20px_50px_-20px_rgba(232,122,0,0.5)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-22px_rgba(232,122,0,0.6)]"
                >
                  Search
                </button>
              </form>
            </div>
        </div>
      </div>
    </section>
  )
}

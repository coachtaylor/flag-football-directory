// components/Hero.tsx
'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { US_STATES } from '@/lib/states'

// Icons
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const FlagIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
  </svg>
)

const TrophyIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
)

const AcademicCapIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
  </svg>
)

type CategoryType = 'teams' | 'leagues' | 'clinics' | 'tournaments'

const categories = [
  {
    key: 'teams',
    label: 'Teams',
    description: 'Find youth & adult teams',
    icon: UsersIcon,
    gradient: 'from-red-500 to-red-600',  // Red for teams (energy)
  },
  {
    key: 'leagues',
    label: 'Leagues',
    description: 'Compare fees & divisions',
    icon: FlagIcon,
    gradient: 'from-blue-700 to-blue-900',  // Navy for leagues (structure)
  },
  {
    key: 'clinics',
    label: 'Clinics',
    description: 'Training & skill sessions',
    icon: AcademicCapIcon,
    gradient: 'from-teal-500 to-teal-600',  // Teal for clinics (growth)
  },
  {
    key: 'tournaments',
    label: 'Tournaments',
    description: 'Upcoming events',
    icon: TrophyIcon,
    gradient: 'from-red-600 to-orange-600',  // Red-orange for tournaments (competition)
  },
]

export default function Hero() {
  const router = useRouter()
  const [type, setType] = useState<CategoryType>('teams')
  const [q, setQ] = useState('')
  const [st, setSt] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (st) params.set('state', st)
    router.push(`/${type}?${params.toString()}`)
  }

  return (
    <section className="relative overflow-hidden bg-base">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-200 dark:bg-red-900 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-200 dark:bg-teal-900 rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container section relative">
        {/* Main headline */}
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Find Your Perfect{' '}
            <span className="text-gradient-primary">Flag Football</span> Match
          </h1>
          <p className="text-xl text-secondary mb-2">
            Search thousands of teams, leagues, clinics, and tournaments across all 50 states
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-secondary">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span>Updated daily</span>
            </div>
            <div className="text-tertiary">•</div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Verified programs</span>
            </div>
          </div>
        </div>

        {/* Enhanced search card */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="card card-padding shadow-xl">
            {/* Category selector */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setType(cat.key as CategoryType)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-lg 
                    font-medium text-sm whitespace-nowrap
                    transition-all duration-200
                    ${
                      type === cat.key
                        ? 'btn-primary shadow-md scale-105'
                        : 'bg-muted text-secondary hover:bg-border-strong'
                    }
                  `}
                  aria-pressed={type === cat.key}
                >
                  <cat.icon />
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search form */}
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid sm:grid-cols-[1fr,auto] gap-3">
                {/* Search input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon />
                  </div>
                  <input
                    type="text"
                    className="input pl-10 h-12"
                    placeholder={`Search ${type} by name, city, or keyword...`}
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    aria-label="Search query"
                  />
                  {q && (
                    <button
                      type="button"
                      onClick={() => setQ('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-tertiary hover:text-secondary"
                      aria-label="Clear search"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* State selector */}
                <select
                  className="select h-12 min-w-[160px]"
                  value={st}
                  onChange={(e) => setSt(e.target.value)}
                  aria-label="Select state"
                >
                  <option value="">All states</option>
                  {US_STATES.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button type="submit" className="btn btn-primary btn-lg flex-1">
                  <SearchIcon />
                  Search {type}
                </button>
                <a href="/add-program" className="btn btn-accent btn-lg sm:w-auto">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Program
                </a>
              </div>
            </form>
          </div>
        </div>

        {/* Quick access cards */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <a
                  key={cat.key}
                  href={`/${cat.key}`}
                  className="group card card-hover card-padding text-center"
                >
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                    <Icon />
                  </div>
                  <h3 className="font-semibold text-primary mb-1">{cat.label}</h3>
                  <p className="text-xs text-secondary">{cat.description}</p>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ===== COLOR SCHEME =====

Primary (Red):     #DC2626 - Energy, action, passion
Secondary (Navy):  #1E40AF - Trust, stability, professional
Accent (Teal):     #14B8A6 - Modern, fresh, growth

Gradients:
- Red to Red:      Teams (energy)
- Navy to Navy:    Leagues (structure)
- Teal to Teal:    Clinics (growth)
- Red to Orange:   Tournaments (competition)

*/
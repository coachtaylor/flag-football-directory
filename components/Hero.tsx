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

const categories: Array<{
  key: CategoryType
  label: string
  description: string
  icon: () => JSX.Element
  color: string
  bgColor: string
  hoverBgColor: string
  shadowColor: string
}> = [
  {
    key: 'teams',
    label: 'Teams',
    description: 'Youth & adult teams',
    icon: UsersIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    hoverBgColor: 'hover:bg-red-100',
    shadowColor: 'hover:shadow-red-100',
  },
  {
    key: 'leagues',
    label: 'Leagues',
    description: 'Organized competitions',
    icon: FlagIcon,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    hoverBgColor: 'hover:bg-blue-100',
    shadowColor: 'hover:shadow-blue-100',
  },
  {
    key: 'clinics',
    label: 'Clinics',
    description: 'Skills & training',
    icon: AcademicCapIcon,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    hoverBgColor: 'hover:bg-teal-100',
    shadowColor: 'hover:shadow-teal-100',
  },
  {
    key: 'tournaments',
    label: 'Tournaments',
    description: 'Competitive events',
    icon: TrophyIcon,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    hoverBgColor: 'hover:bg-orange-100',
    shadowColor: 'hover:shadow-orange-100',
  },
]

export default function Hero() {
  const router = useRouter()
  const [type, setType] = useState<CategoryType>('leagues')
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
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-50/20 via-transparent to-blue-50/20" />
      
      <div className="container py-16 lg:py-24 relative">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Headline */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-tight drop-shadow-sm">
              Find Flag Football Programs{' '}
              <span className="text-red-600">Near You</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Search thousands of teams, leagues, clinics, and tournaments across the United States
            </p>
          </div>

          {/* Search Card - Enhanced with shadows and depth */}
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 sm:p-8 backdrop-blur-sm border border-gray-100">
            <form onSubmit={handleSearch}>
              {/* Category Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  What are you looking for?
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setType(cat.key as CategoryType)}
                      className={`
                        relative p-4 rounded-xl border-2 text-left transition-all duration-200
                        ${
                          type === cat.key
                            ? 'border-gray-900 bg-gray-900 text-white shadow-lg shadow-gray-300/50 scale-[1.02]'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                        }
                      `}
                    >
                      <div className={`font-semibold mb-1 ${type === cat.key ? 'text-white' : 'text-gray-900'}`}>
                        {cat.label}
                      </div>
                      <div className={`text-xs ${type === cat.key ? 'text-gray-200' : 'text-gray-500'}`}>
                        {cat.description}
                      </div>
                      
                      {/* Selected indicator */}
                      {type === cat.key && (
                        <div className="absolute top-3 right-3 w-2 h-2 bg-white rounded-full shadow-sm" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Inputs */}
              <div className="space-y-4">
                {/* Search Input */}
                <div>
                  <label htmlFor="search" className="block text-sm font-semibold text-gray-900 mb-2">
                    Search by name or location
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <SearchIcon />
                    </div>
                    <input
                      id="search"
                      type="text"
                      className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all shadow-sm focus:shadow-md"
                      placeholder={`Search ${type}...`}
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                    />
                  </div>
                </div>

                {/* State and Search Button */}
                <div className="grid sm:grid-cols-[1fr,auto] gap-3">
                  <div>
                    <label htmlFor="state" className="block text-sm font-semibold text-gray-900 mb-2">
                      State (optional)
                    </label>
                    <select
                      id="state"
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all appearance-none bg-white cursor-pointer shadow-sm focus:shadow-md"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.75rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem',
                      }}
                      value={st}
                      onChange={(e) => setSt(e.target.value)}
                    >
                      <option value="">All states</option>
                      {US_STATES.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:pt-[30px]">
                    <button 
                      type="submit" 
                      className="w-full sm:w-auto px-8 py-3.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition-all shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40 hover:-translate-y-0.5"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-lg">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Updated daily</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span className="font-medium">All 50 states</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-lg">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-medium">Verified programs</span>
            </div>
          </div>
        </div>

        {/* Quick Access Cards - Enhanced with depth */}
        <div className="max-w-5xl mx-auto mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <a
                  key={cat.key}
                  href={`/${cat.key}`}
                  className={`group relative overflow-hidden rounded-xl bg-white border border-gray-200 p-6 text-center transition-all duration-200 hover:shadow-xl ${cat.shadowColor} hover:-translate-y-1 shadow-md`}
                >
                  {/* Subtle background gradient on hover */}
                  <div className={`absolute inset-0 ${cat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />
                  
                  <div className="relative">
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-xl ${cat.bgColor} flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                      <Icon />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-base">{cat.label}</h3>
                    <p className="text-xs text-gray-600">{cat.description}</p>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
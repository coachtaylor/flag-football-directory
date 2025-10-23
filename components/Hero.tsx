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
  colorClass: string
  bgColorClass: string
  hoverBgClass: string
}> = [
  {
    key: 'teams',
    label: 'Teams',
    description: 'Youth & adult teams',
    icon: UsersIcon,
    colorClass: 'text-[#001f3d]',
    bgColorClass: 'bg-[#001f3d]/5',
    hoverBgClass: 'hover:bg-[#001f3d]/10',
  },
  {
    key: 'leagues',
    label: 'Leagues',
    description: 'Organized competitions',
    icon: FlagIcon,
    colorClass: 'text-[#e87a00]',
    bgColorClass: 'bg-[#e87a00]/5',
    hoverBgClass: 'hover:bg-[#e87a00]/10',
  },
  {
    key: 'clinics',
    label: 'Clinics',
    description: 'Skills & training',
    icon: AcademicCapIcon,
    colorClass: 'text-[#345c72]',
    bgColorClass: 'bg-[#345c72]/5',
    hoverBgClass: 'hover:bg-[#345c72]/10',
  },
  {
    key: 'tournaments',
    label: 'Tournaments',
    description: 'Competitive events',
    icon: TrophyIcon,
    colorClass: 'text-[#e87a00]',
    bgColorClass: 'bg-[#e87a00]/5',
    hoverBgClass: 'hover:bg-[#e87a00]/10',
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
    <section className="relative bg-[#f6f6f6] overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#001f3d]/5 via-transparent to-[#e87a00]/5" />
      
      <div className="container py-16 lg:py-24 relative">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Headline */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#001f3d] mb-6 tracking-tight leading-tight">
              Find Flag Football Programs{' '}
              <span className="text-[#e87a00]">Near You</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#345c72] max-w-2xl mx-auto">
              Search thousands of teams, leagues, clinics, and tournaments across the United States
            </p>
          </div>

          {/* Search Card - Enhanced with shadows and depth */}
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 sm:p-8 backdrop-blur-sm border border-gray-100">
            <form onSubmit={handleSearch}>
              {/* Category Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#001f3d] mb-4">
                  What are you looking for?
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {categories.map((cat) => {
                    const isSelected = type === cat.key
                    const Icon = cat.icon
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => setType(cat.key as CategoryType)}
                        className={`
                          group relative p-5 rounded-2xl text-left transition-all duration-300
                          ${
                            isSelected
                              ? 'bg-[#001f3d] shadow-xl shadow-[#001f3d]/20 scale-[1.02]'
                              : `bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg ${cat.hoverBgClass}`
                          }
                        `}
                      >
                        {/* Icon */}
                        <div className={`
                          w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all duration-300
                          ${isSelected 
                            ? 'bg-white/10 text-white' 
                            : `${cat.bgColorClass} ${cat.colorClass} group-hover:scale-110`
                          }
                        `}>
                          <Icon />
                        </div>
                        
                        {/* Text */}
                        <div className={`font-semibold mb-1 transition-colors ${isSelected ? 'text-white' : 'text-[#001f3d]'}`}>
                          {cat.label}
                        </div>
                        <div className={`text-xs transition-colors ${isSelected ? 'text-white/80' : 'text-[#345c72]'}`}>
                          {cat.description}
                        </div>
                        
                        {/* Selected indicator dot */}
                        {isSelected && (
                          <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-[#e87a00] rounded-full shadow-sm" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Search Inputs */}
              <div className="space-y-4">
                {/* Search Input */}
                <div>
                  <label htmlFor="search" className="block text-sm font-semibold text-[#001f3d] mb-2">
                    Search by name or location
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#345c72]">
                      <SearchIcon />
                    </div>
                    <input
                      id="search"
                      type="text"
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-2xl text-[#001f3d] placeholder-[#345c72]/50 focus:outline-none focus:ring-2 focus:ring-[#e87a00] focus:border-[#e87a00] transition-all shadow-sm focus:shadow-lg bg-white"
                      placeholder={`Search ${type}...`}
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                    />
                  </div>
                </div>

                {/* State and Search Button */}
                <div className="grid sm:grid-cols-[1fr,auto] gap-3">
                  <div>
                    <label htmlFor="state" className="block text-sm font-semibold text-[#001f3d] mb-2">
                      State (optional)
                    </label>
                    <select
                      id="state"
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl text-[#001f3d] focus:outline-none focus:ring-2 focus:ring-[#e87a00] focus:border-[#e87a00] transition-all appearance-none bg-white cursor-pointer shadow-sm focus:shadow-lg"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23345c72' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
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
                      className="w-full sm:w-auto px-8 py-3.5 bg-[#e87a00] text-white font-semibold rounded-2xl hover:bg-[#e87a00]/90 focus:outline-none focus:ring-2 focus:ring-[#e87a00] focus:ring-offset-2 transition-all shadow-lg shadow-[#e87a00]/30 hover:shadow-xl hover:shadow-[#e87a00]/40 hover:-translate-y-0.5 active:scale-95"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-[#345c72]">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-sm border border-gray-100">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-[#001f3d]">Updated daily</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-sm border border-gray-100">
              <svg className="w-5 h-5 text-[#345c72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-medium text-[#001f3d]">Verified programs</span>
            </div>
          </div>
        </div>

        {/* Quick Access Cards - Modern Design */}
        <div className="max-w-5xl mx-auto mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <a
                  key={cat.key}
                  href={`/${cat.key}`}
                  className="group relative overflow-hidden rounded-2xl bg-white border-2 border-gray-100 p-6 text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-gray-200"
                >
                  {/* Subtle gradient overlay on hover */}
                  <div className={`absolute inset-0 ${cat.bgColorClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className="relative">
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl ${cat.bgColorClass} flex items-center justify-center ${cat.colorClass} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}>
                      <Icon />
                    </div>
                    <h3 className="font-semibold text-[#001f3d] mb-1 text-base group-hover:text-[#001f3d] transition-colors">
                      {cat.label}
                    </h3>
                    <p className="text-xs text-[#345c72] group-hover:text-[#345c72]/80 transition-colors">
                      {cat.description}
                    </p>
                  </div>
                  
                  {/* Arrow indicator */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-5 h-5 text-[#e87a00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
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
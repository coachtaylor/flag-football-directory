// components/Hero.tsx
'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { US_STATES } from '@/lib/states'

// Icons
const SearchIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const UsersIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const FlagIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
  </svg>
)

const TrophyIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
)

const AcademicCapIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  bgColor: string
  textColor: string
}> = [
  {
    key: 'teams',
    label: 'Teams',
    description: 'Youth & adult teams',
    icon: UsersIcon,
    bgColor: 'bg-[#001f3d]',
    textColor: 'text-[#001f3d]',
  },
  {
    key: 'leagues',
    label: 'Leagues',
    description: 'Organized competitions',
    icon: FlagIcon,
    bgColor: 'bg-[#345c72]',
    textColor: 'text-[#345c72]',
  },
  {
    key: 'clinics',
    label: 'Clinics',
    description: 'Skills & training',
    icon: AcademicCapIcon,
    bgColor: 'bg-[#e87a00]',
    textColor: 'text-[#e87a00]',
  },
  {
    key: 'tournaments',
    label: 'Tournaments',
    description: 'Competitive events',
    icon: TrophyIcon,
    bgColor: 'bg-[#001f3d]',
    textColor: 'text-[#001f3d]',
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

  const selectedCategory = categories.find(cat => cat.key === type)

  return (
    <section className="relative bg-[#f6f6f6] py-20 lg:py-28">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Headline */}
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#001f3d] mb-6 leading-tight">
              Find Flag Football <br />
              <span className="text-[#e87a00]">
                Near You
              </span>
            </h1>
            <p className="text-xl text-[#345c72] max-w-2xl mx-auto leading-relaxed">
              Discover thousands of teams, leagues, clinics, and tournaments across all 50 states
            </p>
          </div>

          {/* Category Selection - Big Bold Cards */}
          <div className="mb-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {categories.map((cat) => {
                const Icon = cat.icon
                const isSelected = type === cat.key
                
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setType(cat.key as CategoryType)}
                    className={`
                      p-6 rounded-3xl text-center
                      ${isSelected 
                        ? `${cat.bgColor} text-white shadow-2xl scale-105` 
                        : 'bg-white text-gray-700 shadow-lg hover:shadow-xl'
                      }
                    `}
                  >
                    <div className={`
                      w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center
                      ${isSelected ? 'bg-white/20' : 'bg-gray-50'}
                    `}>
                      <div className={isSelected ? 'text-white' : cat.textColor}>
                        <Icon />
                      </div>
                    </div>
                    <div className={`font-bold text-lg mb-1 ${isSelected ? 'text-white' : 'text-[#001f3d]'}`}>
                      {cat.label}
                    </div>
                    <div className={`text-sm ${isSelected ? 'text-white/90' : 'text-[#345c72]'}`}>
                      {cat.description}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Search Box - Large and Bold */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Search Input */}
              <div>
                <label htmlFor="search" className="block text-lg font-bold text-[#001f3d] mb-3">
                  What are you looking for?
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none ${selectedCategory?.textColor || 'text-gray-400'}`}>
                    <SearchIcon />
                  </div>
                  <input
                    id="search"
                    type="text"
                    className="w-full pl-16 pr-6 py-5 text-lg border-2 border-gray-200 rounded-2xl text-[#001f3d] placeholder-gray-400 focus:outline-none focus:border-[#001f3d]"
                    placeholder={`Search ${type}...`}
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>
              </div>

              {/* State and Search Button */}
              <div className="grid sm:grid-cols-[2fr,1fr] gap-4">
                <div>
                  <label htmlFor="state" className="block text-lg font-bold text-[#001f3d] mb-3">
                    Location
                  </label>
                  <select
                    id="state"
                    className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl text-[#001f3d] focus:outline-none focus:border-[#001f3d] appearance-none bg-white cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23345c72' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 1.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '3.5rem',
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

                <div className="flex items-end">
                  <button 
                    type="submit" 
                    className={`w-full px-8 py-5 text-lg font-bold ${selectedCategory?.bgColor || 'bg-[#e87a00]'} text-white rounded-2xl hover:opacity-90 shadow-xl`}
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#001f3d] mb-2">50</div>
              <div className="text-[#345c72] font-medium">States</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#001f3d] mb-2">1000+</div>
              <div className="text-[#345c72] font-medium">Programs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#001f3d] mb-2">100%</div>
              <div className="text-[#345c72] font-medium">Free</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
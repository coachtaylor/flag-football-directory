import Breadcrumbs from '@/components/Breadcrumbs'
import Link from 'next/link'

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

const AcademicCapIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01-.665-6.479L12 14z" />
  </svg>
)

const TrophyIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
)

const PROGRAM_TYPES = [
  {
    key: 'team',
    label: 'Team',
    description: 'Youth & adult squads',
    icon: UsersIcon,
    accent: '#001f3d',
    href: '/add-program/team',
  },
  {
    key: 'league',
    label: 'League',
    description: 'Season-long play',
    icon: FlagIcon,
    accent: '#e87a00',
    href: '/add-program/league',
  },
  {
    key: 'clinic',
    label: 'Clinic',
    description: 'Skills & training',
    icon: AcademicCapIcon,
    accent: '#345c72',
    href: '/add-program/clinic',
  },
  {
    key: 'tournament',
    label: 'Tournament',
    description: 'Travel competition',
    icon: TrophyIcon,
    accent: '#123a55',
    href: '/add-program/tournament',
  },
]

export default function AddProgram() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16">
          <Breadcrumbs items={[{ label: 'Add Program' }]} className="mb-6" />
          
          <div className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#001f3d]/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#001f3d] mb-4">
                <span className="w-2 h-2 rounded-full bg-[#e87a00]"></span>
                Add Your Program
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#001f3d] sm:text-4xl mb-4">
                Add a Program
              </h1>
              <p className="text-lg text-[#345c72]/90 max-w-2xl mx-auto">
                Help grow the flag football community by adding your team, league, clinic, or tournament to our directory.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              {PROGRAM_TYPES.map((program) => {
                const Icon = program.icon
                return (
                  <Link
                    key={program.key}
                    href={program.href}
                    className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200/60 hover:border-[#001f3d]/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* Color accent bar */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{ backgroundColor: program.accent }}
                    />
                    
                    <div className="p-6 pt-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-[#001f3d] mb-1">{program.label}</h3>
                          <p className="text-sm text-[#345c72]">{program.description}</p>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-[#e87a00] transition-colors" style={{ backgroundColor: `${program.accent}1A`, color: program.accent }}>
                            <Icon />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm font-medium text-[#345c72]/70 group-hover:text-[#e87a00] transition-colors">
                        <span>Get started</span>
                        <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

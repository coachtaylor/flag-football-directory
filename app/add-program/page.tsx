'use client'

import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import Breadcrumbs from '@/components/Breadcrumbs'

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

const AGE_CATEGORIES = [
  {
    key: 'adult',
    label: 'Adult',
    description: 'Programs for adults 18+',
    icon: UsersIcon,
    accent: '#001f3d',
    href: '/add-program/adult',
  },
  {
    key: 'youth',
    label: 'Youth',
    description: 'Programs for kids & teens',
    icon: AcademicCapIcon,
    accent: '#e87a00',
    href: '/add-program/youth',
  },
  {
    key: 'free-agent',
    label: 'Free Agent',
    description: 'List yourself as available',
    icon: UsersIcon,
    accent: '#345c72',
    href: '/add-program/free-agent',
  },
]

export default function AddProgram() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-gray-500">
        Checking your account…
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] bg-white flex items-center">
        <div className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white px-8 py-12 text-center shadow-xl">
          <h1 className="text-3xl font-semibold text-[#001f3d]">Sign in to add a program</h1>
          <p className="mt-4 text-gray-600">
            You need an account to add teams, leagues, clinics, or tournaments to the directory.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[#001f3d] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

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
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                List a program, organization, or make yourself available as a player
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {AGE_CATEGORIES.map((category) => {
                const Icon = category.icon
                return (
                  <Link
                    key={category.key}
                    href={category.href}
                    className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200/60 hover:border-[#001f3d]/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: category.accent }} />

                    <div className="p-8 pt-10">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex-1">
                          <h3 className="text-2xl font-semibold text-[#001f3d] mb-2">{category.label}</h3>
                          <p className="text-base text-gray-600">{category.description}</p>
                        </div>
                        <div className="flex-shrink-0 ml-6">
                          <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center group-hover:bg-[#e87a00] group-hover:text-white transition-colors"
                            style={{ backgroundColor: `${category.accent}1A`, color: category.accent }}
                          >
                            <Icon />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center text-sm font-medium text-gray-500 group-hover:text-[#e87a00] transition-colors">
                        <span>Select {category.label.toLowerCase()} programs</span>
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

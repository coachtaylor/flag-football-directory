'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

const PlusIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const ChartIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const UsersIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
)

const FlagIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
  </svg>
)

const TrophyIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
)

const AcademicCapIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01-.665-6.479L12 14z" />
  </svg>
)

const SettingsIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const ClockIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

interface Submission {
  id: number
  type: string
  status: string
  created_at: string
  payload: {
    name?: string
    city?: string
    state?: string
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading, supabase } = useAuth()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (user) {
      fetchSubmissions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function fetchSubmissions() {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setSubmissions(data || [])
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoadingSubmissions(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#001f3d] border-r-transparent"></div>
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const firstName = user.user_metadata?.first_name || user.email?.split('@')[0] || 'there'
  const fullName = user.user_metadata?.first_name && user.user_metadata?.last_name
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
    : user.user_metadata?.first_name || user.email

  const quickActions = [
    {
      title: 'Add Program',
      description: 'List a new program',
      icon: PlusIcon,
      href: '/add-program',
      color: 'bg-[#001f3d]',
      hoverColor: 'hover:bg-[#002d57]',
    },
    {
      title: 'Free Agent',
      description: 'List yourself as available',
      icon: UsersIcon,
      href: '/add-program/free-agent',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
    },
    {
      title: 'Add Adult Program',
      description: 'List an adult program',
      icon: UsersIcon,
      href: '/add-program/adult',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
    },
    {
      title: 'Add Youth Program',
      description: 'List a youth program',
      icon: AcademicCapIcon,
      href: '/add-program/youth',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
    },
  ]

  const browseCategories = [
    { title: 'Adult Programs', href: '/adult', icon: UsersIcon },
    { title: 'Youth Programs', href: '/youth', icon: AcademicCapIcon },
    { title: 'Adult Free Agents', href: '/adult/free-agents', icon: UsersIcon },
    { title: 'Youth Free Agents', href: '/youth/free-agents', icon: AcademicCapIcon },
    { title: 'All Leagues', href: '/leagues', icon: FlagIcon },
    { title: 'All Teams', href: '/teams', icon: UsersIcon },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#001f3d] mb-2">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Manage your programs, track submissions, and grow your flag football community.
          </p>
        </div>

        {/* Quick Actions */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#001f3d]">Quick Actions</h2>
            <Link
              href="/add-program"
              className="text-sm font-medium text-[#e87a00] hover:text-[#d66f00] transition-colors flex items-center gap-1"
            >
              View all
              <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}>
                      <Icon />
                    </div>
                    <PlusIcon />
                  </div>
                  <h3 className="text-lg font-semibold text-[#001f3d] mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Stats Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-[#001f3d] mb-6">Overview</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <ChartIcon />
                </div>
              </div>
              <p className="text-3xl font-bold text-[#001f3d] mb-1">
                {submissions.filter(s => s.status === 'approved').length}
              </p>
              <p className="text-sm text-gray-600">Active Listings</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
                  <ClockIcon />
                </div>
              </div>
              <p className="text-3xl font-bold text-[#001f3d] mb-1">
                {submissions.filter(s => s.status === 'new' || s.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">Pending Review</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <CheckCircleIcon />
                </div>
              </div>
              <p className="text-3xl font-bold text-[#001f3d] mb-1">
                {submissions.length}
              </p>
              <p className="text-sm text-gray-600">Total Submissions</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <UsersIcon />
                </div>
              </div>
              <p className="text-3xl font-bold text-[#001f3d] mb-1">-</p>
              <p className="text-sm text-gray-600">Views (Coming Soon)</p>
            </div>
          </div>
        </section>

        {/* Recent Submissions */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#001f3d]">Recent Submissions</h2>
            <Link
              href="/submit"
              className="text-sm font-medium text-[#e87a00] hover:text-[#d66f00] transition-colors flex items-center gap-1"
            >
              Submit new
              <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {loadingSubmissions ? (
              <div className="p-12 text-center text-gray-500">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-[#001f3d] border-r-transparent mb-2"></div>
                <p className="text-sm">Loading submissions...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500 mb-4">No submissions yet</p>
                <Link
                  href="/submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#001f3d] px-6 py-3 text-sm font-semibold text-white hover:bg-[#002d57] transition-all duration-300"
                >
                  <PlusIcon />
                  Submit your first program
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <div key={submission.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-[#001f3d]">
                            {submission.payload?.name || 'Unnamed Submission'}
                          </h3>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            submission.status === 'approved' ? 'bg-green-100 text-green-700' :
                            submission.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {submission.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="inline-flex items-center gap-1">
                            <span className="font-medium capitalize">{submission.type}</span>
                          </span>
                          {submission.payload?.city && submission.payload?.state && (
                            <span>
                              {submission.payload.city}, {submission.payload.state}
                            </span>
                          )}
                          <span>
                            {new Date(submission.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Browse Directory */}
        <section>
          <h2 className="text-2xl font-semibold text-[#001f3d] mb-6">Browse Directory</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {browseCategories.map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.title}
                  href={category.href}
                  className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-[#001f3d] transition-colors group-hover:bg-[#001f3d] group-hover:text-white">
                    <Icon />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-[#001f3d] group-hover:text-[#e87a00] transition-colors">
                      {category.title}
                    </h3>
                  </div>
                  <span className="text-gray-400 group-hover:text-[#e87a00] transition-colors">
                    →
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}


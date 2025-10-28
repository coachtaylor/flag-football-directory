'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { US_STATES } from '@/lib/states'

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const InstagramIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const TrophyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
)

interface FreeAgent {
  id: number
  first_name: string
  last_name: string
  city: string
  state: string
  gender: string
  position?: string
  skill_level: string
  experience?: string
  instagram?: string
  looking_for: string[]
  availability: string[]
  bio?: string
  photo_urls?: string[]
  created_at: string
}

export default function AdultFreeAgentsPage() {
  const searchParams = useSearchParams()
  const [freeAgents, setFreeAgents] = useState<FreeAgent[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    state: searchParams?.get('state') || '',
    gender: searchParams?.get('gender') || '',
    skillLevel: searchParams?.get('skill') || '',
    position: searchParams?.get('position') || '',
  })

  useEffect(() => {
    fetchFreeAgents()
  }, [filters])

  async function fetchFreeAgents() {
    setLoading(true)
    try {
      // TODO: Replace with actual API call
      // const params = new URLSearchParams({
      //   age_category: 'ADULT',
      //   ...filters
      // })
      // const res = await fetch(`/api/free-agents?${params}`)
      // const data = await res.json()
      // setFreeAgents(data.freeAgents || [])
      
      // Mock data for now
      setFreeAgents([])
    } catch (error) {
      console.error('Error fetching free agents:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
          <Breadcrumbs
            items={[
              { label: 'Adult', href: '/adult' },
              { label: 'Free Agents' },
            ]}
            className="mb-6"
          />

          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#001f3d]/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#001f3d] mb-4">
                <span className="w-2 h-2 rounded-full bg-[#e87a00]"></span>
                Adult Free Agents
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#001f3d] sm:text-4xl mb-4">
                Available Adult Players
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl">
                Connect with skilled adult flag football players looking to join teams, leagues, or tournaments.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <select
                value={filters.state}
                onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                className="px-4 py-2 rounded-xl border border-gray-200 focus:border-[#e87a00] focus:ring-2 focus:ring-[#e87a00]/25 transition-colors text-sm"
              >
                <option value="">All States</option>
                {US_STATES.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>

              <select
                value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                className="px-4 py-2 rounded-xl border border-gray-200 focus:border-[#e87a00] focus:ring-2 focus:ring-[#e87a00]/25 transition-colors text-sm"
              >
                <option value="">All Genders</option>
                <option value="male">Men</option>
                <option value="female">Women</option>
              </select>

              <select
                value={filters.skillLevel}
                onChange={(e) => setFilters({ ...filters, skillLevel: e.target.value })}
                className="px-4 py-2 rounded-xl border border-gray-200 focus:border-[#e87a00] focus:ring-2 focus:ring-[#e87a00]/25 transition-colors text-sm"
              >
                <option value="">All Skill Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="elite">Elite</option>
              </select>

              <select
                value={filters.position}
                onChange={(e) => setFilters({ ...filters, position: e.target.value })}
                className="px-4 py-2 rounded-xl border border-gray-200 focus:border-[#e87a00] focus:ring-2 focus:ring-[#e87a00]/25 transition-colors text-sm"
              >
                <option value="">All Positions</option>
                <option value="quarterback">Quarterback</option>
                <option value="receiver">Receiver</option>
                <option value="running-back">Running Back</option>
                <option value="center">Center</option>
                <option value="rusher">Rusher</option>
                <option value="defender">Defender</option>
                <option value="any">Any Position</option>
              </select>

              {(filters.state || filters.gender || filters.skillLevel || filters.position) && (
                <button
                  onClick={() => setFilters({ state: '', gender: '', skillLevel: '', position: '' })}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#001f3d] border-r-transparent mb-4"></div>
              <p className="text-gray-600">Loading free agents...</p>
            </div>
          </div>
        ) : freeAgents.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <UserIcon />
            </div>
            <h3 className="text-xl font-semibold text-[#001f3d] mb-2">No free agents found</h3>
            <p className="text-gray-600 mb-6">
              {filters.state || filters.gender || filters.skillLevel || filters.position
                ? 'Try adjusting your filters to see more results.'
                : 'Be the first to list yourself as a free agent!'}
            </p>
            <Link
              href="/add-program/free-agent"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#001f3d] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              List Yourself as Free Agent
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-[#001f3d]">{freeAgents.length}</span> available players
              </p>
              <Link
                href="/add-program/free-agent"
                className="text-sm font-medium text-[#e87a00] hover:text-[#d66f00] transition-colors"
              >
                + List Yourself
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {freeAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Photo */}
                  {agent.photo_urls && agent.photo_urls.length > 0 ? (
                    <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        src={agent.photo_urls[0]}
                        alt={`${agent.first_name} ${agent.last_name}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
                      <UserIcon />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-[#001f3d] mb-1">
                        {agent.first_name} {agent.last_name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <LocationIcon />
                        <span>
                          {agent.city}, {agent.state}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                        <TrophyIcon />
                        {agent.skill_level}
                      </span>
                      {agent.position && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium capitalize">
                          {agent.position.replace('-', ' ')}
                        </span>
                      )}
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium capitalize">
                        {agent.gender}
                      </span>
                    </div>

                    {/* Looking For */}
                    {agent.looking_for && agent.looking_for.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Looking for:</p>
                        <div className="flex flex-wrap gap-1">
                          {agent.looking_for.map((item) => (
                            <span
                              key={item}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs text-gray-600 bg-gray-50 capitalize"
                            >
                              {item.replace('-', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bio Preview */}
                    {agent.bio && (
                      <p className="text-sm text-gray-600 line-clamp-2">{agent.bio}</p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      {agent.instagram && (
                        <a
                          href={`https://instagram.com/${agent.instagram}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                        >
                          <InstagramIcon />
                          Contact
                        </a>
                      )}
                      <Link
                        href={`/adult/free-agents/${agent.id}`}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-[#001f3d] hover:bg-gray-50 transition-colors"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


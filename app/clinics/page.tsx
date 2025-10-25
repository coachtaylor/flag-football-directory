// app/clinics/page.tsx
import { supabase } from '@/lib/supabase'
import { US_STATES } from '@/lib/states'
import OrgCard from '@/components/OrgCard'
import Breadcrumbs from '@/components/Breadcrumbs'

export const dynamic = 'force-dynamic'

const cleanSearchTerm = (term: string) =>
  term.replace(/[(),]/g, ' ').replace(/\s+/g, ' ').trim()

const normalizeLocation = (location?: string | null, fallbackState?: string | null) => {
  if (!location?.trim()) {
    return {
      city: null,
      state: fallbackState?.toUpperCase() || null,
    }
  }

  const parts = location.split(',').map((part) => part.trim()).filter(Boolean)

  if (parts.length === 0) {
    return {
      city: null,
      state: fallbackState?.toUpperCase() || null,
    }
  }

  if (parts.length === 1) {
    const only = parts[0]
    if (/^[A-Za-z]{2}$/.test(only)) {
      return {
        city: null,
        state: only.toUpperCase(),
      }
    }
    return {
      city: only,
      state: fallbackState?.toUpperCase() || null,
    }
  }

  const city = parts.slice(0, -1).join(', ')
  const statePart = parts[parts.length - 1]

  return {
    city,
    state: statePart.length <= 5 ? statePart.toUpperCase() : statePart,
  }
}

export default async function ClinicsPage({ searchParams }: { searchParams?: Record<string,string> }) {
  const rawQ = (searchParams?.q || '').trim()
  const q = cleanSearchTerm(rawQ)
  const state = (searchParams?.state || '').trim().toUpperCase()
  const today = new Date().toISOString().slice(0,10)

  let eQ = supabase
    .from('events')
    .select('id, slug, name, location, state, start_date, end_date, website, signup_url, cover_url, verified')
    .eq('kind','clinic')
    .gte('start_date', today)

  if (q)     eQ = eQ.or(`name.ilike.%${q}%,location.ilike.%${q}%`)
  if (state) eQ = eQ.eq('state', state)

  const { data: clinics, error } = await eQ.order('start_date', { ascending: true })
  if (error) console.error('clinics query error:', error)

  const results = clinics || []

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative w-full overflow-hidden bg-gray-50">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-50 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-4 sm:px-8 lg:px-12">
          <div className="mb-6">
            <Breadcrumbs items={[{ label: 'Clinics' }]} className="py-0 text-sm text-[#345c72]" />
          </div>

          <div className="space-y-10">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-3 rounded-full border border-[#001f3d]/10 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#001f3d]">
                Clinics Directory
              </span>

              <div className="space-y-5">
                <h1 className="text-4xl font-semibold tracking-tight text-[#001f3d] sm:text-5xl xl:text-[3.25rem] xl:leading-[1.1]">
                  Skill clinics & training camps
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-[#123a55]/90 sm:text-xl">
                  Find developmental clinics with clear pricing, dates, and contact details.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-[#345c72]">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-white/80 px-3 py-1 text-sm font-medium text-[#345c72]">
                  <svg className="w-3 h-3 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-white/80 px-3 py-1">
                  <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#e87a00]" />
                  Skill development
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#001f3d]/15 bg-white/80 px-3 py-1">
                  <span aria-hidden className="relative h-2.5 w-2.5 rounded-full bg-[#345c72]">
                    <span className="absolute inset-1 rounded-full bg-white" />
                  </span>
                  Nationwide coverage
                </span>
              </div>
            </div>

            <form
              method="get"
              className="grid gap-4 rounded-[24px] border border-[#001f3d]/10 bg-white/95 p-5 shadow-[0_18px_45px_-32px_rgba(0,31,61,0.38)] sm:p-6"
            >
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr),auto] sm:items-center">
                <label className="flex grow items-center gap-3 rounded-2xl border border-[#001f3d]/15 bg-white px-4 py-3 focus-within:border-[#e87a00] focus-within:ring-2 focus-within:ring-[#e87a00]/25">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    name="q"
                    defaultValue={rawQ}
                    placeholder="Search clinics or locations..."
                    className="w-full text-sm font-medium text-[#001f3d] placeholder:text-[#345c72]/60 focus:outline-none"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-2xl bg-[#e87a00] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_20px_50px_-20px_rgba(232,122,0,0.5)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-22px_rgba(232,122,0,0.6)]"
                >
                  Search
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-1">
                <select
                  className="w-full rounded-2xl border border-[#001f3d]/15 bg-white px-3 py-3 text-sm font-medium text-[#001f3d] focus:border-[#e87a00] focus:outline-none focus:ring-2 focus:ring-[#e87a00]/25"
                  name="state"
                  defaultValue={state}
                >
                  <option value="">All states</option>
                  {US_STATES.map(s => (
                    <option key={s.code} value={s.code}>{s.name}</option>
                  ))}
                </select>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="relative w-full bg-gray-50">
        {/* Subtle top border for visual separation */}
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        </div>
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[#001f3d] sm:text-3xl">
                Clinics matching your filters
              </h2>
              <p className="text-sm font-medium text-[#345c72]/80 sm:text-base">
                Showing <span className="font-semibold text-[#001f3d]">{results.length}</span> clinic{results.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          {/* Clinics Grid */}
          {results.length > 0 ? (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
              {results.map((c: any) => {
                const { city, state: derivedState } = normalizeLocation(c.location, c.state)
                return (
                  <div key={c.id} className="w-full max-w-sm">
                    <OrgCard
                      o={{
                        type: 'Clinic',
                        id: c.id,
                        slug: c.slug,
                        name: c.name,
                        cover_url: c.cover_url,
                        city_name: city,
                        state: derivedState || c.state || null,
                        verified: c.verified,
                      }}
                    />
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="mt-12 rounded-3xl border border-[#001f3d]/15 bg-gray-50 px-8 py-14 text-center shadow-[0_18px_45px_-32px_rgba(0,31,61,0.25)]">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-[#001f3d]/30 bg-white text-[#001f3d]">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-[#001f3d]">No clinics found</h3>
              <p className="mt-3 text-base text-[#345c72]/90">
                Try searching a different location or broadening your filters
              </p>
              <a href="/clinics" className="mt-6 inline-flex items-center justify-center rounded-2xl border border-[#001f3d]/15 bg-white px-5 py-3 text-sm font-semibold text-[#001f3d] shadow-sm transition hover:border-[#e87a00] hover:text-[#e87a00]">
                Clear Filters
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

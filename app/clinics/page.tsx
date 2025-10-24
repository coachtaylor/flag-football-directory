// app/clinics/page.tsx
import { supabase } from '@/lib/supabase'
import { US_STATES } from '@/lib/states'
import OrgCard from '@/components/OrgCard'
import Breadcrumbs from '@/components/Breadcrumbs'

export const dynamic = 'force-dynamic'

const cleanSearchTerm = (term: string) =>
  term.replace(/[(),]/g, ' ').replace(/\s+/g, ' ').trim()

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
    <section className="container py-8">
      <Breadcrumbs items={[{ label: 'Clinics' }]} className="mb-6" />

      <div className="space-y-3">
        <h1 className="section-heading">Skill clinics & training camps</h1>
        <p className="section-subheading">
          Find developmental clinics with clear pricing, dates, and contact details.
        </p>
      </div>

      <div className="surface-card mt-8 mb-8">
        <form className="grid gap-5 p-6 sm:p-8">
          <input
            className="input"
            name="q"
            defaultValue={rawQ}
            placeholder="Search clinics or locations..."
          />
          <select className="select" name="state" defaultValue={state}>
            <option value="">All states</option>
            {US_STATES.map(s => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </select>
          <button type="submit" className="btn btn-primary w-full sm:w-auto">
            Search &amp; Filter
          </button>
        </form>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm font-medium text-[#345c72]/90">
          Showing <span className="font-semibold text-[#001f3d]">{results.length}</span> clinic{results.length === 1 ? '' : 's'}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((c: any) => (
          <OrgCard
            key={c.id}
            o={{
              type: 'Clinic',
              id: c.id,
              slug: c.slug,
              name: c.name,
              cover_url: c.cover_url,
              city_name: c.location,
              state: c.state,
              verified: c.verified,
            }}
          />
        ))}
      </div>

      {results.length === 0 && (
        <div className="empty-state mt-6">
          <div className="empty-state-icon">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          </div>
          <h3 className="empty-state-title">No clinics found</h3>
          <p className="empty-state-description">
            Try searching a different location or broadening your filters
          </p>
          <a href="/clinics" className="btn btn-outline mt-4">
            Clear Filters
          </a>
        </div>
      )}
    </section>
  )
}

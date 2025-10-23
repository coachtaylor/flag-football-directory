import { supabase } from '@/lib/supabase'
import { US_STATES } from '@/lib/states'
import Link from 'next/link'

export default async function StatesGrid() {
  const today = new Date().toISOString().slice(0,10)

  // teams per state
  const { data: teams } = await supabase
    .from('teams')
    .select('id, cities:city_id(state)')
  const teamCounts = (teams || []).reduce<Record<string, number>>((acc, t: any)=> {
    const st = t?.cities?.state; if (!st) return acc; acc[st]=(acc[st]||0)+1; return acc
  }, {})

  // leagues per state
  const { data: leagues } = await supabase
    .from('leagues')
    .select('id, cities:city_id(state)')
  const leagueCounts = (leagues || []).reduce<Record<string, number>>((acc, l: any)=> {
    const st = l?.cities?.state; if (!st) return acc; acc[st]=(acc[st]||0)+1; return acc
  }, {})

  // events per state by kind
  const { data: events } = await supabase
    .from('events')
    .select('state, kind, start_date')
    .gte('start_date', today)

  const tourneyCounts: Record<string, number> = {}
  const clinicCounts: Record<string, number> = {}
  for (const e of events || []) {
    if (!e?.state) continue
    if (e.kind === 'clinic') clinicCounts[e.state] = (clinicCounts[e.state]||0)+1
    else tourneyCounts[e.state] = (tourneyCounts[e.state]||0)+1
  }

  const active = US_STATES
    .map(s => {
      const t = teamCounts[s.code]||0, l = leagueCounts[s.code]||0, c = clinicCounts[s.code]||0, tr = tourneyCounts[s.code]||0
      return { ...s, t, l, c, tr, total: t+l+c+tr }
    })
    .filter(s => s.total>0)
    .sort((a,b)=> b.total - a.total || a.name.localeCompare(b.name))

  if (!active.length) return null

  return (
    <section className="grid gap-4">
      <h2 className="text-xl font-semibold">Browse by state</h2>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {active.map(s=>(
          <article key={s.code} className="card hover:shadow">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{s.name}</h3>
              <span className="small text-gray-600">{s.code}</span>
            </div>
            <p className="small text-gray-700 mt-1">
              {s.t} teams · {s.l} leagues · {s.c} clinics · {s.tr} tournaments
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              {s.t>0 && <Link className="link" href={`/teams?state=${s.code}`}>Teams</Link>}
              {s.l>0 && <Link className="link" href={`/leagues?state=${s.code}`}>Leagues</Link>}
              {s.c>0 && <Link className="link" href={`/clinics?state=${s.code}`}>Clinics</Link>}
              {s.tr>0 && <Link className="link" href={`/tournaments?state=${s.code}`}>Tournaments</Link>}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

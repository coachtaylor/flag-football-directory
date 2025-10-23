'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { US_STATES } from '@/lib/states'

export default function Hero() {
  const router = useRouter()
  const [type, setType] = useState<'teams'|'leagues'|'clinics'|'tournaments'>('teams')
  const [q, setQ] = useState('')
  const [st, setSt] = useState('')

  function go(e: React.FormEvent) {
    e.preventDefault()
    const p = new URLSearchParams()
    if (q.trim()) p.set('q', q.trim())
    if (st) p.set('state', st)
    router.push(`/${type}?${p.toString()}`)
  }

  return (
    <section className="grid gap-6">
      <div className="grid gap-3">
        <h1 className="text-3xl font-semibold">Find Flag Football Near You</h1>
        <p className="text-gray-700">Search teams, leagues, clinics, and tournaments by state.</p>
      </div>

      <form onSubmit={go} className="grid gap-3 sm:flex sm:items-center sm:gap-2">
        <div className="inline-flex rounded border overflow-hidden">
          {(['teams','leagues','clinics','tournaments'] as const).map(k => (
            <button
              key={k} type="button"
              className={`px-3 py-2 text-sm ${type===k ? 'bg-gray-100' : ''}`}
              onClick={()=>setType(k)} aria-pressed={type===k}
            >{k[0].toUpperCase()+k.slice(1)}</button>
          ))}
        </div>
        <input className="border rounded p-2 flex-1 min-w-[220px]" placeholder="Search name or city…" value={q} onChange={e=>setQ(e.target.value)} />
        <select className="border rounded p-2 w-[140px]" value={st} onChange={e=>setSt(e.target.value)}>
          <option value="">All states</option>
          {US_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
        </select>
        <button className="btn btn-primary" type="submit">Search</button>
        <a className="btn" href="/add-program">Add Program</a>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <a className="card hover:shadow" href="/teams"><h3 className="font-semibold">Teams</h3><p className="small text-gray-700">Find youth & adult teams</p></a>
        <a className="card hover:shadow" href="/leagues"><h3 className="font-semibold">Leagues</h3><p className="small text-gray-700">Compare fees & divisions</p></a>
        <a className="card hover:shadow" href="/clinics"><h3 className="font-semibold">Clinics</h3><p className="small text-gray-700">Training & skill sessions</p></a>
        <a className="card hover:shadow" href="/tournaments"><h3 className="font-semibold">Tournaments</h3><p className="small text-gray-700">Upcoming events</p></a>
      </div>
    </section>
  )
}

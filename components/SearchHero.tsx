'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SearchHero() {
  const router = useRouter()
  const [category, setCategory] = useState<'league'|'tournament'|'clinic'>('league')
  const [q, setQ] = useState('')
  const [state, setState] = useState('')
  const [from, setFrom] = useState('')

  function go(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    params.set('category', category)
    if (q.trim()) params.set('q', q.trim())
    if (state.trim()) params.set('state', state.trim().toUpperCase())
    if (category !== 'league' && from) params.set('from', from)
    router.push(`/explore?${params.toString()}`)
  }

  return (
    <div className="card grid gap-4">
      <div className="flex flex-wrap gap-2">
        {(['league','tournament','clinic'] as const).map(k => (
          <button
            key={k}
            type="button"
            onClick={() => setCategory(k)}
            className={`btn ${category===k ? 'btn-primary' : ''}`}
            aria-pressed={category===k}
          >
            {k === 'league' ? 'Leagues' : k === 'tournament' ? 'Tournaments' : 'Clinics'}
          </button>
        ))}
      </div>

      <form onSubmit={go} className="flex flex-wrap gap-2">
        <input
          className="border rounded p-2 flex-1 min-w-[240px]"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder={category==='league' ? 'Search city or league name…' : 'Search tournament/clinic or location…'}
          aria-label="Search"
        />
        <input
          className="border rounded p-2 w-[110px]"
          value={state}
          onChange={e => setState(e.target.value)}
          placeholder="State (CA)"
          aria-label="State"
          maxLength={2}
        />
        {category !== 'league' && (
          <input
            type="date"
            className="border rounded p-2"
            value={from}
            onChange={e => setFrom(e.target.value)}
            aria-label="From date"
          />
        )}
        <button className="btn btn-primary" type="submit">Search</button>
      </form>
    </div>
  )
}

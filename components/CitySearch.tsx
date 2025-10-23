'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
type City = { id: number; name: string; state: string; slug: string }

export default function CitySearch({ cities, initialQuery = '' }: { cities: City[]; initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery)
  const filtered = useMemo(() => {
    const term = q.toLowerCase()
    if (!term) return cities
    return cities.filter(c =>
      c.name.toLowerCase().includes(term) ||
      c.state.toLowerCase().includes(term) ||
      c.slug.toLowerCase().includes(term)
    )
  }, [q, cities])
  return (
    <div className="grid gap-4">
      <form method="GET" className="flex gap-2">
        <input
          className="border rounded p-2 flex-1"
          name="q"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search by city or state (e.g., Phoenix, CA)…"
          aria-label="Search cities"
        />
        <button className="btn btn-primary" type="submit">Search</button>
      </form>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {filtered.map(c => (
          <Link key={c.id} href={`/leagues/${c.slug}`} className="card hover:shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{c.name}</h3>
                <p className="small">{c.state}</p>
              </div>
              <span className="small">View »</span>
            </div>
          </Link>
        ))}
      </div>
      {!filtered.length && (
        <div className="card"><p className="text-sm text-gray-700">No results yet.</p></div>
      )}
    </div>
  )
}

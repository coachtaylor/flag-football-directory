'use client'
import { useState } from 'react'
import Breadcrumbs from '@/components/Breadcrumbs'
export default function SubmitPage() {
  const [type, setType] = useState('league')
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [website, setWebsite] = useState('')
  const [contact, setContact] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('Submitting...')
    const payload = { name, city, state, website, contact }
    const res = await fetch('/api/submit', { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type, payload, source: 'public-form' }) })
    const out = await res.json()
    setStatus(out.ok ? 'Thanks! We’ll verify within 48 hours.' : 'Error — try again.')
    if (out.ok) { setName(''); setCity(''); setState(''); setWebsite(''); setContact('') }
  }

  return (
    <section className="grid gap-4 max-w-xl">
      <Breadcrumbs items={[{ label: 'Submit' }]} className="mb-2" />
      <h1 className="text-2xl font-semibold">Submit a Program / Assignment</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <label className="text-sm">Type</label>
        <select className="border rounded p-2" value={type} onChange={e => setType(e.target.value)}>
          <option value="league">League</option>
          <option value="event">Event</option>
          <option value="assignor">Assignor / Officials</option>
        </select>

        <label className="text-sm">Name</label>
        <input className="border rounded p-2" value={name} onChange={e => setName(e.target.value)} required />
        <label className="text-sm">City</label>
        <input className="border rounded p-2" value={city} onChange={e => setCity(e.target.value)} required />
        <label className="text-sm">State</label>
        <input className="border rounded p-2" value={state} onChange={e => setState(e.target.value)} required />
        <label className="text-sm">Website/Signup</label>
        <input className="border rounded p-2" value={website} onChange={e => setWebsite(e.target.value)} />
        <label className="text-sm">Contact Email</label>
        <input type="email" className="border rounded p-2" value={contact} onChange={e => setContact(e.target.value)} required />
        <button className="btn btn-primary mt-2">Submit</button>
        {status && <p className="text-sm text-gray-700">{status}</p>}
      </form>
    </section>
  )
}

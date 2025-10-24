'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { US_STATES } from '@/lib/states'
import Breadcrumbs from '@/components/Breadcrumbs'

type Kind = 'team'|'league'|'clinic'|'tournament'

export default function AddProgramType({ params }: { params: { type: Kind } }) {
  const router = useRouter()
  const type = params.type
  const typeLabel = type[0].toUpperCase()+type.slice(1)
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState<string|undefined>()

  // Shared fields
  const [name, setName] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')         // free text; you’ll map to a city later
  const [website, setWebsite] = useState('')
  const [about, setAbout] = useState('')

  // Team specifics
  const [gender, setGender] = useState('')
  const [ageGroups, setAgeGroups] = useState<string[]>([])
  const [compLevels, setCompLevels] = useState<string[]>([])
  const [formats, setFormats] = useState<string[]>([])
  const [contactType, setContactType] = useState('')

  // Event/League specifics
  const [price, setPrice] = useState<string>('')      // string -> number on submit
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  // Anti-spam honeypot
  const [website2, setWebsite2] = useState('')        // leave empty; bots will fill it

  function toggle(arr: string[], v: string) {
    return arr.includes(v) ? arr.filter(x=>x!==v) : [...arr, v]
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true); setErr(undefined)

    const payload: any = {
      name, state, city, website, about,
      gender, age_groups: ageGroups, comp_levels: compLevels,
      formats, contact_type: contactType,
      price: price ? Number(price) : undefined,
      start_date: start || undefined,
      end_date: end || undefined,
      website2
    }

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ type, payload })
      })
      const out = await res.json()
      if (!out.ok) throw new Error(out.error || 'Submit failed')
      router.push('/add-program?success=1')
    } catch (e:any) {
      setErr(e.message || 'Error')
    } finally {
      setSubmitting(false)
    }
  }

  const isEvent = type === 'clinic' || type === 'tournament'
  const showContactType = type !== 'clinic' ? true : true // clinics can have non-contact too

  return (
    <section className="grid gap-6">
      <Breadcrumbs
        items={[
          { label: 'Add Program', href: '/add-program' },
          { label: typeLabel },
        ]}
        className="mb-2"
      />
      <h1 className="text-2xl font-semibold">Add a {typeLabel}</h1>
      <form onSubmit={submit} className="card grid gap-4">
        {err && <p className="text-sm text-red-600">{err}</p>}

        {/* Basic */}
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="small">Name*</span>
            <input className="border rounded p-2" required value={name} onChange={e=>setName(e.target.value)} />
          </label>
          <label className="grid gap-1">
            <span className="small">Website</span>
            <input className="border rounded p-2" value={website} onChange={e=>setWebsite(e.target.value)} />
          </label>
          <label className="grid gap-1">
            <span className="small">City*</span>
            <input className="border rounded p-2" required value={city} onChange={e=>setCity(e.target.value)} />
          </label>
          <label className="grid gap-1">
            <span className="small">State*</span>
            <select className="border rounded p-2" required value={state} onChange={e=>setState(e.target.value)}>
              <option value="">Select state</option>
              {US_STATES.map(s=><option key={s.code} value={s.code}>{s.name}</option>)}
            </select>
          </label>
        </div>

        <label className="grid gap-1">
          <span className="small">About</span>
          <textarea className="border rounded p-2 min-h-[120px]" value={about} onChange={e=>setAbout(e.target.value)} />
        </label>

        {/* Teams / Leagues / Tournaments filters */}
        <div className="grid gap-3">
          {(type==='team' || type==='league' || type==='tournament') && (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <span className="small w-28">Gender</span>
                {['boys','girls','coed'].map(g=>(
                  <label key={g} className="flex items-center gap-1">
                    <input type="radio" name="gender" value={g} onChange={()=>setGender(g)} />
                    <span className="capitalize">{g}</span>
                  </label>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="small w-28">Age groups</span>
                {['6U','8U','10U','12U','14U','16U','18U','ADULT'].map(a=>(
                  <label key={a} className="flex items-center gap-1">
                    <input type="checkbox" checked={ageGroups.includes(a)} onChange={()=>setAgeGroups(toggle(ageGroups,a))} />
                    <span>{a}</span>
                  </label>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="small w-28">Level</span>
                {['rec','competitive','elite'].map(l=>(
                  <label key={l} className="flex items-center gap-1">
                    <input type="checkbox" checked={compLevels.includes(l)} onChange={()=>setCompLevels(toggle(compLevels,l))} />
                    <span className="capitalize">{l}</span>
                  </label>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="small w-28">Game type</span>
                {['5v5','7v7','8v8'].map(f=>(
                  <label key={f} className="flex items-center gap-1">
                    <input type="checkbox" checked={formats.includes(f)} onChange={()=>setFormats(toggle(formats,f))} />
                    <span>{f}</span>
                  </label>
                ))}
              </div>

              {showContactType && (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="small w-28">Contact type</span>
                  {['non-contact','contact'].map(c=>(
                    <label key={c} className="flex items-center gap-1">
                      <input type="radio" name="contact_type" value={c} onChange={()=>setContactType(c)} />
                      <span className="capitalize">{c}</span>
                    </label>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Events-only */}
        {isEvent && (
          <div className="grid sm:grid-cols-3 gap-3">
            <label className="grid gap-1">
              <span className="small">Price</span>
              <input className="border rounded p-2" type="number" min="0" step="1" value={price} onChange={e=>setPrice(e.target.value)} />
            </label>
            <label className="grid gap-1">
              <span className="small">Start date</span>
              <input className="border rounded p-2" type="date" value={start} onChange={e=>setStart(e.target.value)} />
            </label>
            <label className="grid gap-1">
              <span className="small">End date</span>
              <input className="border rounded p-2" type="date" value={end} onChange={e=>setEnd(e.target.value)} />
            </label>
          </div>
        )}

        {/* Honeypot */}
        <div aria-hidden className="hidden">
          <input tabIndex={-1} autoComplete="off" value={website2} onChange={e=>setWebsite2(e.target.value)} />
        </div>

        <div className="flex gap-2">
          <button className="btn btn-primary" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit'}</button>
          <a className="btn" href="/add-program">Back</a>
        </div>
      </form>
    </section>
  )
}

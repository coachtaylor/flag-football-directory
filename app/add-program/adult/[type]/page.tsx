'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { US_STATES } from '@/lib/states'
import Breadcrumbs from '@/components/Breadcrumbs'
import Link from 'next/link'

type Kind = 'team'|'league'|'clinic'|'tournament'

export default function AddAdultProgramType({ params }: { params: { type: Kind } }) {
  const router = useRouter()
  const type = params.type
  const typeLabel = type[0].toUpperCase()+type.slice(1)
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState<string|undefined>()

  // Shared fields
  const [name, setName] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [website, setWebsite] = useState('')
  const [about, setAbout] = useState('')

  // Team specifics
  const [gender, setGender] = useState('')
  const [ageGroups, setAgeGroups] = useState<string[]>([])
  const [compLevels, setCompLevels] = useState<string[]>([])
  const [formats, setFormats] = useState<string[]>([])
  const [contactType, setContactType] = useState('')

  // Event/League specifics
  const [price, setPrice] = useState<string>('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  // Anti-spam honeypot
  const [website2, setWebsite2] = useState('')

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
      age_category: 'ADULT', // Set age category
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
  const showContactType = type !== 'clinic' ? true : true

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-10 lg:px-16">
          <Breadcrumbs
            items={[
              { label: 'Add Program', href: '/add-program' },
              { label: 'Adult', href: '/add-program/adult' },
              { label: typeLabel },
            ]}
            className="mb-6"
          />
          
          <div className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#001f3d]/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#001f3d] mb-4">
                <span className="w-2 h-2 rounded-full bg-[#e87a00]"></span>
                Adult {typeLabel}
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#001f3d] sm:text-4xl mb-4">
                Add an Adult {typeLabel}
              </h1>
              <p className="text-lg text-[#345c72]/90 max-w-2xl mx-auto">
                Fill out the details below to add your adult {typeLabel.toLowerCase()} to our directory.
              </p>
            </div>

            <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-200/60 p-8 space-y-8">
              {err && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-600">{err}</p>
                </div>
              )}

              {/* Basic Information */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-xl font-semibold text-[#001f3d] mb-2">Basic Information</h2>
                  <p className="text-sm text-[#345c72]/70">Tell us about your program</p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#001f3d]">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#e87a00] focus:ring-2 focus:ring-[#e87a00]/25 transition-colors" 
                      required 
                      value={name} 
                      onChange={e=>setName(e.target.value)} 
                      placeholder="Enter program name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#001f3d]">Website</label>
                    <input 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#e87a00] focus:ring-2 focus:ring-[#e87a00]/25 transition-colors" 
                      value={website} 
                      onChange={e=>setWebsite(e.target.value)} 
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#001f3d]">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#e87a00] focus:ring-2 focus:ring-[#e87a00]/25 transition-colors" 
                      required 
                      value={city} 
                      onChange={e=>setCity(e.target.value)} 
                      placeholder="Enter city name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#001f3d]">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#e87a00] focus:ring-2 focus:ring-[#e87a00]/25 transition-colors" 
                      required 
                      value={state} 
                      onChange={e=>setState(e.target.value)}
                    >
                      <option value="">Select state</option>
                      {US_STATES.map(s=><option key={s.code} value={s.code}>{s.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#001f3d]">About</label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#e87a00] focus:ring-2 focus:ring-[#e87a00]/25 transition-colors min-h-[120px] resize-y" 
                    value={about} 
                    onChange={e=>setAbout(e.target.value)} 
                    placeholder="Describe your program..."
                  />
                </div>
              </div>

              {/* Program Details */}
              {(type==='team' || type==='league' || type==='tournament') && (
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-semibold text-[#001f3d] mb-2">Program Details</h2>
                    <p className="text-sm text-[#345c72]/70">Specify the program characteristics</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-[#001f3d]">Gender</label>
                      <div className="flex flex-wrap gap-4">
                        {['men','women','coed'].map(g=>(
                          <label key={g} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="gender" 
                              value={g} 
                              onChange={()=>setGender(g)}
                              className="w-4 h-4 text-[#e87a00] focus:ring-[#e87a00]"
                            />
                            <span className="text-sm capitalize text-[#345c72]">{g === 'coed' ? 'Co-Ed' : g}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-[#001f3d]">Competition Level</label>
                      <div className="flex flex-wrap gap-4">
                        {['rec','competitive','elite'].map(l=>(
                          <label key={l} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={compLevels.includes(l)} 
                              onChange={()=>setCompLevels(toggle(compLevels,l))}
                              className="w-4 h-4 text-[#e87a00] focus:ring-[#e87a00] rounded"
                            />
                            <span className="text-sm capitalize text-[#345c72]">{l}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-[#001f3d]">Game Format</label>
                      <div className="flex flex-wrap gap-4">
                        {['5v5','7v7','8v8'].map(f=>(
                          <label key={f} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={formats.includes(f)} 
                              onChange={()=>setFormats(toggle(formats,f))}
                              className="w-4 h-4 text-[#e87a00] focus:ring-[#e87a00] rounded"
                            />
                            <span className="text-sm text-[#345c72]">{f}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {showContactType && (
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-[#001f3d]">Contact Type</label>
                        <div className="flex flex-wrap gap-4">
                          {['non-contact','contact'].map(c=>(
                            <label key={c} className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="radio" 
                                name="contact_type" 
                                value={c} 
                                onChange={()=>setContactType(c)}
                                className="w-4 h-4 text-[#e87a00] focus:ring-[#e87a00]"
                              />
                              <span className="text-sm capitalize text-[#345c72]">{c}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Event Details */}
              {isEvent && (
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-semibold text-[#001f3d] mb-2">Event Details</h2>
                    <p className="text-sm text-[#345c72]/70">When and how much</p>
                  </div>
                  
                  <div className="grid sm:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-[#001f3d]">Price ($)</label>
                      <input 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#e87a00] focus:ring-2 focus:ring-[#e87a00]/25 transition-colors" 
                        type="number" 
                        min="0" 
                        step="1" 
                        value={price} 
                        onChange={e=>setPrice(e.target.value)} 
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-[#001f3d]">Start Date</label>
                      <input 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#e87a00] focus:ring-2 focus:ring-[#e87a00]/25 transition-colors" 
                        type="date" 
                        value={start} 
                        onChange={e=>setStart(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-[#001f3d]">End Date</label>
                      <input 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#e87a00] focus:ring-2 focus:ring-[#e87a00]/25 transition-colors" 
                        type="date" 
                        value={end} 
                        onChange={e=>setEnd(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Honeypot */}
              <div aria-hidden className="hidden">
                <input tabIndex={-1} autoComplete="off" value={website2} onChange={e=>setWebsite2(e.target.value)} />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button 
                  className="flex-1 bg-[#e87a00] hover:bg-[#d16a00] text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                  disabled={submitting}
                >
                  {submitting ? 'Submitting…' : 'Submit Program'}
                </button>
                <Link 
                  className="flex-1 bg-white border border-gray-200 hover:border-[#001f3d]/20 text-[#001f3d] font-semibold py-3 px-6 rounded-xl transition-colors text-center" 
                  href="/add-program/adult"
                >
                  Back
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}


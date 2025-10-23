'use client'
import { useSearchParams, useRouter } from 'next/navigation'

export default function ResultsToolbar({ total }: { total: number }) {
  const sp = useSearchParams(); const router = useRouter()
  const view = sp.get('view') || 'grid'
  const sort = sp.get('sort') || 'relevance'

  function setParam(k: string, v: string) {
    const p = new URLSearchParams(sp)
    p.set(k, v)
    // reset page on sort/view change
    p.delete('page')
    router.push(`/explore?${p.toString()}`)
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="small text-gray-700">{total} result{total===1?'':'s'}</p>
      <div className="flex items-center gap-2">
        <select className="border rounded p-2" value={sort} onChange={e=>setParam('sort', e.target.value)}>
          <option value="relevance">Relevance</option>
          <option value="fee_asc">Lowest fee</option>
          <option value="date_asc">Soonest</option>
        </select>
        <div className="inline-flex rounded border overflow-hidden">
          <button className={`px-3 py-2 ${view==='grid'?'bg-gray-100':''}`} onClick={()=>setParam('view','grid')}>Grid</button>
          <button className={`px-3 py-2 ${view==='list'?'bg-gray-100':''}`} onClick={()=>setParam('view','list')}>List</button>
        </div>
      </div>
    </div>
  )
}


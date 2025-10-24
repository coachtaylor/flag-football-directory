import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
export default function RefereesPage() {
  return (
    <section className="grid gap-4">
      <Breadcrumbs items={[{ label: 'Referees' }]} className="mb-2" />
      <h1 className="text-2xl font-semibold">Become a Flag Football Referee</h1>
      <p className="small">Updated: Oct 2025</p>
      <p className="text-gray-700">Zero-to-paid: training, assignments, and fast payouts.</p>
      <div className="flex gap-3">
        <Link className="btn btn-primary" href="/submit">I want assignments</Link>
        <Link className="btn" href="/submit">Hire officials</Link>
      </div>
    </section>
  )
}

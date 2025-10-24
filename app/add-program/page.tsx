import Breadcrumbs from '@/components/Breadcrumbs'

export default function AddProgram() {
  return (
    <section className="grid gap-6">
      <Breadcrumbs items={[{ label: 'Add Program' }]} className="mb-2" />
      <h1 className="text-2xl font-semibold">Add a Program</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <a className="card hover:shadow" href="/add-program/team">
          <h3 className="font-semibold">Team</h3>
        </a>
        <a className="card hover:shadow" href="/add-program/league">
          <h3 className="font-semibold">League</h3>
        </a>
        <a className="card hover:shadow" href="/add-program/clinic">
          <h3 className="font-semibold">Clinic</h3>
        </a>
        <a className="card hover:shadow" href="/add-program/tournament">
          <h3 className="font-semibold">Tournament</h3>
        </a>
      </div>
    </section>
  )
}

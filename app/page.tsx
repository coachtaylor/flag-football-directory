import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center gap-8 px-6 text-center sm:px-10 lg:px-16">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-primary-700">
          Flag Football Directory
        </span>
        <h1 className="text-4xl font-bold text-secondary-900 sm:text-5xl">
          Choose your flag football journey
        </h1>
        <p className="max-w-2xl text-lg text-secondary-700 sm:text-xl">
          We&apos;re building the most complete hub for flag football. Explore adult listings that are live today or dive into the youth directory while we continue expanding both experiences.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Link
            href="/adult"
            className="group rounded-3xl border border-[#001f3d]/10 bg-white px-6 py-6 text-left shadow-lg shadow-[#001f3d]/10 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <h2 className="text-2xl font-semibold text-[#001f3d]">Adult Directory</h2>
            <p className="mt-2 text-sm text-[#345c72]">
              Browse adult leagues, teams, clinics, and tournaments with modern filters and verified details.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#e87a00]">
              Enter adult hub <span aria-hidden>→</span>
            </span>
          </Link>
          <Link
            href="/youth"
            className="group rounded-3xl border border-[#001f3d]/10 bg-white px-6 py-6 text-left shadow-lg shadow-[#001f3d]/10 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <h2 className="text-2xl font-semibold text-[#001f3d]">Youth Directory</h2>
            <p className="mt-2 text-sm text-[#345c72]">
              Explore teams, leagues, clinics, and tournaments tailored for youth athletes nationwide.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#e87a00]">
              Visit youth listings <span aria-hidden>→</span>
            </span>
          </Link>
        </div>
      </section>
    </main>
  )
}

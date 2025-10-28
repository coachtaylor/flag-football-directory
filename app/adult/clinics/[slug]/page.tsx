import Breadcrumbs from '@/components/Breadcrumbs'

export default function AdultClinicDetailPlaceholder() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative w-full overflow-hidden bg-gray-50">
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-12">
          <Breadcrumbs
            items={[
              { label: 'Adult', href: '/adult' },
              { label: 'Clinics', href: '/adult/clinics' },
              { label: 'Details Coming Soon' },
            ]}
            className="mb-6 text-sm text-[#345c72]"
          />
          <div className="rounded-3xl border border-[#001f3d]/10 bg-white px-8 py-14 text-center shadow-[0_18px_45px_-32px_rgba(0,31,61,0.25)]">
            <h1 className="text-3xl font-semibold text-[#001f3d] sm:text-4xl">Adult clinic profile coming soon</h1>
            <p className="mt-4 text-base text-[#345c72]/90 sm:text-lg">
              We&apos;re compiling registration info, pricing, and coaching staff details for this adult clinic. Check back soon or submit yours.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

import Hero from '@/components/Hero'
import Highlights from '@/components/Highlights'
import StatesGrid from '@/components/StatesGrid'

export default function YouthLandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />

      <section className="relative w-full bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        </div>
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
          <Highlights />
        </div>
      </section>

      <section className="relative w-full bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        </div>
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
          <StatesGrid />
        </div>
      </section>
    </div>
  )
}

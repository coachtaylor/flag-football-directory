import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'FlagFootballDirectory',
  description: 'Find teams, leagues, clinics, and tournaments near you.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container py-8">{children}</main>
        <footer className="border-t">
          <div className="container py-8 text-sm text-gray-600">
            © {new Date().getFullYear()} FlagFootballDirectory
          </div>
        </footer>
      </body>
    </html>
  )
}

'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const link = 'text-sm hover:underline'
  const btn  = 'btn text-sm'

  return (
    <header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="font-semibold">FlagFootballDirectory</Link>
        {isHome ? (
          <nav className="flex items-center gap-4">
            <Link href="/add-program" className={btn}>Add Program</Link>
          </nav>
        ) : (
          <nav className="flex items-center gap-5">
            <Link href="/" className={link}>Home</Link>
            <Link href="/teams" className={link}>Teams</Link>
            <Link href="/leagues" className={link}>Leagues</Link>
            <Link href="/clinics" className={link}>Clinics</Link>
            <Link href="/tournaments" className={link}>Tournaments</Link>
            <Link href="/add-program" className={btn}>Add Program</Link>
          </nav>
        )}
      </div>
    </header>
  )
}

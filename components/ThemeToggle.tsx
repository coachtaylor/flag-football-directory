// components/ThemeToggle.tsx
'use client'
import { useEffect, useState } from 'react'

const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
)

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  // Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true)
    // Check if user has a theme preference stored
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    // Check system preference
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    // Use stored theme, or fall back to system preference
    const initialTheme = storedTheme || systemPreference
    setTheme(initialTheme)
    document.documentElement.setAttribute('data-theme', initialTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  // Prevent flash of wrong theme on initial render
  if (!mounted) {
    return (
      <button
        className="btn-icon btn-ghost"
        aria-label="Toggle theme"
        disabled
      >
        <div className="w-5 h-5" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="btn-icon btn-ghost transition-transform hover:rotate-12"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  )
}

/* ===== USAGE =====

Add to your Navbar:

import ThemeToggle from '@/components/ThemeToggle'

export default function Navbar() {
  return (
    <header className="border-b bg-base">
      <div className="container flex items-center justify-between py-4">
        <Logo />
        <nav className="flex items-center gap-4">
          <Link href="/teams">Teams</Link>
          <Link href="/leagues">Leagues</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}

===== AUTOMATIC SYSTEM PREFERENCE =====

The component automatically:
1. Checks if user has a saved preference
2. Falls back to system preference (dark/light mode)
3. Saves user's choice to localStorage
4. Applies the theme via data-theme attribute

===== PREVENT FLASH =====

To prevent flash of wrong theme on page load, add this script to your root layout:

// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

*/
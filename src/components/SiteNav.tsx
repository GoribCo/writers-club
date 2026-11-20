'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import config from '@/config'
import type { Genre, Language } from '@/lib/types'

// Menus are built at build time from the content folders (see layout.tsx);
// these components only pick the current language/genre from the URL.
function useSegments() {
  const [, lang = '', genre = ''] = usePathname().split('/')
  return { lang, genre }
}

const pill = (active: boolean) =>
  `shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
    active
      ? 'bg-indigo-600 text-white'
      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
  }`

export function TopNav({ languages }: { languages: Language[] }) {
  const { lang } = useSegments()
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/85 dark:bg-gray-900/85 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label={`${config.app.name} home`}>
          <span className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">✎</span>
          <span className="hidden sm:inline text-lg font-bold text-gray-900 dark:text-white">{config.app.name}</span>
        </Link>

        <nav aria-label="Languages" className="flex-1 min-w-0 flex gap-1 overflow-x-auto [scrollbar-width:none]">
          {languages.map(l => (
            <Link key={l.code} href={`/${l.code}/`} lang={l.code} className={pill(l.code === lang)}>
              <span aria-hidden>{l.flag}</span>
              {l.nativeName}
            </Link>
          ))}
        </nav>

        <Link
          href="/search/"
          aria-label="Search"
          className="p-2 rounded-xl text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}

export function SideNav({ languages, menus }: { languages: Language[]; menus: Record<string, Genre[]> }) {
  const { lang, genre } = useSegments()
  const language = languages.find(l => l.code === lang)
  if (!language) return null
  const genres = menus[lang] ?? []
  const total = genres.reduce((n, g) => n + g.count, 0)
  const items = [{ href: `/${lang}/`, label: language.nativeName, icon: language.flag, count: total, active: !genre }]
    .concat(genres.map(g => ({ href: `/${lang}/${g.slug}/`, label: g.label, icon: g.icon, count: g.count, active: g.slug === genre })))

  return (
    <>
      {/* Mobile: horizontal genre chips */}
      <nav aria-label="Genres" lang={lang} className="lg:hidden flex gap-1 overflow-x-auto px-4 pt-3 [scrollbar-width:none]">
        {items.map(i => (
          <Link key={i.href} href={i.href} className={pill(i.active)}>
            <span aria-hidden>{i.icon}</span>{i.label}
          </Link>
        ))}
      </nav>

      {/* Desktop: left sidebar */}
      <nav aria-label="Genres" lang={lang} className="hidden lg:flex flex-col gap-1 sticky top-14 w-56 shrink-0 px-3 py-6 h-[calc(100dvh-3.5rem)] overflow-y-auto border-r border-gray-200 dark:border-gray-800">
        {items.map(i => (
          <Link
            key={i.href}
            href={i.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              i.active
                ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span aria-hidden>{i.icon}</span>
            <span className="flex-1 truncate">{i.label}</span>
            <span className="text-xs text-gray-400">{i.count}</span>
          </Link>
        ))}
      </nav>
    </>
  )
}

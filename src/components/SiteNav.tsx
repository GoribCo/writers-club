'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import SettingsMenu from './SettingsMenu'
import { useI18n, useLanguageName } from './I18n'
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
  const { t } = useI18n()
  return (
    <header className="sticky top-0 z-40 pt-[env(safe-area-inset-top)] backdrop-blur-md bg-white/85 dark:bg-gray-900/85 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label={t('nav.homeAria', { name: config.app.name })}>
          <span className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">✎</span>
          <span className="hidden min-[360px]:inline text-lg font-bold text-gray-900 dark:text-white">{config.app.name}</span>
        </Link>

        <span className="flex-1 lg:hidden" />
        <nav aria-label={t('nav.languages')} className="hidden lg:flex flex-1 min-w-0 gap-1 overflow-x-auto [scrollbar-width:none]">
          {languages.map(l => (
            <Link key={l.code} href={`/${l.code}/`} lang={l.code} className={pill(l.code === lang)}>
              <span aria-hidden>{l.flag}</span>
              {l.nativeName}
            </Link>
          ))}
        </nav>

        <Link
          href="/authors/"
          aria-label={t('nav.authors')}
          className="hidden lg:block p-2 rounded-xl text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </Link>
        <Link
          href="/search/"
          aria-label={t('nav.search')}
          className="hidden lg:block p-2 rounded-xl text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </Link>
        <SettingsMenu languages={languages} />
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
      <nav aria-label="Genres" lang={lang} className="lg:hidden sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-30 flex gap-1 overflow-x-auto px-4 py-2 bg-gray-50/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 [scrollbar-width:none]">
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

const icons = {
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  authors: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></>,
}

/** Mobile/tablet: app-style bottom tab bar; "Languages" opens a sheet with every language. */
export function BottomNav({ languages }: { languages: Language[] }) {
  const pathname = usePathname()
  const { lang } = useSegments()
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [pathname])
  const current = languages.find(l => l.code === lang)
  const { t } = useI18n()
  const languageName = useLanguageName()

  const tab = (active: boolean) =>
    `flex-1 flex flex-col items-center gap-0.5 pt-2 pb-1.5 text-[11px] font-medium ${
      active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'
    }`
  const icon = (d: React.ReactNode) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{d}</svg>
  )

  return (
    <div className="lg:hidden">
      {open && (
        <>
          <button aria-label={t('nav.close')} onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/40" />
          <div role="dialog" aria-label={t('nav.chooseLanguage')} className="fixed inset-x-0 bottom-0 z-50 max-h-[75dvh] overflow-y-auto rounded-t-3xl bg-white dark:bg-gray-900 p-4 pb-[calc(5rem+env(safe-area-inset-bottom))] shadow-2xl">
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-gray-300 dark:bg-gray-700" />
            <h2 className="mb-3 font-semibold text-gray-900 dark:text-white">{t('nav.chooseLanguage')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {languages.map(l => (
                <Link
                  key={l.code}
                  href={`/${l.code}/`}
                  lang={l.code}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl border p-3 ${
                    l.code === lang
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50'
                      : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <span className="text-2xl" aria-hidden>{l.flag}</span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-gray-900 dark:text-white">{l.nativeName}</span>
                    <span className="block truncate text-xs text-gray-400">{languageName(l.code)}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      <nav aria-label={t('nav.home')} className="fixed inset-x-0 bottom-0 z-50 flex border-t border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
        <Link href="/" className={tab(pathname === '/' && !open)}>{icon(icons.home)}{t('nav.home')}</Link>
        <button onClick={() => setOpen(o => !o)} aria-expanded={open} className={tab(open || !!current)}>
          {current && !open ? <span className="text-2xl leading-6" aria-hidden>{current.flag}</span> : icon(icons.globe)}
          <span className="max-w-[5.5rem] truncate">{current && !open ? current.nativeName : t('nav.languages')}</span>
        </button>
        <Link href="/authors/" className={tab(lang === 'authors' && !open)}>{icon(icons.authors)}{t('nav.authors')}</Link>
        <Link href="/search/" className={tab(lang === 'search' && !open)}>{icon(icons.search)}{t('nav.search')}</Link>
      </nav>
    </div>
  )
}

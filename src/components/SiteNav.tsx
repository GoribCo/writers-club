'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
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

/** Every language as a grid of cards; used by the desktop dropdown and the mobile sheet. */
function LanguageGrid({ languages, lang, onPick }: { languages: Language[]; lang: string; onPick: () => void }) {
  const languageName = useLanguageName()
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {languages.map(l => (
        <Link
          key={l.code}
          href={`/${l.code}/`}
          lang={l.code}
          onClick={onPick}
          aria-current={l.code === lang ? 'page' : undefined}
          className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 ${
            l.code === lang
              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50'
              : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <span className="text-xl" aria-hidden>{l.flag}</span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-gray-900 dark:text-white">{l.nativeName}</span>
            <span className="block truncate text-xs text-gray-400">{languageName(l.code)}</span>
          </span>
        </Link>
      ))}
    </div>
  )
}

/** Desktop: one button showing the current language; opens a dropdown with every language. */
function LanguageMenu({ languages, lang }: { languages: Language[]; lang: string }) {
  const [open, setOpen] = useState(false)
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)
  const current = languages.find(l => l.code === lang)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey) }
  }, [open])

  return (
    <div ref={ref} className="relative hidden lg:block">
      <button onClick={() => setOpen(o => !o)} aria-expanded={open} aria-haspopup="dialog" className={pill(!!current)}>
        <span aria-hidden>{current?.flag ?? '🌐'}</span>
        <span lang={current?.code}>{current?.nativeName ?? t('nav.languages')}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden className={`transition-transform ${open ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && (
        <div role="dialog" aria-label={t('nav.chooseLanguage')} className="absolute start-0 top-full mt-2 w-[30rem] max-h-[70dvh] overflow-y-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 shadow-xl">
          <LanguageGrid languages={languages} lang={lang} onPick={() => setOpen(false)} />
        </div>
      )}
    </div>
  )
}

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

        <LanguageMenu languages={languages} lang={lang} />
        <span className="flex-1" />

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

// Fixed site menu (desktop sidebar + mobile "Menu" sheet). Groups are separated by a divider.
const MENU = [
  [['/', '🏠', 'nav.home'], ['/posts/', '📚', 'menu.posts'], ['/magazine/', '📰', 'menu.magazine'], ['/gallery/', '🖼️', 'menu.gallery'],
    ['/collections/', '🗂️', 'footer.collections'], ['/authors/', '👥', 'nav.authors'], ['/events/', '📅', 'footer.events']],
  [['/submit/', '✍️', 'footer.submit'], ['/contact/', '✉️', 'menu.contact'], ['/social/', '💬', 'menu.social']],
  [['/faq/', '❓', 'menu.faq'], ['/help/', '🛟', 'menu.help'], ['/terms/', '📜', 'menu.terms'], ['/privacy/', '🔒', 'menu.privacy']],
] as const

function MenuList({ languages, onPick }: { languages: Language[]; onPick?: () => void }) {
  const pathname = usePathname()
  const { lang } = useSegments()
  const { t } = useI18n()
  // Writing pages (/{lang}/…) count as Posts
  const active = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href) || (href === '/posts/' && languages.some(l => l.code === lang))
  return MENU.map((group, i) => (
    <div key={i} className={`flex flex-col gap-1 ${i ? 'mt-3 pt-3 border-t border-gray-200 dark:border-gray-800' : ''}`}>
      {group.map(([href, icon, key]) => (
        <Link
          key={href}
          href={href}
          onClick={onPick}
          aria-current={active(href) ? 'page' : undefined}
          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
            active(href)
              ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <span aria-hidden>{icon}</span>
          <span className="flex-1 truncate">{t(key)}</span>
        </Link>
      ))}
    </div>
  ))
}

/** Desktop: always-visible left sidebar with the site menu. */
export function SiteMenu({ languages }: { languages: Language[] }) {
  const { t } = useI18n()
  return (
    <nav aria-label={t('nav.menu')} className="hidden lg:flex flex-col sticky top-14 w-56 shrink-0 px-3 py-6 h-[calc(100dvh-3.5rem)] overflow-y-auto border-r border-gray-200 dark:border-gray-800">
      <MenuList languages={languages} />
    </nav>
  )
}

/** Genre chips of the current language, above the content on /{lang}/… pages (all screen sizes). */
export function GenreChips({ languages, menus }: { languages: Language[]; menus: Record<string, Genre[]> }) {
  const { lang, genre } = useSegments()
  const language = languages.find(l => l.code === lang)
  if (!language) return null
  const items = [{ href: `/${lang}/`, label: language.nativeName, icon: language.flag, active: !genre }]
    .concat((menus[lang] ?? []).map(g => ({ href: `/${lang}/${g.slug}/`, label: g.label, icon: g.icon, active: g.slug === genre })))
  return (
    <nav aria-label="Genres" lang={lang} className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-30 flex gap-1 overflow-x-auto px-4 sm:px-6 py-2 bg-gray-50/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 [scrollbar-width:none]">
      {items.map(i => (
        <Link key={i.href} href={i.href} className={pill(i.active)}>
          <span aria-hidden>{i.icon}</span>{i.label}
        </Link>
      ))}
    </nav>
  )
}

const icons = {
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  authors: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
}

/** Mobile/tablet: app-style bottom tab bar; "Languages" and "Menu" each open a bottom sheet. */
export function BottomNav({ languages }: { languages: Language[] }) {
  const pathname = usePathname()
  const { lang } = useSegments()
  const [sheet, setSheet] = useState<'lang' | 'menu' | null>(null)
  useEffect(() => setSheet(null), [pathname])
  const open = sheet !== null
  const close = () => setSheet(null)
  const current = languages.find(l => l.code === lang)
  const { t } = useI18n()

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
          <button aria-label={t('nav.close')} onClick={close} className="fixed inset-0 z-40 bg-black/40" />
          <div role="dialog" aria-label={t(sheet === 'lang' ? 'nav.chooseLanguage' : 'nav.menu')} className="fixed inset-x-0 bottom-0 z-50 max-h-[75dvh] overflow-y-auto rounded-t-3xl bg-white dark:bg-gray-900 p-4 pb-[calc(5rem+env(safe-area-inset-bottom))] shadow-2xl">
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-gray-300 dark:bg-gray-700" />
            <h2 className="mb-3 font-semibold text-gray-900 dark:text-white">{t(sheet === 'lang' ? 'nav.chooseLanguage' : 'nav.menu')}</h2>
            {sheet === 'lang'
              ? <LanguageGrid languages={languages} lang={lang} onPick={close} />
              : <MenuList languages={languages} onPick={close} />}
          </div>
        </>
      )}

      <nav aria-label={t('nav.home')} className="fixed inset-x-0 bottom-0 z-50 flex border-t border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
        <Link href="/" className={tab(pathname === '/' && !open)}>{icon(icons.home)}{t('nav.home')}</Link>
        <button onClick={() => setSheet(s => (s === 'lang' ? null : 'lang'))} aria-expanded={sheet === 'lang'} className={tab(sheet === 'lang' || (!!current && !open))}>
          {current && !open ? <span className="text-2xl leading-6" aria-hidden>{current.flag}</span> : icon(icons.globe)}
          <span className="max-w-[5.5rem] truncate">{current && !open ? current.nativeName : t('nav.languages')}</span>
        </button>
        <Link href="/authors/" className={tab(lang === 'authors' && !open)}>{icon(icons.authors)}{t('nav.authors')}</Link>
        <Link href="/search/" className={tab(lang === 'search' && !open)}>{icon(icons.search)}{t('nav.search')}</Link>
        <button onClick={() => setSheet(s => (s === 'menu' ? null : 'menu'))} aria-expanded={sheet === 'menu'} className={tab(sheet === 'menu')}>{icon(icons.menu)}{t('nav.menu')}</button>
      </nav>
    </div>
  )
}

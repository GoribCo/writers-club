'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import SettingsMenu from './SettingsMenu'
import { useI18n, useLanguageName } from './I18n'
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

export function TopNav({ languages, siteName }: { languages: Language[]; siteName: string }) {
  const { t } = useI18n()
  return (
    <header className="sticky top-0 z-40 pt-[env(safe-area-inset-top)] backdrop-blur-md bg-white/85 dark:bg-gray-900/85 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label={t('nav.homeAria', { name: siteName })}>
          <span className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">✎</span>
          <span className="hidden min-[360px]:inline text-lg font-bold text-gray-900 dark:text-white">{siteName}</span>
        </Link>

        <span className="flex-1" />

        <Link
          href="/search/"
          aria-label={t('nav.search')}
          className="hidden lg:block p-2 rounded-xl text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{icons.search}</svg>
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

// Already in the mobile bottom bar, so left out of the Menu sheet
const IN_BOTTOM_BAR = ['/', '/posts/', '/authors/', '/events/']

/** Posts is the site's main section: /posts/ and every /{lang}/… page. */
function usePostsActive(languages: Language[]) {
  const pathname = usePathname()
  const { lang } = useSegments()
  return pathname.startsWith('/posts/') || languages.some(l => l.code === lang)
}

/** Desktop sidebar: a list. Mobile Menu sheet (`tiles`): search link + 3-column icon tiles, minus the bottom-bar items. */
function MenuList({ languages, postCount, onPick, tiles }: { languages: Language[]; postCount: number; onPick?: () => void; tiles?: boolean }) {
  const pathname = usePathname()
  const { t } = useI18n()
  const postsActive = usePostsActive(languages)
  const active = (href: string) => (href === '/' ? pathname === '/' : href === '/posts/' ? postsActive : pathname.startsWith(href))
  const groups = MENU.map(g => g.filter(([href]) => !tiles || !IN_BOTTOM_BAR.includes(href))).filter(g => g.length)
  return <>
    {tiles && (
      <Link href="/search/" onClick={onPick} className="mb-4 flex items-center gap-3 rounded-2xl bg-gray-100 dark:bg-gray-800 px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>{icons.search}</svg>
        {t('nav.search')}
      </Link>
    )}
    {groups.map((group, i) => (
    <div key={i} className={`${tiles ? 'grid grid-cols-3 gap-2' : 'flex flex-col gap-1'} ${i ? 'mt-3 pt-3 border-t border-gray-200 dark:border-gray-800' : ''}`}>
      {group.map(([href, icon, key]) => (
        <Link
          key={href}
          href={href}
          onClick={onPick}
          aria-current={active(href) ? 'page' : undefined}
          className={`${tiles
            ? 'flex flex-col items-center gap-1 rounded-2xl px-1 py-3 text-xs text-center'
            : 'flex items-center gap-3 px-3 py-2 rounded-xl text-sm'} font-medium transition-colors ${
            active(href)
              ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
              : tiles
                ? 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <span aria-hidden className={tiles ? 'text-2xl' : ''}>{icon}</span>
          <span className={tiles ? 'w-full truncate' : 'flex-1 truncate'}>{t(key)}</span>
          {!tiles && href === '/posts/' && <span className="text-xs text-gray-400">{postCount}</span>}
        </Link>
      ))}
    </div>
  ))}
  </>
}

/** Desktop: always-visible left sidebar with the site menu. */
export function SiteMenu({ languages, postCount }: { languages: Language[]; postCount: number }) {
  const { t } = useI18n()
  return (
    <nav aria-label={t('nav.menu')} className="hidden lg:flex flex-col sticky top-14 w-56 shrink-0 px-3 py-6 h-[calc(100dvh-3.5rem)] overflow-y-auto border-r border-gray-200 dark:border-gray-800">
      <MenuList languages={languages} postCount={postCount} />
    </nav>
  )
}

/**
 * Bar above the content on /{lang}/… pages (all screen sizes): a language switcher, then the genres of that language.
 * Switching keeps the current genre when the other language has it.
 */
export function GenreChips({ languages, menus }: { languages: Language[]; menus: Record<string, Genre[]> }) {
  const { lang, genre } = useSegments()
  const pathname = usePathname()
  const { t } = useI18n()
  const languageName = useLanguageName()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey) }
  }, [open])

  const language = languages.find(l => l.code === lang)
  if (!language) return null
  const hrefIn = (code: string) => (genre && menus[code]?.some(g => g.slug === genre) ? `/${code}/${genre}/` : `/${code}/`)

  return (
    // The switcher sits outside the scrolling chip row so its panel is not clipped
    <div ref={ref} className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-30 flex items-center gap-2 px-4 sm:px-6 py-2 bg-gray-50/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        lang={lang}
        className={`shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ring-1 transition-colors text-gray-800 dark:text-gray-100 ${
          open ? 'bg-gray-100 dark:bg-gray-800 ring-gray-400' : 'bg-white dark:bg-gray-900 ring-gray-300 dark:ring-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        <span aria-hidden>{language.flag}</span>{language.nativeName}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden className={`transition-transform ${open ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6" /></svg>
      </button>
      <span aria-hidden className="h-5 w-px shrink-0 bg-gray-300 dark:bg-gray-700" />
      <nav aria-label="Genres" lang={lang} className="flex min-w-0 gap-1 overflow-x-auto [scrollbar-width:none]">
        <Link href={`/${lang}/`} className={pill(!genre)}>{t('feed.all')}</Link>
        {(menus[lang] ?? []).map(g => (
          <Link key={g.slug} href={`/${lang}/${g.slug}/`} className={pill(g.slug === genre)}>
            <span aria-hidden>{g.icon}</span>{g.label}
          </Link>
        ))}
      </nav>

      {open && (
        <div role="dialog" aria-label={t('nav.chooseLanguage')} className="absolute inset-x-4 sm:inset-x-auto sm:start-6 sm:w-[30rem] top-full mt-2 max-h-[70dvh] overflow-y-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 shadow-xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {languages.map(l => (
              <Link
                key={l.code}
                href={hrefIn(l.code)}
                lang={l.code}
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
        </div>
      )}
    </div>
  )
}

const icons = {
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  authors: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  events: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  posts: <><path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z" /><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z" /></>,
}

/** Mobile/tablet: app-style bottom tab bar — Home · Authors · Posts (raised centre) · Events · Menu (sheet). */
export function BottomNav({ languages, postCount }: { languages: Language[]; postCount: number }) {
  const pathname = usePathname()
  const { lang } = useSegments()
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [pathname])
  const postsActive = usePostsActive(languages)
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
          <button aria-label={t('nav.close')} onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/40" />
          <div role="dialog" aria-label={t('nav.menu')} className="fixed inset-x-0 bottom-0 z-50 max-h-[75dvh] overflow-y-auto rounded-t-3xl bg-white dark:bg-gray-900 p-4 pb-[calc(5rem+env(safe-area-inset-bottom))] shadow-2xl">
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-gray-300 dark:bg-gray-700" />
            <MenuList languages={languages} postCount={postCount} onPick={() => setOpen(false)} tiles />
          </div>
        </>
      )}

      <nav aria-label={t('nav.home')} className="fixed inset-x-0 bottom-0 z-50 flex border-t border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
        <Link href="/" className={tab(pathname === '/' && !open)}>{icon(icons.home)}{t('nav.home')}</Link>
        <Link href="/authors/" className={tab(lang === 'authors' && !open)}>{icon(icons.authors)}{t('nav.authors')}</Link>
        <Link href="/posts/" aria-current={postsActive ? 'page' : undefined} className={`${tab(postsActive && !open)} !pt-0`}>
          <span className={`-mt-5 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg ring-4 ring-white dark:ring-gray-900 ${
            postsActive && !open ? 'bg-indigo-700' : 'bg-indigo-600'
          }`}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{icons.posts}</svg>
          </span>
          {t('menu.posts')}
        </Link>
        <Link href="/events/" className={tab(lang === 'events' && !open)}>{icon(icons.events)}{t('footer.events')}</Link>
        <button onClick={() => setOpen(o => !o)} aria-expanded={open} className={tab(open)}>{icon(icons.menu)}{t('nav.menu')}</button>
      </nav>
    </div>
  )
}

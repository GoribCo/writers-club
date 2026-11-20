'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

// Site (interface) language — separate from the language a writing is in.
// Dictionaries live in content/ui/{code}.json; missing keys fall back to English.

export type Dict = Record<string, string | Record<string, string>>
type Vars = Record<string, string | number>

const RTL = ['ar', 'fa', 'he', 'ur']
const STORAGE_KEY = 'uiLang'

const Ctx = createContext({
  locale: 'en',
  locales: [] as { code: string; name: string }[],
  setLocale: (_: string) => {},
  t: (key: string, _vars?: Vars) => key,
})

export function I18nProvider({ dicts, children }: { dicts: Record<string, Dict>; children: React.ReactNode }) {
  // Start in English so the first client render matches the static HTML, then switch
  const [locale, setLocaleState] = useState('en')

  useEffect(() => {
    let saved: string | null = null
    try { saved = localStorage.getItem(STORAGE_KEY) } catch {}
    const browser = navigator.languages?.map(l => l.slice(0, 2)).find(l => dicts[l])
    setLocaleState(saved && dicts[saved] ? saved : browser ?? 'en')
  }, [dicts])

  useEffect(() => {
    document.documentElement.dir = RTL.includes(locale) ? 'rtl' : 'ltr'
  }, [locale])

  const setLocale = useCallback((code: string) => {
    setLocaleState(code)
    try { localStorage.setItem(STORAGE_KEY, code) } catch {}
  }, [])

  const t = useCallback((key: string, vars: Vars = {}) => {
    let entry = dicts[locale]?.[key] ?? dicts.en?.[key] ?? key
    if (typeof entry === 'object') entry = entry[new Intl.PluralRules(locale).select(Number(vars.n))] ?? entry.other ?? key
    return entry.replace(/\{(\w+)\}/g, (m, v) => (v in vars ? String(vars[v]) : m))
  }, [dicts, locale])

  const locales = Object.entries(dicts).map(([code, d]) => ({ code, name: String(d._name ?? code) }))
  return <Ctx.Provider value={{ locale, locales, setLocale, t }}>{children}</Ctx.Provider>
}

export const useI18n = () => useContext(Ctx)

/** Translated text for server components: <T k="nav.home" /> or <T k="count.writings" n={3} /> */
export function T({ k, ...vars }: { k: string } & Vars) {
  return <>{useI18n().t(k, vars)}</>
}

/** Date in the site language. */
export function LocaleDate({ date, opts = { day: 'numeric', month: 'short', year: 'numeric' } }:
  { date: string; opts?: Intl.DateTimeFormatOptions }) {
  const { locale } = useI18n()
  return date ? <>{new Date(date + 'T00:00:00').toLocaleDateString(locale, opts)}</> : null
}

/** Language name in the site language, e.g. "German" / "Deutsch" / "ドイツ語". */
export function useLanguageName() {
  const { locale } = useI18n()
  return (code: string) => {
    try { return new Intl.DisplayNames([locale], { type: 'language' }).of(code) ?? code } catch { return code }
  }
}

export function SiteLanguageSelect() {
  const { locale, locales, setLocale, t } = useI18n()
  return (
    <label className="relative flex items-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
      <span className="sr-only">{t('nav.siteLanguage')}</span>
      <svg aria-hidden className="pointer-events-none absolute start-2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6" />
      </svg>
      <select
        value={locale}
        onChange={e => setLocale(e.target.value)}
        title={t('nav.siteLanguage')}
        className="appearance-none bg-transparent ps-8 pe-2 py-2 text-sm font-semibold cursor-pointer max-w-28 truncate focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
      >
        {locales.map(l => <option key={l.code} value={l.code} className="normal-case text-gray-900">{l.name}</option>)}
      </select>
    </label>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme, type ThemePreference } from './ThemeProvider'
import { useI18n } from './I18n'
import type { Language } from '@/lib/types'

// Root font size; everything is sized in rem, so the whole site scales
export const FONT_SIZES = { small: '15px', medium: '16px', large: '18px' } as const
type FontSize = keyof typeof FONT_SIZES

/** Top-right settings popover: theme, font size, site language. */
export default function SettingsMenu({ languages }: { languages: Language[] }) {
  const [open, setOpen] = useState(false)
  const [fontSize, setFontSizeState] = useState<FontSize>('medium')
  const { preference, setPreference } = useTheme()
  const { locale, locales, setLocale, t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)
  const flags = Object.fromEntries(languages.map(l => [l.code, l.flag]))

  useEffect(() => {
    try { setFontSizeState((localStorage.getItem('fontSize') as FontSize | null) ?? 'medium') } catch {}
  }, [])

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey) }
  }, [open])

  const setFontSize = (s: FontSize) => {
    setFontSizeState(s)
    document.documentElement.style.fontSize = FONT_SIZES[s]
    try { s === 'medium' ? localStorage.removeItem('fontSize') : localStorage.setItem('fontSize', s) } catch {}
  }

  const option = (active: boolean) =>
    `flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
      active
        ? 'bg-indigo-600 text-white ring-1 ring-indigo-600'
        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 ring-1 ring-gray-300 dark:ring-gray-600 hover:ring-indigo-400'
    }`
  const label = 'mb-2 text-xs font-medium text-gray-500 dark:text-gray-400'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={t('settings.title')}
        className={`flex h-10 w-10 items-center justify-center rounded-full ring-1 transition-colors ${
          open ? 'bg-gray-100 dark:bg-gray-800 ring-gray-400' : 'ring-gray-300 dark:ring-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
        } text-gray-700 dark:text-gray-200`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.84-.44-1.13-.29-.29-.44-.65-.44-1.13a1.64 1.64 0 0 1 1.67-1.67h2c3.05 0 5.56-2.5 5.56-5.55C21.97 6.01 17.46 2 12 2z" />
        </svg>
      </button>

      {open && (
        <div role="dialog" aria-label={t('settings.title')}
          className="absolute end-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] space-y-4 rounded-2xl bg-gray-50 dark:bg-gray-900 p-4 shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700">
          <fieldset>
            <legend className={label}>{t('settings.theme')}</legend>
            <div className="grid grid-cols-3 gap-2">
              {(['system', 'light', 'dark'] as ThemePreference[]).map(p => (
                <button key={p} onClick={() => setPreference(p)} aria-pressed={preference === p} className={option(preference === p)}>
                  {t(`theme.${p}`)}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className={label}>{t('settings.fontSize')}</legend>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(FONT_SIZES) as FontSize[]).map(s => (
                <button key={s} onClick={() => setFontSize(s)} aria-pressed={fontSize === s} className={option(fontSize === s)}>
                  {t(`font.${s}`)}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className={label}>{t('settings.language')}</legend>
            <div className="flex flex-wrap gap-2">
              {locales.map(l => (
                <button key={l.code} lang={l.code} onClick={() => setLocale(l.code)} aria-pressed={locale === l.code} className={option(locale === l.code)}>
                  {flags[l.code] && <span aria-hidden>{flags[l.code]}</span>}{l.name}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      )}
    </div>
  )
}

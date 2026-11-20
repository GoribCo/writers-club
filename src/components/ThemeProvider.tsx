'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type ThemePreference = 'system' | 'light' | 'dark'

const ThemeContext = createContext({
  preference: 'system' as ThemePreference,
  setPreference: (_: ThemePreference) => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPref] = useState<ThemePreference>('system')

  useEffect(() => {
    try { setPref((localStorage.getItem('theme') as ThemePreference | null) ?? 'system') } catch {}
  }, [])

  // Apply, and follow the OS setting live while on "system"
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () =>
      document.documentElement.classList.toggle('dark', preference === 'dark' || (preference === 'system' && media.matches))
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [preference])

  const setPreference = (p: ThemePreference) => {
    setPref(p)
    try { p === 'system' ? localStorage.removeItem('theme') : localStorage.setItem('theme', p) } catch {}
  }

  return <ThemeContext.Provider value={{ preference, setPreference }}>{children}</ThemeContext.Provider>
}

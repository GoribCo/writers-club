'use client'

import { useEffect, useState } from 'react'
import { useI18n } from './I18n'

/** Reading progress bar + share, for writing pages. */
export default function ReaderTools({ title, text }: { title: string; text: string }) {
  const [progress, setProgress] = useState(0)
  const [copied, setCopied] = useState(false)
  const { t } = useI18n()

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight
      setProgress(max > 0 ? Math.min(1, scrollY / max) : 1)
    }
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])

  const share = async () => {
    const url = location.href
    if (navigator.share) return navigator.share({ title, text, url }).catch(() => {})
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const btn = 'h-9 min-w-9 px-2 rounded-full ring-1 ring-gray-200 dark:ring-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40'
  return (
    <>
      <div aria-hidden className="fixed left-0 right-0 top-[calc(3.5rem+env(safe-area-inset-top))] z-50 h-0.5">
        <div className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 origin-left" style={{ transform: `scaleX(${progress})` }} />
      </div>
      <div className="flex items-center gap-2">
        <button className={`${btn} px-4`} onClick={share}>{t(copied ? 'reader.copied' : 'reader.share')}</button>
      </div>
    </>
  )
}

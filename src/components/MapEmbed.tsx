'use client'

import { useState } from 'react'
import { useI18n } from './I18n'

/** Google Maps embed, loaded only after a click (no Google request or cookies before consent). */
export default function MapEmbed({ query }: { query: string }) {
  const [show, setShow] = useState(false)
  const { t } = useI18n()
  if (show)
    return <iframe src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`} title={query} loading="lazy" className="h-72 w-full rounded-xl border-0" />
  return (
    <div className="flex h-72 w-full flex-col items-center justify-center gap-3 rounded-xl bg-gray-100 dark:bg-gray-800 p-4 text-center">
      <span aria-hidden className="text-4xl">📍</span>
      <button onClick={() => setShow(true)} className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">{t('contact.showMap')}</button>
      <p className="max-w-xs text-xs text-gray-500 dark:text-gray-400">{t('contact.mapNotice')}</p>
    </div>
  )
}

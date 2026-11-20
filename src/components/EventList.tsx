'use client'

import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import EventCard from './EventCard'
import type { ClubEvent } from '@/lib/types'

/** Upcoming vs past is decided in the browser (static site). */
export default function EventList({ events }: { events: ClubEvent[] }) {
  const [today, setToday] = useState('')
  useEffect(() => setToday(new Date().toISOString().slice(0, 10)), [])
  const upcoming = events.filter(e => e.date >= today)
  const past = events.filter(e => e.date < today).reverse()
  const list = (es: ClubEvent[], first = false) => es.map((e, i) => (
    <div key={e.slug} id={e.slug}>
      <EventCard e={e} highlight={first && i === 0} />
      {e.body && <div className="prose max-w-none px-5 pt-3 text-sm"><ReactMarkdown>{e.body}</ReactMarkdown></div>}
    </div>
  ))
  return (
    <>
      <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Upcoming</h2>
      <div className="space-y-4 mb-10">{upcoming.length ? list(upcoming, true) : <p className="text-gray-500">No meetings planned yet — check back soon.</p>}</div>
      {past.length > 0 && today && (
        <>
          <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Past</h2>
          <div className="space-y-4 opacity-75">{list(past)}</div>
        </>
      )}
    </>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import EventCard from './EventCard'
import type { ClubEvent } from '@/lib/types'

/** Picks the next event in the visitor's browser, so a static build doesn't show a past meeting. */
export default function NextEvent({ events }: { events: ClubEvent[] }) {
  const [today, setToday] = useState<string>()
  useEffect(() => setToday(new Date().toISOString().slice(0, 10)), [])
  const next = today && events.find(e => e.date >= today)
  if (!next) return null
  return (
    <Link href="/events/" className="block hover:-translate-y-0.5 transition-transform">
      <EventCard e={next} highlight />
    </Link>
  )
}

import type { Metadata } from 'next'
import { getEvents } from '@/lib/content'
import EventList from '@/components/EventList'
import JsonLd from '@/components/JsonLd'
import { absUrl } from '@/lib/url'
import config from '@/config'

export const dynamic = 'force-static'
export const metadata: Metadata = {
  title: 'Events',
  description: 'Weekly meetings, readings and workshops of the writers club.',
  alternates: { canonical: '/events/' },
}

export default function EventsPage() {
  const events = getEvents()
  return (
    <div className="max-w-3xl mx-auto">
      <JsonLd data={events.map(e => ({
        '@context': 'https://schema.org', '@type': 'Event', name: e.title, description: e.description,
        startDate: e.date, eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: { '@type': 'Place', name: e.place || config.app.name },
        organizer: { '@type': 'Organization', name: config.app.name, url: absUrl('/') },
        url: absUrl(`/events/#${e.slug}`),
      }))} />
      <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Events</h1>
      <p className="mb-8 text-gray-500 dark:text-gray-400">Everyone is welcome — bring something you wrote, or just come and listen.</p>
      <EventList events={events} />
    </div>
  )
}

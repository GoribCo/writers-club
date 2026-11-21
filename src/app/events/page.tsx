import type { Metadata } from 'next'
import { getSite, getEvents } from '@/lib/content'
import EventList from '@/components/EventList'
import JsonLd from '@/components/JsonLd'
import { T } from '@/components/I18n'
import { absUrl } from '@/lib/url'
import { markdownPage } from '@/components/MarkdownPage'

const site = getSite()

export const dynamic = 'force-static'
export const metadata: Metadata = markdownPage('events').generateMetadata()

export default function EventsPage() {
  const events = getEvents()
  return (
    <div className="max-w-3xl mx-auto">
      <JsonLd data={events.map(e => ({
        '@context': 'https://schema.org', '@type': 'Event', name: e.title, description: e.description,
        startDate: e.date, eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: { '@type': 'Place', name: e.place || site.name },
        organizer: { '@type': 'Organization', name: site.name, url: absUrl('/') },
        url: absUrl(`/events/#${e.slug}`),
      }))} />
      <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white"><T k="events.title" /></h1>
      <p className="mb-8 text-gray-500 dark:text-gray-400"><T k="events.intro" /></p>
      <EventList events={events} />
    </div>
  )
}

import { getSite } from '@/lib/content'
import MapEmbed from './MapEmbed'
import { T } from './I18n'

const card = 'rounded-2xl bg-white dark:bg-gray-800/60 p-5 ring-1 ring-gray-200 dark:ring-gray-700'
const label = 'text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400'

/** Contact page: email, Instagram, meeting place with map. Values come from contents/site.md. */
export default function ContactInfo() {
  const { email, instagram, instagramHandle, meetingPlace: place, meetingAddress: address } = getSite()
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  return (
    <div className="max-w-2xl mx-auto grid gap-4 sm:grid-cols-2">
      <a href={`mailto:${email}`} className={`${card} hover:ring-indigo-400`}>
        <p className={label}>✉️ <T k="contact.email" /></p>
        <p className="mt-1 break-all font-semibold text-indigo-600 dark:text-indigo-400">{email}</p>
      </a>
      <a href={instagram} target="_blank" rel="noopener" className={`${card} hover:ring-indigo-400`}>
        <p className={label}>📸 Instagram</p>
        <p className="mt-1 font-semibold text-indigo-600 dark:text-indigo-400">{instagramHandle}</p>
      </a>
      <section className={`${card} sm:col-span-2 space-y-3`} aria-labelledby="where-we-meet">
        <div>
          <h2 id="where-we-meet" className={label}>📍 <T k="contact.meeting" /></h2>
          <p className="mt-1 font-semibold text-gray-900 dark:text-white">{place}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{address}</p>
        </div>
        <MapEmbed query={address} />
        <a href={mapsLink} target="_blank" rel="noopener" className="inline-block text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"><T k="contact.openMap" /> ↗</a>
      </section>
    </div>
  )
}

import Link from 'next/link'
import { T } from './I18n'
import { getClub } from '@/lib/content'

const club = getClub()

const links = [
  ['/authors/', 'nav.authors'], ['/collections/', 'footer.collections'], ['/events/', 'footer.events'],
  ['/submit/', 'footer.submit'], ['/contact/', 'menu.contact'], ['/search/', 'nav.search'],
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pb-8 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <p className="font-bold text-gray-900 dark:text-white">{club.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400"><T k="footer.tagline" /></p>
          <a href={club.instagram} target="_blank" rel="noopener" className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
            <span><T k="footer.followUs" />: {club.instagramHandle}</span>
          </a>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {links.map(([href, key]) => (
            <Link key={href} href={href} className="text-gray-600 dark:text-gray-300 hover:text-indigo-600"><T k={key} /></Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}

import Link from 'next/link'
import config from '@/config'
import { T } from './I18n'

const links = [
  ['/authors/', 'nav.authors'], ['/collections/', 'footer.collections'], ['/events/', 'footer.events'],
  ['/submit/', 'footer.submit'], ['/search/', 'nav.search'],
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pb-8 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <p className="font-bold text-gray-900 dark:text-white">{config.app.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400"><T k="footer.tagline" /></p>
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

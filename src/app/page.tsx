import Link from 'next/link'
import { getAllWritings, getLanguages, getWritings } from '@/lib/content'
import WritingCard from '@/components/WritingCard'
import config from '@/config'

export const dynamic = 'force-static'

export default function HomePage() {
  const languages = getLanguages()
  const byCode = Object.fromEntries(languages.map(l => [l.code, l]))
  const latest = getAllWritings().slice(0, 8)

  return (
    <div className="max-w-3xl">
      <section className="mb-8">
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">BTU Cottbus-Senftenberg · International Students</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{config.app.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Students from all over the world meet every week to share and discuss their writing. Stories, poems,
          travel diaries, guides and drama — published here in the languages they were written in.
        </p>
      </section>

      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Read in your language</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
        {languages.map(l => (
          <Link
            key={l.code}
            href={`/${l.code}/`}
            lang={l.code}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 p-4 transition-colors"
          >
            <div className="text-2xl mb-1" aria-hidden>{l.flag}</div>
            <div className="font-semibold text-gray-900 dark:text-white">{l.nativeName}</div>
            <div className="text-xs text-gray-400">{getWritings(l.code).length} writings</div>
          </Link>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Latest writings</h2>
      <div className="space-y-3">
        {latest.map(w => <WritingCard key={w.url} writing={w} language={byCode[w.lang]} />)}
      </div>
    </div>
  )
}

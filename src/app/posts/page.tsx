import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllGenres, getAllWritings, getCountries, getLanguages, groupTranslations } from '@/lib/content'
import HomeFeed from '@/components/HomeFeed'
import { T } from '@/components/I18n'
import { markdownPage } from '@/components/MarkdownPage'

export const dynamic = 'force-static'
export const metadata: Metadata = markdownPage('posts').generateMetadata()

export default function PostsPage() {
  // Drop the body text: the feed is a client component and only needs card fields
  const items = groupTranslations(getAllWritings()).map(i => ({ ...i, writing: { ...i.writing, content: '' } }))
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white"><T k="menu.posts" /></h1>
      <nav aria-label="Languages" className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-gray-500 dark:text-gray-400"><T k="nav.languages" />:</span>
        {getLanguages().map(l => (
          <Link key={l.code} href={`/${l.code}/`} lang={l.code} className="flex items-center gap-1.5 rounded-full px-3 py-1 ring-1 ring-gray-200 dark:ring-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            <span aria-hidden>{l.flag}</span>{l.nativeName}
          </Link>
        ))}
      </nav>
      <nav aria-label="Countries" className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-gray-500 dark:text-gray-400"><T k="countries.title" />:</span>
        {getCountries().map(c => (
          <Link key={c.slug} href={`/countries/${c.slug}/`} className="flex items-center gap-1.5 rounded-full px-3 py-1 ring-1 ring-gray-200 dark:ring-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            <span aria-hidden>{c.flag}</span>{c.name}<span className="text-xs text-gray-400">{c.items.length}</span>
          </Link>
        ))}
      </nav>
      <HomeFeed items={items} genres={getAllGenres()} languages={getLanguages()} />
    </div>
  )
}

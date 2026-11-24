import Link from 'next/link'
import type { Metadata } from 'next'
import { getAuthors, getCountries, getLanguages } from '@/lib/content'
import AuthorAvatar from '@/components/AuthorAvatar'
import { T } from '@/components/I18n'
import { markdownPage } from '@/components/MarkdownPage'

export const dynamic = 'force-static'
export const metadata: Metadata = markdownPage('authors').generateMetadata()

export default function AuthorsPage() {
  const byCode = Object.fromEntries(getLanguages().map(l => [l.code, l]))
  const authors = getAuthors()
  const countries = getCountries()
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6"><T k="authors.title" /></h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {authors.map(a => (
          <Link
            key={a.slug}
            href={`/authors/${a.slug}/`}
            className="flex items-center gap-3 rounded-3xl bg-white dark:bg-gray-800/80 ring-1 ring-gray-200/70 dark:ring-gray-700/60 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 p-5"
          >
            <AuthorAvatar author={a} size={56} />
            <div className="min-w-0">
              <div className="font-semibold text-gray-900 dark:text-white">{a.name}</div>
              <div className="text-sm text-indigo-600 dark:text-indigo-400">{[a.tagline, a.country].filter(Boolean).join(' · ')}</div>
              <div className="text-xs text-gray-400">
                <T k="count.writings" n={a.writings.length} /> ·{' '}
                {[...new Set(a.writings.map(w => w.lang))].map(c => byCode[c]?.flag).join(' ')}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <section className="mt-12">
        <h2 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white"><T k="authors.whereFrom" /></h2>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400"><T k="authors.countries" n={countries.length} /></p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {countries.map(c => (
            <div key={c.slug} className="rounded-2xl bg-white dark:bg-gray-800/80 ring-1 ring-gray-200/70 dark:ring-gray-700/60 p-4">
              <Link href={`/countries/${c.slug}/`} className="flex items-center gap-2 group">
                <span className="text-3xl" aria-hidden>{c.flag}</span>
                <span className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600">{c.name}</span>
                <span className="ms-auto text-xs text-gray-400">{c.items.length}</span>
              </Link>
              <div className="mt-2 flex flex-wrap gap-x-2 text-xs">
                {c.authors.map(a => <Link key={a.slug} href={`/authors/${a.slug}/`} className="text-indigo-600 dark:text-indigo-400 hover:underline">{a.name}</Link>)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

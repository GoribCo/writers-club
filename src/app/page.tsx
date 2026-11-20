import Link from 'next/link'
import { getAllGenres, getAllWritings, getAuthors, getLanguages, getWritings, groupTranslations } from '@/lib/content'
import HomeFeed from '@/components/HomeFeed'
import AuthorAvatar from '@/components/AuthorAvatar'
import config from '@/config'

export const dynamic = 'force-static'

export default function HomePage() {
  const languages = getLanguages()
  // Drop the body text: the feed is a client component and only needs card fields
  const items = groupTranslations(getAllWritings()).map(i => ({ ...i, writing: { ...i.writing, content: '' } }))
  const authors = getAuthors()
  const stats = [
    { n: items.length, label: 'Writings' },
    { n: authors.length, label: 'Authors' },
    { n: languages.length, label: 'Languages' },
  ]

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 px-6 py-10 sm:px-10 sm:py-14 text-white shadow-xl">
        <div aria-hidden className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div aria-hidden className="absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="relative max-w-2xl">
          <p className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur">
            BTU Cottbus-Senftenberg · International Students
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Stories from every corner of the world.
          </h1>
          <p className="mt-4 text-white/85 text-base sm:text-lg">
            {config.app.name} members meet every week to share their writing — stories, poems, travel diaries,
            guides and drama, published in the languages they were written in.
          </p>
          <div className="mt-8 flex gap-8">
            {stats.map(s => (
              <div key={s.label}>
                <div className="text-3xl font-extrabold">{s.n}</div>
                <div className="text-xs uppercase tracking-wider text-white/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomeFeed items={items} genres={getAllGenres()} languages={languages} />

      {/* Authors */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Meet the authors</h2>
          <Link href="/authors/" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">See all →</Link>
        </div>
        <div className="-mx-4 sm:mx-0 px-4 sm:px-0 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none]">
          {authors.map(a => (
            <Link key={a.slug} href={`/authors/${a.slug}/`}
              className="group w-36 shrink-0 rounded-3xl bg-white dark:bg-gray-800/80 ring-1 ring-gray-200/70 dark:ring-gray-700/60 p-4 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <AuthorAvatar author={a} size={64} className="mx-auto ring-4 ring-white dark:ring-gray-800" />
              <div className="mt-3 truncate text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600">{a.name}</div>
              <div className="truncate text-xs text-gray-500 dark:text-gray-400">{a.country}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Languages */}
      <section>
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Read in your language</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {languages.map(l => (
            <Link key={l.code} href={`/${l.code}/`} lang={l.code}
              className="flex items-center gap-3 rounded-2xl bg-white dark:bg-gray-800/80 ring-1 ring-gray-200/70 dark:ring-gray-700/60 p-4 hover:ring-indigo-400 transition">
              <span className="text-3xl" aria-hidden>{l.flag}</span>
              <span className="min-w-0">
                <span className="block truncate font-semibold text-gray-900 dark:text-white">{l.nativeName}</span>
                <span className="block text-xs text-gray-400">{getWritings(l.code).length} writings</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

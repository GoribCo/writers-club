import Link from 'next/link'
import { getAllGenres, getAllWritings, getAuthors, getSite, getCollections, getEvents, getLanguages, getTags, getWritings, groupTranslations } from '@/lib/content'
import NextEvent from '@/components/NextEvent'
import CollectionCard from '@/components/CollectionCard'
import HomeFeed from '@/components/HomeFeed'
import AuthorAvatar from '@/components/AuthorAvatar'
import { T } from '@/components/I18n'

const site = getSite()

export const dynamic = 'force-static'

export default function HomePage() {
  const languages = getLanguages()
  // Drop the body text: the feed is a client component and only needs card fields
  const items = groupTranslations(getAllWritings()).map(i => ({ ...i, writing: { ...i.writing, content: '' } }))
  const authors = getAuthors()
  const collections = getCollections()
  const tags = getTags()
  const stats = [
    { n: items.length, label: 'stat.writings' },
    { n: authors.length, label: 'stat.authors' },
    { n: languages.length, label: 'stat.languages' },
  ]

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 px-6 py-10 sm:px-10 sm:py-14 text-white shadow-xl">
        <div aria-hidden className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div aria-hidden className="absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="relative max-w-2xl">
          <p className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur">
            <T k="home.kicker" university={site.university} />
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            <T k="home.title" />
          </h1>
          <p className="mt-4 text-white/85 text-base sm:text-lg">
            <T k="home.intro" name={site.name} />
          </p>
          <Link href="/posts/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50 hover:shadow-xl">
            <T k="home.startReading" />
            <span aria-hidden className="rtl:rotate-180">→</span>
          </Link>
          <div className="mt-8 flex gap-8">
            {stats.map(s => (
              <div key={s.label}>
                <div className="text-3xl font-extrabold">{s.n}</div>
                <div className="text-xs uppercase tracking-wider text-white/70"><T k={s.label} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NextEvent events={getEvents()} />

      <HomeFeed items={items} genres={getAllGenres()} languages={languages} />

      {collections.length > 0 && (
        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white"><T k="home.collections" /></h2>
            <Link href="/collections/" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"><T k="home.seeAll" /></Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">{collections.slice(0, 2).map(c => <CollectionCard key={c.slug} c={c} />)}</div>
        </section>
      )}

      {tags.length > 0 && (
        <section>
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white"><T k="home.themes" /></h2>
          <div className="flex flex-wrap gap-2">
            {tags.map(t => (
              <Link key={t.slug} href={`/tags/${t.slug}/`}
                className="rounded-full bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:ring-indigo-400">
                #{t.slug} <span className="text-gray-400">{t.items.length}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Authors */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white"><T k="home.meetAuthors" /></h2>
          <Link href="/authors/" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"><T k="home.seeAll" /></Link>
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

      {/* Submit */}
      <section className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between rounded-[2rem] bg-gray-900 dark:bg-white px-6 py-8 sm:px-10 text-white dark:text-gray-900">
        <div>
          <h2 className="text-2xl font-bold"><T k="home.shareTitle" /></h2>
          <p className="mt-1 text-white/70 dark:text-gray-600"><T k="home.shareText" /></p>
        </div>
        <Link href="/submit/" className="shrink-0 rounded-full bg-white dark:bg-gray-900 px-6 py-3 text-center font-semibold text-gray-900 dark:text-white hover:opacity-90">
          <T k="home.shareCta" />
        </Link>
      </section>

      {/* Languages */}
      <section>
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white"><T k="home.readInYourLanguage" /></h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {languages.map(l => (
            <Link key={l.code} href={`/${l.code}/`} lang={l.code}
              className="flex items-center gap-3 rounded-2xl bg-white dark:bg-gray-800/80 ring-1 ring-gray-200/70 dark:ring-gray-700/60 p-4 hover:ring-indigo-400 transition">
              <span className="text-3xl" aria-hidden>{l.flag}</span>
              <span className="min-w-0">
                <span className="block truncate font-semibold text-gray-900 dark:text-white">{l.nativeName}</span>
                <span className="block text-xs text-gray-400"><T k="count.writings" n={getWritings(l.code).length} /></span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

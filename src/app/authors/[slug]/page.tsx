import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getAuthor, getAuthors, getLanguages, groupTranslations } from '@/lib/content'
import AuthorAvatar from '@/components/AuthorAvatar'
import WritingCard from '@/components/WritingCard'

export const dynamicParams = false

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return getAuthors().map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const a = getAuthor(slug)
  return a
    ? { title: a.name, description: a.tagline || `Writings by ${a.name}`, alternates: { canonical: `/authors/${slug}/` } }
    : {}
}

const card = 'rounded-3xl bg-white dark:bg-gray-800/80 ring-1 ring-gray-200/70 dark:ring-gray-700/60'

export default async function AuthorPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const a = getAuthor(slug)
  if (!a) notFound()
  const languages = getLanguages()
  const byCode = Object.fromEntries(languages.map(l => [l.code, l]))
  const works = groupTranslations(a.writings)
  const langs = [...new Set(a.writings.map(w => w.lang))]
  const genres = [...new Set(works.map(i => i.writing.genreLabel))]
  const stats = [
    { n: works.length, label: works.length === 1 ? 'Writing' : 'Writings' },
    { n: langs.length, label: langs.length === 1 ? 'Language' : 'Languages' },
    { n: new Set(a.writings.map(w => w.genre)).size, label: 'Genres' },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      <Link href="/authors/" className="inline-flex items-center gap-1 mb-4 text-sm font-medium text-gray-500 hover:text-indigo-600">← All authors</Link>

      {/* Profile header */}
      <section className={`${card} overflow-hidden mb-8`}>
        <div className="relative h-36 sm:h-48 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500">
          <div aria-hidden className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        </div>
        <div className="px-5 sm:px-8 pb-6">
          <div className="relative -mt-14 sm:-mt-16 flex flex-col gap-3">
            <AuthorAvatar author={a} size={112} className="ring-4 ring-white dark:ring-gray-800 shadow-lg" />
            <div className="min-w-0">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">{a.name}</h1>
              {a.tagline && <p className="mt-1 text-gray-600 dark:text-gray-300">{a.tagline}</p>}
              {a.country && <p className="mt-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">📍 {a.country}</p>}
            </div>
          </div>

          {Object.keys(a.links).length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {Object.entries(a.links).map(([label, href]) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer me"
                  className="rounded-full bg-gray-900 dark:bg-white px-4 py-2 text-sm font-semibold capitalize text-white dark:text-gray-900 hover:opacity-80 transition">
                  {label} ↗
                </a>
              ))}
            </div>
          )}

          <div className="mt-6 grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-900/50 py-4 text-center">
            {stats.map(s => (
              <div key={s.label}>
                <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{s.n}</div>
                <div className="text-xs uppercase tracking-wider text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-8 min-w-0">
          {a.about && (
            <section className={`${card} p-6 sm:p-8`}>
              <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">About</h2>
              <div className="prose writing max-w-none text-gray-700 dark:text-gray-300">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{a.about}</ReactMarkdown>
              </div>
            </section>
          )}

          {works.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Writings by {a.name.split(' ')[0]}</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                {works.map(i => (
                  <WritingCard key={i.writing.url} writing={i.writing} languages={i.langs.map(c => byCode[c]).filter(Boolean)} />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 self-start">
          <section className={`${card} p-5`}>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">Profile</h2>
            <dl className="space-y-3 text-sm">
              {Object.entries({ ...a.details, 'Writes about': genres.join(', ') }).filter(([, v]) => v).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-gray-400">{k}</dt>
                  <dd className="font-medium text-gray-800 dark:text-gray-200">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className={`${card} p-5`}>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">Published in</h2>
            <div className="flex flex-wrap gap-2">
              {langs.map(c => byCode[c] && (
                <Link key={c} href={`/${c}/`} lang={c}
                  className="rounded-full bg-gray-100 dark:bg-gray-900 px-3 py-1.5 text-sm hover:ring-2 hover:ring-indigo-400 transition">
                  <span aria-hidden>{byCode[c].flag}</span> {byCode[c].nativeName}
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

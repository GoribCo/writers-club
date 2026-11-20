import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getAuthor, getAuthors, getLanguages } from '@/lib/content'
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

export default async function AuthorPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const a = getAuthor(slug)
  if (!a) notFound()
  const byCode = Object.fromEntries(getLanguages().map(l => [l.code, l]))
  const genres = [...new Set(a.writings.map(w => w.genre))]

  return (
    <div className="max-w-3xl">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        <Link href="/authors/" className="hover:text-indigo-600">Authors</Link>
      </nav>

      <header className="flex items-center gap-4 mb-6">
        <AuthorAvatar author={a} size={88} />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{a.name}</h1>
          {a.tagline && <p className="text-gray-600 dark:text-gray-300">{a.tagline}</p>}
          {a.country && <p className="text-indigo-600 dark:text-indigo-400 font-medium">{a.country}</p>}
        </div>
      </header>

      {Object.keys(a.links).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(a.links).map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer me"
              className="px-3 py-1 rounded-full text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-400 capitalize"
            >
              {label} ↗
            </a>
          ))}
        </div>
      )}

      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm mb-8">
        {Object.entries({ ...a.details, Writings: String(a.writings.length), Genres: genres.join(', ') })
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-gray-400">{k}</dt>
              <dd className="text-gray-800 dark:text-gray-200">{v}</dd>
            </div>
          ))}
      </dl>

      {a.about && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">About</h2>
          <div className="prose writing max-w-none text-gray-700 dark:text-gray-300">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{a.about}</ReactMarkdown>
          </div>
        </section>
      )}

      {a.writings.length > 0 && <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Writings</h2>}
      <div className="space-y-3">
        {a.writings.map(w => <WritingCard key={w.url} writing={w} language={byCode[w.lang]} />)}
      </div>
    </div>
  )
}

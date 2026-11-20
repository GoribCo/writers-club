import Link from 'next/link'
import type { Metadata } from 'next'
import { getAuthors, getLanguages } from '@/lib/content'
import AuthorAvatar from '@/components/AuthorAvatar'

export const dynamic = 'force-static'
export const metadata: Metadata = { title: 'Authors', alternates: { canonical: '/authors/' } }

export default function AuthorsPage() {
  const byCode = Object.fromEntries(getLanguages().map(l => [l.code, l]))
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Authors</h1>
      <div className="grid sm:grid-cols-2 gap-3">
        {getAuthors().map(a => (
          <Link
            key={a.slug}
            href={`/authors/${a.slug}/`}
            className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all p-4"
          >
            <AuthorAvatar author={a} />
            <div className="min-w-0">
              <div className="font-semibold text-gray-900 dark:text-white">{a.name}</div>
              <div className="text-sm text-indigo-600 dark:text-indigo-400">{[a.tagline, a.country].filter(Boolean).join(' · ')}</div>
              <div className="text-xs text-gray-400">
                {a.writings.length} writing{a.writings.length !== 1 && 's'} ·{' '}
                {[...new Set(a.writings.map(w => w.lang))].map(c => byCode[c]?.flag).join(' ')}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

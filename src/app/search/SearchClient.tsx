'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import WritingCard from '@/components/WritingCard'
import AuthorAvatar from '@/components/AuthorAvatar'
import { useI18n } from '@/components/I18n'
import type { Language, Writing } from '@/lib/types'

type AuthorHit = { slug: string; name: string; country: string; tagline: string; photo: string }

export default function SearchClient({ index, authors, languages }: { index: Writing[]; authors: AuthorHit[]; languages: Language[] }) {
  const [query, setQuery] = useState('')
  const { t } = useI18n()
  // ?q= support (used by the WebSite SearchAction structured data and shareable links)
  useEffect(() => setQuery(new URLSearchParams(location.search).get('q') ?? ''), [])
  const q = query.trim().toLowerCase()
  const authorHits = q ? authors.filter(a => [a.name, a.country, a.tagline].some(f => f.toLowerCase().includes(q))) : []
  const byCode = Object.fromEntries(languages.map(l => [l.code, l]))
  const results = q
    ? index.filter(w =>
        [w.title, w.author, w.country, w.description, w.genre, w.genreLabel, ...w.tags, w.content].some(f => f.toLowerCase().includes(q)))
    : []

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('search.title')}</h1>
      <input
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={t('search.placeholder')}
        aria-label={t('search.title')}
        autoFocus
        className="w-full px-4 py-3 mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {authorHits.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-3">
          {authorHits.map(a => (
            <Link key={a.slug} href={`/authors/${a.slug}/`}
              className="flex items-center gap-3 rounded-2xl bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 p-3 pr-5 hover:ring-indigo-400">
              <AuthorAvatar author={a} size={40} />
              <span>
                <span className="block font-semibold text-gray-900 dark:text-white">{a.name}</span>
                <span className="block text-xs text-gray-500">{[a.tagline, a.country].filter(Boolean).join(' · ')}</span>
              </span>
            </Link>
          ))}
        </div>
      )}
      {q && <p className="text-xs text-gray-400 mb-2">{t('search.results', { n: results.length })}</p>}
      <div className="grid gap-5 sm:grid-cols-2">
        {results.map(w => <WritingCard key={w.url} writing={w} languages={[byCode[w.lang]]} />)}
      </div>
    </div>
  )
}

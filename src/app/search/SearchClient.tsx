'use client'

import { useState } from 'react'
import WritingCard from '@/components/WritingCard'
import type { Language, Writing } from '@/lib/types'

export default function SearchClient({ index, languages }: { index: Writing[]; languages: Language[] }) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const byCode = Object.fromEntries(languages.map(l => [l.code, l]))
  const results = q
    ? index.filter(w =>
        [w.title, w.author, w.country, w.description, w.genre, w.content].some(f => f.toLowerCase().includes(q)))
    : []

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Search</h1>
      <input
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Title, author, country, words…"
        aria-label="Search writings"
        autoFocus
        className="w-full px-4 py-3 mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {q && <p className="text-xs text-gray-400 mb-2">{results.length} result{results.length !== 1 && 's'}</p>}
      <div className="space-y-3">
        {results.map(w => <WritingCard key={w.url} writing={w} language={byCode[w.lang]} />)}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import WritingCard from './WritingCard'
import type { Genre, Language, Writing } from '@/lib/types'

type Item = { writing: Writing; langs: string[] }

/** Content-type menu (All / Stories / Poems …) + filtered feed. Featured = newest of the selection. */
export default function HomeFeed({ items, genres, languages }: { items: Item[]; genres: Genre[]; languages: Language[] }) {
  const [genre, setGenre] = useState('')
  const byCode = Object.fromEntries(languages.map(l => [l.code, l]))
  const shown = genre ? items.filter(i => i.writing.genre === genre) : items
  const [first, ...rest] = shown
  const tabs = [{ slug: '', label: 'All', icon: '✨', count: items.length }, ...genres]
  const card = (i: Item, featured = false) => (
    <WritingCard key={i.writing.url} writing={i.writing} featured={featured}
      languages={i.langs.map(c => byCode[c]).filter(Boolean)} />
  )

  return (
    <section aria-labelledby="feed-title">
      <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 mb-6 bg-gray-50/90 dark:bg-slate-900/90 backdrop-blur-md">
        <h2 id="feed-title" className="sr-only">Writings</h2>
        <div role="tablist" aria-label="Content types" className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
          {tabs.map(t => (
            <button
              key={t.slug}
              role="tab"
              aria-selected={genre === t.slug}
              onClick={() => setGenre(t.slug)}
              className={`shrink-0 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                genre === t.slug
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-gray-400'
              }`}
            >
              <span aria-hidden>{t.icon}</span>{t.label}
              <span className={`text-xs ${genre === t.slug ? 'opacity-70' : 'text-gray-400'}`}>{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      {first && <div className="mb-6">{card(first, true)}</div>}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{rest.map(i => card(i))}</div>
    </section>
  )
}

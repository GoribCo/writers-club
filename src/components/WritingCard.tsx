import Link from 'next/link'
import type { Language, Writing } from '@/lib/types'

/** Pass `language` to show which language the writing is in (mixed-language lists). */
export default function WritingCard({ writing: w, language }: { writing: Writing; language?: Language }) {
  return (
    <Link
      href={w.url}
      lang={w.lang}
      className="block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all p-4"
    >
      <div className="flex items-center gap-2 mb-1 text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
        {language && <span aria-label={language.name}>{language.flag}</span>}
        <span>{w.genre}</span>
        {w.date && <span>· {w.date}</span>}
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white">{w.title}</h3>
      <p className="text-sm text-indigo-600 dark:text-indigo-400">
        {w.author}{w.country && ` · ${w.country}`}
      </p>
      {w.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{w.description}</p>}
    </Link>
  )
}

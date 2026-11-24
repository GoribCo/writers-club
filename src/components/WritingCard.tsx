import Link from 'next/link'
import type { Language, Writing } from '@/lib/types'
import AuthorAvatar from './AuthorAvatar'
import { asset } from '@/lib/url'
import { LocaleDate, T } from './I18n'

const covers: Record<string, string> = {
  story: 'from-amber-200 via-orange-200 to-rose-300 dark:from-amber-900 dark:via-orange-900 dark:to-rose-900',
  poem: 'from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900',
  travel: 'from-emerald-200 via-teal-200 to-sky-300 dark:from-emerald-900 dark:via-teal-900 dark:to-sky-900',
  guide: 'from-sky-200 via-blue-200 to-indigo-300 dark:from-sky-900 dark:via-blue-900 dark:to-indigo-900',
  drama: 'from-rose-200 via-fuchsia-200 to-violet-300 dark:from-rose-900 dark:via-fuchsia-900 dark:to-violet-900',
}
/** Gradient "cover art" for a genre (writings have no images). */
export const genreCover = (genre: string) =>
  covers[genre] ?? 'from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700'

/** Pass `languages` to show which languages the writing is available in (mixed-language lists). */
export default function WritingCard({ writing: w, languages, featured = false }:
  { writing: Writing; languages?: Language[]; featured?: boolean }) {
  return (
    <article
      lang={w.lang}
      className={`group relative flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-gray-800/80 ring-1 ring-gray-200/70 dark:ring-gray-700/60 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${featured ? 'md:flex-row' : ''}`}
    >
      <div className={`relative bg-gradient-to-br ${genreCover(w.genre)} flex items-center justify-center overflow-hidden ${featured ? 'h-48 md:h-auto md:w-2/5' : 'h-32'}`}>
        {w.cover
          ? <img src={asset(w.cover)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <span aria-hidden className={`${featured ? 'text-7xl' : 'text-5xl'} drop-shadow-sm group-hover:scale-110 transition-transform duration-300`}>{w.genreIcon}</span>}
        <span className="absolute top-3 start-3 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-gray-800 dark:text-gray-100">
          {w.genreLabel}
        </span>
        {languages && languages.length > 0 && (
          <span className="absolute top-3 end-3 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur px-2 py-1 text-xs" title={languages.map(l => l.name).join(', ')}>
            {languages.map(l => l.flag).join(' ')}
          </span>
        )}
      </div>
      <div className={`flex flex-1 flex-col p-5 ${featured ? 'md:p-8 md:justify-center' : ''}`}>
        {featured && <span className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400"><T k="card.featured" /></span>}
        <h3 dir="auto" className={`font-bold leading-snug text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${featured ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
          {/* Stretched link: the whole card opens the writing; the country link sits above it */}
          <Link href={w.url} className="after:absolute after:inset-0 after:content-['']">{w.title}</Link>
        </h3>
        {w.description && (
          <p dir="auto" className={`mt-2 text-gray-500 dark:text-gray-400 ${featured ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'}`}>{w.description}</p>
        )}
        <div className="mt-auto pt-4 flex items-center gap-2.5 text-xs text-gray-500 dark:text-gray-400">
          <AuthorAvatar author={{ name: w.author }} size={28} />
          <span className="min-w-0 truncate">
            <span className="font-semibold text-gray-800 dark:text-gray-200">{w.author}</span>
            {w.country && <> · <Link href={`/countries/${w.countrySlug}/`} className="relative z-10 hover:text-indigo-600 hover:underline">{w.country}</Link></>}
          </span>
          <span className="ms-auto shrink-0"><LocaleDate date={w.date} /> · <T k="card.min" n={w.minutes} /></span>
        </div>
      </div>
    </article>
  )
}

import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { getGenres, getLanguage, getLanguages, getTranslations, getWriting, getWritings } from '@/lib/content'

export const dynamicParams = false

type Params = { lang: string; genre: string; slug: string }

export function generateStaticParams(): Params[] {
  return getLanguages().flatMap(l => getWritings(l.code).map(w => ({ lang: w.lang, genre: w.genre, slug: w.slug })))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, genre, slug } = await params
  const w = getWriting(lang, genre, slug)
  if (!w) return {}
  return {
    title: `${w.title} – ${w.author}`,
    description: w.description,
    authors: [{ name: w.author }],
    // hreflang links between translations of the same writing
    alternates: {
      canonical: w.url,
      languages: Object.fromEntries(getTranslations(genre, slug).map(l => [l.code, `/${l.code}/${genre}/${slug}/`])),
    },
    openGraph: { title: w.title, description: w.description, type: 'article', locale: lang },
  }
}

export default async function WritingPage({ params }: { params: Promise<Params> }) {
  const { lang, genre, slug } = await params
  const w = getWriting(lang, genre, slug)
  const language = getLanguage(lang)
  if (!w || !language) notFound()
  const g = getGenres(lang).find(x => x.slug === genre)
  const translations = getTranslations(genre, slug)

  return (
    <article className="max-w-2xl">
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4" lang={lang} dir={language.dir}>
        <Link href={`/${lang}/`} className="hover:text-indigo-600">{language.nativeName}</Link>
        {' / '}
        <Link href={`/${lang}/${genre}/`} className="hover:text-indigo-600">{g?.label ?? genre}</Link>
      </nav>

      {translations.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-gray-400">Also in:</span>
          {translations.map(l => (
            <Link
              key={l.code}
              href={`/${l.code}/${genre}/${slug}/`}
              lang={l.code}
              hrefLang={l.code}
              aria-current={l.code === lang ? 'page' : undefined}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                l.code === lang
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-400'
              }`}
            >
              <span aria-hidden>{l.flag}</span> {l.nativeName}
            </Link>
          ))}
        </div>
      )}

      <div lang={lang} dir={language.dir}>
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{w.title}</h1>
          <p className="text-indigo-600 dark:text-indigo-400 font-medium">
            {w.author}{w.country && ` · ${w.country}`}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {w.date}{w.translator && ` · translated by ${w.translator}`}
          </p>
        </header>

        <div className="prose writing max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
            {w.content}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  )
}

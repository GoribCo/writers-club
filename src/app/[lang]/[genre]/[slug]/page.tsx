import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { getClub, getCollections, getGenres, getLanguage, getLanguages, getNeighbours, getRelated, getTranslations, getWriting, getWritings } from '@/lib/content'
import WritingCard from '@/components/WritingCard'
import ReaderTools from '@/components/ReaderTools'
import { LocaleDate, T } from '@/components/I18n'
import JsonLd from '@/components/JsonLd'
import { absAsset, absUrl, asset } from '@/lib/url'

const club = getClub()

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
    authors: [{ name: w.author, url: `/authors/${w.authorSlug}/` }],
    keywords: [w.genreLabel, ...w.tags],
    // hreflang links between translations of the same writing
    alternates: {
      canonical: w.url,
      languages: Object.fromEntries(getTranslations(genre, slug).map(l => [l.code, `/${l.code}/${genre}/${slug}/`])),
    },
    openGraph: {
      title: w.title, description: w.description, type: 'article', locale: lang, url: w.url,
      publishedTime: w.date, authors: [w.author], tags: w.tags,
      images: [w.cover ? absAsset(w.cover) : { url: `/og/${lang}/${genre}/${slug}.png`, width: 1200, height: 630 }],
    },
  }
}

export default async function WritingPage({ params }: { params: Promise<Params> }) {
  const { lang, genre, slug } = await params
  const w = getWriting(lang, genre, slug)
  const language = getLanguage(lang)
  if (!w || !language) notFound()
  const g = getGenres(lang).find(x => x.slug === genre)
  const translations = getTranslations(genre, slug)
  const { prev, next } = getNeighbours(w)
  const related = getRelated(w)
  const byCode = Object.fromEntries(getLanguages().map(l => [l.code, l]))
  const collection = w.collection ? getCollections().find(c => c.slug === w.collection) : undefined

  return (
    <article className="max-w-2xl mx-auto">
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: w.title,
        description: w.description,
        inLanguage: lang,
        genre: g?.label ?? genre,
        articleSection: g?.label ?? genre,
        keywords: w.tags.join(', '),
        datePublished: w.date,
        url: absUrl(w.url),
        wordCount: w.content.split(/\s+/).length,
        image: w.cover ? absAsset(w.cover) : absUrl(`/og/${lang}/${genre}/${slug}.png`),
        author: { '@type': 'Person', name: w.author, url: absUrl(`/authors/${w.authorSlug}/`) },
        ...(w.translator && { translator: { '@type': 'Person', name: w.translator } }),
        ...(collection && { isPartOf: { '@type': 'Collection', name: collection.title, url: absUrl(`/collections/${collection.slug}/`) } }),
        publisher: { '@type': 'Organization', name: club.name, url: absUrl('/') },
        workTranslation: translations.filter(l => l.code !== lang)
          .map(l => ({ '@type': 'CreativeWork', inLanguage: l.code, url: absUrl(`/${l.code}/${genre}/${slug}/`) })),
      }} />

      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4" lang={lang} dir={language.dir ?? 'ltr'}>
        <Link href={`/${lang}/`} className="hover:text-indigo-600">{language.nativeName}</Link>
        {' / '}
        <Link href={`/${lang}/${genre}/`} className="hover:text-indigo-600">{g?.label ?? genre}</Link>
      </nav>

      {translations.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-gray-400"><T k="writing.alsoIn" /></span>
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

      <div lang={lang} dir={language.dir ?? 'ltr'}>
        <header className="mb-6">
          {w.cover && <img src={asset(w.cover)} alt="" className="mb-6 w-full aspect-[2/1] object-cover rounded-3xl" />}
          {collection && (
            <Link href={`/collections/${collection.slug}/`} className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:underline">
              {collection.title}
            </Link>
          )}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">{w.title}</h1>
          <p className="text-indigo-600 dark:text-indigo-400 font-medium">
            <Link href={`/authors/${w.authorSlug}/`} className="hover:underline">{w.author}</Link>
            {w.country && ` · ${w.country}`}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            <LocaleDate date={w.date} /> · <T k="card.min" n={w.minutes} />{w.translator && <> · <T k="writing.translatedBy" name={w.translator} /></>}
          </p>
        </header>

        <div className="mb-6" dir="ltr"><ReaderTools title={w.title} text={w.description} /></div>

        <div className="prose writing reader max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
            {w.content}
          </ReactMarkdown>
        </div>

        {w.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {w.tags.map(t => (
              <Link key={t} href={`/tags/${t}/`} className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-950">
                #{t}
              </Link>
            ))}
          </div>
        )}

        {(prev || next) && (
          <nav aria-label={`More ${g?.label ?? genre}`} className="mt-10 grid grid-cols-2 gap-3">
            {prev ? (
              <Link href={prev.url} className="rounded-2xl ring-1 ring-gray-200 dark:ring-gray-700 p-4 hover:ring-indigo-400">
                <span className="block text-xs text-gray-400"><T k="writing.previous" /></span>
                <span className="block font-semibold text-gray-900 dark:text-white line-clamp-2">{prev.title}</span>
              </Link>
            ) : <span />}
            {next && (
              <Link href={next.url} className="rounded-2xl ring-1 ring-gray-200 dark:ring-gray-700 p-4 text-end hover:ring-indigo-400">
                <span className="block text-xs text-gray-400"><T k="writing.next" /></span>
                <span className="block font-semibold text-gray-900 dark:text-white line-clamp-2">{next.title}</span>
              </Link>
            )}
          </nav>
        )}
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white"><T k="writing.readNext" /></h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {related.map(r => <WritingCard key={r.url} writing={r} languages={[byCode[r.lang]]} />)}
          </div>
        </section>
      )}
    </article>
  )
}

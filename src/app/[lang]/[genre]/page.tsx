import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getGenres, getLanguage, getLanguages, getWritings } from '@/lib/content'
import WritingCard from '@/components/WritingCard'

export const dynamicParams = false

type Params = { lang: string; genre: string }

export function generateStaticParams(): Params[] {
  return getLanguages().flatMap(l => getGenres(l.code).map(g => ({ lang: l.code, genre: g.slug })))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, genre } = await params
  const g = getGenres(lang).find(x => x.slug === genre)
  return g ? { title: `${g.label} · ${getLanguage(lang)?.nativeName}`, alternates: { canonical: `/${lang}/${genre}/` } } : {}
}

export default async function GenrePage({ params }: { params: Promise<Params> }) {
  const { lang, genre } = await params
  const language = getLanguage(lang)
  const g = getGenres(lang).find(x => x.slug === genre)
  if (!language || !g) notFound()

  return (
    <div className="max-w-3xl" lang={lang} dir={language.dir}>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        <span aria-hidden>{g.icon}</span> {g.label}
      </h1>
      <div className="space-y-3">
        {getWritings(lang, genre).map(w => <WritingCard key={w.url} writing={w} />)}
      </div>
    </div>
  )
}

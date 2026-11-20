import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getLanguage, getLanguages, getWritings } from '@/lib/content'
import WritingCard from '@/components/WritingCard'

export const dynamicParams = false

type Params = { lang: string }

export function generateStaticParams(): Params[] {
  return getLanguages().map(l => ({ lang: l.code }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang } = await params
  const l = getLanguage(lang)
  return l ? { title: `Writings in ${l.name}`, alternates: { canonical: `/${lang}/` } } : {}
}

export default async function LanguagePage({ params }: { params: Promise<Params> }) {
  const { lang } = await params
  const language = getLanguage(lang)
  if (!language) notFound()

  return (
    <div lang={lang} dir={language.dir}>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        <span aria-hidden>{language.flag}</span> {language.nativeName}
      </h1>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {getWritings(lang).map(w => <WritingCard key={w.url} writing={w} />)}
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLanguages, getTags } from '@/lib/content'
import WritingCard from '@/components/WritingCard'
import { T } from '@/components/I18n'

export const dynamicParams = false

type Params = { tag: string }

export function generateStaticParams(): Params[] {
  return getTags().map(t => ({ tag: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { tag } = await params
  return { title: `#${tag}`, description: `Writings about ${tag.replace(/-/g, ' ')}`, alternates: { canonical: `/tags/${tag}/` } }
}

export default async function TagPage({ params }: { params: Promise<Params> }) {
  const { tag } = await params
  const t = getTags().find(x => x.slug === tag)
  if (!t) notFound()
  const byCode = Object.fromEntries(getLanguages().map(l => [l.code, l]))
  return (
    <div className="max-w-5xl mx-auto">
      <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400"><T k="tag.theme" /></p>
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">#{tag}</h1>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {t.items.map(i => <WritingCard key={i.writing.url} writing={i.writing} languages={i.langs.map(c => byCode[c]).filter(Boolean)} />)}
      </div>
    </div>
  )
}

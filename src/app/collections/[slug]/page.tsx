import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getCollections, getLanguages } from '@/lib/content'
import WritingCard from '@/components/WritingCard'
import JsonLd from '@/components/JsonLd'
import { T } from '@/components/I18n'
import { absUrl } from '@/lib/url'

export const dynamicParams = false

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return getCollections().map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const c = getCollections().find(x => x.slug === slug)
  return c ? { title: c.title, description: c.description, alternates: { canonical: `/collections/${slug}/` } } : {}
}

export default async function CollectionPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const c = getCollections().find(x => x.slug === slug)
  if (!c) notFound()
  const byCode = Object.fromEntries(getLanguages().map(l => [l.code, l]))
  return (
    <div className="max-w-5xl mx-auto">
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'Collection', name: c.title, description: c.description,
        url: absUrl(`/collections/${slug}/`),
        hasPart: c.items.map(i => ({ '@type': 'Article', headline: i.writing.title, url: absUrl(i.writing.url) })),
      }} />
      <section className="mb-8 rounded-[2rem] bg-gradient-to-br from-slate-800 via-indigo-900 to-violet-800 px-6 py-10 sm:px-10 text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-white/70"><T k="collection.label" /> · <T k="count.writings" n={c.items.length} /></p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">{c.title}</h1>
        {c.description && <p className="mt-3 max-w-2xl text-white/80">{c.description}</p>}
      </section>
      {c.body && (
        <div dir="auto" className="prose max-w-2xl mb-8"><ReactMarkdown remarkPlugins={[remarkGfm]}>{c.body}</ReactMarkdown></div>
      )}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {c.items.map(i => <WritingCard key={i.writing.url} writing={i.writing} languages={i.langs.map(l => byCode[l]).filter(Boolean)} />)}
      </div>
    </div>
  )
}

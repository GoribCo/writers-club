import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCountries, getLanguages } from '@/lib/content'
import WritingCard from '@/components/WritingCard'
import AuthorAvatar from '@/components/AuthorAvatar'
import { T } from '@/components/I18n'

export const dynamicParams = false

type Params = { country: string }

export function generateStaticParams(): Params[] {
  return getCountries().map(c => ({ country: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { country } = await params
  const c = getCountries().find(x => x.slug === country)
  return c ? { title: `Writings from ${c.name}`, description: `Stories, poems and more by authors from ${c.name}.`, alternates: { canonical: `/countries/${c.slug}/` } } : {}
}

/** All writings by authors from one country (author's country from contents/authors/). */
export default async function CountryPage({ params }: { params: Promise<Params> }) {
  const { country } = await params
  const c = getCountries().find(x => x.slug === country)
  if (!c) notFound()
  const byCode = Object.fromEntries(getLanguages().map(l => [l.code, l]))
  return (
    <div className="max-w-5xl mx-auto">
      <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400"><T k="countries.title" /></p>
      <h1 className="mb-4 flex items-center gap-3 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
        <span aria-hidden>{c.flag}</span><T k="country.writingsFrom" country={c.name} />
      </h1>
      <div className="mb-8 flex flex-wrap gap-3">
        {c.authors.map(a => (
          <Link key={a.slug} href={`/authors/${a.slug}/`} className="flex items-center gap-2 rounded-full bg-white dark:bg-gray-800/80 py-1 ps-1 pe-3 ring-1 ring-gray-200 dark:ring-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:ring-indigo-400">
            <AuthorAvatar author={a} size={28} />{a.name}
          </Link>
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {c.items.map(i => <WritingCard key={i.writing.url} writing={i.writing} languages={i.langs.map(l => byCode[l]).filter(Boolean)} />)}
      </div>
    </div>
  )
}

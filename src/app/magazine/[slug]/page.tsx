import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { getIssues } from '@/lib/content'
import { asset } from '@/lib/url'
import { LocaleDate, T } from '@/components/I18n'

export const dynamicParams = false

// shortcut: static export fails on an empty list, so with no issues one placeholder path is built (it 404s)
export function generateStaticParams() {
  const issues = getIssues()
  return issues.length ? issues.map(i => ({ slug: i.slug })) : [{ slug: '_' }]
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const i = getIssues().find(x => x.slug === slug)
  if (!i) return {}
  return {
    title: i.title, description: i.description, alternates: { canonical: `/magazine/${i.slug}/` },
    openGraph: i.cover ? { images: [asset(i.cover)] } : undefined,
  }
}

/** Online reader for one magazine issue (PDF in the browser's viewer; phones get open/download buttons). */
export default async function IssuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const i = getIssues().find(x => x.slug === slug)
  if (!i) notFound()
  const pdf = asset(i.pdf)
  const btn = 'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold'
  return (
    <div className="space-y-5">
      <Link href="/magazine/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">← <T k="magazine.back" /></Link>
      <div>
        <h1 dir="auto" className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">{i.title}</h1>
        <p className="text-gray-500 dark:text-gray-400"><LocaleDate date={i.date} opts={{ month: 'long', year: 'numeric' }} /></p>
        {i.description && <p dir="auto" className="mt-2 text-lg text-gray-600 dark:text-gray-300">{i.description}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        <a href={pdf} target="_blank" rel="noopener" className={`${btn} bg-indigo-600 text-white hover:bg-indigo-700`}>📖 <T k="magazine.open" /></a>
        <a href={pdf} download className={`${btn} ring-1 ring-gray-300 dark:ring-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800`}>⬇️ <T k="magazine.download" /></a>
      </div>
      {/* Most phone browsers cannot show a PDF inside a page, so the inline reader is for tablets/desktops */}
      <iframe src={`${pdf}#view=FitH`} title={i.title} className="hidden sm:block h-[85dvh] w-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white" />
      <p className="sm:hidden text-sm text-gray-500 dark:text-gray-400"><T k="magazine.phoneHint" /></p>
      {i.body && <div dir="auto" className="prose max-w-none"><ReactMarkdown>{i.body}</ReactMarkdown></div>}
    </div>
  )
}

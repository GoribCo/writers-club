import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getPage } from '@/lib/content'

/** Page + metadata for contents/pages/{slug}.md, served at /{slug}/. */
export function markdownPage(slug: string) {
  return {
    generateMetadata(): Metadata {
      const p = getPage(slug)
      return { title: p?.title, description: p?.description, alternates: { canonical: `/${slug}/` } }
    },
    Page() {
      const p = getPage(slug)
      if (!p) notFound()
      return (
        <div className="max-w-2xl mx-auto">
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">{p.title}</h1>
          {p.description && <p className="mb-8 text-lg text-gray-500 dark:text-gray-400">{p.description}</p>}
          <div className="prose max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]}
            // internal links through next/link so they get the basePath
            components={{ a: ({ href = '', children }) => href.startsWith('/') ? <Link href={href}>{children}</Link> : <a href={href}>{children}</a> }}>
            {p.body}
          </ReactMarkdown></div>
        </div>
      )
    },
  }
}

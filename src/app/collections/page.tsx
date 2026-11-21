import type { Metadata } from 'next'
import { getCollections } from '@/lib/content'
import CollectionCard from '@/components/CollectionCard'
import { T } from '@/components/I18n'
import { markdownPage } from '@/components/MarkdownPage'

export const dynamic = 'force-static'
export const metadata: Metadata = markdownPage('collections').generateMetadata()

export default function CollectionsPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white"><T k="collections.title" /></h1>
      <div className="grid gap-5 sm:grid-cols-2">
        {getCollections().map(c => <CollectionCard key={c.slug} c={c} />)}
      </div>
    </div>
  )
}


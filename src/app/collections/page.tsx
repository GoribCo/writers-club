import type { Metadata } from 'next'
import { getCollections } from '@/lib/content'
import CollectionCard from '@/components/CollectionCard'

export const dynamic = 'force-static'
export const metadata: Metadata = {
  title: 'Collections',
  description: 'Themed collections and semester anthologies from the writers club.',
  alternates: { canonical: '/collections/' },
}

export default function CollectionsPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Collections</h1>
      <div className="grid gap-5 sm:grid-cols-2">
        {getCollections().map(c => <CollectionCard key={c.slug} c={c} />)}
      </div>
    </div>
  )
}


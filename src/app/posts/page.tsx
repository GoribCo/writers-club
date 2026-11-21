import type { Metadata } from 'next'
import { getAllGenres, getAllWritings, getLanguages, groupTranslations } from '@/lib/content'
import HomeFeed from '@/components/HomeFeed'
import { T } from '@/components/I18n'

export const dynamic = 'force-static'
export const metadata: Metadata = { title: 'Posts', description: 'Every writing on the site, in every language.', alternates: { canonical: '/posts/' } }

export default function PostsPage() {
  // Drop the body text: the feed is a client component and only needs card fields
  const items = groupTranslations(getAllWritings()).map(i => ({ ...i, writing: { ...i.writing, content: '' } }))
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white"><T k="menu.posts" /></h1>
      <HomeFeed items={items} genres={getAllGenres()} languages={getLanguages()} />
    </div>
  )
}

import type { Metadata } from 'next'
import { getAllWritings, getLanguages } from '@/lib/content'
import SearchClient from './SearchClient'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search all writings by title, author, country or text.',
}

export default function SearchPage() {
  const languages = getLanguages()
  // Content is trimmed so the page stays small; search covers the opening text.
  const index = getAllWritings().map(w => ({ ...w, content: w.content.slice(0, 2000) }))
  return <SearchClient index={index} languages={languages} />
}

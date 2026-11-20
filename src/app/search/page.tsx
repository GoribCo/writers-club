import type { Metadata } from 'next'
import { getAllWritings, getAuthors, getLanguages } from '@/lib/content'
import SearchClient from './SearchClient'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search all writings and authors by title, name, country, theme or text.',
  alternates: { canonical: '/search/' },
}

export default function SearchPage() {
  const languages = getLanguages()
  // Content is trimmed so the page stays small; search covers the opening text.
  const index = getAllWritings().map(w => ({ ...w, content: w.content.slice(0, 2000) }))
  const authors = getAuthors().map(({ slug, name, country, tagline, photo }) => ({ slug, name, country, tagline, photo }))
  return <SearchClient index={index} authors={authors} languages={languages} />
}

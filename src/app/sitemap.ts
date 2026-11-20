import type { MetadataRoute } from 'next'
import { getAllWritings, getAuthors, getGenres, getLanguages } from '@/lib/content'
import config from '@/config'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = config.url.site
  const urls = ['/', '/search/']
  for (const l of getLanguages()) {
    urls.push(`/${l.code}/`, ...getGenres(l.code).map(g => `/${l.code}/${g.slug}/`))
  }
  urls.push(...getAllWritings().map(w => w.url))
  urls.push('/authors/', ...getAuthors().map(a => `/authors/${a.slug}/`))
  return urls.map(u => ({ url: base + u }))
}

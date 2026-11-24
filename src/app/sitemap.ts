import type { MetadataRoute } from 'next'
import { getAllWritings, getAuthors, getCollections, getCountries, getGenres, getIssues, getLanguages, getTags, getTranslations } from '@/lib/content'
import config from '@/config'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = config.url.site
  const writings = getAllWritings()
  const newest = (ws: { date: string }[]) => ws.map(w => w.date).sort().at(-1) || undefined
  const entry = (u: string, lastModified?: string) => ({ url: base + u, lastModified })

  return [
    entry('/', newest(writings)),
    entry('/authors/', newest(writings)),
    entry('/events/'),
    entry('/collections/'),
    entry('/posts/', newest(writings)),
    entry('/submit/'),
    ...['magazine', 'gallery', 'contact', 'social', 'faq', 'help', 'terms', 'privacy'].map(p => entry(`/${p}/`)),
    entry('/search/'),
    ...getLanguages().flatMap(l => [
      entry(`/${l.code}/`, newest(writings.filter(w => w.lang === l.code))),
      ...getGenres(l.code).map(g => entry(`/${l.code}/${g.slug}/`, newest(writings.filter(w => w.lang === l.code && w.genre === g.slug)))),
    ]),
    ...writings.map(w => ({
      ...entry(w.url, w.date),
      alternates: { languages: Object.fromEntries(getTranslations(w.genre, w.slug).map(l => [l.code, `${base}/${l.code}/${w.genre}/${w.slug}/`])) },
    })),
    ...getAuthors().map(a => entry(`/authors/${a.slug}/`, newest(a.writings))),
    ...getCollections().map(c => entry(`/collections/${c.slug}/`, newest(c.items.map(i => i.writing)))),
    ...getIssues().map(i => entry(`/magazine/${i.slug}/`, i.date)),
    ...getCountries().map(c => entry(`/countries/${c.slug}/`, newest(c.items.map(i => i.writing)))),
    ...getTags().map(t => entry(`/tags/${t.slug}/`, newest(t.items.map(i => i.writing)))),
  ]
}

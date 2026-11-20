import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Author, Genre, Language, Writing } from './types'

// Layout: content/{lang}/{genre}/{slug}.md — the same {genre}/{slug} in another
// {lang} folder is treated as a translation of the same writing.
const contentDir = path.join(process.cwd(), 'content')

const readJson = (file: string) => JSON.parse(fs.readFileSync(path.join(contentDir, file), 'utf-8'))

const subdirs = (dir: string) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name)
    : []

/** "Amara Okafor" → "amara-okafor"; keeps non-Latin letters. */
export const slugify = (name: string) =>
  name.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '')

const titleCase = (slug: string) => slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

/** Languages from languages.json that have at least one writing, in file order. */
export function getLanguages(): Language[] {
  const all = readJson('languages.json').languages as Language[]
  return all.filter(l => getWritings(l.code).length > 0)
}

export function getLanguage(code: string): Language | undefined {
  return getLanguages().find(l => l.code === code)
}

/** Genres that have writings in `lang`, ordered as in genres.json, unknown folders last. */
const genreMeta = () => readJson('genres.json') as Record<string, { icon?: string; names?: Record<string, string> }>
const genreLabel = (slug: string, lang: string) => {
  const m = genreMeta()[slug]
  return m?.names?.[lang] ?? m?.names?.en ?? titleCase(slug)
}

export function getGenres(lang: string): Genre[] {
  const meta = genreMeta()
  const order = Object.keys(meta)
  const rank = (slug: string) => (order.includes(slug) ? order.indexOf(slug) : order.length)
  return subdirs(path.join(contentDir, lang))
    .map(slug => ({
      slug,
      icon: meta[slug]?.icon ?? '📄',
      label: genreLabel(slug, lang),
      count: getWritings(lang, slug).length,
    }))
    .filter(g => g.count > 0)
    .sort((a, b) => rank(a.slug) - rank(b.slug) || a.slug.localeCompare(b.slug))
}

function parseWriting(lang: string, genre: string, slug: string): Writing {
  const { data, content } = matter(fs.readFileSync(path.join(contentDir, lang, genre, `${slug}.md`), 'utf-8'))
  // YAML turns unquoted dates into Date objects
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? '')
  return {
    lang,
    genre,
    genreLabel: genreLabel(genre, lang),
    genreIcon: genreMeta()[genre]?.icon ?? '📄',
    slug,
    url: `/${lang}/${genre}/${slug}/`,
    title: String(data.title ?? titleCase(slug)),
    author: readAuthorFile(slugify(String(data.author ?? 'Anonymous')))?.name ?? String(data.author ?? 'Anonymous'),
    authorSlug: slugify(String(data.author ?? 'Anonymous')),
    country: String(data.country ?? ''),
    date,
    description: String(data.description ?? ''),
    translator: String(data.translator ?? ''),
    minutes: Math.max(1, Math.round(content.split(/\s+/).length / 200)),
    content,
  }
}

/** Writings in a language (optionally one genre), newest first. */
export function getWritings(lang: string, genre?: string): Writing[] {
  const langDir = path.join(contentDir, lang)
  return (genre ? [genre] : subdirs(langDir))
    .flatMap(g => {
      const dir = path.join(langDir, g)
      if (!fs.existsSync(dir)) return []
      return fs.readdirSync(dir)
        .filter(f => f.endsWith('.md'))
        .map(f => parseWriting(lang, g, f.slice(0, -3)))
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
}

export function getAllWritings(): Writing[] {
  return getLanguages()
    .flatMap(l => getWritings(l.code))
    .sort((a, b) => b.date.localeCompare(a.date))
}

/** Every genre across all languages (English labels), with total counts, in genres.json order. */
export function getAllGenres(): Genre[] {
  const all = new Map<string, Genre>()
  for (const l of getLanguages())
    for (const g of getGenres(l.code)) {
      const cur = all.get(g.slug)
      all.set(g.slug, { ...g, label: genreLabel(g.slug, 'en'), count: (cur?.count ?? 0) + g.count })
    }
  return [...all.values()]
}

export function getWriting(lang: string, genre: string, slug: string): Writing | null {
  return fs.existsSync(path.join(contentDir, lang, genre, `${slug}.md`)) ? parseWriting(lang, genre, slug) : null
}

/** Every language this genre/slug exists in (including the current one). */
export function getTranslations(genre: string, slug: string): Language[] {
  return getLanguages().filter(l => fs.existsSync(path.join(contentDir, l.code, genre, `${slug}.md`)))
}

const authorsDir = path.join(contentDir, 'authors')

/** Reads content/authors/{slug}.md (writings only; no `writings` list). */
function readAuthorFile(slug: string): Omit<Author, 'writings'> | null {
  const file = path.join(authorsDir, `${slug}.md`)
  if (!fs.existsSync(file)) return null
  const { data, content } = matter(fs.readFileSync(file, 'utf-8'))
  const strMap = (v: unknown) =>
    Object.fromEntries(Object.entries((v ?? {}) as Record<string, unknown>)
      .map(([k, x]) => [k, x instanceof Date ? x.toISOString().slice(0, 10) : Array.isArray(x) ? x.join(', ') : String(x)]))
  return {
    slug,
    name: String(data.name ?? titleCase(slug)),
    country: String(data.country ?? ''),
    photo: String(data.photo ?? ''),
    tagline: String(data.tagline ?? ''),
    links: strMap(data.links),
    details: strMap(data.details),
    about: content.trim(),
  }
}

/**
 * Authors A–Z: everyone with a file in content/authors/ plus anyone named in a writing's `author`
 * without one. A writing's `author` may be the id ("amara-okafor") or the full name ("Amara Okafor").
 */
export function getAuthors(): Author[] {
  const writings = getAllWritings()
  const fileSlugs = fs.existsSync(authorsDir)
    ? fs.readdirSync(authorsDir).filter(f => f.endsWith('.md')).map(f => f.slice(0, -3))
    : []
  const slugs = new Set([...fileSlugs, ...writings.map(w => w.authorSlug)])
  return [...slugs].map(slug => {
    const own = writings.filter(w => w.authorSlug === slug)
    const ref = own.find(w => w.lang === 'en') ?? own[0]
    const file = readAuthorFile(slug)
    return {
      ...(file ?? { slug, name: ref.author, country: ref.country, photo: '', tagline: '', links: {}, details: {}, about: '' }),
      country: file?.country || ref?.country || '',
      writings: own,
    }
  }).sort((a, b) => a.name.localeCompare(b.name))
}

export function getAuthor(slug: string): Author | undefined {
  return getAuthors().find(a => a.slug === slug)
}

/** One entry per writing (translations merged), preferring the English version; `langs` = every language it exists in. */
export function groupTranslations(writings: Writing[]): { writing: Writing; langs: string[] }[] {
  const groups = new Map<string, Writing[]>()
  for (const w of writings) groups.set(`${w.genre}/${w.slug}`, [...(groups.get(`${w.genre}/${w.slug}`) ?? []), w])
  return [...groups.values()].map(ws => ({
    writing: ws.find(w => w.lang === 'en') ?? ws[0],
    langs: ws.map(w => w.lang),
  }))
}

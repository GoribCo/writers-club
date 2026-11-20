import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Genre, Language, Writing } from './types'

// Layout: content/{lang}/{genre}/{slug}.md — the same {genre}/{slug} in another
// {lang} folder is treated as a translation of the same writing.
const contentDir = path.join(process.cwd(), 'content')

const readJson = (file: string) => JSON.parse(fs.readFileSync(path.join(contentDir, file), 'utf-8'))

const subdirs = (dir: string) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name)
    : []

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
export function getGenres(lang: string): Genre[] {
  const meta = readJson('genres.json') as Record<string, { icon?: string; names?: Record<string, string> }>
  const order = Object.keys(meta)
  const rank = (slug: string) => (order.includes(slug) ? order.indexOf(slug) : order.length)
  return subdirs(path.join(contentDir, lang))
    .map(slug => ({
      slug,
      icon: meta[slug]?.icon ?? '📄',
      label: meta[slug]?.names?.[lang] ?? meta[slug]?.names?.en ?? titleCase(slug),
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
    slug,
    url: `/${lang}/${genre}/${slug}/`,
    title: String(data.title ?? titleCase(slug)),
    author: String(data.author ?? 'Anonymous'),
    country: String(data.country ?? ''),
    date,
    description: String(data.description ?? ''),
    translator: String(data.translator ?? ''),
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

export function getWriting(lang: string, genre: string, slug: string): Writing | null {
  return fs.existsSync(path.join(contentDir, lang, genre, `${slug}.md`)) ? parseWriting(lang, genre, slug) : null
}

/** Every language this genre/slug exists in (including the current one). */
export function getTranslations(genre: string, slug: string): Language[] {
  return getLanguages().filter(l => fs.existsSync(path.join(contentDir, l.code, genre, `${slug}.md`)))
}

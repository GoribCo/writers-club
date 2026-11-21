import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Author, ClubEvent, Collection, Genre, Language, Writing } from './types'

// Layout: contents/posts/{genre}/{slug}/{lang}.md — every {lang}.md in one {slug} folder
// is a translation of the same writing.
const contentDir = path.join(process.cwd(), 'contents')
const postsDir = path.join(contentDir, 'posts')
const postFile = (lang: string, genre: string, slug: string) => path.join(postsDir, genre, slug, `${lang}.md`)

const readJson = (file: string) => JSON.parse(fs.readFileSync(path.join(contentDir, file), 'utf-8'))

const subdirs = (dir: string) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name)
    : []

/** "Amara Okafor" → "amara-okafor"; keeps non-Latin letters. */
export const slugify = (name: string) =>
  name.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '')

// YAML turns unquoted dates into Date objects
const ymd = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? ''))

/** "NG" → 🇳🇬 */
const flagOf = (code: string) =>
  /^[a-z]{2}$/i.test(code) ? String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1f1a5 + c.charCodeAt(0))) : ''

/** Every content/{dir}/*.md parsed, file name as slug. */
const readMdDir = (dir: string) => {
  const full = path.join(contentDir, dir)
  if (!fs.existsSync(full)) return []
  return fs.readdirSync(full).filter(f => f.endsWith('.md'))
    .map(f => ({ slug: f.slice(0, -3), ...matter(fs.readFileSync(path.join(full, f), 'utf-8')) }))
}

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
  return subdirs(postsDir)
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
  const { data, content } = matter(fs.readFileSync(postFile(lang, genre, slug), 'utf-8'))
  const date = ymd(data.date)
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
    tags: (Array.isArray(data.tags) ? data.tags : []).map((t: unknown) => slugify(String(t))),
    collection: String(data.collection ?? ''),
    cover: String(data.cover ?? ''),
    content,
  }
}

/** Writings in a language (optionally one genre), newest first. */
export function getWritings(lang: string, genre?: string): Writing[] {
  return (genre ? [genre] : subdirs(postsDir))
    .flatMap(g => subdirs(path.join(postsDir, g))
      .filter(s => fs.existsSync(postFile(lang, g, s)))
      .map(s => parseWriting(lang, g, s)))
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
      all.set(g.slug, { ...g, label: genreLabel(g.slug, 'en'), names: genreMeta()[g.slug]?.names, count: (cur?.count ?? 0) + g.count })
    }
  return [...all.values()]
}

export function getWriting(lang: string, genre: string, slug: string): Writing | null {
  return fs.existsSync(postFile(lang, genre, slug)) ? parseWriting(lang, genre, slug) : null
}

/** Every language this genre/slug exists in (including the current one). */
export function getTranslations(genre: string, slug: string): Language[] {
  return getLanguages().filter(l => fs.existsSync(postFile(l.code, genre, slug)))
}

const authorsDir = path.join(contentDir, 'authors')

/** Reads content/authors/{slug}.md (writings only; no `writings` list). */
function readAuthorFile(slug: string): Omit<Author, 'writings'> | null {
  const file = path.join(authorsDir, `${slug}.md`)
  if (!fs.existsSync(file)) return null
  const { data, content } = matter(fs.readFileSync(file, 'utf-8'))
  const strMap = (v: unknown) =>
    Object.fromEntries(Object.entries((v ?? {}) as Record<string, unknown>)
      .map(([k, x]) => [k, Array.isArray(x) ? x.join(', ') : ymd(x)]))
  return {
    slug,
    name: String(data.name ?? titleCase(slug)),
    country: String(data.country ?? ''),
    flag: flagOf(String(data.countryCode ?? '')),
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
      ...(file ?? { slug, name: ref.author, country: ref.country, flag: '', photo: '', tagline: '', links: {}, details: {}, about: '' }),
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

/** Other writings to read next: same author or shared tags first, then same genre. One per translation group, `lang` version preferred. */
export function getRelated(w: Writing, limit = 3): Writing[] {
  const score = (o: Writing) =>
    (o.authorSlug === w.authorSlug ? 3 : 0) + o.tags.filter(t => w.tags.includes(t)).length * 2 + (o.genre === w.genre ? 1 : 0)
  const groups = new Map<string, Writing[]>()
  for (const o of getAllWritings())
    if (`${o.genre}/${o.slug}` !== `${w.genre}/${w.slug}`) groups.set(`${o.genre}/${o.slug}`, [...(groups.get(`${o.genre}/${o.slug}`) ?? []), o])
  return [...groups.values()]
    .map(ws => ws.find(o => o.lang === w.lang) ?? ws.find(o => o.lang === 'en') ?? ws[0])
    .map(o => ({ o, s: score(o) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s || b.o.date.localeCompare(a.o.date))
    .slice(0, limit)
    .map(x => x.o)
}

/** Older / newer writing in the same language + genre. */
export function getNeighbours(w: Writing): { prev?: Writing; next?: Writing } {
  const list = getWritings(w.lang, w.genre)
  const i = list.findIndex(o => o.slug === w.slug)
  return { next: list[i - 1], prev: list[i + 1] }
}

/** All tags with their writings (translations merged), A–Z. */
export function getTags(): { slug: string; items: ReturnType<typeof groupTranslations> }[] {
  const grouped = groupTranslations(getAllWritings())
  const slugs = [...new Set(grouped.flatMap(i => i.writing.tags))].sort()
  return slugs.map(slug => ({ slug, items: grouped.filter(i => i.writing.tags.includes(slug)) }))
}

/** Events, soonest first. */
export function getEvents(): ClubEvent[] {
  return readMdDir('events').map(({ slug, data, content }) => ({
    slug,
    title: String(data.title ?? titleCase(slug)),
    date: ymd(data.date),
    time: String(data.time ?? ''),
    place: String(data.place ?? ''),
    description: String(data.description ?? ''),
    body: content.trim(),
  })).sort((a, b) => a.date.localeCompare(b.date))
}

/** Collections, newest file first (by name). */
export function getCollections(): (Collection & { items: ReturnType<typeof groupTranslations> })[] {
  const grouped = groupTranslations(getAllWritings())
  return readMdDir('collections').map(({ slug, data, content }) => ({
    slug,
    title: String(data.title ?? titleCase(slug)),
    description: String(data.description ?? ''),
    cover: String(data.cover ?? ''),
    body: content.trim(),
    items: grouped.filter(i => i.writing.collection === slug),
  })).sort((a, b) => b.slug.localeCompare(a.slug))
}

/** contents/club.md: the club's name, description, contact and meeting place. */
export function getClub() {
  const { data } = matter(fs.readFileSync(path.join(contentDir, 'club.md'), 'utf-8'))
  const name = String(data.name ?? 'Writers Club')
  const instagram = String(data.instagram ?? '')
  return {
    name,
    shortName: String(data.shortName ?? name),
    title: String(data.title ?? name),
    description: String(data.description ?? ''),
    tagline: String(data.tagline ?? ''),
    keywords: (Array.isArray(data.keywords) ? data.keywords : []).map(String),
    email: String(data.email ?? ''),
    instagram,
    instagramHandle: instagram ? '@' + instagram.replace(/\/+$/, '').split('/').pop() : '',
    meetingPlace: String(data.meetingPlace ?? ''),
    meetingAddress: String(data.meetingAddress ?? ''),
  }
}

export type MediaItem = { kind: 'image' | 'video' | 'youtube'; src: string; caption: string }

/** "/gallery/a.jpg" → image, ".mp4/.webm/.mov" → video, YouTube link → embed (privacy-enhanced youtube-nocookie). */
const mediaItem = (raw: unknown): MediaItem => {
  const o = (typeof raw === 'string' ? { src: raw } : raw ?? {}) as Record<string, unknown>
  const src = String(o.src ?? '')
  const caption = String(o.caption ?? '')
  const yt = src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/)
  if (yt) return { kind: 'youtube', src: `https://www.youtube-nocookie.com/embed/${yt[1]}`, caption }
  return { kind: /\.(mp4|webm|mov)$/i.test(src) ? 'video' : 'image', src, caption }
}

/** Gallery albums: contents/gallery/{yyyy-mm-dd-slug}.md, newest first. `items` = photos/videos. */
export function getAlbums() {
  return readMdDir('gallery').map(({ slug, data, content }) => ({
    slug,
    title: String(data.title ?? titleCase(slug)),
    date: ymd(data.date),
    body: content.trim(),
    items: (Array.isArray(data.items) ? data.items : []).map(mediaItem).filter(i => i.src),
  })).sort((a, b) => b.date.localeCompare(a.date))
}

/** Magazine issues: contents/magazine/{slug}.md with a `pdf` in public/, newest first. */
export function getIssues() {
  return readMdDir('magazine').map(({ slug, data, content }) => ({
    slug,
    title: String(data.title ?? titleCase(slug)),
    date: ymd(data.date),
    description: String(data.description ?? ''),
    cover: String(data.cover ?? ''),
    pdf: String(data.pdf ?? ''),
    body: content.trim(),
  })).sort((a, b) => b.date.localeCompare(a.date))
}

/** content/pages/{slug}.md, e.g. the submit page. */
export function getPage(slug: string): { title: string; description: string; body: string } | null {
  const p = readMdDir('pages').find(x => x.slug === slug)
  return p ? { title: String(p.data.title ?? titleCase(slug)), description: String(p.data.description ?? ''), body: p.content.trim() } : null
}

/** Interface dictionaries: content/ui/{code}.json (English first). */
export function getUiDictionaries(): Record<string, Record<string, string | Record<string, string>>> {
  const dir = path.join(contentDir, 'ui')
  const codes = fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5))
    .sort((a, b) => (a === 'en' ? -1 : b === 'en' ? 1 : a.localeCompare(b)))
  return Object.fromEntries(codes.map(c => [c, JSON.parse(fs.readFileSync(path.join(dir, `${c}.json`), 'utf-8'))]))
}

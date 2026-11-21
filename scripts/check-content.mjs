// Checks contents/ before a build. Errors stop the build; warnings are printed only.
// Run: npm run check   (also runs automatically before npm run build)
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const root = path.join(process.cwd(), 'contents')
const errors = []
const warnings = []
const read = f => matter(fs.readFileSync(f, 'utf-8'))
// Check the raw text: YAML silently rolls invalid dates over (2026-13-45 → 2027-02-14)
const rawDate = f => (fs.readFileSync(f, 'utf-8').match(/^date:\s*["']?([^"'\s]+)/m) ?? [])[1] ?? ''
const validDate = s => /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s)) && new Date(s).toISOString().slice(0, 10) === s
const mdFiles = dir => (fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.md')) : [])
const slugify = s => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '')

const languages = JSON.parse(fs.readFileSync(path.join(root, 'languages.json'), 'utf-8')).languages.map(l => l.code)
const genres = Object.keys(JSON.parse(fs.readFileSync(path.join(root, 'genres.json'), 'utf-8')))
const authors = new Set(mdFiles(path.join(root, 'authors')).map(f => f.slice(0, -3)))
const collections = new Set(mdFiles(path.join(root, 'collections')).map(f => f.slice(0, -3)))
const writings = new Map() // genre/slug -> langs
const subdirs = dir => (fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name) : [])
const posts = path.join(root, 'posts')

// Layout: contents/posts/{genre}/{slug}/{lang}.md
for (const genre of subdirs(posts)) {
  if (!genres.includes(genre)) warnings.push(`contents/posts/${genre}/: genre not in genres.json (no icon/translated name)`)
  for (const slug of subdirs(path.join(posts, genre))) {
    const files = mdFiles(path.join(posts, genre, slug))
    if (!files.length) warnings.push(`contents/posts/${genre}/${slug}/: no {lang}.md files`)
    for (const f of files) {
      const lang = f.slice(0, -3)
      const file = `contents/posts/${genre}/${slug}/${f}`
      const full = path.join(posts, genre, slug, f)
      if (!languages.includes(lang)) { errors.push(`${file}: "${lang}" is not in languages.json`); continue }
      const { data, content } = read(full)
      if (!data.title) errors.push(`${file}: missing title`)
      if (!data.author) errors.push(`${file}: missing author`)
      else if (!authors.has(slugify(String(data.author)))) warnings.push(`${file}: no author file contents/authors/${slugify(String(data.author))}.md`)
      const d = rawDate(full)
      if (!validDate(d)) errors.push(`${file}: date must be a real YYYY-MM-DD date (got "${d}")`)
      if (!data.description) warnings.push(`${file}: missing description (used by search engines)`)
      if (data.collection && !collections.has(String(data.collection))) errors.push(`${file}: unknown collection "${data.collection}"`)
      if (data.tags && !Array.isArray(data.tags)) errors.push(`${file}: tags must be a list, e.g. [winter, food]`)
      if (!content.trim()) errors.push(`${file}: empty text`)
      const key = `${genre}/${slug}`
      writings.set(key, [...(writings.get(key) ?? []), lang])
    }
  }
}

for (const [key, langs] of writings)
  if (langs.length > 1 && !langs.includes('en')) warnings.push(`${key}: translated (${langs.join(', ')}) but no English version`)

for (const f of mdFiles(path.join(root, 'authors'))) {
  const { data } = read(path.join(root, 'authors', f))
  if (!data.name) errors.push(`contents/authors/${f}: missing name`)
  if (data.countryCode && !/^[A-Za-z]{2}$/.test(data.countryCode)) errors.push(`contents/authors/${f}: countryCode must be 2 letters`)
  for (const [k, v] of Object.entries(data.links ?? {}))
    if (!/^https?:\/\//.test(String(v))) errors.push(`contents/authors/${f}: link "${k}" must start with https://`)
}

for (const f of mdFiles(path.join(root, 'events'))) {
  const { data } = read(path.join(root, 'events', f))
  if (!data.title) errors.push(`contents/events/${f}: missing title`)
  if (!validDate(rawDate(path.join(root, 'events', f)))) errors.push(`contents/events/${f}: date must be a real YYYY-MM-DD date`)
}

// public/ file referenced by a content file (external URLs are not checked)
const missing = src => src.startsWith('/') && !fs.existsSync(path.join(process.cwd(), 'public', src))

for (const f of mdFiles(path.join(root, 'gallery'))) {
  const file = `contents/gallery/${f}`
  const { data } = read(path.join(root, 'gallery', f))
  if (!data.title) errors.push(`${file}: missing title`)
  if (!validDate(rawDate(path.join(root, 'gallery', f)))) errors.push(`${file}: date must be a real YYYY-MM-DD date`)
  if (!Array.isArray(data.items) || !data.items.length) errors.push(`${file}: items must be a list of photos/videos`)
  for (const it of Array.isArray(data.items) ? data.items : []) {
    const src = String(typeof it === 'string' ? it : it?.src ?? '')
    if (!src) errors.push(`${file}: an item has no src`)
    else if (missing(src)) errors.push(`${file}: file not found: public${src}`)
  }
}

for (const f of mdFiles(path.join(root, 'magazine'))) {
  const file = `contents/magazine/${f}`
  const { data } = read(path.join(root, 'magazine', f))
  if (!data.title) errors.push(`${file}: missing title`)
  if (!validDate(rawDate(path.join(root, 'magazine', f)))) errors.push(`${file}: date must be a real YYYY-MM-DD date`)
  if (!data.pdf) errors.push(`${file}: missing pdf (e.g. pdf: /magazine/issue-01.pdf)`)
  else if (missing(String(data.pdf))) errors.push(`${file}: file not found: public${data.pdf}`)
  if (data.cover && missing(String(data.cover))) errors.push(`${file}: cover not found: public${data.cover}`)
}

{
  const file = 'contents/site.md'
  if (!fs.existsSync(path.join(root, 'site.md'))) errors.push(`${file}: missing (site name, description, email, Instagram, meeting place)`)
  else {
    const { data } = read(path.join(root, 'site.md'))
    if (!data.name) errors.push(`${file}: missing name`)
    if (!data.description) warnings.push(`${file}: missing description (used by search engines)`)
    if (data.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) errors.push(`${file}: email looks wrong`)
    if (data.instagram && !/^https:\/\//.test(data.instagram)) errors.push(`${file}: instagram must be a full https:// link`)
  }
}

warnings.forEach(w => console.warn(`⚠️  ${w}`))
errors.forEach(e => console.error(`❌ ${e}`))
console.log(`Content check: ${writings.size} writings, ${authors.size} authors — ${errors.length} errors, ${warnings.length} warnings`)
process.exit(errors.length ? 1 : 0)

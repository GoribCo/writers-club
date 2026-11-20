// Checks content/ before a build. Errors stop the build; warnings are printed only.
// Run: npm run check   (also runs automatically before npm run build)
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const root = path.join(process.cwd(), 'content')
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
const special = new Set(['authors', 'events', 'collections', 'pages'])
const authors = new Set(mdFiles(path.join(root, 'authors')).map(f => f.slice(0, -3)))
const collections = new Set(mdFiles(path.join(root, 'collections')).map(f => f.slice(0, -3)))
const writings = new Map() // genre/slug -> langs

for (const dir of fs.readdirSync(root, { withFileTypes: true }).filter(d => d.isDirectory() && !special.has(d.name))) {
  const lang = dir.name
  if (!languages.includes(lang)) { errors.push(`content/${lang}/: "${lang}" is not in languages.json`); continue }
  for (const genre of fs.readdirSync(path.join(root, lang), { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name)) {
    if (!genres.includes(genre)) warnings.push(`content/${lang}/${genre}/: genre not in genres.json (no icon/translated name)`)
    for (const f of mdFiles(path.join(root, lang, genre))) {
      const file = `content/${lang}/${genre}/${f}`
      const { data, content } = read(path.join(root, lang, genre, f))
      if (!data.title) errors.push(`${file}: missing title`)
      if (!data.author) errors.push(`${file}: missing author`)
      else if (!authors.has(slugify(String(data.author)))) warnings.push(`${file}: no author file content/authors/${slugify(String(data.author))}.md`)
      const d = rawDate(path.join(root, lang, genre, f))
      if (!validDate(d)) errors.push(`${file}: date must be a real YYYY-MM-DD date (got "${d}")`)
      if (!data.description) warnings.push(`${file}: missing description (used by search engines)`)
      if (data.collection && !collections.has(String(data.collection))) errors.push(`${file}: unknown collection "${data.collection}"`)
      if (data.tags && !Array.isArray(data.tags)) errors.push(`${file}: tags must be a list, e.g. [winter, food]`)
      if (!content.trim()) errors.push(`${file}: empty text`)
      const key = `${genre}/${f}`
      writings.set(key, [...(writings.get(key) ?? []), lang])
    }
  }
}

for (const [key, langs] of writings)
  if (langs.length > 1 && !langs.includes('en')) warnings.push(`${key}: translated (${langs.join(', ')}) but no English version`)

for (const f of mdFiles(path.join(root, 'authors'))) {
  const { data } = read(path.join(root, 'authors', f))
  if (!data.name) errors.push(`content/authors/${f}: missing name`)
  if (data.countryCode && !/^[A-Za-z]{2}$/.test(data.countryCode)) errors.push(`content/authors/${f}: countryCode must be 2 letters`)
  for (const [k, v] of Object.entries(data.links ?? {}))
    if (!/^https?:\/\//.test(String(v))) errors.push(`content/authors/${f}: link "${k}" must start with https://`)
}

for (const f of mdFiles(path.join(root, 'events'))) {
  const { data } = read(path.join(root, 'events', f))
  if (!data.title) errors.push(`content/events/${f}: missing title`)
  if (!validDate(rawDate(path.join(root, 'events', f)))) errors.push(`content/events/${f}: date must be a real YYYY-MM-DD date`)
}

warnings.forEach(w => console.warn(`⚠️  ${w}`))
errors.forEach(e => console.error(`❌ ${e}`))
console.log(`Content check: ${writings.size} writings, ${authors.size} authors — ${errors.length} errors, ${warnings.length} warnings`)
process.exit(errors.length ? 1 : 0)

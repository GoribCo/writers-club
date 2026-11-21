import { getAllWritings, getAuthors, getClub, getCollections, getLanguages, groupTranslations } from '@/lib/content'
import { absUrl } from '@/lib/url'

const club = getClub()

export const dynamic = 'force-static'

/** llms.txt (llmstxt.org): a plain map of the site for AI tools. */
export function GET() {
  const byCode = Object.fromEntries(getLanguages().map(l => [l.code, l.name]))
  const writings = groupTranslations(getAllWritings())
  const lines = [
    `# ${club.name}`,
    '',
    `> ${club.description}`,
    '',
    'Original creative writing by international students at BTU Cottbus-Senftenberg, Germany. Each writing is published in the language it was written in; some have translations. Author pages describe each writer.',
    '',
    '## Writings',
    '',
    ...writings.map(({ writing: w, langs }) =>
      `- [${w.title}](${absUrl(w.url)}): ${w.genreLabel} by ${w.author}${w.country ? ` (${w.country})` : ''}, ${w.date}. ${w.description} Languages: ${langs.map(c => byCode[c] ?? c).join(', ')}.`),
    '',
    '## Authors',
    '',
    ...getAuthors().map(a => `- [${a.name}](${absUrl(`/authors/${a.slug}/`)}): ${[a.tagline, a.country].filter(Boolean).join(', ')}.`),
    '',
    '## Collections',
    '',
    ...getCollections().map(c => `- [${c.title}](${absUrl(`/collections/${c.slug}/`)}): ${c.description}`),
    '',
    '## Optional',
    '',
    `- [Events](${absUrl('/events/')}): weekly meetings and readings`,
    `- [Submit your writing](${absUrl('/submit/')})`,
    ...getLanguages().map(l => `- [Writings in ${l.name}](${absUrl(`/${l.code}/`)})`),
    '',
  ]
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}

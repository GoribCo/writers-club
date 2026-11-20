import { getLanguages, getWriting, getWritings } from '@/lib/content'
import { ogImage } from '@/lib/ogImage'

export const dynamic = 'force-static'
export const dynamicParams = false

type Params = { lang: string; genre: string; file: string }

/** /og/{lang}/{genre}/{slug}.png — social preview per writing. */
export function generateStaticParams(): Params[] {
  return getLanguages().flatMap(l => getWritings(l.code).map(w => ({ lang: w.lang, genre: w.genre, file: `${w.slug}.png` })))
}

export async function GET(_: Request, { params }: { params: Promise<Params> }) {
  const { lang, genre, file } = await params
  const slug = file.replace(/\.png$/, '')
  const w = getWriting(lang, genre, slug)
  if (!w) return new Response('Not found', { status: 404 })
  // English version supplies a Latin title when this one is in another script
  const en = getWriting('en', genre, slug)
  const title = en && !/^[\p{Script=Latin}\p{N}\p{P}\p{S}\s]*$/u.test(w.title) ? en.title : w.title
  return ogImage({ kicker: en?.genreLabel ?? w.genreLabel, title, subtitle: `by ${w.author}`, genre })
}

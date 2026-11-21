import { ogImage } from '@/lib/ogImage'
import { getAllGenres, getSite } from '@/lib/content'

export const dynamic = 'force-static'

// Plain route (not opengraph-image.tsx) so the file ends in .png for GitHub Pages and the URL respects basePath
export function GET() {
  const site = getSite()
  return ogImage({ kicker: site.name, title: site.tagline || site.name, subtitle: getAllGenres().map(g => g.label).join(' · ') })
}

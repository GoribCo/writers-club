import { ogImage } from '@/lib/ogImage'
import { getAllGenres, getClub } from '@/lib/content'

export const dynamic = 'force-static'

// Plain route (not opengraph-image.tsx) so the file ends in .png for GitHub Pages and the URL respects basePath
export function GET() {
  const club = getClub()
  return ogImage({ kicker: club.name, title: club.tagline || club.name, subtitle: getAllGenres().map(g => g.label).join(' · ') })
}

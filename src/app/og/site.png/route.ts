import { ogImage } from '@/lib/ogImage'

export const dynamic = 'force-static'

// Plain route (not opengraph-image.tsx) so the file ends in .png for GitHub Pages and the URL respects basePath
export function GET() {
  return ogImage({ kicker: "BTU Writer's Club", title: 'Stories from every corner of the world.', subtitle: 'Stories · Poems · Travel · Guides · Drama' })
}

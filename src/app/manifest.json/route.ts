import { getClub } from '@/lib/content'
import config from '@/config'

export const dynamic = 'force-static'

/** Web app manifest; name/description come from contents/club.md. Icon paths are relative to this file (basePath-safe). */
export function GET() {
  const club = getClub()
  const icon = (src: string, size: number, purpose: string) => ({ src, sizes: `${size}x${size}`, type: 'image/png', purpose })
  return Response.json({
    name: club.title,
    short_name: club.shortName,
    description: club.description,
    start_url: './',
    scope: './',
    display: 'standalone',
    orientation: 'any',
    background_color: config.theme.colorLight,
    theme_color: config.theme.primary,
    categories: ['books', 'education'],
    lang: 'en',
    icons: [icon('./icon-192.png', 192, 'any'), icon('./icon-512.png', 512, 'any'), icon('./icon-maskable.png', 512, 'maskable')],
  })
}

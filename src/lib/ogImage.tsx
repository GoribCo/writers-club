import { ImageResponse } from 'next/og'
import { getSite } from '@/lib/content'

const site = getSite()

export const ogSize = { width: 1200, height: 630 }

const gradients: Record<string, string> = {
  story: 'linear-gradient(135deg, #f59e0b, #f43f5e)',
  poem: 'linear-gradient(135deg, #6366f1, #d946ef)',
  travel: 'linear-gradient(135deg, #10b981, #0ea5e9)',
  guide: 'linear-gradient(135deg, #0ea5e9, #4f46e5)',
  drama: 'linear-gradient(135deg, #f43f5e, #7c3aed)',
}

// shortcut: the built-in OG font is Latin-only, so non-Latin titles fall back to a Latin line; add Noto fonts to render them
const latin = (s: string) => /^[\p{Script=Latin}\p{N}\p{P}\p{S}\s]*$/u.test(s)

/** Social preview card (1200×630) shared by the site and every writing. */
export function ogImage({ kicker, title, subtitle, genre = '' }: { kicker: string; title: string; subtitle: string; genre?: string }) {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, color: 'white', background: gradients[genre] ?? 'linear-gradient(135deg, #4f46e5, #7c3aed, #d946ef)' }}>
        <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, opacity: 0.85, textTransform: 'uppercase', letterSpacing: 4 }}>
          {latin(kicker) ? kicker : site.name}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 76, fontWeight: 800, lineHeight: 1.1 }}>{latin(title) ? title : site.name}</div>
          <div style={{ display: 'flex', fontSize: 36, marginTop: 24, opacity: 0.9 }}>{latin(subtitle) ? subtitle : ''}</div>
        </div>
        <div style={{ display: 'flex', fontSize: 28, opacity: 0.8 }}>{[site.name, site.university].filter(Boolean).join(' · ')}</div>
      </div>
    ),
    ogSize,
  )
}

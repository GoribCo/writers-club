// Central developer configuration.
// Content (languages, genres, writings) lives in /contents/*.json and /contents/posts/{genre}/{slug}/{lang}.md.

const config = {
  // ── Site identity ──────────────────────────────────────────────────────────
  app: {
    name: "BTU Writer's Club",
    version: '0.2.0',
    tagline: 'Writings from the international students of BTU Cottbus',
  },

  // ── URLs ──────────────────────────────────────────────────────────────────
  // Override with NEXT_PUBLIC_SITE_URL env var in production.
  // Override with NEXT_PUBLIC_BASE_PATH for GitHub Pages sub-directory deploys.
  url: {
    site: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://goribco.github.io/btu-writers-club',
    basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  },

  // ── Contact ───────────────────────────────────────────────────────────────
  contact: {
    email: 'btuwritersclub@gmail.com',
    instagram: 'https://www.instagram.com/btu_writers_club/',
    instagramHandle: '@btu_writers_club',
  },

  // Where regular meetings happen (Contact page map). The map is found by address, no coordinates needed.
  meeting: {
    place: 'IKMZ Library, Room 2.12',
    address: 'Platz der Deutschen Einheit 2, 03044 Cottbus',
  },

  // ── Dev server ─────────────────────────────────────────────────────────────
  dev: {
    port: 3010,
  },

  // ── SEO defaults ──────────────────────────────────────────────────────────
  seo: {
    defaultTitle: "BTU Writer's Club – Cottbus",
    titleTemplate: "%s | BTU Writer's Club",
    defaultDescription:
      'Stories, poems, travel writing, guides and drama in many languages by the international students of the BTU Cottbus-Senftenberg writers club.',
    keywords: ['BTU Cottbus', 'writers club', 'creative writing', 'poems', 'stories', 'travel writing', 'international students'],
  },

  // ── Analytics ─────────────────────────────────────────────────────────────
  // Set NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX in your environment or GitHub Actions secret.
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_ID ?? '',
  },

  // ── Theme ──────────────────────────────────────────────────────────────────
  theme: {
    colorLight: '#f9fafb',
    colorDark: '#0f172a',
    primary: '#4f46e5',
  },
} as const

export default config

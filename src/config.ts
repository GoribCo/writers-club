// Central developer configuration.
// Content (languages, genres, writings) lives in /content/*.json and /content/{lang}/{genre}/*.md.

const config = {
  // ── Site identity ──────────────────────────────────────────────────────────
  app: {
    name: 'Writers Club',
    version: '0.2.0',
    tagline: 'Writings from the international students of BTU Cottbus',
  },

  // ── URLs ──────────────────────────────────────────────────────────────────
  // Override with NEXT_PUBLIC_SITE_URL env var in production.
  // Override with NEXT_PUBLIC_BASE_PATH for GitHub Pages sub-directory deploys.
  url: {
    site: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://campus-writers.example',
    basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  },

  // ── Dev server ─────────────────────────────────────────────────────────────
  dev: {
    port: 3010,
  },

  // ── SEO defaults ──────────────────────────────────────────────────────────
  seo: {
    defaultTitle: 'Writers Club – BTU Cottbus',
    titleTemplate: '%s | Writers Club',
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

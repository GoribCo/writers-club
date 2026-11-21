// Developer configuration only. Everything editors may change (club name, description, email,
// Instagram, meeting place) lives in contents/club.md → getClub() in lib/content.ts.

const config = {
  // ── Site identity ──────────────────────────────────────────────────────────
  app: {
    version: '0.2.0',
  },

  // ── URLs ──────────────────────────────────────────────────────────────────
  // Override with NEXT_PUBLIC_SITE_URL env var in production.
  // Override with NEXT_PUBLIC_BASE_PATH for GitHub Pages sub-directory deploys.
  url: {
    site: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://goribco.github.io/btu-writers-club',
    basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  },

  // ── Dev server ─────────────────────────────────────────────────────────────
  dev: {
    port: 3010,
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

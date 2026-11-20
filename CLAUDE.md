# Writers Club — Project Knowledge

## What This Is

**Writers Club** — website of the international writers club at BTU Cottbus-Senftenberg. Students publish stories, poems, travel writing, guides and drama in many languages. No database — all content is plain Markdown. Static export for GitHub Pages. (Converted from the "writers-club" language-learning app; the old learning features were removed.)

## Tech Stack

- **Next.js 15** — App Router, `output: 'export'` (static), `trailingSlash: true`
- **React 19**
- **Tailwind CSS v4** — uses `@import "tailwindcss"` in globals.css, NOT `@tailwind base/components/utilities`
- **gray-matter** — parses Markdown frontmatter
- **react-markdown + remark-gfm + rehype-slug** — renders Markdown (server-side)
- TypeScript throughout

## Critical: Tailwind v4 Dark Mode

Dark mode uses the `.dark` class on `<html>`, NOT the media query. This requires:

```css
/* src/app/globals.css */
@import "tailwindcss";
@variant dark (&:is(.dark *));
```

Without `@variant dark`, all `dark:` utility classes are silently ignored.

## Project Structure

```
src/
  app/
    layout.tsx                      # Builds menus from content, renders TopNav + SideNav
    page.tsx                        # Home: language cards + latest writings
    [lang]/page.tsx                 # All writings in a language
    [lang]/[genre]/page.tsx         # Writings in one genre + language
    [lang]/[genre]/[slug]/page.tsx  # A writing + "Also in" translation switcher
    search/                         # Client-side search over all writings
    sitemap.ts, robots.ts
  components/
    SiteNav.tsx                     # TopNav (languages) + SideNav (genres; chips on mobile)
    WritingCard.tsx                 # List item for a writing
    ThemeProvider/ThemeToggle, GoogleAnalytics, InstallBanner, ServiceWorkerRegistrar
  lib/content.ts                    # All fs-based loaders
  lib/types.ts
content/
  languages.json                    # Known languages (order = top menu order; "dir": "rtl" optional)
  genres.json                       # Optional icon + translated names per genre folder
  {lang}/{genre}/{slug}.md          # One writing
```

## Content Model

- `content/{lang}/{genre}/{slug}.md` → URL `/{lang}/{genre}/{slug}/`
- Same `{genre}/{slug}` in another `{lang}` folder = translation of the same writing (linked via "Also in" + hreflang).
- A language appears only if it is in `languages.json` AND has at least one writing. A genre appears only if it has writings.
- Genre label: `genres.json` name for that language → English name → title-cased folder name.
- Frontmatter: `title`, `author`, `country`, `date` (YYYY-MM-DD), `description`, optional `translator`. Lists sort newest first.
- `.writing p { white-space: pre-line }` keeps authors' line breaks (poems, dialogue).

## Content Loaders (`src/lib/content.ts`)

All paths use `process.cwd()` — never `__dirname`.

| Function | Returns |
|----------|---------|
| `getLanguages()` / `getLanguage(code)` | Languages that have content |
| `getGenres(lang)` | Genres with counts for a language |
| `getWritings(lang, genre?)` | Writings, newest first |
| `getAllWritings()` | All writings across languages |
| `getWriting(lang, genre, slug)` | One writing or null |
| `getTranslations(genre, slug)` | Languages the writing exists in |

All route `generateStaticParams` are data-driven, with `dynamicParams = false`.

## Navigation

- **Top bar:** logo, language tabs (scroll horizontally on mobile), search, theme toggle.
- **Left sidebar (lg+) / chips (mobile):** genres of the current language, read from the URL's first segment. Hidden on home and search.

## Theme System

- `ThemeProvider` wraps the entire app in `layout.tsx`
- On mount: reads `localStorage.theme`, falls back to `prefers-color-scheme`
- Toggles by adding/removing `.dark` class on `document.documentElement`
- `useTheme()` hook exported from `ThemeProvider.tsx` — use in any client component
- `ThemeToggle` button appears in every page header

## Key Decisions & Why

| Decision | Reason |
|----------|--------|
| Static export (`output: 'export'`) | GitHub Pages deployment, no server needed |
| Content in Markdown files | No database, version-controllable; club admin publishes via git |
| URL `/{lang}/{genre}/{slug}/` | Language-first browsing; translations share genre+slug |
| Network-first service worker | New writings must appear for returning visitors; cache is offline fallback |
| `@variant dark` in CSS | Tailwind v4 defaults to media query; class-based needed for JS toggle |

## Running Locally

```bash
./run.sh          # installs deps if missing, then npm run dev
# or
npm install
npm run dev       # http://localhost:3000
```

## Building / Deploying

```bash
npm run build     # outputs static files to out/
# Deploy out/ to GitHub Pages
# Set basePath in next.config.ts if deploying to a subdirectory
```

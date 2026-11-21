# Writers Club — Project Knowledge

## What This Is

**Writers Club** — website of the international writers club at BTU Cottbus-Senftenberg. Students publish stories, poems, travel writing, guides and drama in many languages. No database — all content is plain Markdown. Static export for GitHub Pages. (Converted from the "writers-club" language-learning app; the old learning features were removed.)

## Tech Stack

- **Next.js 16** (Turbopack build) — App Router, `output: 'export'` (static), `trailingSlash: true`
- **React 19.3**
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
    page.tsx                        # Home: hero + stats, content-type tabs + feed (HomeFeed), authors strip, languages
    [lang]/page.tsx                 # All writings in a language
    [lang]/[genre]/page.tsx         # Writings in one genre + language
    [lang]/[genre]/[slug]/page.tsx  # A writing + "Also in" translation switcher
    search/                         # Client-side search over all writings
    authors/page.tsx                # All authors + "Where we come from" (by country)
    tags/[tag]/                     # Writings with a theme tag
    collections/, collections/[slug]/  # Themed collections / anthologies
    events/                         # Meetings (upcoming/past decided in the browser)
    submit/                         # Renders contents/pages/submit.md
    og/site.png, og/[lang]/[genre]/[file]/  # Social preview PNGs (route handlers, built statically)
    llms.txt/                       # Plain site map for AI tools
    authors/[slug]/page.tsx         # Author details + all their writings (every language)
    sitemap.ts, robots.ts
  components/
    SiteNav.tsx                     # TopNav (languages) + SideNav (genres; chips on mobile)
    WritingCard.tsx                 # Magazine card (genre gradient cover, author, date, reading time); `featured` variant
    HomeFeed.tsx                    # Client: genre filter tabs + featured + grid
    AuthorAvatar.tsx                # Photo or coloured initials
    SettingsMenu.tsx                # Theme / font size / site language popover
    ThemeProvider, GoogleAnalytics, InstallBanner, ServiceWorkerRegistrar
  lib/content.ts                    # All fs-based loaders
  lib/types.ts
contents/
  languages.json                    # Known languages (order = top menu order; "dir": "rtl" optional)
  genres.json                       # Optional icon + translated names per genre folder
  authors/{id}.md                   # Author profile; file name = id. Frontmatter: name, country, photo, tagline, links{}, details{}; body = About. See authors/README.md.example
  events/{yyyy-mm-dd-slug}.md       # title, date, time, place, description; body = details
  collections/{id}.md               # title, description, cover; body = intro. Writings join with `collection: {id}`
  pages/submit.md                   # Submit page text
  ui/{code}.json                    # Site (interface) language dictionaries — NOT content. en.json is the fallback
  posts/{genre}/{slug}/{lang}.md    # One writing in one language
```

## Content Model

- `contents/posts/{genre}/{slug}/{lang}.md` → URL `/{lang}/{genre}/{slug}/` (e.g. `posts/poem/nodi/bn.md` → `/bn/poem/nodi/`)
- Every `{lang}.md` in one `{slug}` folder = translations of the same writing (linked via "Also in" + hreflang).
- A language appears only if it is in `languages.json` AND has at least one writing. A genre appears only if it has writings.
- Genre label: `genres.json` name for that language → English name → title-cased folder name.
- Frontmatter: `title`, `author` (author id = file name in `contents/authors/`, or a full name), `country`, `date` (YYYY-MM-DD), `description`, optional `translator`, `tags: [a, b]`, `collection: id`, `cover: /path.jpg`. Lists sort newest first.
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
| `getAllGenres()` | Genres across all languages (English labels, total counts) |
| `groupTranslations(writings)` | One entry per writing (English preferred) + its languages |
| `getAuthors()` / `getAuthor(id)` | Author files + anyone named in a writing, with their writings |

All route `generateStaticParams` are data-driven, with `dynamicParams = false`.

## Site language (interface i18n)

- Separate from content language. Visitor picks it in Settings (`SettingsMenu`); saved in `localStorage.uiLang`; first visit uses the browser language if a dictionary exists, else English.
- Dictionaries: `contents/ui/{code}.json`. `_name` = name in the select. Value is a string with `{vars}`, or a plural object `{ "one": …, "other": … }` (Intl.PluralRules categories). Missing keys fall back to `en.json`. Add a language = add a file.
- Use `<T k="key" n={3} />` in server components, `useI18n().t()` in client components, `<LocaleDate date=…/>` for dates (`components/I18n.tsx`).
- Static HTML is rendered in English and switches after hydration (no per-language routes). Metadata/SEO stays English.
- `<html dir>` follows the site language (rtl for ar); content blocks carry their own `lang`/`dir` (`dir="auto"` on authored text).

## SEO / GEO

- Every page: title, description, canonical. Writings: hreflang between translations, OG image `/og/{lang}/{genre}/{slug}.png`.
- JSON-LD: Organization + WebSite (with SearchAction → `/search/?q=`) in layout; Article on writings; ProfilePage/Person on authors; Event on events; Collection on collections. Use `components/JsonLd`.
- `<html lang/dir>` is set from the URL by an inline script in layout (one root layout in static export).
- Paths to files in public/ go through `asset()` (basePath); absolute URLs through `absUrl()` / `absAsset()` in `lib/url.ts`.
- `npm run check` (runs before every build) validates content: dates, authors, collections, links.

## Navigation

- **Top bar:** logo, search (lg+), settings (theme / font size / site language). No reading-language picker: languages are linked from the home page's languages section and the top of `/posts/`; each writing has "Also in".
- **Bottom tab bar (below lg):** Home · Authors · **Posts** (raised centre button) · Events · Menu (sheet: search link + the rest of the site menu as 3-column tiles; items already in the bar are left out). Safe-area aware (`viewportFit: 'cover'`).
- **Footer:** Authors · Collections · Events · Submit · Search.
- **Left sidebar (lg+, every page):** fixed site menu (`MENU` in `SiteNav.tsx`): Home, Posts, Magazine, Gallery, Collections, Authors, Events · Submit, Contact, Social · FAQ, Help, Terms, Privacy. On mobile the same menu opens from the bottom bar's **Menu** tab.
- **Language bar (all sizes, `GenreChips`):** sticky above the content on `/{lang}/…` pages only — a language switcher (keeps the genre if the other language has it), then All + genre chips.
- **Simple text pages** (submit, contact, gallery, magazine, social, faq, help, terms, privacy): `contents/pages/{slug}.md`, each with a 4-line route `src/app/{slug}/page.tsx` using `markdownPage()` from `components/MarkdownPage.tsx`. `/posts/` lists every writing (reuses `HomeFeed`).

## Settings (top-right palette button)

- `SettingsMenu.tsx` popover: **Theme** (System/Light/Dark), **Font size** (Small/Medium/Large → root font-size 15/16/18px, everything is rem), **Language** (site language).
- `ThemeProvider` holds the theme preference; "system" follows `prefers-color-scheme` live. `useTheme()` → `{ preference, setPreference }`.
- Stored in localStorage: `theme`, `fontSize`, `uiLang`. The inline script in `layout.tsx` applies all three before paint (keep its font sizes in sync with `FONT_SIZES`).

## Key Decisions & Why

| Decision | Reason |
|----------|--------|
| Static export (`output: 'export'`) | GitHub Pages deployment, no server needed |
| Content in Markdown files (`contents/posts/{genre}/{slug}/{lang}.md`) | No database, version-controllable; club admin publishes via git |
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

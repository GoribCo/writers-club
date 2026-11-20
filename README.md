# Writers Club

Website of the international writers club at BTU Cottbus-Senftenberg. Members share stories, poems, travel writing, guides and drama in their own languages; each week's writings are published here.

Static Next.js site — no database, every writing is a Markdown file. Deploys to GitHub Pages.

## Publishing a writing

Add a file at `content/{language}/{genre}/{slug}.md`:

```markdown
---
title: "The Spree at Night"
author: "Amara Okafor"
country: "Nigeria"
date: 2026-11-14
description: "One or two sentences shown in lists."
translator: "Lena Hoffmann"   # optional, for translations
---

Text in Markdown. Line breaks are kept, so poems can be written line by line.
```

- **Translations:** use the same `{genre}/{slug}.md` in another language folder. The pages link to each other automatically ("Also in: English · Deutsch · বাংলা").
- **New language:** add it to `content/languages.json` (add `"dir": "rtl"` for right-to-left scripts), then create its folder.
- **New genre:** just create the folder. Optionally add an icon and translated names in `content/genres.json`.
- Menus (languages on top, genres on the left) are generated from the folders. Empty languages/genres are hidden.

## URLs

| URL | Page |
|-----|------|
| `/` | Home — languages + latest writings |
| `/{lang}/` | All writings in a language |
| `/{lang}/{genre}/` | One genre in a language |
| `/{lang}/{genre}/{slug}/` | A writing |
| `/search/` | Search across all languages |

## Run

```bash
./run.sh          # or: npm install && npm run dev
npm run build     # static site in out/
```

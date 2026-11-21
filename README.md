# Writers Club

Website of the international writers club at BTU Cottbus-Senftenberg. Members share stories, poems, travel writing, guides and drama in their own languages; each week's writings are published here.

Static Next.js site — no database, every writing is a Markdown file. Deploys to GitHub Pages.

## Publishing a writing

Add a file at `contents/posts/{genre}/{slug}/{language}.md` (e.g. `contents/posts/poem/nodi/bn.md`):

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

- **Translations:** add another `{language}.md` next to it in the same `{slug}` folder. The pages link to each other automatically ("Also in: English · Deutsch · বাংলা").
- **New language:** add it to `contents/languages.json` (add `"dir": "rtl"` for right-to-left scripts), then add `{code}.md` files.
- **New genre:** create a folder in `contents/posts/`. Optionally add an icon and translated names in `contents/genres.json`.
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

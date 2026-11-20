export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
  dir?: 'rtl'
}

export interface Genre {
  slug: string
  label: string
  icon: string
  count: number
}

export interface Writing {
  lang: string
  genre: string
  genreLabel: string // in the writing's own language
  genreIcon: string
  slug: string
  url: string
  title: string
  author: string
  authorSlug: string
  country: string
  date: string // YYYY-MM-DD
  description: string
  translator: string
  minutes: number // reading time
  tags: string[] // tag slugs
  collection: string // collection id ('' = none)
  cover: string // optional image (URL or path under public/)
  content: string
}

export interface Author {
  slug: string // = file name in content/authors/
  name: string
  country: string
  flag: string // emoji from `countryCode` (ISO 3166 alpha-2), may be empty
  photo: string // URL or path under public/, may be empty
  tagline: string // one line, e.g. "Poet · MSc Environmental Engineering"
  links: Record<string, string> // label → URL (website, instagram, linkedin, …)
  details: Record<string, string> // free label → value facts (Joined, Studies, Languages, …)
  about: string // Markdown body of the author file
  writings: Writing[] // newest first, all languages
}

export interface ClubEvent {
  slug: string // file name in content/events/
  title: string
  date: string // YYYY-MM-DD
  time: string // free text, e.g. "18:00–20:00"
  place: string
  description: string
  body: string // Markdown
}

export interface Collection {
  slug: string // file name in content/collections/
  title: string
  description: string
  cover: string
  body: string // Markdown
}

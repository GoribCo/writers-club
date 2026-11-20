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
  content: string
}

export interface Author {
  slug: string // = file name in content/authors/
  name: string
  country: string
  photo: string // URL or path under public/, may be empty
  tagline: string // one line, e.g. "Poet · MSc Environmental Engineering"
  links: Record<string, string> // label → URL (website, instagram, linkedin, …)
  details: Record<string, string> // free label → value facts (Joined, Studies, Languages, …)
  about: string // Markdown body of the author file
  writings: Writing[] // newest first, all languages
}

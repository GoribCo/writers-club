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
  slug: string
  url: string
  title: string
  author: string
  country: string
  date: string // YYYY-MM-DD
  description: string
  translator: string
  content: string
}

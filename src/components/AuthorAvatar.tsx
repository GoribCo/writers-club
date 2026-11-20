import type { Author } from '@/lib/types'
import config from '@/config'

export default function AuthorAvatar({ author: a, size = 48 }: { author: Author; size?: number }) {
  const style = { width: size, height: size }
  if (a.photo) return <img src={a.photo.startsWith('/') ? config.url.basePath + a.photo : a.photo} alt="" style={style} className="rounded-full object-cover shrink-0" />
  const initials = a.name.split(/\s+/).map(p => [...p][0]).slice(0, 2).join('').toUpperCase()
  return (
    <span aria-hidden style={{ ...style, fontSize: size * 0.38 }}
      className="rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-bold flex items-center justify-center shrink-0">
      {initials}
    </span>
  )
}

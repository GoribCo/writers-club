import config from '@/config'

const tints = [
  'from-rose-400 to-orange-300', 'from-indigo-500 to-sky-400', 'from-emerald-400 to-teal-500',
  'from-fuchsia-500 to-purple-500', 'from-amber-400 to-pink-500', 'from-cyan-400 to-blue-600',
]

/** Photo, or coloured initials (colour stable per name). */
export default function AuthorAvatar({ author: a, size = 48, className = '' }:
  { author: { name: string; photo?: string }; size?: number; className?: string }) {
  const style = { width: size, height: size }
  if (a.photo)
    return <img src={a.photo.startsWith('/') ? config.url.basePath + a.photo : a.photo} alt="" style={style} className={`rounded-full object-cover shrink-0 ${className}`} />
  const initials = a.name.split(/\s+/).map(p => [...p][0]).slice(0, 2).join('').toUpperCase()
  const tint = tints[[...a.name].reduce((n, c) => n + c.charCodeAt(0), 0) % tints.length]
  return (
    <span aria-hidden style={{ ...style, fontSize: size * 0.38 }}
      className={`rounded-full bg-gradient-to-br ${tint} text-white font-bold flex items-center justify-center shrink-0 ${className}`}>
      {initials}
    </span>
  )
}

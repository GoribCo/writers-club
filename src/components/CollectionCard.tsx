import Link from 'next/link'
import type { getCollections } from '@/lib/content'
import { asset } from '@/lib/url'
import { T } from './I18n'

export default function CollectionCard({ c }: { c: ReturnType<typeof getCollections>[number] }) {
  return (
    <Link href={`/collections/${c.slug}/`}
      className="group relative flex min-h-48 flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-indigo-900 to-violet-800 p-6 text-white shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all">
      {c.cover && <img src={asset(c.cover)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500" />}
      <div dir="auto" className="relative">
        <span className="text-xs font-bold uppercase tracking-widest text-white/70"><T k="count.writings" n={c.items.length} /></span>
        <h2 className="mt-1 text-2xl font-extrabold">{c.title}</h2>
        {c.description && <p className="mt-1 text-sm text-white/80 line-clamp-2">{c.description}</p>}
      </div>
    </Link>
  )
}

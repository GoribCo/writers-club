import type { ClubEvent } from '@/lib/types'

const fmt = (d: string, opts: Intl.DateTimeFormatOptions) => new Date(d + 'T00:00:00').toLocaleDateString('en-GB', opts)

export default function EventCard({ e, highlight = false }: { e: ClubEvent; highlight?: boolean }) {
  return (
    <div className={`flex gap-4 rounded-3xl p-5 ring-1 ${highlight
      ? 'bg-gradient-to-br from-amber-50 to-rose-50 dark:from-amber-950/40 dark:to-rose-950/40 ring-amber-200 dark:ring-amber-900'
      : 'bg-white dark:bg-gray-800/80 ring-gray-200/70 dark:ring-gray-700/60'}`}>
      <div className="w-16 shrink-0 rounded-2xl bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-700 text-center py-2 h-fit">
        <div className="text-xs font-bold uppercase text-rose-500">{fmt(e.date, { month: 'short' })}</div>
        <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{fmt(e.date, { day: 'numeric' })}</div>
      </div>
      <div className="min-w-0">
        {highlight && <p className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Next meeting</p>}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{e.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {fmt(e.date, { weekday: 'long' })}{e.time && ` · ${e.time}`}{e.place && ` · 📍 ${e.place}`}
        </p>
        {e.description && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{e.description}</p>}
      </div>
    </div>
  )
}

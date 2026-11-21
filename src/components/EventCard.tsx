import type { EventItem } from '@/lib/types'
import { LocaleDate, T } from './I18n'

export default function EventCard({ e, highlight = false }: { e: EventItem; highlight?: boolean }) {
  return (
    <div className={`flex gap-4 rounded-3xl p-5 ring-1 ${highlight
      ? 'bg-gradient-to-br from-amber-50 to-rose-50 dark:from-amber-950/40 dark:to-rose-950/40 ring-amber-200 dark:ring-amber-900'
      : 'bg-white dark:bg-gray-800/80 ring-gray-200/70 dark:ring-gray-700/60'}`}>
      <div className="w-16 shrink-0 rounded-2xl bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-700 text-center py-2 h-fit">
        <div className="text-xs font-bold uppercase text-rose-500"><LocaleDate date={e.date} opts={{ month: 'short' }} /></div>
        <div className="text-2xl font-extrabold text-gray-900 dark:text-white"><LocaleDate date={e.date} opts={{ day: 'numeric' }} /></div>
      </div>
      <div className="min-w-0">
        {highlight && <p className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400"><T k="events.next" /></p>}
        <h3 dir="auto" className="text-lg font-bold text-gray-900 dark:text-white">{e.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <LocaleDate date={e.date} opts={{ weekday: 'long' }} />{e.time && <> · <bdi>{e.time}</bdi></>}{e.place && <> · 📍 <bdi>{e.place}</bdi></>}
        </p>
        {e.description && <p dir="auto" className="mt-2 text-sm text-gray-600 dark:text-gray-300">{e.description}</p>}
      </div>
    </div>
  )
}

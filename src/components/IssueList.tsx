import Link from 'next/link'
import { getIssues } from '@/lib/content'
import { asset } from '@/lib/url'
import { LocaleDate, T } from './I18n'

/** Magazine issues as cover cards → /magazine/{slug}/ reader. */
export default function IssueList() {
  const issues = getIssues()
  if (!issues.length) return <p className="text-center text-gray-500 dark:text-gray-400"><T k="magazine.empty" /></p>
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {issues.map(i => (
        <Link key={i.slug} href={`/magazine/${i.slug}/`} className="group">
          {i.cover ? (
            // eslint-disable-next-line @next/next/no-img-element -- static export, images unoptimized
            <img src={asset(i.cover)} alt="" loading="lazy" className="aspect-[3/4] w-full rounded-xl object-cover shadow-md transition group-hover:shadow-xl group-hover:-translate-y-0.5" />
          ) : (
            <div aria-hidden className="aspect-[3/4] w-full rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 p-4 flex items-end text-white font-extrabold text-lg shadow-md transition group-hover:shadow-xl group-hover:-translate-y-0.5">{i.title}</div>
          )}
          <p dir="auto" className="mt-2 font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600">{i.title}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400"><LocaleDate date={i.date} opts={{ month: 'long', year: 'numeric' }} /></p>
        </Link>
      ))}
    </div>
  )
}

import { getAlbums } from '@/lib/content'
import { asset } from '@/lib/url'
import { LocaleDate, T } from './I18n'

/** Gallery albums (contents/gallery/*.md): photos open full size, videos play inline, YouTube embeds. */
export default function Gallery() {
  const albums = getAlbums()
  if (!albums.length) return <p className="text-center text-gray-500 dark:text-gray-400"><T k="gallery.empty" /></p>
  return (
    <div className="space-y-12">
      {albums.map(a => (
        <section key={a.slug} id={a.slug} aria-labelledby={`album-${a.slug}`} className="scroll-mt-20">
          <header className="mb-4">
            <h2 id={`album-${a.slug}`} dir="auto" className="text-xl font-bold text-gray-900 dark:text-white">{a.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400"><LocaleDate date={a.date} /> · <T k="gallery.items" n={a.items.length} /></p>
            {a.body && <p dir="auto" className="mt-2 whitespace-pre-line text-gray-600 dark:text-gray-300">{a.body}</p>}
          </header>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {a.items.map(m => (
              <figure key={m.src} className={m.kind === 'image' ? '' : 'col-span-2'}>
                {m.kind === 'image' ? (
                  <a href={asset(m.src)} target="_blank" rel="noopener">
                    {/* eslint-disable-next-line @next/next/no-img-element -- static export, images unoptimized */}
                    <img src={asset(m.src)} alt={m.caption || a.title} loading="lazy" className="aspect-square w-full rounded-xl object-cover bg-gray-200 dark:bg-gray-800 hover:opacity-90" />
                  </a>
                ) : m.kind === 'video' ? (
                  <video src={asset(m.src)} controls preload="metadata" playsInline className="aspect-video w-full rounded-xl bg-black" />
                ) : (
                  <iframe src={m.src} title={m.caption || a.title} loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="aspect-video w-full rounded-xl bg-black" />
                )}
                {m.caption && <figcaption dir="auto" className="mt-1 text-xs text-gray-500 dark:text-gray-400">{m.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

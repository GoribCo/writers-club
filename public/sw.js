const CACHE = 'campus-writer-v1'

// Drop caches from older versions (e.g. the old cache-first 'lexora-v1').
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
))

// Network-first so newly published writings show up; cache is the offline fallback.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return
  e.respondWith(fetch(e.request).then(res => {
    if (res && res.status === 200 && res.type !== 'opaque') {
      const clone = res.clone()
      caches.open(CACHE).then(c => c.put(e.request, clone))
    }
    return res
  }).catch(() => caches.match(e.request)))
})

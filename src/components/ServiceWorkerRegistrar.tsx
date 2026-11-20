'use client'

import { useEffect } from 'react'
import { asset } from '@/lib/url'

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register(asset('/sw.js'))
        .catch(() => {
          // SW registration is best-effort — ignore errors in non-HTTPS contexts etc.
        })
    }
  }, [])

  return null
}

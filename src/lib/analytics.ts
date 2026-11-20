import config from '@/config'

// Type-safe gtag wrapper. Only fires when GA ID is configured and gtag is loaded.
function gtag(...args: unknown[]) {
  if (typeof window === 'undefined') return
  if (!config.analytics.gaId) return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).gtag?.(...args)
}

// Called automatically by the GoogleAnalytics component on route change.
export function trackPageView(url: string) {
  gtag('config', config.analytics.gaId, { page_path: url })
}

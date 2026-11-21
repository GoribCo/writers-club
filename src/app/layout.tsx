import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'
import { TopNav, SiteMenu, GenreChips, BottomNav } from '@/components/SiteNav'
import { getAllWritings, getGenres, getLanguages, getUiDictionaries, groupTranslations } from '@/lib/content'
import { I18nProvider } from '@/components/I18n'
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import InstallBanner from '@/components/InstallBanner'
import config from '@/config'
import JsonLd from '@/components/JsonLd'
import SiteFooter from '@/components/SiteFooter'
import { absUrl, asset } from '@/lib/url'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(config.url.site),
  title: {
    default: config.seo.defaultTitle,
    template: config.seo.titleTemplate,
  },
  description: config.seo.defaultDescription,
  keywords: [...config.seo.keywords],
  authors: [{ name: config.app.name }],
  creator: config.app.name,
  openGraph: {
    title: config.seo.defaultTitle,
    description: config.seo.defaultDescription,
    siteName: config.app.name,
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og/site.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: config.seo.defaultTitle,
    description: config.seo.defaultDescription,
  },
  alternates: {
    canonical: config.url.site,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // lets the bars use the iPhone safe areas
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: config.theme.colorLight },
    { media: '(prefers-color-scheme: dark)', color: config.theme.colorDark },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const languages = getLanguages()
  const menus = Object.fromEntries(languages.map(l => [l.code, getGenres(l.code)]))
  const postCount = groupTranslations(getAllWritings()).length
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href={asset('/manifest.json')} />

        {/* Apple PWA — enables "Add to Home Screen" via Safari on iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={config.app.name} />
        <link rel="apple-touch-icon" href={asset('/apple-touch-icon.png')} />

        {/* Splash screens for common iPhone sizes */}
        <link rel="apple-touch-startup-image" href="/apple-touch-icon.png" />

        {/* Prevent auto-detection of phone numbers / emails */}
        <meta name="format-detection" content="telephone=no" />

        {/* Android / Chrome: status bar colour */}
        <meta name="theme-color" content="#4f46e5" />

        {/* Before paint: <html lang> = the page's content language (SEO); <html dir> = the visitor's site language */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var c=location.pathname.slice(${JSON.stringify(config.url.basePath.length)}).split('/')[1];if(${JSON.stringify(languages.map(l => l.code))}.indexOf(c)>-1)document.documentElement.lang=c;try{var d=document.documentElement,s=localStorage,t=s.getItem('theme'),f={small:'15px',large:'18px'}[s.getItem('fontSize')];if(['ar','fa','he','ur'].indexOf(s.getItem('uiLang'))>-1)d.dir='rtl';if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))d.classList.add('dark');if(f)d.style.fontSize=f}catch(e){}})()` }} />
        <JsonLd data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Organization', '@id': absUrl('/#org'), name: config.app.name, url: absUrl('/'),
              logo: absUrl('/icon-512.png'), description: config.seo.defaultDescription,
              email: config.contact.email, sameAs: [config.contact.instagram],
              parentOrganization: { '@type': 'CollegeOrUniversity', name: 'BTU Cottbus-Senftenberg', url: 'https://www.b-tu.de' },
            },
            {
              '@type': 'WebSite', '@id': absUrl('/#site'), name: config.app.name, url: absUrl('/'),
              publisher: { '@id': absUrl('/#org') }, inLanguage: languages.map(l => l.code),
              potentialAction: { '@type': 'SearchAction', target: absUrl('/search/?q={query}'), 'query-input': 'required name=query' },
            },
          ],
        }} />

      </head>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 dark:bg-slate-900 min-h-dvh`}>
        <ThemeProvider>
        <I18nProvider dicts={getUiDictionaries()}>
          <GoogleAnalytics />
          <ServiceWorkerRegistrar />
          <TopNav languages={languages} />
          {/* Desktop: site menu sidebar left of content. Genre chips above content on language pages. */}
          <div className="max-w-6xl mx-auto lg:flex lg:items-start">
            <SiteMenu languages={languages} postCount={postCount} />
            <div className="flex-1 min-w-0">
              <GenreChips languages={languages} menus={menus} />
              <main className="px-4 sm:px-6 pt-6 pb-12">
                {children}
              </main>
            </div>
          </div>
          <SiteFooter />
          <BottomNav languages={languages} postCount={postCount} />
          <InstallBanner />
        </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

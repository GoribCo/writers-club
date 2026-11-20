import config from '@/config'

/** Local file under public/ → URL that works with basePath; external URLs unchanged. */
export const asset = (p: string) => (p.startsWith('/') ? config.url.basePath + p : p)

/** Site path → absolute URL (for JSON-LD, llms.txt). */
export const absUrl = (p: string) => config.url.site + p

/** Image/file path → absolute URL (external URLs unchanged). */
export const absAsset = (p: string) => (p.startsWith('/') ? absUrl(p) : p)

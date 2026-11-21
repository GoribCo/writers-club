import { markdownPage } from '@/components/MarkdownPage'
import Gallery from '@/components/Gallery'

export const dynamic = 'force-static'
const { Page, generateMetadata } = markdownPage('gallery', Gallery)
export { generateMetadata }
export default Page

import { markdownPage } from '@/components/MarkdownPage'

export const dynamic = 'force-static'
const { Page, generateMetadata } = markdownPage('gallery')
export { generateMetadata }
export default Page

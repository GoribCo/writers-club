import { markdownPage } from '@/components/MarkdownPage'

export const dynamic = 'force-static'
const { Page, generateMetadata } = markdownPage('faq')
export { generateMetadata }
export default Page

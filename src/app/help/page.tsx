import { markdownPage } from '@/components/MarkdownPage'

export const dynamic = 'force-static'
const { Page, generateMetadata } = markdownPage('help')
export { generateMetadata }
export default Page

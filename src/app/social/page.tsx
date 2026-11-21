import { markdownPage } from '@/components/MarkdownPage'

export const dynamic = 'force-static'
const { Page, generateMetadata } = markdownPage('social')
export { generateMetadata }
export default Page

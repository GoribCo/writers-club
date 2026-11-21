import { markdownPage } from '@/components/MarkdownPage'

export const dynamic = 'force-static'
const { Page, generateMetadata } = markdownPage('magazine')
export { generateMetadata }
export default Page

import { markdownPage } from '@/components/MarkdownPage'
import ContactInfo from '@/components/ContactInfo'

export const dynamic = 'force-static'
const { Page, generateMetadata } = markdownPage('contact', ContactInfo)
export { generateMetadata }
export default Page

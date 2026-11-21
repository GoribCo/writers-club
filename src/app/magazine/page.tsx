import { markdownPage } from '@/components/MarkdownPage'
import IssueList from '@/components/IssueList'

export const dynamic = 'force-static'
const { Page, generateMetadata } = markdownPage('magazine', IssueList)
export { generateMetadata }
export default Page

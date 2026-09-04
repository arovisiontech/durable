import { BlogHeroBanner } from '@/src/components/public/BlogHeroBanner'
import { LatestBlogsSection } from '@/src/components/public/LatestBlogsSection'

export const metadata = {
  title: 'Latest Insights & Blogs | Durable Hospital Supplies',
  description:
    'Stay updated with the latest trends, innovations, and expert insights in surgical instrument manufacturing and healthcare technology.',
}

export default function BlogsPage() {
  return (
    <div className="w-full bg-white min-h-screen">
      {/* 1. Page Header with Hero Image matching SS 2 */}
      <BlogHeroBanner />

      {/* 2. Blog Grid Section matching SS 1 */}
      <LatestBlogsSection />
    </div>
  )
}

import { CategoryHeroBanner } from '@/src/components/public/CategoryHeroBanner'
import { LatestBlogsSection } from '@/src/components/public/LatestBlogsSection'

export const metadata = {
  title: 'Latest News & Trade Fair Announcements | Durable Hospital Supplies',
  description:
    'Stay updated with the latest news, medical device innovations, upcoming surgical exhibitions, MEDICA Düsseldorf, Arab Health, and industry trade shows.',
}

export const revalidate = 60

export default function NewsPage() {
  return (
    <div className="w-full bg-white min-h-screen">
      <CategoryHeroBanner
        title="LATEST NEWS &"
        highlight="ANNOUNCEMENTS"
        badgeText="PRESS & EXHIBITIONS"
        description="Stay updated with our latest medical trade fair appearances, product releases, surgical technology breakthroughs, and global healthcare events."
      />

      <LatestBlogsSection />
    </div>
  )
}

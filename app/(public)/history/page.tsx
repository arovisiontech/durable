import { CategoryHeroBanner } from '@/src/components/public/CategoryHeroBanner'
import { DurableHistorySection } from '@/src/components/public/DurableHistorySection'
import { OurJourneySection } from '@/src/components/public/OurJourneySection'

export const metadata = {
  title: 'Our History & Heritage | Durable Hospital Supplies',
  description:
    'Discover the legacy of Durable Hospital Supplies. Over decades of craftsmanship, precision engineering, and worldwide distribution of surgical instruments.',
}

export const revalidate = 60

export default function HistoryPage() {
  return (
    <div className="w-full bg-white min-h-screen">
      <CategoryHeroBanner
        title="OUR HERITAGE &"
        highlight="HISTORY"
        badgeText="ESTABLISHED LEGACY"
        description="Tracing back decades of master craftsmanship, precision forging, and technological innovation in surgical instrument manufacturing."
      />

      <DurableHistorySection />
      <OurJourneySection />
    </div>
  )
}

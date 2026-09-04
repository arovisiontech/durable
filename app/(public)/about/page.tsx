import { Metadata } from 'next'
import { AboutHeroBanner } from '@/src/components/public/AboutHeroBanner'
import { DurableHistorySection } from '@/src/components/public/DurableHistorySection'
import { OurJourneySection } from '@/src/components/public/OurJourneySection'

export const metadata: Metadata = {
  title: 'About Us | Durable Hospital Supplies',
  description:
    'Precision in every instrument. Trust in every detail. Learn more about Durable Hospital Supplies history and journey from humble origins to global recognition.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. About Us Hero Banner matching SS 2 */}
      <AboutHeroBanner />

      {/* 2. Durable History Section matching SS 1 (Durable History) */}
      <DurableHistorySection />

      {/* 3. Our Journey Section matching SS 1 (From Humble Origins To Global Recognition) */}
      <OurJourneySection />
    </main>
  )
}

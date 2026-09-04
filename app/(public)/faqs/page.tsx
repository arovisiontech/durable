import { FaqHeroBanner } from '@/src/components/public/FaqHeroBanner'
import { FaqAccordionSection } from '@/src/components/public/FaqAccordionSection'

export const metadata = {
  title: 'Frequently Asked Questions (FAQs) | Durable Hospital Supplies',
  description:
    'Find answers to common questions about our surgical instruments, ISO/CE certifications, custom OEM manufacturing, shipping, and warranty.',
}

export default function FaqsPage() {
  return (
    <div className="w-full bg-white min-h-screen">
      {/* 1. FAQ Page Hero Header Banner with SS 1 Hero Image */}
      <FaqHeroBanner />

      {/* 2. FAQ Accordion List & Search Filter */}
      <FaqAccordionSection />
    </div>
  )
}

import { Metadata } from 'next'
import { StrengthsHeroBanner } from '@/src/components/public/StrengthsHeroBanner'
import { StrengthsSection } from '@/src/components/public/StrengthsSection'

export const metadata: Metadata = {
  title: 'Our Strengths | Durable Hospital Supplies',
  description:
    'Discover our manufacturing strengths, technical mastery, precision engineering, and cohesive team at Durable Hospital Supplies.',
}

export default function StrengthsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner matching SS 1 */}
      <StrengthsHeroBanner />

      {/* Main Content matching SS 2, SS 3, SS 4 */}
      <StrengthsSection />
    </main>
  )
}

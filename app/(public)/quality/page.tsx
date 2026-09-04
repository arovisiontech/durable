import { CategoryHeroBanner } from '@/src/components/public/CategoryHeroBanner'
import { QualityPillarsSection } from '@/src/components/public/QualityPillarsSection'
import { QualityTrustSection } from '@/src/components/public/QualityTrustSection'
import { ProcessAcrossSection } from '@/src/components/public/ProcessAcrossSection'

export const metadata = {
  title: 'Quality Standards & Testing | Durable Hospital Supplies',
  description:
    'Our rigorous 100% quality inspection process, metallurgy testing, Rockwell hardness verification, and bio-compatible passivation for surgical instruments.',
}

export const revalidate = 60

export default function QualityPage() {
  return (
    <div className="w-full bg-white min-h-screen">
      <CategoryHeroBanner
        title="QUALITY STANDARDS &"
        highlight="INSPECTION"
        badgeText="UNCOMPROMISING PRECISION"
        description="Every instrument undergoes 100% hand inspection, Rockwell hardness testing, corrosion passivation, and microscopic alignment checks before delivery."
      />

      <QualityTrustSection />
      <QualityPillarsSection />
      <ProcessAcrossSection />
    </div>
  )
}

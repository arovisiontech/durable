import { CataloguesHeroBanner } from '@/src/components/public/CataloguesHeroBanner'
import { CataloguesOverviewSection } from '@/src/components/public/CataloguesOverviewSection'
import { DownloadableCataloguesSection } from '@/src/components/public/DownloadableCataloguesSection'
import { InstrumentPillarsSection } from '@/src/components/public/InstrumentPillarsSection'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function PublicCataloguesPage() {
  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen space-y-0">
      {/* 1. Dynamic Hero Banner matching SS 2 settings */}
      <CataloguesHeroBanner />

      {/* 2. Dynamic Catalogues Overview Section matching SS 3 settings */}
      <CataloguesOverviewSection />

      {/* 3. Dynamic Downloadable Catalogues Grid Section matching SS 4 settings & cards */}
      <DownloadableCataloguesSection />

      {/* 4. Reusable, Single Use & Sterile Kitting 3-Pillars Grid Section */}
      <InstrumentPillarsSection />
    </div>
  )
}

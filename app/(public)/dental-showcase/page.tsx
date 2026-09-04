import { CategoryHeroBanner } from '@/src/components/public/CategoryHeroBanner'
import { DentalCatalogShowcaseSection } from '@/src/components/public/DentalCatalogShowcaseSection'

export const metadata = {
  title: 'Dental Instruments Showcase & Specifications | Durable Hospital Supplies',
  description:
    'Explore our 01-06 Dental instrument categories including Extraction & Oral Surgery, Dental Bone Surgery, Periodontics & Cleaning, Endodontics, Diagnostic, and Discipline Specific instruments.',
}

export const revalidate = 60

export default function DentalShowcasePage() {
  return (
    <div className="w-full bg-white min-h-screen">
      {/* Hero Banner */}
      <CategoryHeroBanner
        title="DENTAL INSTRUMENTS &"
        highlight="FLOW CHARTS"
        badgeText="OFFICIAL DENTAL CATALOGUES"
        description="Explore detailed technical specifications, instrument flow charts, sizing dimensions, and downloadable PDF catalogues for all 6 major dental surgical fields."
      />

      {/* 6 Dental Showcase Items (01 to 06) with Animated 4-Side Light Motion */}
      <DentalCatalogShowcaseSection />
    </div>
  )
}

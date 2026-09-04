import { CategoryHeroBanner } from '@/src/components/public/CategoryHeroBanner'
import { ProductCatalogShowcaseSection } from '@/src/components/public/ProductCatalogShowcaseSection'

export const metadata = {
  title: 'Product Catalog Showcase | Durable Hospital Supplies',
  description:
    'Explore our 01-06 product catalog showcase featuring General Surgery, Dental, Electrosurgical, Hollowware, Orthopedics, and Ophthalmic instruments.',
}

export const revalidate = 60

export default function CatalogShowcasePage() {
  return (
    <div className="w-full bg-white min-h-screen">
      {/* Hero Banner with SS 2 Background Image */}
      <CategoryHeroBanner
        title="TECHNICAL CATALOGUES &"
        highlight="SPECIFICATIONS"
        badgeText="OFFICIAL PRODUCT CATALOGUES"
        description="Explore and download our official product catalogues featuring full technical instrument specifications, sizing dimensions, tungsten carbide inserts, and ordering SKUs."
      />

      {/* 6 Alternating Catalog Flow Chart Showcase (01 to 06) */}
      <ProductCatalogShowcaseSection />
    </div>
  )
}

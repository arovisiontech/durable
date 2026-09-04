import { ProductsHeroBanner } from '@/src/components/public/ProductsHeroBanner'
import { ExploreProductCategoriesSection } from '@/src/components/public/ExploreProductCategoriesSection'
import { DentalProcedureBannerSection } from '@/src/components/public/DentalProcedureBannerSection'
import { ExploreDentalCategoriesSection } from '@/src/components/public/ExploreDentalCategoriesSection'

export const revalidate = 60

export default function PublicProductsPage() {
  return (
    <div className="w-full bg-white space-y-12">
      {/* 1. Products Hero Banner */}
      <ProductsHeroBanner categoryTitle="GENERAL" categoryHighlight="SURGERY" />

      {/* 2. Explore Our Product Categories (6 Cards Grid matching SS 1 - Links to Catalogues Page) */}
      <ExploreProductCategoriesSection />

      {/* 3. Dental & Surgical Procedure Wide Clinic Banner */}
      <DentalProcedureBannerSection />

      {/* 4. Explore Our Dental Instruments Categories (6 Cards Grid) */}
      <ExploreDentalCategoriesSection />
    </div>
  )
}

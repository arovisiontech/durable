import { ProductsHeroBanner } from '@/src/components/public/ProductsHeroBanner'
import { ExploreProductCategoriesSection } from '@/src/components/public/ExploreProductCategoriesSection'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function PublicProductsPage() {
  return (
    <div className="w-full bg-white space-y-12 pb-16">
      {/* 1. Products Hero Banner */}
      <ProductsHeroBanner categoryTitle="GENERAL" categoryHighlight="SURGERY" />

      {/* 2. Explore Our Product Categories (Live Supabase Categories Grid) */}
      <ExploreProductCategoriesSection />
    </div>
  )
}

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CATEGORIES_DATA } from '@/src/data/categoriesData'
import { CategoryHeroBanner } from '@/src/components/public/CategoryHeroBanner'
import { ArrowRight } from 'lucide-react'
import { SubcategoryPdfSection } from '@/src/components/public/SubcategoryPdfSection'
import { fetchPublicCategories } from '@/app/actions/public'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  let categoryName = slug.replace(/-/g, ' ').toUpperCase()
  let description = 'High quality surgical, medical, and dental instruments manufactured to ISO 13485 standards.'

  try {
    const allCategories = await fetchPublicCategories()
    const found = allCategories.find((c) => c.slug === slug || c.id === slug)

    if (found) {
      categoryName = found.name
      if (found.description) description = found.description
    } else if (CATEGORIES_DATA[slug]) {
      categoryName = `${CATEGORIES_DATA[slug].title} ${CATEGORIES_DATA[slug].highlight}`
      description = CATEGORIES_DATA[slug].description
    }
  } catch (e) {
    console.error('Metadata category fetch error:', e)
  }

  return {
    title: `${categoryName} | Durable Hospital Supplies`,
    description,
  }
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  // 1. Fetch dynamic categories list from persistent server data store
  const allCategories = await fetchPublicCategories()
  const currentCategory = allCategories.find((c) => c.slug === slug || c.id === slug)

  let categoryData = {
    title: slug.split('-').slice(0, -1).join(' ').toUpperCase() || slug.toUpperCase(),
    highlight: slug.split('-').slice(-1)[0]?.toUpperCase() || '',
    badgeText: 'ISO 13485 & CE CERTIFIED',
    description: 'Precision manufactured surgical and medical instruments designed for maximum performance.',
    slug,
  }

  if (currentCategory) {
    const words = currentCategory.name.split(' ')
    const highlight = words.length > 1 ? words.pop()! : ''
    const title = words.join(' ') || currentCategory.name

    categoryData = {
      title,
      highlight,
      badgeText: 'ISO 13485 & CE CERTIFIED',
      description: currentCategory.description || 'Precision surgical and medical instruments.',
      slug: currentCategory.slug,
    }
  } else if (CATEGORIES_DATA[slug]) {
    categoryData = {
      title: CATEGORIES_DATA[slug].title,
      highlight: CATEGORIES_DATA[slug].highlight,
      badgeText: CATEGORIES_DATA[slug].badgeText,
      description: CATEGORIES_DATA[slug].description,
      slug,
    }
  }

  // 2. Navigation pills from active categories (all 9 categories matching SS 3)
  const allCategoriesList =
    allCategories.length > 0
      ? allCategories.map((c) => ({ slug: c.slug, name: c.name }))
      : [
          { slug: 'general-surgery', name: 'General Surgery' },
          { slug: 'dental', name: 'Dental' },
          { slug: 'medical-hollowware', name: 'Medical Hollowware' },
          { slug: 'ophthalmic', name: 'Ophthalmic' },
          { slug: 'hospital-furniture', name: 'Hospital Furniture' },
          { slug: 'single-use-instruments', name: 'Single Use Instruments' },
          { slug: 'veterinary-instruments', name: 'Veterinary-Instruments' },
          { slug: 'plastic-surgery', name: 'Plastic Surgery' },
          { slug: 'special-surgical-instruments', name: 'Special Surgical Instruments' },
        ]

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen pb-16 space-y-10">
      {/* 1. Category Hero Banner */}
      <CategoryHeroBanner
        title={categoryData.title}
        highlight={categoryData.highlight}
        badgeText={categoryData.badgeText}
        description={categoryData.description}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        {/* 2. Category Navigation Pills Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs flex items-center justify-between gap-4 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-2 min-w-max">
            {allCategoriesList.map((cat) => {
              const isActive = cat.slug === categoryData.slug
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#0B1B3D] text-white shadow-sm scale-102'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {cat.name}
                </Link>
              )
            })}
          </div>

          <Link
            href="/products"
            className="text-xs font-extrabold text-[#E31B23] hover:underline flex items-center gap-1 shrink-0 px-3"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2.5 Subcategories PDF Catalogs Grid Showcase */}
        <SubcategoryPdfSection
          categorySlug={categoryData.slug}
          categoryTitle={`${categoryData.title} ${categoryData.highlight}`}
        />

        {/* 3. Bottom OEM & Bulk Procurement Banner */}
        <div className="bg-[#0B1B3D] text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left z-10">
            <span className="text-[10px] font-bold tracking-widest text-[#E31B23] uppercase">
              CUSTOM CONTRACT MANUFACTURING
            </span>
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
              Need Custom OEM Sizing for {categoryData.title} {categoryData.highlight}?
            </h3>
            <p className="text-xs text-slate-300 max-w-xl font-medium leading-relaxed">
              We specialize in custom jaw serrations, titanium color coatings, laser marking, and customized procedure packaging for healthcare brands worldwide.
            </p>
          </div>

          <Link
            href="/contact"
            className="z-10 px-6 py-3.5 bg-[#E31B23] hover:bg-red-700 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-lg shrink-0 flex items-center gap-2"
          >
            <span>DISCUSS OEM CONTRACT</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  )
}

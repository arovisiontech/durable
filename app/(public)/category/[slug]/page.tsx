import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CATEGORIES_DATA } from '@/src/data/categoriesData'
import { CategoryHeroBanner } from '@/src/components/public/CategoryHeroBanner'
import { ArrowLeft, ArrowRight, Package, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react'

import { SubcategoryPdfSection } from '@/src/components/public/SubcategoryPdfSection'

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return Object.keys(CATEGORIES_DATA).map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const resolvedParams = await params
  const category = CATEGORIES_DATA[resolvedParams.slug]
  if (!category) return { title: 'Category Not Found' }

  return {
    title: `${category.title} ${category.highlight} | Durable Hospital Supplies`,
    description: category.description,
  }
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const resolvedParams = await params
  const category = CATEGORIES_DATA[resolvedParams.slug]

  if (!category) {
    notFound()
  }

  const allCategories = [
    { slug: 'general-surgery', name: 'General Surgery' },
    { slug: 'dental', name: 'Dental' },
    { slug: 'medical-hollowware', name: 'Medical Hollowware' },
    { slug: 'ophthalmic', name: 'Ophthalmic' },
    { slug: 'hospital-furniture', name: 'Hospital Furniture' },
    { slug: 'single-use-instruments', name: 'Single Use Instruments' },
  ]

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen pb-16 space-y-10">
      {/* 1. Category Hero Banner with SS 2 Background Image */}
      <CategoryHeroBanner
        title={category.title}
        highlight={category.highlight}
        badgeText={category.badgeText}
        description={category.description}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* 2. Category Navigation Pills Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {allCategories.map((cat) => {
              const isActive = cat.slug === category.slug
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

        {/* 2.5 Subcategories PDF Catalogs Grid Showcase (Matching SS 2) */}
        <SubcategoryPdfSection
          categorySlug={category.slug}
          categoryTitle={`${category.title} ${category.highlight}`}
        />

        {/* 3. Bottom OEM & Bulk Procurement Banner */}
        <div className="bg-[#0B1B3D] text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left z-10">
            <span className="text-[10px] font-bold tracking-widest text-[#E31B23] uppercase">
              CUSTOM CONTRACT MANUFACTURING
            </span>
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
              Need Custom OEM Sizing for {category.title} {category.highlight}?
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

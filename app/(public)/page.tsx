import { HeroSection } from '@/src/components/public/HeroSection'
import { AboutSection } from '@/src/components/public/AboutSection'
import { StatsSection } from '@/src/components/public/StatsSection'
import { SolutionsSection } from '@/src/components/public/SolutionsSection'
import { QualityTrustSection } from '@/src/components/public/QualityTrustSection'
import { QualityPillarsSection } from '@/src/components/public/QualityPillarsSection'
import { PrecisionHealthcareSection } from '@/src/components/public/PrecisionHealthcareSection'
import { ProcessAcrossSection } from '@/src/components/public/ProcessAcrossSection'
import { ComplianceVideoSection } from '@/src/components/public/ComplianceVideoSection'
import { LatestBlogsSection } from '@/src/components/public/LatestBlogsSection'
import { fetchPublicHeroSlides } from '@/app/actions/public'

export const revalidate = 60

export default async function HomePage() {
  const slides = await fetchPublicHeroSlides()

  return (
    <div className="pb-4 sm:pb-8 space-y-0">
      {/* 1. Dynamic Multi-Image Hero Section Slider */}
      <HeroSection slides={slides && slides.length > 0 ? slides : undefined} />

      {/* 2. About Us Section */}
      <AboutSection />

      {/* 3. Company Key Statistics Counter Section */}
      <StatsSection />

      {/* 4. Comprehensive Surgical & Medical Instrument Solutions Grid */}
      <SolutionsSection />

      {/* 5. Quality You Can Trust Feature Grid */}
      <QualityTrustSection />

      {/* 6. Delivering Confidence Through Quality 2-Column Section */}
      <QualityPillarsSection />

      {/* 7. Precision Solutions. Trusted Quality. Better Healthcare Banner */}
      <PrecisionHealthcareSection />

      {/* 8. How We Process Across Department Showcase */}
      <ProcessAcrossSection />

      {/* 9. Compliance & Certifications Video Showcase */}
      <ComplianceVideoSection />

      {/* 10. Insights From Our Latest Blogs Section */}
      <LatestBlogsSection limit={2} />
    </div>
  )
}

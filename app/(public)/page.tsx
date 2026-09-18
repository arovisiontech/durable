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

export const revalidate = 60

export default function HomePage() {
  return (
    <div className="pb-4 sm:pb-8 space-y-0">
      {/* 1. Hero Section (Untouched - Same as original) */}
      <HeroSection />

      {/* 2. About Us Section (Compact length) */}
      <AboutSection />

      {/* 3. Company Key Statistics Counter Section (Compact length) */}
      <StatsSection />

      {/* 4. Comprehensive Surgical & Medical Instrument Solutions Grid (Compact length) */}
      <SolutionsSection />

      {/* 5. Quality You Can Trust Feature Grid (Compact length) */}
      <QualityTrustSection />

      {/* 6. Delivering Confidence Through Quality 2-Column Section (Compact length) */}
      <QualityPillarsSection />

      {/* 7. Precision Solutions. Trusted Quality. Better Healthcare Banner (Compact length) */}
      <PrecisionHealthcareSection />

      {/* 8. How We Process Across Department Showcase (Compact length) */}
      <ProcessAcrossSection />

      {/* 9. Compliance & Certifications Video Showcase (Compact length) */}
      <ComplianceVideoSection />

      {/* 10. Insights From Our Latest Blogs Section (Compact length) */}
      <LatestBlogsSection limit={2} />
    </div>
  )
}


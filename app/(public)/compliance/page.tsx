import { CategoryHeroBanner } from '@/src/components/public/CategoryHeroBanner'
import { ComplianceVideoSection } from '@/src/components/public/ComplianceVideoSection'
import { QualityPillarsSection } from '@/src/components/public/QualityPillarsSection'
import { ShieldCheck, Award, FileCheck, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Regulatory & CE MDR Compliance | Durable Hospital Supplies',
  description:
    'Full international regulatory compliance including CE MDR EU 2017/745, ISO 13485:2016 quality management, US FDA device registration, and bio-compatibility certification.',
}

export const revalidate = 60

export default function CompliancePage() {
  const complianceCertificates = [
    {
      code: 'ISO 13485:2016',
      title: 'Medical Devices Quality Management System',
      detail:
        'Audited and certified by TÜV NORD / BSI for precision manufacturing, traceability, cleanroom packaging, and risk management compliance.',
    },
    {
      code: 'CE MDR EU 2017/745',
      title: 'European Medical Device Regulation',
      detail:
        'Full Technical File documentation, UDI barcode identification, and clinical evaluation compliance for Class I & Class IIa surgical instruments.',
    },
    {
      code: 'US FDA 21 CFR 820',
      title: 'US FDA Quality System Regulation (QSR)',
      detail:
        'Registered medical device establishment with complete device history records (DHR) and biocompatibility safety clearance.',
    },
    {
      code: 'ASTM F899 & DIN EN ISO 7153-1',
      title: 'Surgical Grade Stainless Steel Alloys',
      detail:
        'Constructed exclusively from AISI 410, 420, 316L, and German Tungsten Carbide inserts for high corrosion resistance and autoclave endurance.',
    },
  ]

  return (
    <div className="w-full bg-white min-h-screen">
      <CategoryHeroBanner
        title="REGULATORY &"
        highlight="COMPLIANCE"
        badgeText="GLOBAL CERTIFICATION"
        description="Certified according to international medical standards including ISO 13485, CE MDR, US FDA QSR, and ASTM stainless steel guidelines."
      />

      <QualityPillarsSection />
      
      <section className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                VERIFIED REGULATORY ACCREDITATION
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0B1B3D] tracking-tight uppercase">
              INTERNATIONAL <span className="text-[#E31B23]">CERTIFICATIONS</span> & AUDITS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complianceCertificates.map((cert, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-slate-900 text-white font-mono text-xs font-bold rounded-lg">
                    {cert.code}
                  </span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-lg font-black text-[#0B1B3D]">{cert.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{cert.detail}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      <ComplianceVideoSection />
    </div>
  )
}

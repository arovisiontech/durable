import { CategoryHeroBanner } from '@/src/components/public/CategoryHeroBanner'
import { ShieldCheck, Heart, Leaf, Users, Award, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Corporate Social Responsibility (CSR) | Durable Hospital Supplies',
  description:
    'Our commitment to ethical manufacturing, zero child labor, green environmental practices, fair worker welfare, and healthcare community support.',
}

export const revalidate = 60

export default function CSRPage() {
  const csrPillars = [
    {
      icon: ShieldCheck,
      title: 'Ethical & Fair Labor Practices',
      description:
        'Strict zero-tolerance policy against child labor and forced labor. We guarantee safe working environments, fair living wages, and comprehensive healthcare benefits for all our craftsmen and technicians.',
    },
    {
      icon: Leaf,
      title: 'Environmental Sustainability',
      description:
        'Implementing eco-friendly passivation processes, water recycling systems, energy-efficient forging plants, and zero-waste packaging to reduce carbon emissions across our supply chain.',
    },
    {
      icon: Heart,
      title: 'Global Healthcare Support',
      description:
        'Donating essential surgical instrument sets and sterile hollowware containers to humanitarian medical missions, emergency disaster relief, and rural healthcare clinics in developing regions.',
    },
    {
      icon: Users,
      title: 'Community Empowerment & Training',
      description:
        'Investing in local technical training academies to upskill young artisans in computer-aided design (CAD), CNC machining, and bio-compatible metallurgy standards.',
    },
  ]

  return (
    <div className="w-full bg-white min-h-screen">
      <CategoryHeroBanner
        title="CORPORATE SOCIAL"
        highlight="RESPONSIBILITY"
        badgeText="SUSTAINABILITY & ETHICS"
        description="Building a better future through ethical manufacturing, social welfare, zero child labor policies, and eco-friendly production practices."
      />

      <section className="py-14 sm:py-20 bg-slate-50/50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header Block */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 shadow-xs">
              <Award className="w-3.5 h-3.5 text-[#E31B23]" />
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                ETHICAL MANUFACTURING STANDARDS
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0B1B3D] tracking-tight uppercase">
              RESPONSIBLE MANUFACTURING & <span className="text-[#E31B23]">COMMUNITY IMPACT</span>
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
              At Durable Hospital Supplies, corporate responsibility is at the core of our business model. We ensure every instrument is forged under ethical conditions that honor human dignity and environmental health.
            </p>
          </div>

          {/* 4 Pillars Grid with 4-Side Glow Border */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {csrPillars.map((pillar, index) => {
              const Icon = pillar.icon
              return (
                <div key={index} className="group relative rounded-2xl">
                  {/* 4-Side Glow */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#E31B23]/30 via-[#3B82F6]/30 to-[#E31B23]/30 rounded-2xl blur-md opacity-40 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative p-[2px] rounded-2xl overflow-hidden bg-slate-200 group-hover:shadow-xl transition-all duration-500 h-full">
                    <div className="relative z-10 bg-white rounded-[14px] p-7 sm:p-8 h-full space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-[#E31B23] transition-colors">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-black text-[#0B1B3D] leading-snug">
                        {pillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {pillar.description}
                      </p>
                      <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verified Compliance Standard</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </section>
    </div>
  )
}

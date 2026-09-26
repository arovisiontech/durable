'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export interface StrengthCard {
  id: string
  title: string
  description: string
  image_url: string
}

export interface InHouseSectionData {
  title: string
  description: string
  image_url: string
}

export interface EoSterilizationData {
  title: string
  description: string
  image_url: string
}

export interface PartnerConnectData {
  title: string
  description: string
  button_text: string
  button_link: string
  image_url: string
}

export interface ContinuousImprovementData {
  title: string
  description: string
  image_url: string
}

export interface CsrData {
  title: string
  description: string
  image_url: string
}

export interface FaqsBannerData {
  title: string
  description: string
  button_text: string
  button_link: string
  image_url: string
}

export interface CustomBlock {
  id: string
  title: string
  subheading?: string
  description: string
  image_url?: string
}

export interface StrengthsPageData {
  introText: string
  feature: {
    title: string
    subheading?: string
    description: string
    image_url: string
  }
  cardsGrid1: StrengthCard[]
  inHouse: InHouseSectionData
  cardsGrid2: StrengthCard[]
  eoSterilization: EoSterilizationData
  partnerConnect: PartnerConnectData
  continuousImprovement: ContinuousImprovementData
  csr: CsrData
  faqsBanner: FaqsBannerData
  customBlocks: CustomBlock[]
}

const DEFAULT_STRENGTHS_DATA: StrengthsPageData = {
  introText:
    'Durable Hospital Supplies is a vertically integrated OEM surgical instrument manufacturer and medical device supply chain partner based in Sialkot, Pakistan, working directly with surgical equipment suppliers, surgical instrument distributors and dental instruments suppliers across the US, EU & UK. From precision forging and CNC machining to EO sterilization and global distribution, every step of our manufacturing process is performed in-house. This gives our distributors, hospital procurement teams and private label healthcare brands complete confidence in quality, compliance and supply chain reliability.',
  feature: {
    title: 'Precision Driven Manufacturing',
    subheading: 'IN-HOUSE EXCELLENCE',
    description:
      'Everything begins with design. We meticulously plan and establish dimensions, tolerances, and metallurgical requirements before production even starts. Our state-of-the-art CNC machinery combined with skilled craftsmanship guarantees that every instrument conforms to exact specifications and international standards.',
    image_url: '/images/process-hand-filing.png',
  },
  cardsGrid1: [
    {
      id: 'card-team',
      title: 'Our Team',
      description:
        "Our team is the backbone of our success. We are a cohesive group of professionals, technicians, and engineers united by a shared goal: to create exceptional products. Their expertise, dedication, and collaboration are the driving force behind everything we achieve. Our team's passion for excellence is what sets us apart, making them the bloodline of our company and the key to our continued growth and success. We are more than a team; we are Durable family.",
      image_url: '/images/blog-instruments-tray.png',
    },
    {
      id: 'card-mastery',
      title: 'Passion for technical mastery',
      description:
        'We have a deep understanding of technicalities, standards, and compliance, and we thrive on challenges that push us to excel. Our ability to see the nuances and subtleties that distinguish a great instrument from a nominal one sets us apart. As technical people with a passion for manufacturing, we embrace the complexities of our industry. This passion is woven into our ethos and reflected in the precision and quality of our products.',
      image_url: '/images/process-wooden-anvil.png',
    },
  ],
  inHouse: {
    title: 'Our strength is being In-House',
    description:
      'We control every aspect of production, from crafting our own forging dies and forging units to machining, vacuum hardening, polishing, setting, finishing, coatings, and laser marking—all within our factory premises. Afterwards, we package the products in our cleanroom, sterilize them with EO, and ship them directly to our customers. Due to our in-house processes, we maintain strict quality control at every step and meet delivery deadlines with confidence. Additionally, we are committed to continually improving our processes and expanding our capacities to better serve our customers.',
    image_url: '/images/process-erp-operator.png',
  },
  cardsGrid2: [
    {
      id: 'card-cert',
      title: 'Certifications & Compliance',
      description:
        'Our instruments and manufacturing facilities are fully compliant with ISO 9001, ISO 13485, and SA 8000 standards. We are in process of getting our MDR and are equipped with an ISO Class 8 cleanroom and EO sterilization capabilities. Additionally, we hold FDA and a wide range of country-specific certifications to meet the diverse needs of our customers',
      image_url: '/images/process-traveler-card.png',
    },
    {
      id: 'card-quality',
      title: 'No Compromise on Quality',
      description:
        "Quality is non-negotiable. We adhere to the highest industry standards, ensuring that every instrument we produce is crafted with precision, reliability, and excellence. Our commitment to quality extends through every stage of the manufacturing process, from sourcing premium materials to implementing rigorous quality control checks.  For us, there is no compromise on quality—it's the foundation of our reputation and the trust our customers place in us.",
      image_url: '/images/blog-scissors-highres.png',
    },
    {
      id: 'card-capacity',
      title: 'Scalability & Capacity',
      description:
        'Scalability and capacity are at the heart of our operations. With the ability to supply millions of pieces each month already, we are actively increasing our production capacities across all categories, including reusable, disposable, and sterile instruments. This ongoing expansion ensures that we not only meet the current demands of our customers but are also well-positioned to scale further as market needs evolve.',
      image_url: '/images/cat-forceps-clamps.png',
    },
    {
      id: 'card-erp',
      title: 'Oracle ERP',
      description:
        'One of our greatest strengths is our robust ERP system. It enables us to effectively manage customer requirements, handle high business volumes, and oversee diverse operations and compliance with ease. Manufacturing at this scale would be impossible without accurate, real-time information, and Oracle ERP empowers us to achieve this seamlessly',
      image_url: '/images/durable-building.png',
    },
  ],
  eoSterilization: {
    title: 'EO & Sterilization',
    description:
      'At Durable Hospital Supplies, one of our core strengths lies in our comprehensive sterilization solutions, which include Ethylene Oxide (EO) Sterilization within our ISO Class 7 Clean Room facility. This ensures that our instruments meet the highest safety and hygiene standards. Additionally, we specialize in a variety of packaging solutions, including blister packs and Tyvek pouches, tailored to our customers’ needs. By offering sterile instruments in various packaging formats, we help our clients save both time and costs, ensuring ready-to-use products. All of our processes are certified, guaranteeing quality and compliance at every step of production.',
    image_url: '/images/about-surgical-instruments.png',
  },
  partnerConnect: {
    title: 'Partner Connect Portal',
    description:
      'In the fast-moving surgical landscape, real-time data is as critical as the precision of the instruments themselves. Building on our robust digital infrastructure, we have launched the Partner Connect Portal, giving our distributors direct, secure access to a dedicated segment of our Oracle ERP. This proactive transparency allows partners to independently monitor vital KPIs, track current and past orders, check live inventory, and access technical drawings instantly. By digitizing the flow of information, we ensure our partners stay agile, informed, and equipped to lead in their respective markets.',
    button_text: 'Explore Partner Connect Portal',
    button_link: '/contact',
    image_url: '/images/process-erp-operator.png',
  },
  continuousImprovement: {
    title: 'Continuous Improvement Mindset',
    description:
      'We are constantly optimizing, training, and staying at the forefront of the latest technologies. By embracing advancements and taking calculated risks, we ensure that we stay ahead of the curve. Change is not something we resist—it’s something we welcome and turn to our advantage. This mindset of continuous improvement allows us to refine our processes and deliver better results, always pushing the boundaries of what’s possible in our industry.',
    image_url: '/images/company-stats-banner.png',
  },
  csr: {
    title: 'Corporate Social Responsibility',
    description:
      'At Durable Hospital Supplies, corporate social responsibility is at the heart of what we do. We proudly manage Roshni Homes, an orphanage that provides a nurturing environment for children. In addition, we actively support our local community through health and education sponsorships, ensuring opportunities for growth and well-being. Our efforts also include providing clean drinking water in underserved areas, reinforcing our commitment to making a positive impact. Through these & more initiatives like this, we are dedicated to giving back and creating lasting change in the communities where we live.',
    image_url: '/images/durable-building.jpg',
  },
  faqsBanner: {
    title: 'Why Choose Durable Hospital Supplies as Your OEM Surgical Instrument Manufacturer?',
    description:
      'Explore the most frequently asked questions from distributors, hospitals and healthcare brands before they partnered with Durable Hospital Supplies. Learn how our OEM manufacturing capabilities, ISO 13485 certification, in-house sterilization and global supply chain can support your business.',
    button_text: 'Explore FAQs',
    button_link: '/faqs',
    image_url: '/images/surgical-hero.jpg',
  },
  customBlocks: [],
}

export function StrengthsSection() {
  const [data, setData] = useState<StrengthsPageData>(DEFAULT_STRENGTHS_DATA)

  const loadData = () => {
    try {
      const saved = localStorage.getItem('durable_strengths_data')
      if (saved) {
        const parsed = JSON.parse(saved)
        setData((prev) => ({
          introText: parsed.introText ?? prev.introText,
          feature: { ...prev.feature, ...(parsed.feature || {}) },
          cardsGrid1: Array.isArray(parsed.cardsGrid1)
            ? parsed.cardsGrid1
            : Array.isArray(parsed.cards)
            ? parsed.cards
            : prev.cardsGrid1,
          inHouse: { ...prev.inHouse, ...(parsed.inHouse || {}) },
          cardsGrid2: Array.isArray(parsed.cardsGrid2) ? parsed.cardsGrid2 : prev.cardsGrid2,
          eoSterilization: { ...prev.eoSterilization, ...(parsed.eoSterilization || {}) },
          partnerConnect: { ...prev.partnerConnect, ...(parsed.partnerConnect || {}) },
          continuousImprovement: { ...prev.continuousImprovement, ...(parsed.continuousImprovement || {}) },
          csr: { ...prev.csr, ...(parsed.csr || {}) },
          faqsBanner: { ...prev.faqsBanner, ...(parsed.faqsBanner || {}) },
          customBlocks: Array.isArray(parsed.customBlocks) ? parsed.customBlocks : prev.customBlocks,
        }))
      }
    } catch (e) {
      console.error('Error loading strengths data from localStorage:', e)
    }
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('durable_content_updated', handleUpdate)
    return () => window.removeEventListener('durable_content_updated', handleUpdate)
  }, [])

  return (
    <div className="w-full bg-[#EAE8E3]/60 py-10 sm:py-16 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* SECTION 1: Intro Overview Paragraph matching SS 2 */}
        {data.introText && (
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-base sm:text-lg lg:text-xl font-normal text-slate-800 leading-relaxed text-left sm:text-center">
              {data.introText}
            </p>
          </div>
        )}

        {/* SECTION 2: Feature Block 1 ("Precision Driven Manufacturing") - items-start & compact image */}
        {data.feature && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200/80 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 items-start gap-8">
              
              {/* Image Column */}
              <div className="md:col-span-5 relative h-[300px] sm:h-[360px] md:h-[400px] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.feature.image_url || '/images/process-hand-filing.png'}
                  alt={data.feature.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Column - Starts aligned with top row of image */}
              <div className="md:col-span-7 space-y-4 pt-1">
                {data.feature.subheading && (
                  <span className="text-xs font-black uppercase tracking-widest text-[#E31B23]">
                    {data.feature.subheading}
                  </span>
                )}
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0B1B3D] tracking-tight leading-tight">
                  {data.feature.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                  {data.feature.description}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* SECTION 3: Cards Grid 1 ("Our Team" & "Passion for technical mastery") matching SS 3 */}
        {data.cardsGrid1 && data.cardsGrid1.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {data.cardsGrid1.map((card) => (
              <div key={card.id} className="space-y-4 flex flex-col h-full">
                
                {/* Card Top Image Block matching SS 3 */}
                <div className="relative h-60 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-200 border border-slate-200 shadow-xs group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image_url || '/images/blog-instruments-tray.png'}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Card Title & Content matching SS 4 */}
                <div className="space-y-3 pt-2 flex-1">
                  <h3 className="text-xl sm:text-2xl font-black text-[#0B1B3D] tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-normal text-slate-700 leading-relaxed">
                    {card.description}
                  </p>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* SECTION 4: In-House Section ("Our strength is being In-House") matching SS 4 */}
        {data.inHouse && (
          <div className="space-y-6 pt-4">
            {/* Top Factory Image with Controlled Height */}
            <div className="relative h-64 sm:h-80 md:h-[400px] w-full rounded-2xl overflow-hidden bg-slate-200 border border-slate-200 shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.inHouse.image_url || '/images/process-erp-operator.png'}
                alt={data.inHouse.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title & Description matching SS 4 */}
            <div className="space-y-3 pt-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1B3D] tracking-tight">
                {data.inHouse.title}
              </h2>
              <p className="text-xs sm:text-sm lg:text-base font-normal text-slate-700 leading-relaxed">
                {data.inHouse.description}
              </p>
            </div>
          </div>
        )}

        {/* SECTION 5: 2x2 Grid of 4 Cards (Certifications, Quality, Capacity, Oracle ERP) matching SS 5 */}
        {data.cardsGrid2 && data.cardsGrid2.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {data.cardsGrid2.map((card) => (
                <div key={card.id} className="space-y-4 flex flex-col h-full">
                  
                  {/* Card Image Box */}
                  <div className="relative h-56 sm:h-64 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.image_url || '/images/process-traveler-card.png'}
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Card Text Content */}
                  <div className="space-y-2 pt-1 flex-1">
                    <h3 className="text-xl sm:text-2xl font-black text-[#0B1B3D] tracking-tight">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-normal text-slate-700 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 6: EO & Sterilization (SS 1) - items-start & aligned with top of image */}
        {data.eoSterilization && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200/80 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 items-start gap-8">
              
              {/* Left Image Column (SS 1) - Compact controlled height */}
              <div className="md:col-span-5 relative h-[300px] sm:h-[360px] md:h-[400px] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.eoSterilization.image_url || '/images/about-surgical-instruments.png'}
                  alt={data.eoSterilization.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right Text Column (SS 1) - Starts aligned from top of image row */}
              <div className="md:col-span-7 space-y-4 pt-1">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1B3D] tracking-tight leading-tight">
                  {data.eoSterilization.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-700 font-normal leading-relaxed">
                  {data.eoSterilization.description}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* SECTION 7: Partner Connect Portal (SS 2) - items-start & aligned with top of image */}
        {data.partnerConnect && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200/80 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 items-start gap-8">
              
              {/* Left Text & CTA Column (SS 2) - Starts aligned with top of image */}
              <div className="md:col-span-7 space-y-6 pt-1">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1B3D] tracking-tight leading-tight">
                  {data.partnerConnect.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-700 font-normal leading-relaxed">
                  {data.partnerConnect.description}
                </p>
                {data.partnerConnect.button_text && (
                  <div>
                    <Link
                      href={data.partnerConnect.button_link || '/contact'}
                      className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-[#1A2542] hover:bg-[#0B1B3D] text-white text-xs sm:text-sm font-extrabold tracking-wider transition-colors shadow-md"
                    >
                      {data.partnerConnect.button_text}
                    </Link>
                  </div>
                )}
              </div>

              {/* Right Image Column (SS 2) - Compact controlled height */}
              <div className="md:col-span-5 relative h-[300px] sm:h-[360px] md:h-[400px] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.partnerConnect.image_url || '/images/process-erp-operator.png'}
                  alt={data.partnerConnect.title}
                  className="w-full h-full object-cover"
                />
              </div>

            </div>
          </div>
        )}

        {/* SECTION 8: Continuous Improvement Mindset matching SS 3 */}
        {data.continuousImprovement && (
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs space-y-8 p-6 sm:p-10">
            {/* Top Banner Image (SS 3) - Controlled Height */}
            <div className="relative h-60 sm:h-72 md:h-[360px] w-full rounded-2xl overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.continuousImprovement.image_url || '/images/company-stats-banner.png'}
                alt={data.continuousImprovement.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom Centered Title & Description (SS 3) */}
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <h2 className="text-2xl sm:text-4xl font-black text-[#0B1B3D] tracking-tight">
                {data.continuousImprovement.title}
              </h2>
              <p className="text-xs sm:text-sm lg:text-base font-normal text-slate-700 leading-relaxed">
                {data.continuousImprovement.description}
              </p>
            </div>
          </div>
        )}

        {/* SECTION 9: Corporate Social Responsibility (SS 4) - items-start & aligned with top of image */}
        {data.csr && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200/80 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 items-start gap-8">
              
              {/* Left Text Column (SS 4) - Starts aligned from top of image row */}
              <div className="md:col-span-7 space-y-4 pt-1">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1B3D] tracking-tight leading-tight">
                  {data.csr.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-700 font-normal leading-relaxed">
                  {data.csr.description}
                </p>
              </div>

              {/* Right Vertical Image Column (SS 4) - Compact controlled height */}
              <div className="md:col-span-5 relative h-[300px] sm:h-[360px] md:h-[400px] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.csr.image_url || '/images/durable-building.jpg'}
                  alt={data.csr.title}
                  className="w-full h-full object-cover"
                />
              </div>

            </div>
          </div>
        )}

        {/* SECTION 10: Explore FAQs Banner matching SS 5 */}
        {data.faqsBanner && (
          <div className="relative w-full rounded-3xl overflow-hidden min-h-[360px] sm:min-h-[400px] flex items-center justify-center p-6 sm:p-12 border border-slate-300/80 shadow-lg">
            {/* Background Hallway Image (SS 5) */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
              style={{ backgroundImage: `url('${data.faqsBanner.image_url || '/images/surgical-hero.jpg'}')` }}
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] z-10" />

            {/* Centered Overlay Glassmorphism Box (SS 5) */}
            <div className="relative z-20 max-w-3xl w-full bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-10 text-center space-y-6 shadow-2xl border border-white/60">
              <h2 className="text-2xl sm:text-4xl font-black text-[#0B1B3D] tracking-tight leading-tight">
                {data.faqsBanner.title}
              </h2>
              <p className="text-xs sm:text-sm lg:text-base font-normal text-slate-700 leading-relaxed max-w-2xl mx-auto">
                {data.faqsBanner.description}
              </p>
              {data.faqsBanner.button_text && (
                <div>
                  <Link
                    href={data.faqsBanner.button_link || '/faqs'}
                    className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-[#1A2542] hover:bg-[#0B1B3D] text-white text-xs sm:text-sm font-extrabold tracking-wider uppercase transition-colors shadow-md"
                  >
                    {data.faqsBanner.button_text}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION 11: Additional Custom Content Blocks */}
        {data.customBlocks && data.customBlocks.length > 0 && (
          <div className="space-y-10 pt-4 border-t border-slate-300/60">
            {data.customBlocks.map((block) => (
              <div
                key={block.id}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4"
              >
                {block.subheading && (
                  <span className="text-xs font-bold uppercase tracking-wider text-[#E31B23]">
                    {block.subheading}
                  </span>
                )}
                <h3 className="text-xl sm:text-3xl font-black text-[#0B1B3D]">
                  {block.title}
                </h3>
                {block.image_url && (
                  <div className="relative h-60 sm:h-80 w-full rounded-xl overflow-hidden my-4 bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={block.image_url}
                      alt={block.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  {block.description}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

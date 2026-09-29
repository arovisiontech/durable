'use client'

import { useState, useEffect } from 'react'

export function DentalProcedureBannerSection() {
  const [bannerUrl, setBannerUrl] = useState('/images/dental-clinic-banner.png')

  const loadData = () => {
    try {
      const saved = localStorage.getItem('durable_dental_clinic_banner')
      if (saved) {
        setBannerUrl(saved)
      }
    } catch (e) {
      console.error('LocalStorage DentalProcedureBanner read error:', e)
    }
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('durable_content_updated', handleUpdate)
    return () => window.removeEventListener('durable_content_updated', handleUpdate)
  }, [])

  return (
    <section className="w-full bg-white py-6 sm:py-10 border-b border-slate-200 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full aspect-[21/6] sm:aspect-[21/5.5] lg:aspect-[21/5] rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-100 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bannerUrl || '/images/dental-clinic-banner.png'}
            alt="Durable Hospital Supplies Dental & Precision Surgical Instruments In Use"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
          />
        </div>
      </div>
    </section>
  )
}


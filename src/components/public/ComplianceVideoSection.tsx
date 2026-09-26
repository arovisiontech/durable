'use client'

import { useState, useRef, useEffect } from 'react'

const DEFAULT_VIDEO = {
  badge: 'COMPLIANCE AND CERTIFICATIONS',
  title: 'Committed To Global Standards',
  description: 'Durable Hospital Supplies Operates In Full Compliance With Internationally Recognized Medical Device Regulations And Quality Management Standards. Our Surgical, Dental, And Medical Instruments Are Manufactured, Inspected, And Validated To Meet Global Healthcare Markets Requirements.',
  videoUrl: 'https://vimeo.com/1230520070?fl=ip&fe=ec',
  thumbnailImage: '/images/company-stats-banner.png',
}

function getVimeoEmbedUrl(url: string, autoplay = true) {
  if (!url) return null
  const reg = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/
  const match = url.match(reg)
  if (match && match[1]) {
    const id = match[1]
    return `https://player.vimeo.com/video/${id}?autoplay=${autoplay ? 1 : 0}&autopause=0&badge=0&byline=0&title=0&portrait=0`
  }
  return null
}

export function ComplianceVideoSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoData, setVideoData] = useState(DEFAULT_VIDEO)
  const videoRef = useRef<HTMLVideoElement>(null)

  const loadData = () => {
    try {
      const saved = localStorage.getItem('durable_video_data')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed === 'object') {
          // If videoUrl was old default MP4, update to new Vimeo link
          if (!parsed.videoUrl || parsed.videoUrl === '/videos/0609.mp4') {
            parsed.videoUrl = 'https://vimeo.com/1230520070?fl=ip&fe=ec'
          }
          setVideoData((prev) => ({ ...prev, ...parsed }))
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('durable_content_updated', handleUpdate)
    return () => window.removeEventListener('durable_content_updated', handleUpdate)
  }, [])

  const vimeoEmbedUrl = getVimeoEmbedUrl(videoData.videoUrl, true)

  const handlePlayPause = () => {
    if (vimeoEmbedUrl) {
      setIsPlaying(true)
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  return (
    <section className="w-full bg-[#0F233A] text-white py-8 sm:py-10 relative overflow-hidden">
      {/* 100% Full Screen Edge-to-Edge Video Showcase */}
      <div className="w-full relative shadow-2xl bg-slate-950 overflow-hidden h-[280px] sm:h-[400px] lg:h-[520px] group">
        {vimeoEmbedUrl ? (
          isPlaying ? (
            <div className="w-full h-full relative">
              <iframe
                src={vimeoEmbedUrl}
                className="w-full h-full border-0 block"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Durable Compliance & Manufacturing Video"
              />
              <button
                onClick={() => setIsPlaying(false)}
                className="absolute top-3 right-3 z-30 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-full backdrop-blur-xs border border-white/20 transition-all text-xs font-bold"
                aria-label="Close Video"
              >
                ✕ Close
              </button>
            </div>
          ) : (
            <div className="w-full h-full relative bg-slate-950 flex items-center justify-center">
              {/* Background Poster Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={videoData.thumbnailImage || '/images/company-stats-banner.png'}
                alt="Video Thumbnail"
                className="w-full h-full object-cover opacity-60"
              />

              {/* Overlapping Red Pill Badge on Bottom Right of Video */}
              <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-6 lg:right-10 z-20 pointer-events-none">
                <div className="inline-flex items-center gap-1.5 bg-[#E31B23] text-white text-[9px] sm:text-xs font-black tracking-widest uppercase px-3.5 py-1.5 rounded-full shadow-xl">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  {videoData.badge || 'COMPLIANCE AND CERTIFICATIONS'}
                </div>
              </div>

              {/* Center Play Button Overlay */}
              <div
                onClick={handlePlayPause}
                className="absolute inset-0 bg-slate-950/30 flex items-center justify-center cursor-pointer transition-all duration-300 group-hover:bg-slate-950/20 z-10"
              >
                <button
                  aria-label="Play Video"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/25 hover:bg-white/40 backdrop-blur-md border-2 border-white flex items-center justify-center shadow-xl transition-all duration-300 transform group-hover:scale-110"
                >
                  <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white flex items-center justify-center shadow-md">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-6 h-6 sm:w-8 sm:h-8 text-[#0F233A] ml-1"
                    >
                      <path d="M8 5v14l11-7z" fill="currentColor" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          )
        ) : (
          <>
            <video
              ref={videoRef}
              src={videoData.videoUrl || 'https://vimeo.com/1230520070?fl=ip&fe=ec'}
              className="w-full h-full object-cover min-w-full min-h-full block"
              style={{ objectFit: 'cover' }}
              controls={isPlaying}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Overlapping Red Pill Badge on Bottom Right of Video */}
            {!isPlaying && (
              <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-6 lg:right-10 z-20 pointer-events-none">
                <div className="inline-flex items-center gap-1.5 bg-[#E31B23] text-white text-[9px] sm:text-xs font-black tracking-widest uppercase px-3.5 py-1.5 rounded-full shadow-xl">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  {videoData.badge || 'COMPLIANCE AND CERTIFICATIONS'}
                </div>
              </div>
            )}

            {/* Center Play Button Overlay */}
            {!isPlaying && (
              <div
                onClick={handlePlayPause}
                className="absolute inset-0 bg-slate-950/30 flex items-center justify-center cursor-pointer transition-all duration-300 group-hover:bg-slate-950/20"
              >
                <button
                  aria-label="Play Video"
                  className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-white/25 hover:bg-white/40 backdrop-blur-md border-2 border-white flex items-center justify-center shadow-xl transition-all duration-300 transform group-hover:scale-110"
                >
                  <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-full bg-white flex items-center justify-center shadow-md">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-5 h-5 sm:w-7 sm:h-7 text-[#0F233A] ml-1"
                    >
                      <path d="M8 5v14l11-7z" fill="currentColor" />
                    </svg>
                  </div>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Content & Global Compliance Badges */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 sm:space-y-8 pt-6 sm:pt-8">
        {/* Text Row: Left Title + Right Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
          <div className="lg:col-span-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              {videoData.title || 'Committed To Global Standards'}
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="text-xs font-semibold text-slate-300 leading-relaxed">
              {videoData.description}
            </p>
          </div>
        </div>

        {/* Compliance & Quality Logo Row */}
        <div className="pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-4 sm:gap-6 opacity-90">
          {/* Logo 1: SCCI Sialkot Chamber */}
          <div className="h-8 sm:h-10 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/icon-scci-white.png"
              alt="SCCI Sialkot Chamber"
              className="h-full object-contain filter brightness-0 invert"
            />
          </div>

          {/* Logo 2: ISO 9001:2015 */}
          <div className="h-8 sm:h-10 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/icon-iso.png"
              alt="ISO 9001:2015"
              className="h-full object-contain filter brightness-0 invert"
            />
          </div>

          {/* Logo 3: ISO 13485:2016 */}
          <div className="h-8 sm:h-10 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/icon-iso-13485-white.png"
              alt="ISO 13485:2016"
              className="h-full object-contain filter brightness-0 invert"
            />
          </div>

          {/* Logo 4: SIMA Pakistan */}
          <div className="h-8 sm:h-10 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/icon-sima-scci.png"
              alt="SIMA Surgical Instrument Manufacturers Association"
              className="h-full object-contain filter brightness-0 invert"
            />
          </div>

          {/* Logo 5: CE Mark */}
          <div className="h-8 sm:h-9 flex items-center justify-center font-black text-xl tracking-widest text-white border-2 border-white px-2.5 rounded-md">
            CE
          </div>

          {/* Logo 6: FDA Registered */}
          <div className="h-8 sm:h-9 flex items-center justify-center font-black text-xl tracking-tighter text-white border-2 border-white px-2.5 rounded-md">
            FDA
          </div>

          {/* Logo 7: EU-MDR Ready */}
          <div className="h-8 sm:h-10 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/icon-eumdr.png"
              alt="EU-MDR Ready"
              className="h-full object-contain filter brightness-0 invert"
            />
          </div>
        </div>
      </div>
    </section>
  )
}


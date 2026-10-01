'use client'

import { useState, useRef, useEffect } from 'react'

const DEFAULT_VIDEO = {
  badge: 'COMPLIANCE AND CERTIFICATIONS',
  title: 'Committed To Global Standards',
  description:
    'Durable Hospital Supplies Operates In Full Compliance With Internationally Recognized Medical Device Regulations And Quality Management Standards. Our Surgical, Dental, And Medical Instruments Are Manufactured, Inspected, And Validated To Meet Global Healthcare Markets Requirements.',
  videoUrl: 'https://vimeo.com/1230520070?fl=ip&fe=ec',
  thumbnailImage: '',
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
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [videoData, setVideoData] = useState(DEFAULT_VIDEO)
  const videoRef = useRef<HTMLVideoElement>(null)

  const loadData = () => {
    try {
      const saved = localStorage.getItem('durable_video_data')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed === 'object') {
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

  const hasCustomThumbnail =
    videoData.thumbnailImage &&
    videoData.thumbnailImage !== '/images/company-stats-banner.png' &&
    videoData.thumbnailImage.trim() !== ''

  const vimeoEmbedUrlDirect = getVimeoEmbedUrl(videoData.videoUrl, false)
  const vimeoEmbedUrlAutoplay = getVimeoEmbedUrl(videoData.videoUrl, true)

  const handlePlayPause = () => {
    setIsPlaying(true)
    setIsFullScreen(true)
  }

  return (
    <section className="w-full bg-[#0F233A] text-white py-6 sm:py-10 relative overflow-hidden">
      {/* 100% Responsive Edge-to-Edge Clean Video Showcase Container */}
      <div className="w-full relative shadow-2xl bg-slate-950 overflow-hidden aspect-video min-h-[340px] sm:min-h-[500px] lg:min-h-[680px] 2xl:min-h-[850px] 4xl:min-h-[1200px] group">
        {vimeoEmbedUrlDirect ? (
          hasCustomThumbnail && !isPlaying ? (
            <div className="w-full h-full relative bg-slate-950 flex items-center justify-center">
              {/* Custom Poster Image if user explicitly uploaded one */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={videoData.thumbnailImage}
                alt="Video Thumbnail"
                className="w-full h-full object-cover"
              />

              {/* Center Play Button Overlay */}
              <div
                onClick={handlePlayPause}
                className="absolute inset-0 bg-slate-950/20 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group-hover:bg-slate-950/10 z-10 space-y-4"
              >
                <button
                  aria-label="Play Video"
                  className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-red-600/90 hover:bg-red-600 backdrop-blur-md border-4 border-white flex items-center justify-center shadow-2xl transition-all duration-300 transform group-hover:scale-110"
                >
                  <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-white flex items-center justify-center shadow-inner">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-8 h-8 sm:w-10 sm:h-10 text-[#E31B23] ml-1"
                    >
                      <path d="M8 5v14l11-7z" fill="currentColor" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full h-full relative">
              <iframe
                src={isPlaying ? vimeoEmbedUrlAutoplay! : vimeoEmbedUrlDirect}
                className="w-full h-full border-0 block"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Durable Compliance & Manufacturing Video"
              />
            </div>
          )
        ) : (
          <div className="w-full h-full relative">
            <video
              ref={videoRef}
              src={videoData.videoUrl || 'https://vimeo.com/1230520070?fl=ip&fe=ec'}
              className="w-full h-full object-cover min-w-full min-h-full block"
              controls
              poster={hasCustomThumbnail ? videoData.thumbnailImage : undefined}
            />
          </div>
        )}
      </div>

      {/* ULTRA 100% FULLSCREEN RESPONSIVE MODAL FOR 24", 29", 64" MONITORS */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-0 sm:p-4 w-screen h-screen">
          <div className="relative w-full h-full max-w-[3840px] flex flex-col items-center justify-center bg-black">
            {/* Top Fullscreen Control Bar */}
            <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
              <button
                onClick={() => setIsFullScreen(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-2xl text-xs font-black shadow-2xl transition-all flex items-center gap-2 border border-white/20"
              >
                <span>✕ Exit Fullscreen</span>
              </button>
            </div>

            {vimeoEmbedUrlAutoplay ? (
              <iframe
                src={vimeoEmbedUrlAutoplay}
                className="w-full h-full border-0 block"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Durable Compliance Video Fullscreen"
              />
            ) : (
              <video
                src={videoData.videoUrl || 'https://vimeo.com/1230520070?fl=ip&fe=ec'}
                className="w-full h-full object-contain block"
                controls
                autoPlay
              />
            )}
          </div>
        </div>
      )}

      {/* Bottom Content & Global Compliance Badges */}
      <div className="max-w-[1920px] 3xl:max-w-[2400px] 4xl:max-w-[3200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 sm:space-y-8 pt-6 sm:pt-8">
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

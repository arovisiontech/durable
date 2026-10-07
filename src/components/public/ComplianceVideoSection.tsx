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

      {/* Bottom Content & Global Compliance Badges matching SS 2 */}
      <div className="max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 pt-8">
        {/* Text Row: Left Title + Right Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          <div className="lg:col-span-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {videoData.title || 'Committed To Global Standards'}
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="text-xs sm:text-sm font-semibold text-slate-300 leading-relaxed">
              {videoData.description}
            </p>
          </div>
        </div>

        {/* Compliance & Quality Logo Row matching SS 2 (7 Logos Distributed Evenly Across Screen) */}
        <div className="pt-8 sm:pt-10 border-t border-slate-700/60 grid grid-cols-3 sm:grid-cols-7 gap-4 sm:gap-6 lg:gap-8 items-center justify-items-center w-full">
          {/* Logo 1: SCCI Sialkot Chamber */}
          <div className="h-10 sm:h-14 lg:h-16 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/icon-scci-white.png"
              alt="SCCI Sialkot Chamber"
              className="h-full object-contain filter brightness-0 invert"
            />
          </div>

          {/* Logo 2: ISO 9001:2015 */}
          <div className="flex flex-col items-center justify-center text-white select-none">
            <svg className="w-8 h-8 sm:w-11 sm:h-11 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span className="text-xs sm:text-sm font-black tracking-wider uppercase mt-1 leading-none">ISO</span>
            <span className="text-[10px] sm:text-xs font-extrabold tracking-wider text-slate-300 leading-tight">9001:2015</span>
          </div>

          {/* Logo 3: ISO 13485:2016 */}
          <div className="flex flex-col items-center justify-center text-white select-none">
            <svg className="w-8 h-8 sm:w-11 sm:h-11 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span className="text-xs sm:text-sm font-black tracking-wider uppercase mt-1 leading-none">ISO</span>
            <span className="text-[10px] sm:text-xs font-extrabold tracking-wider text-slate-300 leading-tight">13485 : 2016</span>
          </div>

          {/* Logo 4: SIMA Pakistan */}
          <div className="h-10 sm:h-14 lg:h-16 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/icon-sima-scci.png"
              alt="SIMAP Surgical Instrument Manufacturers Association"
              className="h-full object-contain filter brightness-0 invert"
            />
          </div>

          {/* Logo 5: CE Mark (Large Bold Vector CE, No Box matching SS 2) */}
          <div className="h-10 sm:h-14 lg:h-16 flex items-center justify-center select-none text-white">
            <svg className="h-full w-auto text-white fill-current" viewBox="0 0 160 100">
              <path d="M50,10 C27.9,10 10,27.9 10,50 C10,72.1 27.9,90 50,90 C62.3,90 73.3,84.4 80.6,75.6 L68.8,63.8 C64.3,69.5 57.6,73.2 50,73.2 C37.2,73.2 26.8,62.8 26.8,50 C26.8,37.2 37.2,26.8 50,26.8 C57.6,26.8 64.3,30.5 68.8,36.2 L80.6,24.4 C73.3,15.6 62.3,10 50,10 Z" />
              <path d="M125,10 C104.5,10 87.4,24.4 82.5,43 L125,43 L125,57 L82.5,57 C87.4,75.6 104.5,90 125,90 C137.3,90 148.3,84.4 155.6,75.6 L143.8,63.8 C139.3,69.5 132.6,73.2 125,73.2 C113.8,73.2 104.4,65 101.5,54 L155,54 L155,46 L101.5,46 C104.4,35 113.8,26.8 125,26.8 C132.6,26.8 139.3,30.5 143.8,36.2 L155.6,24.4 C148.3,15.6 137.3,10 125,10 Z" />
            </svg>
          </div>

          {/* Logo 6: FDA Registered (Large Bold Vector FDA, No Box matching SS 2) */}
          <div className="h-10 sm:h-14 lg:h-16 flex items-center justify-center select-none text-white">
            <svg className="h-full w-auto text-white fill-current" viewBox="0 0 200 80">
              <path d="M15 15 H65 V27 H33 V40 H60 V52 H33 V75 H15 Z" />
              <path d="M75 15 H115 C132 15 145 28 145 45 C145 62 132 75 115 75 H75 Z M93 27 V63 H113 C123 63 127 55 127 45 C127 35 123 27 113 27 Z" />
              <path d="M165 15 L145 75 H163 L168 58 H187 L192 75 H210 L190 15 Z M172 45 L177.5 27 L183 45 Z" />
            </svg>
          </div>

          {/* Logo 7: EU-MDR Ready (Official Icon from SS 1) */}
          <div className="h-10 sm:h-14 lg:h-16 flex items-center justify-center">
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

'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { BLOGS_DATA, BlogItem } from '@/src/data/blogsData'

export type { BlogItem }
export { BLOGS_DATA }

interface LatestBlogsSectionProps {
  limit?: number
  showHeader?: boolean
}

export function LatestBlogsSection({ limit, showHeader = true }: LatestBlogsSectionProps) {
  const blogsToDisplay = limit ? BLOGS_DATA.slice(0, limit) : BLOGS_DATA

  return (
    <section className="w-full bg-[#FAFAFA] py-10 sm:py-14 relative overflow-hidden border-b border-slate-200">
      {/* Subtle Background Radial Pattern matching SS 1 */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#0B1B3D_1.5px,transparent_1.5px)] [background-size:20px_20px]" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-10">
        {/* Top Header Row matching SS 1 */}
        {showHeader && (
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200/60">
            {/* Left Title */}
            <div className="space-y-0.5">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0B1B3D]">
                Insights From Our
              </h3>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1B3D] tracking-tight">
                Latest Blogs
              </h2>
            </div>

            {/* Right Subtitle matching SS 1 */}
            <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed max-w-md">
              Stay Updated With The Latest Trends, Innovations, And Expert Insights In The Manufacturing And Industrial Sectors
            </p>
          </div>
        )}

        {/* 2-Column Blog Cards Grid matching SS 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          {blogsToDisplay.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="group block space-y-3.5"
            >
              {/* Featured Image Wrapper with Smooth Rounded Corners matching SS 1 */}
              <div className="relative rounded-2xl overflow-hidden shadow-xs group-hover:shadow-xl border border-slate-200 aspect-[16/10] transition-all duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Category Badge overlay on top left */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 bg-[#0B1B3D]/90 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm">
                    {blog.category}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Title & Arrow Button Row matching SS 1 */}
              <div className="flex items-start justify-between gap-4 pt-1 px-1">
                <div className="space-y-1 max-w-md">
                  <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>{blog.date}</span>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                  </div>
                  <h4 className="text-sm sm:text-base lg:text-lg font-black text-[#0B1B3D] group-hover:text-[#E31B23] transition-colors leading-snug">
                    {blog.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium pt-0.5">
                    {blog.excerpt}
                  </p>
                </div>

                {/* Dark Navy Circle/Rounded Button with Arrow matching SS 1 */}
                <div className="shrink-0 bg-[#0F2942] group-hover:bg-[#E31B23] text-white p-3 rounded-xl transition-colors shadow-sm flex items-center justify-center mt-1">
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

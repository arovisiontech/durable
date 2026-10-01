'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { BLOGS_DATA, BlogItem } from '@/src/data/blogsData'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'

interface BlogDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const resolvedParams = use(params)
  const [blog, setBlog] = useState<BlogItem | null>(null)
  const [allBlogs, setAllBlogs] = useState<BlogItem[]>(BLOGS_DATA)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      let currentBlogs = BLOGS_DATA
      const saved = localStorage.getItem('durable_blogs_list')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          currentBlogs = parsed
        }
      }
      setAllBlogs(currentBlogs)

      const found = currentBlogs.find(
        (b) => b.slug.toLowerCase() === resolvedParams.slug.toLowerCase()
      )
      if (found) {
        setBlog(found)
      } else {
        // Fallback: match by ID or first matching word
        const fallback = currentBlogs.find(
          (b) => b.id.toLowerCase() === resolvedParams.slug.toLowerCase()
        )
        if (fallback) setBlog(fallback)
        else setBlog(currentBlogs[0] || null)
      }
    } catch (e) {
      console.error('Error finding blog article:', e)
      setBlog(BLOGS_DATA[0] || null)
    } finally {
      setIsLoading(false)
    }
  }, [resolvedParams.slug])

  if (isLoading) {
    return (
      <div className="w-full bg-white min-h-screen py-20 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#0B1B3D] border-t-[#E31B23] rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading Article...</p>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="w-full bg-white min-h-screen py-20 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <h2 className="text-2xl font-black text-[#0B1B3D]">Article Not Found</h2>
          <p className="text-xs text-slate-500 font-medium">
            The blog article you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B1B3D] text-white text-xs font-bold rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blogs</span>
          </Link>
        </div>
      </div>
    )
  }

  const relatedBlogs = allBlogs.filter((b) => b.id !== blog.id).slice(0, 2)

  return (
    <div className="w-full bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-600 hover:text-[#E31B23] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blogs</span>
        </Link>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-[#0B1B3D] text-white text-[10px] font-black uppercase tracking-wider rounded-md">
              {blog.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              <span>{blog.date}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>{blog.readTime || '5 min read'}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0B1B3D] tracking-tight leading-tight">
            {blog.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed border-l-4 border-[#E31B23] pl-4 py-1 bg-slate-50 rounded-r-xl">
            {blog.excerpt}
          </p>
        </div>

        {/* Featured Image */}
        <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 aspect-[16/9] relative bg-slate-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={blog.image || '/images/blog-instruments-tray.png'}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div className="prose prose-slate max-w-none space-y-6 pt-4 text-slate-700 font-normal leading-relaxed text-sm sm:text-base">
          {blog.content ? (
            blog.content.map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))
          ) : (
            <p>{blog.excerpt}</p>
          )}
        </div>

        {/* Author / Company Sign Off Box */}
        <div className="bg-[#FAFAFA] border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-12">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Published by Durable Hospital Supplies
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Medical Device Engineering & Regulatory Quality Assurance Division
            </p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 bg-[#0B1B3D] hover:bg-[#E31B23] text-white text-xs font-extrabold rounded-xl transition-colors shadow-sm"
          >
            Contact Experts
          </Link>
        </div>

        {/* Related Articles Section */}
        {relatedBlogs.length > 0 && (
          <div className="pt-12 border-t border-slate-200 space-y-6">
            <h3 className="text-xl font-extrabold text-[#0B1B3D]">Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedBlogs.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="group block space-y-2 border border-slate-200 rounded-2xl p-4 hover:shadow-lg transition-all bg-white"
                >
                  <div className="rounded-xl overflow-hidden aspect-[16/10] relative bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rel.image || '/images/blog-instruments-tray.png'}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="text-sm font-extrabold text-[#0B1B3D] group-hover:text-[#E31B23] transition-colors leading-snug">
                    {rel.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

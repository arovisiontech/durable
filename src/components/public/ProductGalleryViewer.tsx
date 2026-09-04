'use client'

import { useState } from 'react'
import { Package } from 'lucide-react'
import { ProductImageItem } from '@/src/types/product'

interface ProductGalleryViewerProps {
  featuredImage: string | null
  galleryImages: ProductImageItem[]
  title: string
}

export function ProductGalleryViewer({
  featuredImage,
  galleryImages,
  title,
}: ProductGalleryViewerProps) {
  const allImages = [
    ...(featuredImage ? [{ image_url: featuredImage, alt_text: title }] : []),
    ...galleryImages,
  ]

  const [activeUrl, setActiveUrl] = useState(
    allImages.length > 0 ? allImages[0].image_url : null
  )

  return (
    <div className="space-y-4">
      {/* Main Image Box */}
      <div className="relative aspect-4/3 rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs flex items-center justify-center">
        {activeUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={activeUrl}
            alt={title}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        ) : (
          <Package className="w-16 h-16 text-slate-300" />
        )}
      </div>

      {/* Thumbnail Strip */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveUrl(img.image_url)}
              className={`w-16 h-16 rounded-xl bg-white border overflow-hidden shrink-0 transition-all ${
                activeUrl === img.image_url
                  ? 'border-red-600 ring-2 ring-red-500/20 scale-105'
                  : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.image_url}
                alt={`${title} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

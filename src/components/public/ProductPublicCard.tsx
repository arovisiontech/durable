import Link from 'next/link'
import { Package, ArrowRight, Star } from 'lucide-react'
import { ProductItem } from '@/src/types/product'

interface ProductPublicCardProps {
  product: ProductItem
}

export function ProductPublicCard({ product }: ProductPublicCardProps) {
  return (
    <div className="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-4/3 bg-slate-100 border-b border-slate-100 overflow-hidden flex items-center justify-center">
        {product.featured_image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={product.featured_image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <Package className="w-12 h-12 text-slate-300" />
        )}

        {/* Featured Badge */}
        {product.is_featured && (
          <div className="absolute top-3 left-3 bg-amber-500 text-white font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
            <Star className="w-3 h-3 fill-white" />
            <span>Featured</span>
          </div>
        )}

        {/* SKU Badge */}
        {product.sku && (
          <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-xs text-white font-mono text-[10px] font-semibold px-2 py-0.5 rounded-lg border border-slate-700/50">
            {product.sku}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {product.category_name && (
            <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
              {product.category_name}
            </span>
          )}

          <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
            {product.title}
          </h3>

          {product.short_description && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
              {product.short_description}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <Link
            href={`/products/${product.slug}`}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-slate-900 bg-slate-100 group-hover:bg-red-600 group-hover:text-white rounded-xl transition-all duration-200"
          >
            <span>View Specifications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

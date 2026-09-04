import Link from 'next/link'
import { Package, ArrowRight, Plus } from 'lucide-react'

interface ProductItem {
  id: string
  name: string
  slug: string
  is_featured?: boolean
  created_at?: string
  category?: { name: string } | null
}

interface RecentProductsCardProps {
  products: ProductItem[]
}

export function RecentProductsCard({ products }: RecentProductsCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-red-50 text-red-600">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recent Products</h3>
            <p className="text-xs text-slate-500">Latest medical instruments added</p>
          </div>
        </div>
        <Link
          href="/admin/products"
          className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="py-4 flex-1">
        {products.length === 0 ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">No products added yet</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-0.5">
                Your medical instrument catalog is currently empty.
              </p>
            </div>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add First Product
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {products.map((product) => (
              <div
                key={product.id}
                className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/80 rounded-lg px-2 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {product.category?.name || 'Uncategorized'}
                  </p>
                </div>
                {product.is_featured && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                    Featured
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 text-right">
        <Link
          href="/admin/products"
          className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          Manage Catalog →
        </Link>
      </div>
    </div>
  )
}

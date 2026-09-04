import Link from 'next/link'
import {
  Package,
  FolderTree,
  FileText,
  Newspaper,
  MessageSquare,
  Mail,
  Plus,
  FileUp,
  SquarePen,
  Settings,
  ShieldCheck,
  Calendar,
  Layers,
} from 'lucide-react'
import { createClient } from '@/src/lib/supabase/server'
import { StatCard } from '@/src/components/admin/StatCard'
import { RecentProductsCard } from '@/src/components/admin/RecentProductsCard'
import { RecentMessagesCard } from '@/src/components/admin/RecentMessagesCard'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Authenticated user & profile info
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user?.id || '')
    .single()

  // Real Supabase Counts
  const [
    productsCountRes,
    categoriesCountRes,
    cataloguesCountRes,
    blogsCountRes,
    messagesCountRes,
    subscribersCountRes,
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('catalogues').select('*', { count: 'exact', head: true }),
    supabase.from('blogs').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
    supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
  ])

  const productsCount = productsCountRes.count ?? 0
  const categoriesCount = categoriesCountRes.count ?? 0
  const cataloguesCount = cataloguesCountRes.count ?? 0
  const blogsCount = blogsCountRes.count ?? 0
  const messagesCount = messagesCountRes.count ?? 0
  const subscribersCount = subscribersCountRes.count ?? 0

  // Fetch Latest 5 Products
  const { data: recentProductsData } = await supabase
    .from('products')
    .select('id, name, slug, is_featured, created_at, category:categories(name)')
    .order('created_at', { ascending: false })
    .limit(5)

  // Normalize category object
  const recentProducts = (recentProductsData || []).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    is_featured: p.is_featured,
    created_at: p.created_at,
    category: Array.isArray(p.category) ? p.category[0] : p.category,
  }))

  // Fetch Latest 5 Contact Messages
  const { data: recentMessagesData } = await supabase
    .from('contact_messages')
    .select('id, full_name, email, subject, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  const recentMessages = recentMessagesData || []

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-8">
      {/* 1. Welcome Card */}
      <div className="bg-gradient-to-br from-[#0D1527] to-[#1E293B] border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-600/20 text-red-400 border border-red-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                {profile?.role === 'admin' ? 'Administrator Workspace' : 'Editor Workspace'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formattedDate}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'Admin'}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Manage your medical instrument catalog, brochures, blogs, customer messages, and site configuration from your centralized dashboard.
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Database Connected</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-400" />
              <span>Phase 1 Admin Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Actions Bar */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            href="/admin/products"
            className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl hover:border-red-300 hover:bg-red-50/50 transition-all text-xs font-semibold text-slate-800 shadow-2xs group"
          >
            <Plus className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/admin/catalogues"
            className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl hover:border-red-300 hover:bg-red-50/50 transition-all text-xs font-semibold text-slate-800 shadow-2xs group"
          >
            <FileUp className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
            <span>Upload PDF</span>
          </Link>
          <Link
            href="/admin/blogs"
            className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl hover:border-red-300 hover:bg-red-50/50 transition-all text-xs font-semibold text-slate-800 shadow-2xs group"
          >
            <SquarePen className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
            <span>Write Blog</span>
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl hover:border-red-300 hover:bg-red-50/50 transition-all text-xs font-semibold text-slate-800 shadow-2xs group"
          >
            <FolderTree className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
            <span>Categories</span>
          </Link>
          <Link
            href="/admin/contact-messages"
            className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl hover:border-red-300 hover:bg-red-50/50 transition-all text-xs font-semibold text-slate-800 shadow-2xs group"
          >
            <MessageSquare className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
            <span>Inquiries</span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl hover:border-red-300 hover:bg-red-50/50 transition-all text-xs font-semibold text-slate-800 shadow-2xs group"
          >
            <Settings className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* 3. Real Supabase Metric Cards Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Database Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard
            title="Products"
            count={productsCount}
            icon={Package}
            href="/admin/products"
            description="Active medical instruments"
          />
          <StatCard
            title="Categories"
            count={categoriesCount}
            icon={FolderTree}
            href="/admin/categories"
            description="Instrument classifications"
          />
          <StatCard
            title="PDF Catalogues"
            count={cataloguesCount}
            icon={FileText}
            href="/admin/catalogues"
            description="Downloadable PDF brochures"
          />
          <StatCard
            title="Blog Posts"
            count={blogsCount}
            icon={Newspaper}
            href="/admin/blogs"
            description="Published news & updates"
          />
          <StatCard
            title="Contact Messages"
            count={messagesCount}
            icon={MessageSquare}
            href="/admin/contact-messages"
            description="Total customer inquiries"
          />
          <StatCard
            title="Newsletter Subscribers"
            count={subscribersCount}
            icon={Mail}
            href="/admin/newsletter"
            description="Subscribed email addresses"
          />
        </div>
      </div>

      {/* 4. Recent Data Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentProductsCard products={recentProducts} />
        <RecentMessagesCard messages={recentMessages} />
      </div>
    </div>
  )
}

import {
  fetchPublicSiteSettings,
  fetchPublicNavigation,
  fetchPublicCategories,
} from '@/app/actions/public'
import { PublicHeader } from '@/src/components/public/PublicHeader'
import { PublicFooter } from '@/src/components/public/PublicFooter'
import { PublicSiteSettings, PublicNavigationItem } from '@/src/types/public'
import { CategoryItem } from '@/src/types/category'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let settings: PublicSiteSettings | null = null
  let navigation: PublicNavigationItem[] = []
  let categories: CategoryItem[] = []

  try {
    const results = await Promise.allSettled([
      fetchPublicSiteSettings(),
      fetchPublicNavigation(),
      fetchPublicCategories(),
    ])

    settings = results[0].status === 'fulfilled' ? results[0].value : null
    navigation = results[1].status === 'fulfilled' ? results[1].value : []
    categories = results[2].status === 'fulfilled' ? results[2].value : []
  } catch (err) {
    console.error('Error fetching public layout data:', err)
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-red-500 selection:text-white">
      <PublicHeader settings={settings} navigation={navigation} categories={categories} />
      <main className="flex-1 w-full">{children}</main>
      <PublicFooter settings={settings} categories={categories} />
    </div>
  )
}

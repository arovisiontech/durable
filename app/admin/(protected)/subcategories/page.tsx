import { SubcategoryManager } from '@/src/components/admin/subcategories/SubcategoryManager'
import { fetchSubcategoriesAction } from '@/app/admin/actions/subcategories'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminSubcategoriesPage() {
  const { subcategories } = await fetchSubcategoriesAction()
  return <SubcategoryManager initialSubcategories={subcategories} />
}

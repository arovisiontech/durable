'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/src/lib/supabase/server'
import { createPublicClient } from '@/src/lib/supabase/public'
import { CategoryItem, CategoryFormData, CategoryDeleteCheckResult, categorySchema } from '@/src/types/category'
import {
  getServerCategories,
  upsertServerCategory,
  deleteServerCategory,
  getServerProducts,
} from '@/src/lib/serverDataStore'

function revalidateCategoryPaths(slug?: string) {
  try {
    revalidatePath('/', 'layout')
    revalidatePath('/categories')
    revalidatePath('/category/[slug]', 'page')
    if (slug) {
      revalidatePath(`/category/${slug}`)
      revalidatePath(`/categories/${slug}`)
    }
    revalidatePath('/products')
    revalidatePath('/admin/categories')
  } catch (err) {
    console.error('Revalidation error:', err)
  }
}

export async function fetchCategoriesAction(params?: {
  search?: string
  status?: 'all' | 'published' | 'draft'
  parentFilter?: 'all' | 'root' | 'sub'
  sortBy?: 'order' | 'name' | 'newest'
}) {
  try {
    let rawCategories: CategoryItem[] = getServerCategories()

    // Apply Search Filter
    if (params?.search && params.search.trim() !== '') {
      const term = params.search.trim().toLowerCase()
      rawCategories = rawCategories.filter(
        (c) => c.name.toLowerCase().includes(term) || c.slug.toLowerCase().includes(term)
      )
    }

    // Apply Status Filter
    if (params?.status === 'published') {
      rawCategories = rawCategories.filter((c) => c.is_published)
    } else if (params?.status === 'draft') {
      rawCategories = rawCategories.filter((c) => !c.is_published)
    }

    // Apply Parent Filter
    if (params?.parentFilter === 'root') {
      rawCategories = rawCategories.filter((c) => !c.parent_id)
    } else if (params?.parentFilter === 'sub') {
      rawCategories = rawCategories.filter((c) => !!c.parent_id)
    }

    // Apply Sorting
    switch (params?.sortBy) {
      case 'name':
        rawCategories.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'newest':
        rawCategories.sort(
          (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        )
        break
      case 'order':
      default:
        rawCategories.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        break
    }

    const categoryMap = new Map(rawCategories.map((c) => [c.id, c]))

    const getDepth = (cat: any, depth = 0): number => {
      if (!cat.parent_id || depth > 10) return depth
      const parent = categoryMap.get(cat.parent_id)
      return parent ? getDepth(parent, depth + 1) : depth
    }

    const categories: CategoryItem[] = rawCategories.map((cat) => {
      const parent = cat.parent_id ? categoryMap.get(cat.parent_id) : null
      return {
        id: cat.id,
        parent_id: cat.parent_id || null,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || null,
        image_url: cat.image_url || null,
        sort_order: cat.sort_order ?? 0,
        is_published: cat.is_published ?? true,
        created_at: cat.created_at || new Date().toISOString(),
        updated_at: cat.updated_at || new Date().toISOString(),
        parent_name: parent?.name || null,
        product_count: 0,
        level: getDepth(cat),
      }
    })

    return { categories, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch categories'
    const fallback = getServerCategories()
    return { categories: fallback, error: message }
  }
}

export async function createCategoryAction(formData: CategoryFormData) {
  try {
    const validated = categorySchema.parse(formData)
    const newCategory: CategoryItem = {
      id: `cat-${validated.slug}-${Date.now()}`,
      parent_id: validated.parent_id || null,
      name: validated.name,
      slug: validated.slug,
      description: validated.description || null,
      image_url: validated.image_url || null,
      sort_order: validated.sort_order ?? 0,
      is_published: validated.is_published,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      product_count: 0,
      level: 0,
    }

    // 1. Permanently persist to server file store
    upsertServerCategory(newCategory)

    // 2. Best-effort Supabase sync
    try {
      let supabase: any
      try {
        supabase = await createClient()
      } catch {
        supabase = createPublicClient()
      }
      await supabase.from('categories').insert({
        name: validated.name,
        slug: validated.slug,
        parent_id: validated.parent_id || null,
        description: validated.description || null,
        image_url: validated.image_url || null,
        sort_order: validated.sort_order ?? 0,
        is_published: validated.is_published,
      })
    } catch (e) {
      console.warn('[createCategoryAction] Supabase notice:', e)
    }

    revalidateCategoryPaths(validated.slug)
    return { category: newCategory, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Creation failed'
    return { category: null, error: message }
  }
}

export async function updateCategoryAction(id: string, formData: CategoryFormData) {
  try {
    const validated = categorySchema.parse(formData)
    const existing = getServerCategories().find(
      (c) => c.id === id || c.slug === id || (validated.slug && c.slug === validated.slug)
    )

    const updatedCategory: CategoryItem = {
      id: existing ? existing.id : id,
      parent_id: validated.parent_id || null,
      name: validated.name,
      slug: validated.slug,
      description: validated.description || null,
      image_url: validated.image_url || null,
      sort_order: validated.sort_order ?? 0,
      is_published: validated.is_published,
      created_at: existing ? existing.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
      product_count: existing?.product_count || 0,
      level: 0,
    }

    // 1. Permanently persist to server file store
    upsertServerCategory(updatedCategory)

    // 2. Best-effort Supabase sync
    try {
      let supabase: any
      try {
        supabase = await createClient()
      } catch {
        supabase = createPublicClient()
      }
      await supabase
        .from('categories')
        .update({
          name: validated.name,
          slug: validated.slug,
          parent_id: validated.parent_id || null,
          description: validated.description || null,
          image_url: validated.image_url || null,
          sort_order: validated.sort_order ?? 0,
          is_published: validated.is_published,
          updated_at: new Date().toISOString(),
        })
        .or(`id.eq.${id},slug.eq.${id},slug.eq.${validated.slug}`)

      // Also sync full categories collection to page_sections for global consistency
      const allServerCats = getServerCategories()
      await supabase
        .from('page_sections')
        .update({
          content: { data: allServerCats },
          updated_at: new Date().toISOString(),
        })
        .eq('heading', 'durable_categories')
    } catch (e) {
      console.warn('[updateCategoryAction] Supabase notice:', e)
    }

    revalidateCategoryPaths(validated.slug)
    return { success: true, category: updatedCategory, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Update failed'
    return { success: false, error: message }
  }
}

export async function toggleCategoryStatusAction(id: string, isPublished: boolean) {
  try {
    const existing = getServerCategories().find((c) => c.id === id || c.slug === id)
    if (existing) {
      existing.is_published = isPublished
      existing.updated_at = new Date().toISOString()
      upsertServerCategory(existing)
    }

    try {
      let supabase: any
      try {
        supabase = await createClient()
      } catch {
        supabase = createPublicClient()
      }
      await supabase
        .from('categories')
        .update({
          is_published: isPublished,
          updated_at: new Date().toISOString(),
        })
        .or(`id.eq.${id},slug.eq.${id}`)
    } catch {}

    revalidateCategoryPaths(existing?.slug)
    return { success: true, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Status toggle failed'
    return { success: false, error: message }
  }
}

export async function checkCategoryDeleteSafetyAction(id: string): Promise<{
  result: CategoryDeleteCheckResult
  error: string | null
}> {
  const products = getServerProducts()
  const prodCount = products.filter((p) => p.category_id === id).length
  const categories = getServerCategories()
  const childCount = categories.filter((c) => c.parent_id === id).length

  return {
    result: {
      canDelete: true,
      productCount: prodCount,
      childCategoryCount: childCount,
    },
    error: null,
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    // 1. Delete from persistent server file store
    deleteServerCategory(id)

    // 2. Best-effort Supabase sync
    try {
      let supabase: any
      try {
        supabase = await createClient()
      } catch {
        supabase = createPublicClient()
      }
      await supabase.from('categories').delete().or(`id.eq.${id},slug.eq.${id}`)
    } catch {}

    revalidateCategoryPaths()
    return { success: true, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Delete failed'
    return { success: false, error: message }
  }
}

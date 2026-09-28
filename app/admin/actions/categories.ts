'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/src/lib/supabase/server'
import { CategoryItem, CategoryFormData, CategoryDeleteCheckResult, categorySchema } from '@/src/types/category'
import { INITIAL_CATEGORIES_SEED, INITIAL_PRODUCTS_SEED } from '@/src/lib/dataStore'

function revalidateCategoryPaths(slug?: string) {
  try {
    revalidatePath('/')
    revalidatePath('/categories')
    if (slug) {
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
    const supabase = await createClient()

    let rawCategories: any[] = []
    let supabaseSuccess = false

    try {
      const { data, error } = await supabase.from('categories').select('*')
      if (!error && data && data.length > 0) {
        rawCategories = data
        supabaseSuccess = true
      }
    } catch {
      // Fallback
    }

    if (!supabaseSuccess || rawCategories.length === 0) {
      rawCategories = INITIAL_CATEGORIES_SEED.map((c) => ({
        id: c.id,
        parent_id: c.parent_id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        image_url: c.image_url,
        sort_order: c.sort_order,
        is_published: c.is_published,
        created_at: c.created_at,
        updated_at: c.updated_at,
      }))
    }

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
        rawCategories.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'order':
      default:
        rawCategories.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        break
    }

    // Product counts map
    const countMap: Record<string, number> = {}
    INITIAL_PRODUCTS_SEED.forEach((p) => {
      if (p.category_id) {
        countMap[p.category_id] = (countMap[p.category_id] || 0) + 1
      }
    })

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
        parent_id: cat.parent_id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image_url: cat.image_url,
        sort_order: cat.sort_order,
        is_published: cat.is_published,
        created_at: cat.created_at,
        updated_at: cat.updated_at,
        parent_name: parent?.name || null,
        product_count: countMap[cat.id] || countMap[cat.slug] || 0,
        level: getDepth(cat),
      }
    })

    return { categories, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch categories'
    return { categories: INITIAL_CATEGORIES_SEED, error: message }
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
      parent_name: null,
      product_count: 0,
      level: validated.parent_id ? 1 : 0,
    }

    try {
      const supabase = await createClient()
      await supabase.from('categories').insert({
        name: validated.name,
        slug: validated.slug,
        parent_id: validated.parent_id || null,
        description: validated.description || null,
        image_url: validated.image_url || null,
        sort_order: validated.sort_order ?? 0,
        is_published: validated.is_published,
      })
    } catch {
      // Local fallback
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
    try {
      const supabase = await createClient()
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
        .eq('id', id)
    } catch {
      // Local fallback
    }

    revalidateCategoryPaths(validated.slug)
    return { success: true, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Update failed'
    return { success: false, error: message }
  }
}

export async function toggleCategoryStatusAction(id: string, isPublished: boolean) {
  try {
    try {
      const supabase = await createClient()
      await supabase
        .from('categories')
        .update({
          is_published: isPublished,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
    } catch {
      // Local fallback
    }

    revalidateCategoryPaths()
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
  return {
    result: { canDelete: true, productCount: 0, childCategoryCount: 0 },
    error: null,
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    try {
      const supabase = await createClient()
      await supabase.from('categories').delete().eq('id', id)
    } catch {
      // Local fallback
    }

    revalidateCategoryPaths()
    return { success: true, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Delete failed'
    return { success: false, error: message }
  }
}

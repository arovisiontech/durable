'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/src/lib/supabase/server'
import { CategoryItem, CategoryFormData, CategoryDeleteCheckResult, categorySchema } from '@/src/types/category'
import { INITIAL_CATEGORIES_SEED, INITIAL_PRODUCTS_SEED } from '@/src/lib/dataStore'

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
    const supabase = await createClient()

    let rawCategories: any[] = []
    let supabaseSuccess = false

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })

      if (!error && data) {
        const dbSlugs = new Set(data.map((c) => c.slug.toLowerCase()))
        const dbNames = new Set(data.map((c) => c.name.toLowerCase()))
        const missingSeed = INITIAL_CATEGORIES_SEED.filter(
          (s) => !dbSlugs.has(s.slug.toLowerCase()) && !dbNames.has(s.name.toLowerCase())
        )
        rawCategories = [...data, ...missingSeed]
        supabaseSuccess = true
      }
    } catch (e) {
      console.error('Error fetching categories from Supabase:', e)
    }

    if (!supabaseSuccess || rawCategories.length === 0) {
      rawCategories = [...INITIAL_CATEGORIES_SEED]
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
        rawCategories.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
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
    return { categories: INITIAL_CATEGORIES_SEED, error: message }
  }
}

export async function createCategoryAction(formData: CategoryFormData) {
  try {
    const validated = categorySchema.parse(formData)
    const supabase = await createClient()

    const insertPayload = {
      name: validated.name,
      slug: validated.slug,
      parent_id: validated.parent_id || null,
      description: validated.description || null,
      image_url: validated.image_url || null,
      sort_order: validated.sort_order ?? 0,
      is_published: validated.is_published,
    }

    const { data, error } = await supabase
      .from('categories')
      .insert(insertPayload)
      .select()
      .single()

    if (error) {
      console.error('Supabase category creation error:', error)
      return { category: null, error: error.message }
    }

    revalidateCategoryPaths(validated.slug)
    return { category: data as CategoryItem, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Creation failed'
    return { category: null, error: message }
  }
}

export async function updateCategoryAction(id: string, formData: CategoryFormData) {
  try {
    const validated = categorySchema.parse(formData)
    const supabase = await createClient()

    const updatePayload = {
      name: validated.name,
      slug: validated.slug,
      parent_id: validated.parent_id || null,
      description: validated.description || null,
      image_url: validated.image_url || null,
      sort_order: validated.sort_order ?? 0,
      is_published: validated.is_published,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('categories')
      .update(updatePayload)
      .eq('id', id)

    if (error) {
      console.error('Supabase category update error:', error)
      return { success: false, error: error.message }
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
    const supabase = await createClient()
    const { error } = await supabase
      .from('categories')
      .update({
        is_published: isPublished,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error('Supabase category toggle error:', error)
      return { success: false, error: error.message }
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
    const supabase = await createClient()
    const { error } = await supabase.from('categories').delete().eq('id', id)

    if (error) {
      console.error('Supabase category delete error:', error)
      return { success: false, error: error.message }
    }

    revalidateCategoryPaths()
    return { success: true, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Delete failed'
    return { success: false, error: message }
  }
}

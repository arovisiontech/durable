'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/src/lib/supabase/server'
import { CategoryItem, CategoryFormData, CategoryDeleteCheckResult, categorySchema } from '@/src/types/category'

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

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { categories: [], error: 'Unauthorized' }
    }

    // Fetch all categories
    let query = supabase.from('categories').select('*')

    // Apply Search Filter
    if (params?.search && params.search.trim() !== '') {
      const searchTerm = `%${params.search.trim()}%`
      query = query.or(`name.ilike.${searchTerm},slug.ilike.${searchTerm}`)
    }

    // Apply Status Filter
    if (params?.status === 'published') {
      query = query.eq('is_published', true)
    } else if (params?.status === 'draft') {
      query = query.eq('is_published', false)
    }

    // Apply Parent Filter
    if (params?.parentFilter === 'root') {
      query = query.is('parent_id', null)
    } else if (params?.parentFilter === 'sub') {
      query = query.not('parent_id', 'is', null)
    }

    // Apply Sorting
    switch (params?.sortBy) {
      case 'name':
        query = query.order('name', { ascending: true })
        break
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'order':
      default:
        query = query.order('sort_order', { ascending: true }).order('name', { ascending: true })
        break
    }

    const { data: rawCategories, error } = await query

    if (error) {
      console.error('Error fetching categories:', error)
      return { categories: [], error: error.message }
    }

    if (!rawCategories || rawCategories.length === 0) {
      return { categories: [], error: null }
    }

    // Fetch product counts for each category
    const categoryIds = rawCategories.map((c) => c.id)
    const { data: productCounts } = await supabase
      .from('products')
      .select('category_id')
      .in('category_id', categoryIds)

    const countMap: Record<string, number> = {}
    if (productCounts) {
      productCounts.forEach((p) => {
        if (p.category_id) {
          countMap[p.category_id] = (countMap[p.category_id] || 0) + 1
        }
      })
    }

    // Map parent names & depth levels
    const categoryMap = new Map(rawCategories.map((c) => [c.id, c]))

    const getDepth = (cat: typeof rawCategories[0], depth = 0): number => {
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
        product_count: countMap[cat.id] || 0,
        level: getDepth(cat),
      }
    })

    return { categories, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch categories'
    return { categories: [], error: message }
  }
}

export async function createCategoryAction(formData: CategoryFormData) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { category: null, error: 'Unauthorized' }
    }

    // Validate Input
    const validated = categorySchema.parse(formData)

    // Check slug uniqueness
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', validated.slug)
      .maybeSingle()

    if (existing) {
      return { category: null, error: `Slug "${validated.slug}" is already in use by another category.` }
    }

    // Insert Category
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: validated.name,
        slug: validated.slug,
        parent_id: validated.parent_id || null,
        description: validated.description || null,
        image_url: validated.image_url || null,
        sort_order: validated.sort_order ?? 0,
        is_published: validated.is_published,
      })
      .select()
      .single()

    if (error || !data) {
      console.error('Error creating category:', error)
      return { category: null, error: error?.message || 'Database creation failed' }
    }

    // Audit Log in activity_logs
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'CREATE_CATEGORY',
      entity_type: 'category',
      entity_id: data.id,
      details: {
        name: data.name,
        slug: data.slug,
        parent_id: data.parent_id,
        is_published: data.is_published,
      },
    })

    revalidateCategoryPaths(data.slug)

    const categoryItem: CategoryItem = {
      ...data,
      parent_name: null,
      product_count: 0,
      level: 0,
    }

    return { category: categoryItem, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Creation failed'
    return { category: null, error: message }
  }
}

export async function updateCategoryAction(id: string, formData: CategoryFormData) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Prevent self-parenting
    if (formData.parent_id === id) {
      return { success: false, error: 'A category cannot be selected as its own parent.' }
    }

    // Validate Input
    const validated = categorySchema.parse(formData)

    // Check slug uniqueness excluding current ID
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', validated.slug)
      .neq('id', id)
      .maybeSingle()

    if (existing) {
      return { success: false, error: `Slug "${validated.slug}" is already in use by another category.` }
    }

    // Update Category
    const { error } = await supabase
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

    if (error) {
      console.error('Error updating category:', error)
      return { success: false, error: error.message }
    }

    // Audit Log in activity_logs
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'UPDATE_CATEGORY',
      entity_type: 'category',
      entity_id: id,
      details: {
        name: validated.name,
        slug: validated.slug,
        parent_id: validated.parent_id,
        is_published: validated.is_published,
      },
    })

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

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('categories')
      .update({
        is_published: isPublished,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    // Audit Log in activity_logs
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'CATEGORY_STATUS_CHANGE',
      entity_type: 'category',
      entity_id: id,
      details: { is_published: isPublished },
    })

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
  try {
    const supabase = await createClient()

    // 1. Check assigned products count
    const { count: productCount } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', id)

    // 2. Check child subcategories count
    const { count: childCount } = await supabase
      .from('categories')
      .select('id', { count: 'exact', head: true })
      .eq('parent_id', id)

    const pCount = productCount || 0
    const cCount = childCount || 0

    if (pCount > 0 || cCount > 0) {
      const parts: string[] = []
      if (pCount > 0) parts.push(`${pCount} assigned product(s)`)
      if (cCount > 0) parts.push(`${cCount} subcategory(ies)`)

      return {
        result: {
          canDelete: false,
          productCount: pCount,
          childCategoryCount: cCount,
          message: `Deletion blocked: This category has ${parts.join(' and ')}. Please reassign or delete them first.`,
        },
        error: null,
      }
    }

    return {
      result: {
        canDelete: true,
        productCount: 0,
        childCategoryCount: 0,
      },
      error: null,
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Safety check failed'
    return {
      result: { canDelete: false, productCount: 0, childCategoryCount: 0, message },
      error: message,
    }
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Safety check
    const safety = await checkCategoryDeleteSafetyAction(id)
    if (!safety.result.canDelete) {
      return { success: false, error: safety.result.message || 'Category deletion is blocked.' }
    }

    // Get category name for audit log
    const { data: catData } = await supabase
      .from('categories')
      .select('name')
      .eq('id', id)
      .single()

    // Delete record
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    // Audit Log in activity_logs
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'DELETE_CATEGORY',
      entity_type: 'category',
      entity_id: id,
      details: { name: catData?.name || id },
    })

    revalidateCategoryPaths()

    return { success: true, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Delete failed'
    return { success: false, error: message }
  }
}

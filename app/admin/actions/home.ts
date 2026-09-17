'use server'

import { createClient } from '@/src/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface HeroSlideInput {
  id?: string
  title: string
  subtitle?: string | null
  description?: string | null
  image_url: string
  button_text?: string | null
  button_link?: string | null
  sort_order?: number
  is_published?: boolean
}

export async function getAdminHeroSlides() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching admin hero slides:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Failed to get hero slides:', err)
    return []
  }
}

export async function createHeroSlideAction(input: HeroSlideInput) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('hero_slides')
      .insert({
        title: input.title,
        subtitle: input.subtitle || null,
        description: input.description || null,
        image_url: input.image_url,
        button_text: input.button_text || 'Partner With Us',
        button_link: input.button_link || '/contact',
        sort_order: input.sort_order || 0,
        is_published: input.is_published !== undefined ? input.is_published : true,
      })
      .select('*')
      .single()

    if (error) {
      console.error('Error creating hero slide:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin/content/home')
    return { success: true, slide: data }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Server error' }
  }
}

export async function updateHeroSlideAction(id: string, input: Partial<HeroSlideInput>) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('hero_slides')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      console.error('Error updating hero slide:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin/content/home')
    return { success: true, slide: data }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Server error' }
  }
}

export async function deleteHeroSlideAction(id: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('hero_slides').delete().eq('id', id)

    if (error) {
      console.error('Error deleting hero slide:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin/content/home')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Server error' }
  }
}

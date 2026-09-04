'use server'

import { createClient } from '@/src/lib/supabase/server'
import { MediaItem, MediaUsageCheckResult, MediaUsageReference } from '@/src/types/media'

export async function fetchMediaItemsAction(params: {
  search?: string
  type?: 'all' | 'image' | 'video'
  sortBy?: 'newest' | 'oldest' | 'name' | 'size'
  page?: number
  pageSize?: number
}) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { media: [], totalCount: 0, error: 'Unauthorized' }
    }

    const page = params.page || 1
    const pageSize = params.pageSize || 24
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('media')
      .select('*', { count: 'exact' })

    // Apply Search Filter
    if (params.search && params.search.trim() !== '') {
      const searchTerm = `%${params.search.trim()}%`
      query = query.or(`filename.ilike.${searchTerm},alt_text.ilike.${searchTerm}`)
    }

    // Apply MIME Type Filter
    if (params.type === 'image') {
      query = query.ilike('file_type', 'image/%')
    } else if (params.type === 'video') {
      query = query.ilike('file_type', 'video/%')
    }

    // Apply Sort
    switch (params.sortBy) {
      case 'oldest':
        query = query.order('created_at', { ascending: true })
        break
      case 'name':
        query = query.order('filename', { ascending: true })
        break
      case 'size':
        query = query.order('file_size', { ascending: false, nullsFirst: false })
        break
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    // Apply Pagination
    query = query.range(from, to)

    const { data, count, error } = await query

    if (error) {
      console.error('Error fetching media:', error)
      return { media: [], totalCount: 0, error: error.message }
    }

    // Map public URLs
    const media: MediaItem[] = (data || []).map((item) => {
      const { data: publicUrlData } = supabase.storage
        .from('website-media')
        .getPublicUrl(item.file_path)

      const publicUrl =
        item.file_path?.startsWith('/') || item.file_path?.startsWith('http')
          ? item.file_path
          : publicUrlData.publicUrl

      return {
        id: item.id,
        filename: item.filename,
        file_path: item.file_path,
        file_type: item.file_type,
        file_size: item.file_size,
        alt_text: item.alt_text,
        uploaded_by: item.uploaded_by,
        created_at: item.created_at,
        public_url: publicUrl,
      }
    })

    return {
      media,
      totalCount: count || 0,
      error: null,
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch media records'
    return { media: [], totalCount: 0, error: message }
  }
}

export async function createMediaRecordAction(payload: {
  filename: string
  file_path: string
  file_type: string
  file_size: number
  alt_text?: string
}) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { media: null, error: 'Unauthorized' }
    }

    // Insert Media Record into Database
    const { data, error } = await supabase
      .from('media')
      .insert({
        filename: payload.filename,
        file_path: payload.file_path,
        file_type: payload.file_type,
        file_size: payload.file_size,
        alt_text: payload.alt_text || payload.filename,
        uploaded_by: user.id,
      })
      .select()
      .single()

    if (error || !data) {
      console.error('Error creating media record:', error)
      return { media: null, error: error?.message || 'Database record creation failed' }
    }

    // Audit Log in activity_logs
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'UPLOAD_MEDIA',
      entity_type: 'media',
      entity_id: data.id,
      details: {
        filename: payload.filename,
        file_path: payload.file_path,
        file_type: payload.file_type,
        file_size: payload.file_size,
      },
    })

    const { data: publicUrlData } = supabase.storage
      .from('website-media')
      .getPublicUrl(data.file_path)

    const mediaItem: MediaItem = {
      id: data.id,
      filename: data.filename,
      file_path: data.file_path,
      file_type: data.file_type,
      file_size: data.file_size,
      alt_text: data.alt_text,
      uploaded_by: data.uploaded_by,
      created_at: data.created_at,
      public_url: publicUrlData.publicUrl,
    }

    return { media: mediaItem, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database insertion failed'
    return { media: null, error: message }
  }
}

export async function updateMediaAltTextAction(id: string, altText: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
      .from('media')
      .update({ alt_text: altText })
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    // Log Activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'UPDATE_MEDIA',
      entity_type: 'media',
      entity_id: id,
      details: { alt_text: altText },
    })

    return { success: true, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Update failed'
    return { success: false, error: message }
  }
}

export async function checkMediaUsageAction(filePath: string): Promise<{
  result: MediaUsageCheckResult
  error: string | null
}> {
  try {
    const supabase = await createClient()

    const { data: publicUrlData } = supabase.storage
      .from('website-media')
      .getPublicUrl(filePath)

    const publicUrl = publicUrlData.publicUrl

    const references: MediaUsageReference[] = []

    // Helper to query table
    const checkTable = async (
      tableName: string,
      columnName: string,
      displayNameField: string = 'name'
    ) => {
      const { data } = await supabase
        .from(tableName)
        .select(`id, ${displayNameField}`)
        .or(`${columnName}.ilike.%${filePath}%,${columnName}.ilike.%${publicUrl}%`)

      if (data && data.length > 0) {
        references.push({
          tableName,
          columnName,
          count: data.length,
          sampleRecords: data.slice(0, 3).map((r) => {
            const item = r as unknown as Record<string, string>
            return {
              id: String(item.id || ''),
              name: String(item[displayNameField] || item.id || ''),
            }
          }),
        })
      }
    }

    await Promise.all([
      checkTable('products', 'featured_image', 'name'),
      checkTable('product_images', 'image_url', 'id'),
      checkTable('categories', 'image_url', 'name'),
      checkTable('blogs', 'featured_image', 'title'),
      checkTable('certifications', 'image_url', 'title'),
      checkTable('certifications', 'file_url', 'title'),
      checkTable('catalogues', 'cover_image', 'title'),
      checkTable('catalogues', 'pdf_url', 'title'),
      checkTable('hero_slides', 'image_url', 'title'),
      checkTable('site_settings', 'logo_url', 'id'),
      checkTable('site_settings', 'favicon_url', 'id'),
    ])

    return {
      result: {
        isReferenced: references.length > 0,
        references,
      },
      error: null,
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to check media usage'
    return {
      result: { isReferenced: false, references: [] },
      error: message,
    }
  }
}

export async function deleteMediaRecordAction(id: string, filePath: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Step 1: Remove from Supabase Storage bucket FIRST
    const { error: storageError } = await supabase.storage
      .from('website-media')
      .remove([filePath])

    if (storageError) {
      console.error('Storage deletion error:', storageError)
      return {
        success: false,
        error: `Storage deletion failed: ${storageError.message}. Database record was preserved.`,
      }
    }

    // Step 2: Delete database record from media table AFTER storage deletion succeeds
    const { error: dbError } = await supabase
      .from('media')
      .delete()
      .eq('id', id)

    if (dbError) {
      console.error('Database deletion error:', dbError)
      return {
        success: false,
        error: `Database deletion failed: ${dbError.message}`,
      }
    }

    // Audit Log in activity_logs
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'DELETE_MEDIA',
      entity_type: 'media',
      entity_id: id,
      details: { file_path: filePath },
    })

    return { success: true, error: null }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Delete failed'
    return { success: false, error: message }
  }
}

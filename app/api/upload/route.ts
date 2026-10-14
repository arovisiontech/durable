import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { createClient as createServerClient } from '@/src/lib/supabase/server'
import { createPublicClient } from '@/src/lib/supabase/public'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const rawName = file.name || 'uploaded-file'
    const ext = path.extname(rawName) || ''
    const baseName = path
      .basename(rawName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    const sanitizedFilename = `${Date.now()}-${baseName}${ext}`
    const isPdf = file.type === 'application/pdf' || ext.toLowerCase() === '.pdf'

    // 1. Try uploading to Supabase Storage if accessible
    try {
      let supabase: any
      try {
        supabase = await createServerClient()
      } catch (e) {
        supabase = createPublicClient()
      }

      const bucketName = isPdf ? 'catalogues' : 'website-media'
      const storagePath = `uploads/${new Date().toISOString().slice(0, 7)}/${sanitizedFilename}`

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from(bucketName)
        .upload(storagePath, buffer, {
          contentType: file.type || 'application/octet-stream',
          upsert: true,
        })

      if (!uploadErr && uploadData?.path) {
        const { data: pubData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(uploadData.path)

        if (pubData?.publicUrl) {
          // Best effort insert into media table
          try {
            await supabase.from('media').insert({
              filename: rawName,
              file_path: storagePath,
              file_type: file.type,
              file_size: file.size,
              alt_text: baseName.replace(/-/g, ' '),
            })
          } catch {}

          return NextResponse.json({
            success: true,
            url: pubData.publicUrl,
            filename: rawName,
            storage: 'supabase',
          })
        }
      }
    } catch (sbErr) {
      console.warn('[Upload API] Supabase storage upload notice:', sbErr)
    }

    // 2. Local File System Storage Fallback (if writable) or Data URL fallback (Vercel serverless)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      const filePath = path.join(uploadDir, sanitizedFilename)
      fs.writeFileSync(filePath, buffer)
      const publicUrl = `/uploads/${sanitizedFilename}`

      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename: rawName,
        storage: 'local',
      })
    } catch (fsErr) {
      console.warn('[Upload API] Filesystem is read-only (e.g. Vercel Lambda). Returning clean data URL fallback.')
      const mimeType = file.type || (isPdf ? 'application/pdf' : 'image/jpeg')
      const dataUrl = `data:${mimeType};base64,${buffer.toString('base64')}`
      return NextResponse.json({
        success: true,
        url: dataUrl,
        filename: rawName,
        storage: 'data_url',
      })
    }
  } catch (err: any) {
    console.error('[Upload API] Upload error:', err)
    return NextResponse.json({ error: err.message || 'File upload failed' }, { status: 500 })
  }
}

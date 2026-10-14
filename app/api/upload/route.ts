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

    // 1. Try uploading to Supabase Storage if accessible
    try {
      let supabase: any
      try {
        supabase = await createServerClient()
      } catch (e) {
        supabase = createPublicClient()
      }

      const isPdf = file.type === 'application/pdf' || ext.toLowerCase() === '.pdf'
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

    // 2. Reliable Local File System Storage Fallback
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const filePath = path.join(uploadDir, sanitizedFilename)

    fs.writeFileSync(filePath, buffer)
    const publicUrl = `/uploads/${sanitizedFilename}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: rawName,
      storage: 'local',
    })
  } catch (err: any) {
    console.error('[Upload API] Upload error:', err)
    return NextResponse.json({ error: err.message || 'File upload failed' }, { status: 500 })
  }
}

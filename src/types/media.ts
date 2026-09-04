export interface MediaItem {
  id: string
  filename: string
  file_path: string
  file_type: string
  file_size: number | null
  alt_text: string | null
  uploaded_by: string | null
  created_at: string
  public_url: string
}

export interface MediaUploadItem {
  id: string
  file: File
  altText: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  previewUrl?: string
}

export interface MediaFilterState {
  search: string
  type: 'all' | 'image' | 'video'
  sortBy: 'newest' | 'oldest' | 'name' | 'size'
  page: number
}

export interface MediaUsageReference {
  tableName: string
  columnName: string
  count: number
  sampleRecords: { id: string; title?: string; name?: string }[]
}

export interface MediaUsageCheckResult {
  isReferenced: boolean
  references: MediaUsageReference[]
}

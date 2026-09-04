export interface PublicSiteSettings {
  company_name: string
  logo_url: string | null
  favicon_url: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  address: string | null
  social_links?: {
    twitter?: string
    facebook?: string
    linkedin?: string
    instagram?: string
    youtube?: string
  } | null
  seo_settings?: {
    meta_title?: string
    meta_description?: string
  } | null
}

export interface PublicNavigationItem {
  id: string
  parent_id: string | null
  label: string
  url: string
  target: string
  sort_order: number
  is_visible: boolean
  children?: PublicNavigationItem[]
}

export interface PublicHeroSlide {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  image_url: string | null
  button_text: string | null
  button_link: string | null
  sort_order: number
}

export interface PublicSearchResult {
  products: Array<{
    id: string
    title: string
    slug: string
    sku: string | null
    featured_image: string | null
    category_name?: string | null
  }>
  categories: Array<{
    id: string
    name: string
    slug: string
    image_url: string | null
  }>
}

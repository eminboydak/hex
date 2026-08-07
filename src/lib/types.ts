export type PostStatus = 'draft' | 'published'

export interface Post {
  id: number
  slug: string
  title: string
  content_markdown: string
  excerpt: string | null
  status: PostStatus
  published_at: string | null
  created_at: string
  updated_at: string
  metadata: string
}

export interface PostSummary {
  id: number
  slug: string
  title: string
  excerpt: string | null
  published_at: string | null
}

export interface Tag {
  id: number
  name: string
  slug: string
}

export interface GuestbookEntry {
  id: number
  message: string
  created_at: string
  metadata: string
}

export interface GuestbookEntryView extends GuestbookEntry {
  formattedId: string
  identiconSvg: string
}

import type { GuestbookEntry, Post, PostSummary } from './types'

/**
 * Lightweight projection used by the index list and the posts feed.
 */
export async function getPublishedPosts(db: D1Database): Promise<PostSummary[]> {
  const { results } = await db
    .prepare(
      `SELECT id, slug, title, excerpt, published_at
       FROM posts
       WHERE status = ?
       ORDER BY published_at IS NULL, published_at DESC, created_at DESC`,
    )
    .bind('published')
    .all<PostSummary>()
  return results
}

/**
 * Full row for a single published post by slug.
 */
export async function getPostBySlug(
  db: D1Database,
  slug: string,
): Promise<Post | null> {
  return db
    .prepare('SELECT * FROM posts WHERE slug = ? AND status = ?')
    .bind(slug, 'published')
    .first<Post>()
}

/**
 * Latest guestbook entries, newest first.
 */
export async function getGuestbookEntries(
  db: D1Database,
  limit = 50,
): Promise<GuestbookEntry[]> {
  const { results } = await db
    .prepare(
      'SELECT id, message, created_at, metadata FROM guestbook ORDER BY created_at DESC LIMIT ?',
    )
    .bind(limit)
    .all<GuestbookEntry>()
  return results
}

/**
 * Insert a validated message and return the created row.
 */
export async function createGuestbookEntry(
  db: D1Database,
  message: string,
): Promise<GuestbookEntry> {
  const row = await db
    .prepare(
      'INSERT INTO guestbook (message) VALUES (?) RETURNING id, message, created_at, metadata',
    )
    .bind(message)
    .first<GuestbookEntry>()
  if (!row) {
    throw new Error('Guestbook insert returned no row')
  }
  return row
}

import type { Post, PostSummary } from './types'

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

import type { GuestbookEntry, Post, PostSummary, CreatePostInput, UpdatePostInput } from './types'

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
 * All posts including drafts (for admin panel).
 */
export async function getAllPosts(db: D1Database): Promise<Post[]> {
  const { results } = await db
    .prepare(
      `SELECT * FROM posts
       ORDER BY created_at DESC`,
    )
    .all<Post>()
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
 * Get post by ID (for admin).
 */
export async function getPostById(db: D1Database, id: number): Promise<Post | null> {
  return db
    .prepare('SELECT * FROM posts WHERE id = ?')
    .bind(id)
    .first<Post>()
}

/**
 * Get all existing slugs (for uniqueness checking).
 */
export async function getAllSlugs(db: D1Database): Promise<string[]> {
  const { results } = await db
    .prepare('SELECT slug FROM posts')
    .all<{ slug: string }>()
  return results.map((row: { slug: string }) => row.slug);
}

/**
 * Create a new post with auto-generated slug.
 */
export async function createPost(
  db: D1Database,
  input: CreatePostInput,
  generateSlugFn: (title: string, existingSlugs: string[]) => Promise<string>
): Promise<Post> {
  const { title, content_markdown, excerpt, status, published_at, metadata } = input;
  const now = new Date().toISOString();

  // Get existing slugs for uniqueness checking
  const existingSlugs = await getAllSlugs(db);
  
  // Generate unique slug
  const slug = input.slug || await generateSlugFn(title, existingSlugs);

  const row = await db
    .prepare(
      `INSERT INTO posts (title, slug, content_markdown, excerpt, status, published_at, created_at, updated_at, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       RETURNING *`
    )
    .bind(title, slug, content_markdown, excerpt || null, status, published_at || null, now, now, metadata || '{}')
    .first<Post>()
  
  if (!row) {
    throw new Error('Post insert returned no row')
  }
  return row
}

/**
 * Update an existing post by ID.
 */
export async function updatePost(
  db: D1Database,
  id: number,
  input: UpdatePostInput
): Promise<Post | null> {
  const updates: string[] = [];
  const bindValues: (string | number | null)[] = [];
  
  const { title, slug, content_markdown, excerpt, status, published_at, metadata } = input;
  const now = new Date().toISOString();

  if (title !== undefined) {
    updates.push('title = ?');
    bindValues.push(title);
  }
  if (slug !== undefined) {
    updates.push('slug = ?');
    bindValues.push(slug);
  }
  if (content_markdown !== undefined) {
    updates.push('content_markdown = ?');
    bindValues.push(content_markdown);
  }
  if (excerpt !== undefined) {
    updates.push('excerpt = ?');
    bindValues.push(excerpt);
  }
  if (status !== undefined) {
    updates.push('status = ?');
    bindValues.push(status);
  }
  if (published_at !== undefined) {
    updates.push('published_at = ?');
    bindValues.push(published_at);
  }
  if (metadata !== undefined) {
    updates.push('metadata = ?');
    bindValues.push(metadata);
  }

  if (updates.length === 0) {
    return await getPostById(db, id);
  }

  updates.push('updated_at = ?');
  bindValues.push(now);
  bindValues.push(id);

  const row = await db
    .prepare(
      `UPDATE posts
       SET ${updates.join(', ')}
       WHERE id = ?
       RETURNING *`
    )
    .bind(...bindValues)
    .first<Post>()
  
  return row;
}

/**
 * Delete a post by ID and explicitly clean up post_tags.
 */
export async function deletePost(db: D1Database, id: number): Promise<boolean> {
  // Explicitly clean up post_tags (D1 FK reliability issue)
  await db
    .prepare('DELETE FROM post_tags WHERE post_id = ?')
    .bind(id)
    .run();

  // Delete the post
  const result = await db
    .prepare('DELETE FROM posts WHERE id = ?')
    .bind(id)
    .run();

  return result.meta.changes > 0
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

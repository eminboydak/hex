import { Hono } from 'hono';
import type { APIContext } from 'astro';
import { env } from 'cloudflare:workers';
import {
  createGuestbookEntry,
  getPostBySlug,
  getPublishedPosts,
  getGuestbookEntries,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
} from '@/lib/db';
import { identityFromId } from '@/lib/identity';
import { adminAuthMiddleware } from '@/lib/auth';
import { generateUniqueSlug } from '@/lib/slugify';
import type { GuestbookEntryView, CreatePostInput, UpdatePostInput } from '@/lib/types';

const app = new Hono<{ Bindings: Env }>().basePath('/api');

// --- Public endpoints ---

app.get('/posts', async (c) => {
  const posts = await getPublishedPosts(c.env.DB);
  return c.json({ posts });
});

app.get('/posts/:slug', async (c) => {
  const post = await getPostBySlug(c.env.DB, c.req.param('slug'));
  if (!post) {
    return c.json({ error: 'Not found' }, 404);
  }
  return c.json({ post });
});

app.get('/guestbook', async (c) => {
  const entries = await getGuestbookEntries(c.env.DB);
  const views: GuestbookEntryView[] = entries.map((e) => ({
    ...e,
    ...identityFromId(e.id),
  }));
  return c.json({ entries: views });
});

app.post('/guestbook', async (c) => {
  let body: { message?: unknown };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (message.length < 1 || message.length > 280) {
    return c.json({ error: 'Message must be 1–280 characters' }, 400);
  }
  const entry = await createGuestbookEntry(c.env.DB, message);
  return c.json({ entry: { ...entry, ...identityFromId(entry.id) } }, 201);
});

// --- Admin endpoints (protected) ---

// Apply auth middleware to all /api/admin/* routes
app.use('/admin/*', adminAuthMiddleware());

// Image upload
app.post('/admin/upload', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'blog';

    if (!file || !file.type.startsWith('image/')) {
      return c.json({ error: 'Invalid file: must be an image' }, 400);
    }

    // Check file size (5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      return c.json({ error: 'File too large: maximum 5MB' }, 400);
    }

    // Generate R2 path: blog/YYYY/MM/<ulid>.<ext>
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const ulid = crypto.randomUUID();
    const ext = file.type === 'image/webp' ? 'webp' : 
                  file.type === 'image/jpeg' ? 'jpg' :
                  file.type === 'image/png' ? 'png' : 'webp';
    
    const key = `${type}/${year}/${month}/${ulid}.${ext}`;

    // Put to R2
    await c.env.BUCKET.put(key, file, {
      httpMetadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000, immutable',
      },
    });

    // Return CDN URL
    const url = `https://cdn.eminboydak.com/${key}`;
    return c.json({ url, key, filename: `${ulid}.${ext}` });
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ error: 'Upload failed' }, 500);
  }
});

// Post management
app.get('/admin/posts', async (c) => {
  const posts = await getAllPosts(c.env.DB);
  return c.json({ posts });
});

app.post('/admin/posts', async (c) => {
  try {
    const body = await c.req.json();
    const { title, slug, content_markdown, excerpt, status, published_at, metadata } = body;

    if (!title || !content_markdown) {
      return c.json({ error: 'Title and content are required' }, 400);
    }

    // Generate slug if not provided
    let finalSlug = slug;
    if (!finalSlug) {
      const slugsResult = await c.env.DB.prepare('SELECT slug FROM posts').all<{ slug: string }>();
      const existingSlugs = slugsResult.results.map(r => r.slug);
      finalSlug = await generateUniqueSlug(title, existingSlugs);
    }

    const input: CreatePostInput = {
      title,
      slug: finalSlug,
      content_markdown,
      excerpt: excerpt || null,
      status: status || 'draft',
      published_at: published_at || null,
      metadata: metadata || '{}',
    };

    const post = await createPost(c.env.DB, input, generateUniqueSlug);
    return c.json({ post }, 201);
  } catch (error) {
    console.error('Create post error:', error);
    return c.json({ error: 'Failed to create post' }, 500);
  }
});

app.put('/admin/posts/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) {
      return c.json({ error: 'Invalid post ID' }, 400);
    }

    const body = await c.req.json();
    const { title, slug, content_markdown, excerpt, status, published_at, metadata } = body;

    const input: UpdatePostInput = {
      ...(title !== undefined && { title }),
      ...(slug !== undefined && { slug }),
      ...(content_markdown !== undefined && { content_markdown }),
      ...(excerpt !== undefined && { excerpt }),
      ...(status !== undefined && { status }),
      ...(published_at !== undefined && { published_at }),
      ...(metadata !== undefined && { metadata }),
    };

    const post = await updatePost(c.env.DB, id, input);
    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    return c.json({ post });
  } catch (error) {
    console.error('Update post error:', error);
    return c.json({ error: 'Failed to update post' }, 500);
  }
});

app.delete('/admin/posts/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) {
      return c.json({ error: 'Invalid post ID' }, 400);
    }

    const success = await deletePost(c.env.DB, id);
    if (!success) {
      return c.json({ error: 'Post not found' }, 404);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Delete post error:', error);
    return c.json({ error: 'Failed to delete post' }, 500);
  }
});

app.notFound((c) => c.json({ error: 'Not found' }, 404));

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Internal Server Error' }, 500);
});

export const ALL = (ctx: APIContext): Response | Promise<Response> =>
  app.fetch(ctx.request, env, ctx.locals.cfContext);

import { Hono } from 'hono';
import type { APIContext } from 'astro';
import { env } from 'cloudflare:workers';
import {
  createGuestbookEntry,
  getPostBySlug,
  getPublishedPosts,
  getGuestbookEntries,
} from '@/lib/db';
import { identityFromId } from '@/lib/identity';
import type { GuestbookEntryView } from '@/lib/types';

const app = new Hono<{ Bindings: Env }>().basePath('/api');

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

app.notFound((c) => c.json({ error: 'Not found' }, 404));

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Internal Server Error' }, 500);
});

export const ALL = (ctx: APIContext): Response | Promise<Response> =>
  app.fetch(ctx.request, env, ctx.locals.cfContext);

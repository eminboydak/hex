import { Hono } from 'hono';
import type { APIContext } from 'astro';
import { env } from 'cloudflare:workers';
import { getPostBySlug, getPublishedPosts } from '@/lib/db';

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

app.notFound((c) => c.json({ error: 'Not found' }, 404));

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Internal Server Error' }, 500);
});

export const ALL = (ctx: APIContext): Response | Promise<Response> =>
  app.fetch(ctx.request, env, ctx.locals.cfContext);

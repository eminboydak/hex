// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  // Disable Astro Sessions so the Cloudflare adapter does not auto-provision an
  // unconfigured `SESSION` KV namespace binding in the generated wrangler config.
  session: false,
  adapter: cloudflare({
    imageService: 'compile',
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [preact()],
  vite: {
    plugins: [tailwindcss()],
  },
});

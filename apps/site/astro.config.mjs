// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://kcsu.org.uk',
  trailingSlash: 'never',
  build: { format: 'file' },
  compressHTML: true,
  redirects: {
    '/about-us/team': { status: 301, destination: '/about-us/exec' },
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});

import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { fileURLToPath } from 'node:url';

import vercel from '@astrojs/vercel/static';

// https://astro.build/config
export default defineConfig({
  outDir: '../../dist/packages/website',
  integrations: [react(), tailwind({
    configFile: fileURLToPath(new URL('./tailwind.config.cjs', import.meta.url))
  })],
  output: 'static',
  adapter: vercel()
});
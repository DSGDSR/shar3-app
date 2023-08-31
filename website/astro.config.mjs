import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { fileURLToPath } from 'node:url';

import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  outDir: '../../dist/website',
  integrations: [react(), tailwind({
    configFile: fileURLToPath(new URL('./tailwind.config.cjs', import.meta.url))
  })],
  output: 'server',
  adapter: vercel()
});
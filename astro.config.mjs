// @ts-check
import { defineConfig } from "astro/config";

import preact from "@astrojs/preact";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: 'https://mrodriguez956.github.io',
  base: 'the-blog',
  integrations: 
  [react()],

  vite: {
    plugins: [tailwindcss()],
  },
});
// @ts-check
import { defineConfig } from "astro/config";

import preact from "@astrojs/preact";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [    
    preact({
      include: ['**/preact/*'],
     }),
    react({
      include: ['**/react/*'],
    }),],

  vite: {
    plugins: [tailwindcss()],
  },
});
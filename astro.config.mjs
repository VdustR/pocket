import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://vdustr.dev",
  base: "/pocket",
  integrations: [svelte()],
  vite: {
    plugins: [tailwindcss()],
    define: {
      __BUILD_TIME__: JSON.stringify(Date.now().toString(36)),
    },
  },
  output: "static",
});

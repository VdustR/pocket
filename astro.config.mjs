import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://vdustr.dev",
  base: "/pocket",
  integrations: [svelte()],
  vite: {
    plugins: [tailwindcss()],
  },
  output: "static",
});

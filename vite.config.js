// @ts-check

import { svelte } from "@sveltejs/vite-plugin-svelte";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import WindiCSS from "vite-plugin-windicss";

const _dirname = dirname(
  fileURLToPath(
    // because of type: module
    // @ts-ignore
    import.meta.url
  )
);

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  plugins: [WindiCSS(), svelte()],
  resolve: {
    alias: {
      "@": resolve(_dirname, "src"),
    },
  },
});

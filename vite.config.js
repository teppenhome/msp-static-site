import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  root: ".",
  publicDir: "public",

  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "./index.html",
        consulting: "./consulting.html",
      },
    },
  },
});

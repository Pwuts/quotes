import { defineNuxtConfig } from "nuxt/config";
import { createRequire } from "module";
import path from "path";

const { resolve } = createRequire(import.meta.url);
const prismaClientIndexBrowser = resolve("@prisma/client/index-browser").replace(
  `@prisma/client`,
  `.prisma/client`,
);

// https://nuxt.com/docs/guide/directory-structure/nuxt-config
export default defineNuxtConfig({
  srcDir: "src/",

  typescript: {
    typeCheck: true,
  },

  $meta: {
    title: "QuoteDB",
  },

  compatibilityDate: "2025-04-13",

  vite: {
    resolve: {
      alias: {
        ".prisma/client/index-browser": path.relative(
          __dirname,
          prismaClientIndexBrowser,
        ),
      },
    },
  },
});

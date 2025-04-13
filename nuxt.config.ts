import { defineNuxtConfig } from "nuxt/config";

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
});

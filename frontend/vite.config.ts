/// <reference types="vitest" />

import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import path from "node:path";
import {loadEnv} from "vite";

import dotenvExpand from "dotenv-expand";

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), "");

  const envData = dotenvExpand.expand({
    parsed: {...env}
  }).parsed ?? env;

  return {
    define: {
      "import.meta.env": envData
    },

    plugins: [
      vue(),
      vuetify({
        autoImport: true,
      }),
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "vuetify/styles" as *;`,
        },
      },
    },

    server: {
      port: 5173,
      open: false,
    },

    // Vitestの設定
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./tests/setup.ts"],
      include: ["src/**/*.{test,spec}.{ts,tsx,js,jsx}"],
    },
  }
});

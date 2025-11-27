import js from "@eslint/js";
import tseslint from "typescript-eslint";
import vue from "eslint-plugin-vue";
import eslintConfigPrettier from "eslint-config-prettier";
import unusedImports from "eslint-plugin-unused-imports";

export default tseslint.config(
  {
    ignores: ["dist", "coverage", "node_modules"],
  },

  {
    extends: [
      // javascriptの推奨ルール
      js.configs.recommended,

      // typescriptの推奨ルール
      ...tseslint.configs.recommended,

      ...vue.configs["flat/recommended"],
    ],
    files: ["src/**/*.{js,jsx,ts,tsx,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      "unused-imports/no-unused-imports": "error",
    },
  },

  eslintConfigPrettier,
);

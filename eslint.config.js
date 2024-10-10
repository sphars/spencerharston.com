import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ["!**/eleventy.config.js", "**/dist", "**/node_modules"],
  },
  ...compat.extends("eslint:recommended"),
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },

      ecmaVersion: 2022,
      sourceType: "module",
    },

    rules: {
      indent: ["warn", 2],
      semi: ["warn", "always"],
      quotes: ["warn", "double"],
      "no-unused-vars": ["warn"],
    },
  },
  {
    files: ["src/assets/scripts/*.js"],

    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];

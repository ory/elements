import eslint from "@eslint/js"
import tsParser from "@typescript-eslint/parser"
import formatjs from "eslint-plugin-formatjs"
import pluginPromise from "eslint-plugin-promise"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import storybook from "eslint-plugin-storybook"
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss"
import tsdoc from "eslint-plugin-tsdoc"
import globals from "globals"
import tseslint from "typescript-eslint"
import path from "node:path"

const config = tseslint.config([
  {
    ignores: [
      "**/assets/*.js",
      "**/.storybook/**",
      "**/dist/**",
      "**/storybook-static/**",
      "**/*.config.{js,mjs,cjs,ts}",
      "examples/nextjs-spa/**", // This project is not maintained
      "**/jest.preset.{cjs,ts}",
      "**/tsup.config.{js,ts}",
      "**/.next/**",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  pluginPromise.configs["flat/recommended"],
  storybook.configs["flat/recommended"],
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    files: ["**/src/**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
      react,
      tsdoc,
      formatjs,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: "module",

      parserOptions: {
        tsconfigRootDir: "./",

        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      // TODO: https://github.com/microsoft/tsdoc/issues/374 (and specifically https://github.com/microsoft/tsdoc/issues/374#issuecomment-2336536959)
      "tsdoc/syntax": "off",
      "formatjs/no-offset": "error",
      "@typescript-eslint/no-floating-promises": "error",
      // The legacy elements is written with lots of any types
      "no-unused-vars": "off",
      "no-undef": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "no-extra-semi": "off",
    },
  },
  {
    files: [
      "examples/nextjs-app-router/**/*.ts",
      "examples/nextjs-app-router/**/*.tsx",
    ],
    languageOptions: {
      parserOptions: {
        project: ["./examples/nextjs-app-router/tsconfig.json"],
      },
    },
  },
  {
    name: "elements-react",
    files: ["packages/elements-react/**"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "better-tailwindcss": eslintPluginBetterTailwindcss,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // enable all recommended rules to report an error
      ...eslintPluginBetterTailwindcss.configs["recommended-error"].rules,
      "better-tailwindcss/enforce-consistent-line-wrapping": "off",
      "better-tailwindcss/no-unregistered-classes": [
        "error",
        { ignore: ["ory-elements"] },
      ],
    },
    settings: {
      "better-tailwindcss": {
        // // tailwindcss 4: the path to the entry file of the css based tailwind config (eg: `src/global.css`)
        entryPoint: "packages/elements-react/src/theme/default/global.css",
        // tailwindcss 3: the path to the tailwind config file (eg: `tailwind.config.js`)
        // "tailwindConfig": "/Users/jonas.hungershausen/Repositories/cloud/elements/packages/elements-react/tailwind.config.ts"
      },
    },
  },
  {
    name: "tests",
    files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-call": "off",
    },
  },
  {
    files: ["packages/elements-react/stories/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
])

export default config

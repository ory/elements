import eslint from "@eslint/js"
import tsParser from "@typescript-eslint/parser"
import formatjs from "eslint-plugin-formatjs"
import pluginPromise from "eslint-plugin-promise"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import storybook from "eslint-plugin-storybook"
import tailwind from "eslint-plugin-tailwindcss"
import tsdoc from "eslint-plugin-tsdoc"
import globals from "globals"
import tseslint from "typescript-eslint"

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
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    files: ["packages/elements-react-stories/**"],
    rules: {
      // The stories need to be able to require the JSON files, at the moment
      "@typescript-eslint/no-require-imports": "off",
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
    name: "tailwind",
    files: ["packages/elements-react/**/*.{js,jsx,ts,tsx}"],
    ...tailwind.configs["flat/recommended"][0],
    ...tailwind.configs["flat/recommended"][1],
    rules: {
      ...tailwind.configs["flat/recommended"][1].rules,
      "tailwindcss/classnames-order": "off",
      "tailwindcss/no-custom-classname": [
        "warn",
        {
          cssFiles: [
            "packages/elements-react/**/*.css",
            "!**/node_modules",
            "!**/.*",
            "!**/dist",
            "!**/build",
          ],
        },
      ],
    },
    settings: {
      tailwindcss: {
        config: "packages/elements-react/tailwind.config.ts",
        callees: ["classnames", "clsx", "ctl", "cn", "cva"],
      },
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

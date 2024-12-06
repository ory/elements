import eslint from "@eslint/js"
import tsParser from "@typescript-eslint/parser"
import formatjs from "eslint-plugin-formatjs"
import playwright from "eslint-plugin-playwright"
import pluginPromise from "eslint-plugin-promise"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import storybook from "eslint-plugin-storybook"
import tsdoc from "eslint-plugin-tsdoc"
import globals from "globals"
import tseslint from "typescript-eslint"

const config = tseslint.config([
  {
    ignores: [
      "**/assets/*.js",
      "!.storybook",
      "**/dist/**",
      "**/storybook-static/**",
      "babel.config.js",
      "eslint.config.mjs",
      "**/playwright-report/**",
      "examples/nextjs-spa/**", // This project is not maintained
      "**/playwright.config.{js,ts}",
      "**/playwright-ct.config.ts",
      "**/jest.config.{js,ts}",
      "**/jest.preset.{cjs,ts}",
      "playwright/**",
      "**/tsup.config.{js,ts}",
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
      "tsdoc/syntax": "warn",
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
    name: "playwright-tests",
    files: ["src/**/*.spec.ts"],
    ...playwright.configs["flat/recommended"],
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      "no-empty-pattern": "off",
    },
  },
  {
    name: "legacy-examples",
    files: ["examples/preact-spa/**", "examples/react-spa/**"],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: "./",
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      tsdoc,
    },
    rules: {
      "tsdoc/syntax": "warn",
      // The legacy examples violate these rule a ton, so we disable it
      "promise/always-return": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-explicit-any": "off",
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
    name: "legacy-elements",
    files: ["src/react-components/**", "src/ui/**"],
    rules: {
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "tsdoc/syntax": "off",
      "@typescript-eslint/no-explicit-any": "off",
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
])

export default config

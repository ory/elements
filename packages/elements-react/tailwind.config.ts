// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { Config } from "tailwindcss"

import variables from "./variables-processed.json"
import plugin from "tailwindcss/plugin"

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      padding: {
        "4.5": "1.125rem",
      },
      /* We need the default border radius as well in some cases. */
      borderRadius: variables.borderRadius,
    },
    fontFamily: {
      sans: ['"Inter var", sans-serif'],
    },
    colors: {
      ...variables.colors.light,
    },
    backgroundColor: {
      ...variables.colors.light,
    },
    borderColor: {
      ...variables.colors.light,
    },
    ringColor: {
      ...variables.colors.light,
    },
    fill: {
      ...variables.colors.light,
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("loading", "&[data-loading=true]")
    }),
  ],
}

export default config

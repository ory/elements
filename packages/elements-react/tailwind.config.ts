// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { Config } from "tailwindcss"

import plugin from "tailwindcss/plugin"
import OryElementsTailwindConfig from "./tailwind/defaults"

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
      padding: {
        "4.5": "1.125rem",
      },
    },
    fontFamily: {
      sans: ["var(--font-sans)"],
    },
    ...OryElementsTailwindConfig,
    data: {
      loading: `loading~="true"`,
    },
  },
  plugins: [
    plugin((plugin) => {
      plugin.addVariant("loading", "&[data-loading=true]")
    }),
    require("tailwindcss-animate"),
  ],
}

export default config

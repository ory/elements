import {
  createGlobalTheme,
  createGlobalThemeContract,
  globalStyle,
} from "@vanilla-extract/css"
import { ThemeVars } from "@vanilla-extract/css/dist/declarations/src/types"

import { defaultLightTheme, Theme } from "./consts"

export const oryTheme: ThemeVars<Theme> = createGlobalThemeContract(
  {
    fontFamily: "font-family",
    fontStyle: "font-style",
    accent: {
      def: "accent-def",
      muted: "accent-muted",
      emphasis: "accent-emphasis",
      disabled: "accent-disabled",
      subtle: "accent-subtle",
    },
    foreground: {
      def: "foreground-def",
      muted: "foreground-muted",
      subtle: "foreground-subtle",
      disabled: "foreground-disabled",
      onDark: "foreground-on-dark",
      onAccent: "foreground-on-accent",
      onDisabled: "foreground-on-disabled",
    },
    background: {
      surface: "background-surface",
      canvas: "background-canvas",
      subtle: "background-subtle",
    },
    error: {
      def: "error-def",
      subtle: "error-subtle",
      muted: "error-muted",
      emphasis: "error-emphasis",
    },
    success: {
      emphasis: "success-emphasis",
    },
    border: {
      def: "border-def",
    },
    text: {
      def: "text-def",
      disabled: "text-disabled",
    },
    input: {
      background: "input-background",
      disabled: "input-disabled",
      placeholder: "input-placeholder",
      text: "input-text",
    },
  },
  (value) => `ory-theme-${value}`,
)

createGlobalTheme(":root", oryTheme, {
  ...defaultLightTheme,
})

globalStyle("html, body", {
  textRendering: "geometricPrecision",
  WebkitFontSmoothing: "antialiased",
  fontFamily: oryTheme.fontFamily,
  fontStyle: oryTheme.fontStyle,
  boxSizing: "border-box",
})

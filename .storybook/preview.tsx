import { ThemeProvider, IntlProvider, locales } from "@ory/elements"
import { StoryFn } from "@storybook/react"

import "@ory/elements/assets/normalize.css"

import "@ory/elements/assets/fa-brands.min.css"
import "@ory/elements/assets/fa-solid.min.css"
import "@ory/elements/assets/fontawesome.min.css"
import "@ory/elements/assets/inter-font.css"
import "@ory/elements/assets/jetbrains-mono-font.css"
import "@ory/elements/style.css"

import React from "react"

export const globalTypes = {
  theme: {
    name: "Theme",
    defaultValue: "light",
    toolbar: {
      icon: "circlehollow",
      items: [
        { value: "light", icon: "circlehollow", title: "light" },
        { value: "dark", icon: "circle", title: "dark" },
      ],
      name: true,
    },
  },
  locale: {
    name: "Locale",
    defaultValue: "en",
    toolbar: {
      icon: "globe",
      items: Object.keys(locales).map((locale) => ({
        value: locale,
        icon: "globe",
        title: locale,
      })),
    },
  },
}

type Context = {
  globals: {
    theme: "light" | "dark"
    locale: keyof typeof locales
  }
}

export const withTheme = (StoryFn: StoryFn, context: Context) => {
  const theme = context.globals.theme
  return (
    <ThemeProvider theme={theme} enableFontSmoothing={true}>
      <StoryFn />
    </ThemeProvider>
  )
}

export const withIntl = (StoryFn: StoryFn, context: Context) => (
  <IntlProvider locale={context.globals.locale}>
    <StoryFn />
  </IntlProvider>
)

export const decorators = [withTheme, withIntl]
export const tags = ["autodocs"];

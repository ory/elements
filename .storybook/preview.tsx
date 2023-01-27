import { ThemeProvider } from "@ory/elements"
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
}

export const withTheme = (StoryFn, context) => {
  const theme = context.globals.theme
  return (
    <ThemeProvider theme={theme} enableFontSmoothing={true}>
      <StoryFn />
    </ThemeProvider>
  )
}

export const decorators = [withTheme]

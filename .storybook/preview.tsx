import { ThemeProvider } from "@ory/elements"
import "@ory/elements/style.css"

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
    <ThemeProvider theme={theme}>
      <StoryFn />
    </ThemeProvider>
  )
}

export const decorators = [withTheme]

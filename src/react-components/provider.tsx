import React from "react"
import { assignInlineVars } from "@vanilla-extract/dynamic"
import { defaultDarkTheme, defaultLightTheme, oryTheme, Theme } from "../theme"

// normalize the standard browser CSS
import "../assets/normalize.css"
// add theme 'Inter' font support
import "../assets/inter-font.css"

export type ThemeProviderProps = {
  theme?: "light" | "dark"
  themeOverrides?: Partial<Theme>
  children?: React.ReactNode
}

export const ThemeProvider = ({
  children,
  theme,
  themeOverrides,
}: ThemeProviderProps) => (
  <div
    style={assignInlineVars(oryTheme, {
      ...(theme === "dark" ? defaultDarkTheme : defaultLightTheme),
      ...themeOverrides,
    })}
  >
    {children}
  </div>
)

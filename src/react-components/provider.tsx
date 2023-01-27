import { assignInlineVars } from "@vanilla-extract/dynamic"
import React from "react"
import { defaultDarkTheme, defaultLightTheme, oryTheme, Theme } from "../theme"

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

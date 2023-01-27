import { assignInlineVars } from "@vanilla-extract/dynamic"
import cn from "classnames"

import { defaultDarkTheme, defaultLightTheme, oryTheme, Theme } from "../theme"
import {
  themeProviderFontRenderingStyle,
  themeProviderStyle,
} from "../theme/theme-provider.css"

export type ThemeProviderProps = {
  theme?: "light" | "dark"
  themeOverrides?: Partial<Theme>
  enableFontSmoothing?: boolean
  children?: React.ReactNode | React.ReactElement
}

export const ThemeProvider = ({
  children,
  theme,
  themeOverrides,
  enableFontSmoothing,
}: ThemeProviderProps) => (
  <div
    className={cn(
      themeProviderStyle,
      enableFontSmoothing && themeProviderFontRenderingStyle,
    )}
    style={assignInlineVars(oryTheme, {
      ...(theme === "dark" ? defaultDarkTheme : defaultLightTheme),
      ...themeOverrides,
    })}
  >
    {children}
  </div>
)

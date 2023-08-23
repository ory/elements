import { assignInlineVars } from "@vanilla-extract/dynamic"
import cn from "classnames"
import { ReactElement, ReactNode } from "react"
import { IntlProvider } from "react-intl"

import { defaultDarkTheme, defaultLightTheme, oryTheme, Theme } from "../theme"
import {
  themeProviderFontRenderingStyle,
  themeProviderStyle,
} from "../theme/theme-provider.css"
import * as locales from "./../locales"

export type ThemeProviderProps = {
  theme?: "light" | "dark"
  themeOverrides?: Partial<Theme>
  enableFontSmoothing?: boolean
  children?: ReactNode | ReactElement | ReactElement[] | ReactNode[]
  locale?: keyof typeof locales
}

export const ThemeProvider = ({
  children,
  theme,
  themeOverrides,
  enableFontSmoothing,
  locale = "en",
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
    <IntlProvider
      locale={locale}
      defaultLocale="en"
      messages={locales[locale]}
      defaultRichTextElements={{
        del: (chunks) => <del>{chunks}</del>,
      }}
    >
      {children}
    </IntlProvider>
  </div>
)

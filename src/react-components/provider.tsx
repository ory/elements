import { assignInlineVars } from "@vanilla-extract/dynamic"
import cn from "classnames"
import { PropsWithChildren, ReactElement, ReactNode } from "react"
import { IntlProvider as OriginalIntlProvider } from "react-intl"

import { defaultDarkTheme, defaultLightTheme, oryTheme, Theme } from "../theme"
import {
  themeProviderFontRenderingStyle,
  themeProviderStyle,
} from "../theme/theme-provider.css"
import * as locales from "./../locales"

export interface ThemeProviderProps {
  theme?: "light" | "dark"
  themeOverrides?: Partial<Theme>
  enableFontSmoothing?: boolean
  children?: ReactNode | ReactElement | ReactElement[] | ReactNode[]
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

export const IntlProvider = ({
  locale = "en",
  children,
}: PropsWithChildren<{
  locale?: keyof typeof locales
}>) => (
  <OriginalIntlProvider
    locale={locale}
    defaultLocale="en"
    messages={locales[locale]}
    defaultRichTextElements={{
      del: (chunks) => <del>{chunks}</del>,
    }}
  >
    {children}
  </OriginalIntlProvider>
)

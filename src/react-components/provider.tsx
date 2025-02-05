// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

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

export type TranslationFile = {
  [K in keyof typeof locales.en]: string
}

// ISO 639-1 language codes
// https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
export const LanguageCodes = [
  "ab",
  "aa",
  "af",
  "sq",
  "am",
  "ar",
  "hy",
  "as",
  "ay",
  "az",
  "ba",
  "eu",
  "bn",
  "dz",
  "bh",
  "bi",
  "br",
  "bg",
  "my",
  "be",
  "km",
  "ca",
  "zh",
  "co",
  "hr",
  "cs",
  "da",
  "nl",
  "en",
  "eo",
  "et",
  "fo",
  "fj",
  "fi",
  "fr",
  "fy",
  "gd",
  "gl",
  "ka",
  "de",
  "el",
  "kl",
  "gn",
  "gu",
  "ha",
  "iw",
  "hi",
  "hu",
  "is",
  "in",
  "ia",
  "ie",
  "ik",
  "ga",
  "it",
  "ja",
  "jw",
  "kn",
  "ks",
  "kk",
  "rw",
  "ky",
  "rn",
  "ko",
  "ku",
  "lo",
  "la",
  "lv",
  "ln",
  "lt",
  "mk",
  "mg",
  "ms",
  "ml",
  "mt",
  "mi",
  "mr",
  "mo",
  "mn",
  "na",
  "ne",
  "no",
  "oc",
  "or",
  "om",
  "ps",
  "fa",
  "pl",
  "pt",
  "pa",
  "qu",
  "rm",
  "ro",
  "ru",
  "sm",
  "sg",
  "sa",
  "sr",
  "sh",
  "st",
  "tn",
  "sn",
  "sd",
  "si",
  "ss",
  "sk",
  "sl",
  "so",
  "es",
  "su",
  "sw",
  "sv",
  "tl",
  "tg",
  "ta",
  "tt",
  "te",
  "th",
  "bo",
  "ti",
  "to",
  "ts",
  "tr",
  "tk",
  "tw",
  "uk",
  "ur",
  "uz",
  "vi",
  "vo",
  "cy",
  "wo",
  "xh",
  "ji",
  "yo",
  "zu",
] as const

export type CustomLanguageFormats = {
  [k in (typeof LanguageCodes)[number]]?: Partial<TranslationFile>
}

export interface CustomTranslations {
  customTranslations: Partial<CustomLanguageFormats>
  locale: (typeof LanguageCodes)[number]
  defaultLocale: (typeof LanguageCodes)[number]
}

const isCustomTranslations = (o: unknown): o is CustomTranslations => {
  return (o as CustomTranslations).customTranslations !== undefined
}

export type SupportedLanguageFormats = {
  [k in keyof typeof locales]: TranslationFile
}

type locale = keyof typeof locales

export interface SupportedTranslations {
  locale?: locale
  defaultLocale?: locale
}

export type IntlProviderProps<Type> = Type extends CustomTranslations
  ? PropsWithChildren<CustomTranslations>
  : PropsWithChildren<SupportedTranslations>

export const IntlProvider = <
  T extends SupportedTranslations | CustomTranslations = SupportedTranslations,
>({
  children,
  ...props
}: IntlProviderProps<T>) => {
  let translation = locales.en

  if (props.locale && props.locale in locales) {
    translation = { ...locales.en, ...locales[props.locale as locale] }
  }

  const intlProps = isCustomTranslations(props)
    ? {
        locale: props.locale,
        defaultLocale: props.defaultLocale,
        messages: props.customTranslations[props.locale],
      }
    : {
        locale: props.locale ?? "en",
        defaultLocale: props.defaultLocale ?? "en",
        messages: translation,
      }

  return (
    <OriginalIntlProvider
      {...intlProps}
      onWarn={() => ({})}
      defaultRichTextElements={{
        del: (chunks) => <del>{chunks}</del>,
      }}
    >
      {children}
    </OriginalIntlProvider>
  )
}

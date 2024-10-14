// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { merge } from "lodash"
import { PropsWithChildren } from "react"
import { IntlProvider as OriginalIntlProvider } from "react-intl"
import { LocaleMap, locales } from "../locales"

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

export type Locale = keyof typeof locales

export type IntlContextProps = {
  locale: Locale
  customTranslations?: Partial<LocaleMap>
}

export const IntlProvider = ({
  children,
  locale,
  customTranslations,
}: PropsWithChildren<IntlContextProps>) => {
  const messages = merge({}, locales, customTranslations)

  return (
    <OriginalIntlProvider
      onWarn={() => ({})}
      defaultRichTextElements={{
        del: (chunks) => <del>{chunks}</del>,
      }}
      locale={locale}
      messages={messages[locale]}
      defaultLocale="en"
    >
      {children}
    </OriginalIntlProvider>
  )
}

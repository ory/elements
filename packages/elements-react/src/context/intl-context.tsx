import { PropsWithChildren, useContext } from "react"
import { IntlContext, IntlProvider as OriginalIntlProvider } from "react-intl"
import * as locales from "../locales"

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

/**
 * A record of custom translations for a specific locale.
 */
export type CustomLanguageFormats = {
  [k in (typeof LanguageCodes)[number]]?: Partial<TranslationFile>
}

export type CustomTranslations = {
  customTranslations: Partial<CustomLanguageFormats>
  locale: (typeof LanguageCodes)[number]
  defaultLocale: (typeof LanguageCodes)[number]
}

export const isCustomTranslations = (o: unknown): o is CustomTranslations => {
  return (
    typeof o === "object" &&
    !!o &&
    "customTranslations" in o &&
    !!o.customTranslations
  )
}

export type Locale = keyof typeof locales

export type SupportedTranslations = {
  locale?: Locale
  defaultLocale?: string
}

export type OryIntlProviderProps<Translation> =
  Translation extends CustomTranslations
    ? CustomTranslations
    : SupportedTranslations

export const IntlProvider = <
  Translation extends
    | SupportedTranslations
    | CustomTranslations = SupportedTranslations,
>({
  children,
  ...props
}: PropsWithChildren<OryIntlProviderProps<Translation>>) => {
  const intlCtx = useContext(IntlContext)

  if (intlCtx) {
    return children
  }

  let translation = locales.en

  if (props.locale && props.locale in locales) {
    translation = locales[props.locale as Locale]
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

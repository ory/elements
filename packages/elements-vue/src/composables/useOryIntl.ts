// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { inject, provide, type InjectionKey } from "vue"
import { createI18n, useI18n, type I18n } from "vue-i18n"
import { OryLocales, type Locale, type LocaleMap } from "../locales"
import { OryConfigKey } from "./useOryConfig"

export type OryIntlConfig = {
  locale: Locale
  customTranslations?: Partial<LocaleMap>
}

type OryIntlContextValue = {
  i18n: I18n
  locale: Locale
}

const OryIntlKey: InjectionKey<OryIntlContextValue> = Symbol("OryIntl")

/**
 * Merges custom translations with the default Ory translations.
 */
function mergeTranslations(
  locale: Locale,
  customTranslations?: Record<string, string>,
): Record<string, string> {
  const baseMessages = OryLocales[locale] || OryLocales.en
  if (!customTranslations) {
    return baseMessages
  }
  return {
    ...baseMessages,
    ...customTranslations,
  }
}

/**
 * Creates and provides the Ory i18n context.
 *
 * @param config - The i18n configuration with locale and optional custom translations
 */
export function provideOryIntl(config: OryIntlConfig) {
  const { locale, customTranslations } = config

  const messages = mergeTranslations(locale, customTranslations?.[locale])

  const i18n = createI18n({
    legacy: false,
    locale,
    fallbackLocale: "en",
    messages: {
      [locale]: messages,
      en: OryLocales.en,
    },
  })

  const context: OryIntlContextValue = {
    i18n,
    locale,
  }

  provide(OryIntlKey, context)

  return context
}

// Cache for the auto-created i18n instance to avoid recreating on each call
let autoI18nInstance: I18n | null = null
let autoI18nLocale: string | null = null

/**
 * Use the Ory i18n context.
 * Returns the vue-i18n composer instance.
 * If no OryIntl context is provided, creates one automatically based on the OryConfig locale.
 */
export function useOryIntl() {
  const context = inject(OryIntlKey, null)

  // If OryIntl context is provided, use it
  if (context) {
    return useI18n()
  }

  // Try to get locale from OryConfig, otherwise default to English
  const oryConfig = inject(OryConfigKey, null)
  const configLocale =
    (oryConfig?.config.value.project.default_locale as Locale) || "en"

  // Create or reuse auto i18n instance
  if (!autoI18nInstance || autoI18nLocale !== configLocale) {
    autoI18nLocale = configLocale

    // Build messages object with all locales for proper fallback
    const messages: Record<string, Record<string, string>> = {
      [configLocale]: OryLocales[configLocale] || OryLocales.en,
    }

    // Always include English as fallback
    if (configLocale !== "en") {
      messages.en = OryLocales.en
    }

    autoI18nInstance = createI18n({
      legacy: false,
      locale: configLocale,
      fallbackLocale: "en",
      messages,
      silentFallbackWarn: true,
      silentTranslationWarn: true,
    })
  }

  // Return a composer-like interface that works without vue-i18n plugin
  const localeMessages = OryLocales[configLocale] || OryLocales.en
  const fallbackMessages = OryLocales.en

  return {
    t: (key: string, values?: Record<string, unknown>) => {
      let translation = localeMessages[key] || fallbackMessages[key] || key

      // Replace placeholders like {parts} with values
      if (values && typeof translation === "string") {
        Object.entries(values).forEach(([k, v]) => {
          translation = translation.replace(
            new RegExp(`\\{${k}\\}`, "g"),
            String(v),
          )
        })
      }

      return translation
    },
    locale: { value: configLocale },
  }
}

export { type Locale, type LocaleMap, OryLocales }

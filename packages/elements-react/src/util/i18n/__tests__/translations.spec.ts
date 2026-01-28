// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryLocales as supportedLanguages } from "../../../locales"

type TemplateStrings = {
  [k in keyof typeof supportedLanguages.en]: string[]
}

describe("Translations", () => {
  let templates: Partial<TemplateStrings>

  beforeAll(() => {
    const en = supportedLanguages.en
    templates = {}
    for (const [key, value] of Object.entries(en)) {
      const matches = value.match(/\{.+?}/g)
      if (!matches) {
        continue
      }
      templates[key] = matches
    }
  })

  for (const [language, translation] of Object.entries(supportedLanguages)) {
    test(`language keys and templates match [${language}]`, () => {
      expect(Object.keys(translation).sort()).toEqual(
        Object.keys(supportedLanguages.en).sort(),
      )
    })
  }

  for (const [language, translation] of Object.entries(supportedLanguages)) {
    test(`translations have no missing keys lang=${language}`, () => {
      const enKeys = Object.keys(supportedLanguages.en)
      const translationKeys = Object.keys(translation)
      const missingKeys = enKeys.filter((key) => !translationKeys.includes(key))
      expect(missingKeys).toEqual([])
    })
  }

  for (const [language, translation] of Object.entries(supportedLanguages)) {
    if (language === "en") {
      continue
    }

    test(`placeholders are preserved in translations [${language}]`, () => {
      const issues: string[] = []

      for (const [key, enValue] of Object.entries(supportedLanguages.en)) {
        const translatedValue = translation[key]
        if (!translatedValue) {
          continue
        }

        // Extract placeholders from English source (e.g., {provider}, {contactSupportEmail})
        const enPlaceholders = (enValue.match(/\{[^}]+\}/g) || []).sort()
        const translatedPlaceholders = (
          translatedValue.match(/\{[^}]+\}/g) || []
        ).sort()

        // Check if placeholders match
        if (
          JSON.stringify(enPlaceholders) !==
          JSON.stringify(translatedPlaceholders)
        ) {
          issues.push(
            `Key "${key}": expected placeholders ${JSON.stringify(enPlaceholders)}, got ${JSON.stringify(translatedPlaceholders)}`,
          )
        }
      }

      expect(issues).toEqual([])
    })
  }

  for (const [language, translation] of Object.entries(supportedLanguages)) {
    if (language === "en") {
      continue
    }

    test(`empty keys match English empty keys [${language}]`, () => {
      const issues: string[] = []

      for (const [key, enValue] of Object.entries(supportedLanguages.en)) {
        const translatedValue = translation[key]

        // If English value is empty, translation should also be empty
        if (enValue === "" && translatedValue !== "") {
          issues.push(
            `Key "${key}": English value is empty but translation is "${translatedValue}"`,
          )
        }

        // If English value is not empty, translation should not be empty
        if (enValue !== "" && translatedValue === "") {
          issues.push(
            `Key "${key}": English value is "${enValue}" but translation is empty`,
          )
        }
      }

      expect(issues).toEqual([])
    })
  }

  for (const [language, translation] of Object.entries(supportedLanguages)) {
    if (language === "en") {
      continue
    }

    test(`no English fallbacks in translations [${language}]`, () => {
      const issues: string[] = []

      // Keys where matching English text is acceptable (placeholders, technical terms, proper nouns)
      const allowedMatches = new Set([
        "identities.messages.1050006", // {secret}
        "identities.messages.1050009", // {secret}
        "identities.messages.1050015", // {secrets_list}
        "identities.messages.1070001", // Password (technical term)
        "identities.messages.1070002", // {title}
        "identities.messages.1070004", // ID
        "identities.messages.1070007", // Email (technical term)
        "identities.messages.4000001", // {reason}
        "identities.messages.5000001", // {reason}
        "logout.reject-button", // No (same in many languages)
        "property.code", // code (technical term)
        "property.email", // email (technical term)
        "property.identifier", // identifier (technical term)
        "property.password", // password (technical term)
        "property.username", // username (technical term)
        "settings.navigation-passkey", // Passkeys (proper noun)
        "settings.navigation-password", // Password (technical term)
        "settings.navigation-profile", // Profile (same in many languages)
        "settings.navigation-totp", // Authenticator App (technical/product name)
        "settings.navigation-webauthn", // Hardware Tokens (technical term)
        "two-step.password.title", // Password (technical term)
        "two-step.webauthn.title", // Security key (technical term)
      ])

      for (const [key, enValue] of Object.entries(supportedLanguages.en)) {
        const translatedValue = translation[key]

        // Skip empty values
        if (!enValue || !translatedValue) {
          continue
        }

        // Skip allowed exceptions
        if (allowedMatches.has(key)) {
          continue
        }

        // Check if the translation is exactly the same as English (potential fallback)
        if (enValue === translatedValue) {
          issues.push(
            `Key "${key}": translation matches English text "${enValue}"`,
          )
        }
      }

      expect(issues).toEqual([])
    })
  }
})

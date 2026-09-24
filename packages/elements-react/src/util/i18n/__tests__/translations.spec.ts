// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  MessageFormatElement,
  parse,
  TYPE,
} from "@formatjs/icu-messageformat-parser"
import { OryLocales as supportedLanguages } from "../../../locales"

// Collects the ICU argument names of a message, including plural/select
// arguments and any arguments nested inside their branches. A regex over
// "{...}" cannot handle the nesting of plural branches.
function extractArgumentNames(message: string): string[] {
  const names = new Set<string>()
  const walk = (elements: MessageFormatElement[]) => {
    for (const element of elements) {
      switch (element.type) {
        case TYPE.argument:
        case TYPE.number:
        case TYPE.date:
        case TYPE.time:
          names.add(element.value)
          break
        case TYPE.select:
        case TYPE.plural:
          names.add(element.value)
          for (const option of Object.values(element.options)) {
            walk(option.value)
          }
          break
        case TYPE.tag:
          walk(element.children)
          break
      }
    }
  }
  walk(parse(message))
  return [...names].sort()
}

describe("Translations", () => {
  for (const [language, translation] of Object.entries(supportedLanguages)) {
    if (language === "en") {
      continue
    }

    test(`no keys that English lacks [${language}]`, () => {
      const extraKeys = Object.keys(translation).filter(
        (key) => !(key in supportedLanguages.en),
      )
      expect(extraKeys).toEqual([])
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

        let translatedArguments: string[]
        try {
          translatedArguments = extractArgumentNames(translatedValue)
        } catch (error) {
          issues.push(
            `Key "${key}": message does not parse as ICU: ${(error as Error).message}`,
          )
          continue
        }

        const enArguments = extractArgumentNames(enValue)
        if (
          JSON.stringify(enArguments) !== JSON.stringify(translatedArguments)
        ) {
          issues.push(
            `Key "${key}": expected arguments ${JSON.stringify(enArguments)}, got ${JSON.stringify(translatedArguments)}`,
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

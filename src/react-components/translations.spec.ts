import { expect, test } from "@playwright/experimental-ct-react"
import * as supportedLanguages from "../locales"

test("keys match", async () => {
  const { en, ...otherLanguages } = supportedLanguages
  const enKeys = Object.keys(en).sort()

  for (const [language, translations] of Object.entries(otherLanguages)) {
    await test.step(`Checking ${language}`, () => {
      expect(Object.keys(translations).sort()).toEqual(enKeys)
    })
  }
})

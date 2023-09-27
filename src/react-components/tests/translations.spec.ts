// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { expect, test as base } from "@playwright/experimental-ct-react"
import * as supportedLanguages from "../../locales"

type Language = {
  [K in keyof typeof supportedLanguages.en]: string
}

type SupportedLanguages = {
  [k in keyof typeof supportedLanguages]: Language
}

type TemplateStrings = {
  [k in keyof typeof supportedLanguages.en]: string[]
}

const test = base.extend<{
  en: Language
  translations: Partial<SupportedLanguages>
  templates: Partial<TemplateStrings>
}>({
  en: async ({}, use) => {
    await use(supportedLanguages.en)
  },
  translations: async ({}, use) => {
    const translations: Partial<SupportedLanguages> = {}
    for (const [language, translation] of Object.entries(supportedLanguages)) {
      translations[language as keyof typeof supportedLanguages] = translation
    }
    await use(translations)
  },
  templates: async ({ en }, use) => {
    const templates: Partial<TemplateStrings> = {}
    for (const [key, value] of Object.entries(en)) {
      const matches = value.match(/\{.+?}/g)
      if (!matches) {
        continue
      }
      templates[key as keyof typeof en] = matches
    }
    await use(templates)
  },
})

test("language keys and templates match", async ({
  en,
  translations,
  templates,
}) => {
  await test.step("Checking language keys", () => {
    for (const translation of Object.values(translations)) {
      expect(Object.keys(translation).sort()).toEqual(Object.keys(en).sort())
    }
  })

  await test.step("Checking template strings", () => {
    Object.entries(translations).forEach(([language, translation]) => {
      console.log(`Checking ${language} template strings`)
      Object.entries(templates).forEach(([key, templateStrings]) => {
        for (const templateString of templateStrings) {
          console.log(`Checking ${language} ${key} ${templateString}`)
          expect(translation[key as keyof typeof en]).toContain(templateString)
        }
      })
    })
  })
})

// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { expect, test as base } from "@playwright/experimental-ct-react"
import * as supportedLanguages from "../../locales"

type TemplateStrings = {
  [k in keyof typeof supportedLanguages.en]: string[]
}

const test = base.extend<{
  templates: Partial<TemplateStrings>
}>({
  templates: async ({}, use) => {
    const en = supportedLanguages.en
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

test("language keys and templates match", async ({ templates }) => {
  for (const [language, translation] of Object.entries(supportedLanguages)) {
    await test.step("Checking language keys for language " + language, () => {
      expect(Object.keys(translation).sort()).toEqual(
        Object.keys(supportedLanguages.en).sort(),
      )
    })
  }

  await test.step("Checking template strings", () => {
    Object.entries(supportedLanguages).forEach(([, translation]) => {
      Object.entries(templates).forEach(([key, templateStrings]) => {
        for (const templateString of templateStrings) {
          expect(
            translation[key as keyof typeof supportedLanguages.en],
          ).toContain(templateString)
        }
      })
    })
  })
})

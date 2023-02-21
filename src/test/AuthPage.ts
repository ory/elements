// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from "@ory/client"
import { expect, Locator } from "@playwright/test"
import { Traits } from "./types"
import { inputNodesToRecord, isUiNode, RandomString } from "./Utils"

const email = `${RandomString()}@example.com`
const password = RandomString()

export const defaultLoginTraits: Record<string, Traits> = {
  identifier: {
    label: "Email",
    type: "input",
    value: email,
  },
  password: {
    label: "Password",
    type: "input",
    value: password,
  },
}

export const defaultTraits: Record<string, Traits> = {
  "traits.email": {
    label: "Email",
    type: "input",
    value: email,
  },
  password: {
    label: "Password",
    type: "input",
    value: password,
  },
}

export const defaultVerificationTraits: Record<string, Traits> = {
  "traits.email": defaultTraits["traits.email"],
}

export class AuthPage {
  readonly locator: Locator
  readonly traits: Record<string, Traits>
  readonly formFields: Record<string, Locator> = {}

  constructor(traits: Record<string, Traits> | UiNode[], locator: Locator) {
    this.locator = locator
    this.traits = isUiNode(traits) ? inputNodesToRecord(traits) : traits
    for (const key in traits) {
      this.formFields[key] = locator.locator(`input[name="${key}"]`)
    }
  }

  async expectTraitFields() {
    for (const key in this.traits) {
      if (this.traits[key].type === "hidden") {
        await expect(this.locator.locator(`*[name="${key}"]`)).toBeHidden()
      } else {
        await expect(this.locator.locator(`*[name="${key}"]`)).toBeVisible()
      }
    }
  }

  async expectTraitLabels() {
    for (const key in this.traits) {
      await expect(this.locator).toContainText(this.traits[key].label)
    }
  }

  async submitForm() {
    for (const key in this.traits) {
      if (this.traits[key].type === "input") {
        await this.formFields[key].fill(this.traits[key].value)
      } else if (this.traits[key].type === "checkbox") {
        await this.formFields[key].click()
      }
    }
    await this.locator.locator('[type="submit"]').click()
  }
}

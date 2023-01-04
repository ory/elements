// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from "@ory/client"
import { expect, Locator } from "@playwright/test"
import { Traits } from "./types"
import { inputNodesToRecord, isUiNode } from "./Utils"

export class ConsentPage {
  readonly locator: Locator
  readonly formFields: Record<string, Locator> = {}

  constructor(locator: Locator) {
    this.locator = locator
  }

  async expectScopeFields(scopes: string[]) {
    for (const scope of scopes) {
      await expect(
        this.locator.locator(`input[type="checkbox"][value="${scope}"]`),
      ).toBeVisible()
    }
  }

  async expectUris(uris: string[]) {
    for (const uri of uris) {
      await expect(this.locator.locator(`a[href="${uri}"]`)).toBeVisible()
    }
  }

  async expectAllowSubmit() {
    await expect(
      this.locator.locator('button[value="accept"][type="submit"]'),
    ).toBeVisible()
  }

  async submitForm() {
    await this.locator.locator('[type="submit"]').click()
  }
}

// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Page } from "@playwright/test"
import { AuthPage, defaultTraits } from "./AuthPage"
import { Traits } from "./types"

export class VerificationPage extends AuthPage {
  readonly pageUrl: URL
  readonly page: Page

  constructor(
    page: Page,
    baseUrl: string,
    traits?: Record<string, Traits>,
    path?: string,
  ) {
    super(
      traits || {
        email: defaultTraits["traits.email"],
      },
      page.locator("*[data-testid='verification-auth-card']"),
    )
    this.page = page
    this.pageUrl = new URL(path || "/verification", baseUrl)
  }

  async goto() {
    await this.page.goto(this.pageUrl.href)
  }
}

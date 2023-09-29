// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Page } from "@playwright/test"
import { defaultTraits } from "../traits"
import { Traits } from "../types"
import { AuthPage } from "./AuthPage"

export class SettingsPage extends AuthPage {
  readonly pageUrl: URL
  readonly page: Page

  constructor(
    page: Page,
    baseUrl: string,
    traits?: Record<string, Traits>,
    path?: string,
  ) {
    super(traits ?? defaultTraits, page.getByTestId("settings-settings-card"))
    this.page = page
    this.pageUrl = new URL(path ?? "/settings", baseUrl)
  }

  async goto() {
    await this.page.goto(this.pageUrl.href)
  }
}

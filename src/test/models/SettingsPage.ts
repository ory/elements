// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { defaultTraits } from "../traits"
import { Traits } from "../types"
import { AuthPage } from "./AuthPage"
import { Page } from "@playwright/test"

export class SettingsPage extends AuthPage {
  readonly pageUrl: URL
  readonly page: Page

  constructor(
    page: Page,
    baseUrl: string,
    opts?: {
      traits?: Record<string, Traits>
      path?: string
      ssr?: boolean
    },
  ) {
    super(
      opts?.traits || defaultTraits,
      page.getByTestId("settings-settings-card"),
      opts?.ssr,
    )
    this.page = page
    this.pageUrl = new URL(opts?.path || "/settings", baseUrl)
  }

  async goto() {
    await this.page.goto(this.pageUrl.href)
  }
}

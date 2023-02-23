// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Page, Response } from "@playwright/test"
import { AuthPage, defaultLoginTraits } from "./AuthPage"
import { Traits } from "./types"

export class LoginPage extends AuthPage {
  readonly pageUrl: URL
  readonly page: Page

  constructor(
    page: Page,
    baseUrl: string,
    traits?: Record<string, Traits>,
    path?: string,
  ) {
    super(
      traits || defaultLoginTraits,
      page.locator("*[data-testid='login-auth-card']"),
    )
    this.page = page
    this.pageUrl = new URL(path || "/login", baseUrl)
  }

  async goto() {
    await this.page.goto(this.pageUrl.href)
  }

  async interceptCreateRequest(): Promise<Response> {
    return super.interceptCreateRequest("login")
  }

  async interceptFetchRequest(): Promise<Response> {
    return super.interceptFetchRequest("login")
  }

  async interceptSubmitRequest(): Promise<Response> {
    return super.interceptSubmitRequest("login")
  }
}

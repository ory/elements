import { Page } from "@playwright/test"
import { AuthPage, defaultTraits } from "./AuthPage"
import { Traits } from "./types"

export class RegistrationPage extends AuthPage {
  readonly pageUrl: URL
  readonly page: Page

  constructor(
    page: Page,
    baseUrl: string,
    traits?: Record<string, Traits>,
    path?: string,
  ) {
    super(
      traits || defaultTraits,
      page.locator("*[data-testid='registration-auth-card']"),
    )
    this.page = page
    this.pageUrl = new URL(path || "/registration", baseUrl)
  }

  async goto() {
    await this.page.goto(this.pageUrl.href)
  }
}

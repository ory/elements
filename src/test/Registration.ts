import { Locator, Page } from "@playwright/test"
import { Traits } from "./types"

export default class Registration {
  public page: Page
  readonly traits: Record<string, Traits>
  readonly id: Locator
  readonly password: Locator
  readonly submitButton: Locator
  readonly formFields: Record<string, Locator> = {}

  constructor(traits: Record<string, Traits>, page: Page) {
    this.page = page
    this.traits = traits
    this.id = page.locator(`input[name="identifier"]`)
    this.password = page.locator(`input[name="password"]`)
    this.submitButton = page.locator(`button[type="submit"]`)
    for (const key in traits) {
      this.formFields[key] = page.locator(`input[name="${key}"]`)
    }
  }

  async register(traits?: Record<string, Traits>) {
    if (!traits) {
      traits = this.traits
    }
    for (const key in traits) {
      if (traits[key].type === "input") {
        await this.formFields[key].fill(traits[key].value)
      } else if (traits[key].type === "checkbox") {
        await this.formFields[key].click()
      }
    }
  }
}

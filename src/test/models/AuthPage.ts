// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Session, UiNode } from "@ory/client"
import { expect, Locator, Response } from "@playwright/test"
import { merge } from "lodash"
import { sessionForbiddenFixture } from "../fixtures"
import { MockFlow, MockFlowResponse, Traits } from "../types"
import { inputNodesToRecord, isUiNode, RandomEmail, UUIDv4 } from "../utils"

export class AuthPage {
  readonly locator: Locator
  readonly traits: Record<string, Traits>
  readonly formFields: Record<string, Locator> = {}
  readonly flowMessage: Locator

  constructor(traits: Record<string, Traits> | UiNode[], locator: Locator) {
    this.locator = locator
    this.traits = isUiNode(traits) ? inputNodesToRecord(traits) : traits

    for (const key in this.traits) {
      this.formFields[key] = locator.locator(
        `input[name="${this.traits[key].name || key}"]`,
      )
    }

    // a wildcard selector for any ui/message node in the flow
    // this is used to check for error messages
    // since there is no way to check for a specific message
    // inside of this model, we use a wildcard selector
    // this can of course be chained with other selectors to be more specific
    // this.flowmessage.locator("*[data-testid*='ui/message/10000']")
    this.flowMessage = locator.locator("*[data-testid*='ui/message/']")
  }

  async expectTraitFields(traits?: Record<string, Traits>) {
    const t = traits || this.traits
    for (const key in t) {
      if (t[key].type === "hidden") {
        await expect(this.locator.locator(`*[name="${key}"]`)).toBeHidden()
      } else {
        await expect(
          this.locator.locator(`*[name="${t[key].name || key}"]`),
        ).toBeVisible()
      }
    }
  }

  async expectTraitLabels() {
    for (const key in this.traits) {
      await expect(this.locator).toContainText(this.traits[key].label)
    }
  }

  async submitForm(buttonLocator?: string) {
    for (const key in this.traits) {
      if (this.traits[key].type === "input") {
        await this.formFields[key].fill(this.traits[key].value)
      } else if (this.traits[key].type === "checkbox") {
        await this.formFields[key].click()
      }
    }
    await this.locator.locator(buttonLocator || '[type="submit"]').click()
  }

  async expectFlowMessage(text: string) {
    await expect(this.flowMessage).toContainText(text)
  }

  sessionForbiddenResponse(): MockFlowResponse {
    return {
      status: 403,
      headers: {
        "Content-Type": "application/json",
      },
      body: sessionForbiddenFixture,
    }
  }

  sessionSuccessResponse(): MockFlowResponse {
    return {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        active: true,
        id: UUIDv4(),
        identity: {
          id: UUIDv4(),
          traits: this.traits,
          schema_id: "default",
          schema_url: `/schemas/default`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          recovery_addresses: [
            {
              id: UUIDv4(),
              value: RandomEmail(),
              via: "email",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ],
          verifiable_addresses: [
            {
              id: UUIDv4(),
              value: RandomEmail(),
              via: "email",
              status: "verified",
              verified: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              verified_at: new Date().toISOString(),
            },
          ],
        },
      } as Session,
    }
  }

  async registerMockCreateResponse({ flow, response }: MockFlow) {
    return this.locator
      .page()
      .route(`**/self-service/${flow}/browser**`, async (route) => {
        route.fulfill({
          ...response,
          body: JSON.stringify(response?.body),
        })
      })
  }

  async registerMockFetchResponse({ flow, response }: MockFlow) {
    return this.locator
      .page()
      .route(`**/self-service/${flow}/flows**`, async (route) => {
        route.fulfill({
          ...response,
          body: JSON.stringify(response?.body),
        })
      })
  }

  async registerMockSubmitResponse({ flow, response }: MockFlow) {
    return this.locator
      .page()
      .route(`**/self-service/${flow}?flow**`, async (route) => {
        route.fulfill({
          ...response,
          body: JSON.stringify(response?.body),
        })
      })
  }

  async registerMockWhoamiResponse({
    response,
    state,
  }: Omit<MockFlow, "flow">) {
    !state && (state = "session_forbidden")
    return this.locator.page().route("**/sessions/whoami", async (route) => {
      await route.fulfill({
        ...merge(
          {},
          state === "session_active"
            ? this.sessionSuccessResponse
            : this.sessionForbiddenResponse(),
          response,
        ),
        body: JSON.stringify(response?.body),
      })
    })
  }

  async interceptCreateResponse(flow: string): Promise<Response> {
    return this.locator
      .page()
      .waitForResponse(`**/self-service/${flow}/browser**`)
  }

  async interceptFetchResponse(flow: string): Promise<Response> {
    return this.locator
      .page()
      .waitForResponse(`**/self-service/${flow}/flows?id=**`)
  }

  async interceptSubmitResponse(flow: string): Promise<Response> {
    return this.locator
      .page()
      .waitForResponse(`**/self-service/${flow}?flow=**`)
  }
}

// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Session } from "@ory/client"
import { expect, Locator, Response } from "@playwright/test"
import { merge } from "lodash"
import { sessionForbiddenFixture } from "../fixtures"
import { inputNodesToRecord, isUiNode, RandomString, UUIDv4 } from "../utils"
import { MockFlowResponse, Traits } from "./types"

const email = `${RandomString()}@example.com`
const password = RandomString(10)

export const defaultLoginTraits: Record<string, Traits> = {
  identifier: {
    group: "default",
    label: "Email",
    type: "input",
    value: email,
    node_type: "input",
    required: true,
  },
  password: {
    group: "password",
    node_type: "input",
    required: true,
    label: "Password",
    type: "input",
    value: password,
  },
  submitButton: {
    group: "password",
    node_type: "input",
    label: "Sign in",
    type: "submit",
    value: "password",
  },
}

export const defaultRegistrationTraits: Record<string, Traits> = {
  "traits.email": {
    group: "password",
    node_type: "input",
    required: true,
    label: "Email",
    type: "input",
    value: email,
  },
  password: {
    group: "password",
    node_type: "input",
    required: true,
    label: "Password",
    type: "input",
    value: password,
  },
  tos: {
    group: "default",
    node_type: "input",
    required: true,
    label: "I agree to the terms of service",
    type: "checkbox",
    value: "",
  },
  submitButton: {
    group: "default",
    node_type: "input",
    label: "Sign up",
    type: "submit",
    value: "password",
  },
}

export const defaultVerificationEmailTraits: Record<string, Traits> = {
  email: {
    group: "code",
    label: "Email",
    type: "input",
    value: email,
    node_type: "input",
    required: true,
  },
  submitButton: {
    group: "code",
    node_type: "input",
    label: "Submit",
    type: "submit",
    value: "code",
  },
}

export const defaultTraits: Record<string, Traits> = {
  "traits.email": {
    group: "default",
    node_type: "input",
    required: true,
    label: "Email",
    type: "email",
    value: email,
  },
  password: {
    group: "password",
    node_type: "input",
    required: true,
    label: "Password",
    type: "password",
    value: password,
  },
}

export const defaultRecoveryTraits: Record<string, Traits> = {
  email: {
    group: "code",
    label: "Email",
    type: "email",
    value: email,
    node_type: "input",
    required: true,
  },
  submitButton: {
    group: "code",
    node_type: "input",
    label: "Submit",
    type: "submit",
    value: "code",
  },
}

export const defaultRecoveryTraitsWithCode: Record<string, Traits> = {
  code: {
    group: "code",
    label: "Verify code",
    type: "input",
    value: "123456",
    node_type: "input",
    required: true,
  },
  resendButton: {
    group: "code",
    node_type: "input",
    label: "Resend Code",
    type: "submit",
    name: "email",
    value: email,
  },
  submitButton: {
    name: "method",
    group: "code",
    node_type: "input",
    label: "Submit",
    type: "submit",
    value: "code",
  },
}

export const defaultVerificationTraits: Record<string, Traits> = {
  "traits.email": defaultTraits["traits.email"],
}

export type MockFlow = {
  flow: string
  response?: MockFlowResponse
  state?:
    | "verification_submit_email"
    | "verification_submit_code"
    | "recovery_submit_email"
    | "recovery_submit_code"
    | "session_forbidden"
    | "session_active"
}

export const defaultMockFlowResponse: MockFlowResponse = {
  status: 200,
  body: null,
  headers: {
    "Content-Type": "application/json",
  },
}

export class AuthPage {
  readonly locator: Locator
  readonly traits: Record<string, Traits>
  readonly formFields: Record<string, Locator> = {}
  readonly errorMessage: Locator

  constructor(traits: Record<string, Traits>, locator: Locator) {
    this.locator = locator
    this.traits = isUiNode(traits) ? inputNodesToRecord(traits) : traits
    for (const key in traits) {
      this.formFields[key] = locator.locator(
        `input[name="${traits[key].name || key}"]`,
      )
    }
    this.errorMessage = locator.locator("*[data-testid*='ui/message/']")
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

  async expectErorr(text: string) {
    await expect(this.errorMessage).toContainText(text)
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
              value: email,
              via: "email",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ],
          verifiable_addresses: [
            {
              id: UUIDv4(),
              value: email,
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

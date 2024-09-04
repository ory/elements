// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { RegistrationFlow } from "@ory/client"
import { Page, Response } from "@playwright/test"
import { merge } from "lodash"
import { defaultRegistrationTraits } from "../traits"
import { MockFlow, MockFlowResponse, Traits } from "../types"
import { traitsToNodes, UUIDv4 } from "../utils"
import { AuthPage } from "./AuthPage"

export class RegistrationPage extends AuthPage {
  readonly pageUrl: URL
  readonly oryProjectUrl: URL
  readonly page: Page

  readonly registrationActionPath = "/self-service/registration?flow="

  constructor(
    page: Page,
    baseUrl: string,
    oryProjectUrl: string,
    traits?: Record<string, Traits>,
    path?: string,
  ) {
    super(
      traits ?? defaultRegistrationTraits,
      page.getByTestId("registration-auth-card"),
    )
    this.page = page
    this.pageUrl = new URL(path ?? "/registration", baseUrl)
    this.oryProjectUrl = new URL(oryProjectUrl)
  }

  async goto() {
    await this.page.goto(this.pageUrl.href)
  }

  getRegistrationFlowResponse(): MockFlowResponse {
    return {
      body: {
        id: UUIDv4(),
        expires_at: new Date().toISOString(),
        issued_at: new Date().toISOString(),
        type: "browser",
        request_url: this.pageUrl.href,
        ui: {
          action: new URL(this.registrationActionPath, this.oryProjectUrl).href,
          method: "POST",
          nodes: traitsToNodes(this.traits, true),
          messages: [],
        },
        state: "choose_method",
      } as RegistrationFlow,
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    }
  }

  registerMockCreateResponse({
    response,
  }: Omit<MockFlow, "flow">): Promise<void> {
    return super.registerMockCreateResponse({
      flow: "registration",
      response: merge({}, this.getRegistrationFlowResponse(), response),
    })
  }

  registerMockFetchResponse({
    response,
  }: Omit<MockFlow, "flow">): Promise<void> {
    return super.registerMockFetchResponse({
      flow: "registration",
      response: merge({}, this.getRegistrationFlowResponse(), response),
    })
  }

  registerMockSubmitResponse({
    response,
  }: Omit<MockFlow, "flow">): Promise<void> {
    return super.registerMockSubmitResponse({
      flow: "registration",
      response: merge({}, this.getRegistrationFlowResponse(), response),
    })
  }

  interceptCreateResponse(): Promise<Response> {
    return super.interceptCreateResponse("registration")
  }

  interceptFetchResponse(): Promise<Response> {
    return super.interceptFetchResponse("registration")
  }

  interceptSubmitResponse(): Promise<Response> {
    return super.interceptSubmitResponse("registration")
  }
}

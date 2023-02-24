// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LoginFlow, Session } from "@ory/client"
import { Page, Response } from "@playwright/test"
import { merge } from "lodash"
import { RandomString, traitsToNodes } from "../utils"
import { AuthPage, defaultLoginTraits, MockFlow } from "./AuthPage"
import { MockFlowResponse, Traits } from "./types"

export class LoginPage extends AuthPage {
  readonly pageUrl: URL
  readonly oryProjectUrl: URL
  readonly page: Page

  readonly loginActionPath = "/self-service/login?flow="

  constructor(
    page: Page,
    baseUrl: string,
    oryProjectUrl: string,
    traits?: Record<string, Traits>,
    path?: string,
  ) {
    super(
      traits || defaultLoginTraits,
      page.locator("*[data-testid='login-auth-card']"),
    )
    this.page = page
    this.pageUrl = new URL(path || "/login", baseUrl)
    this.oryProjectUrl = new URL(oryProjectUrl)
  }

  async goto() {
    await this.page.goto(this.pageUrl.href)
  }

  getLoginFlowResponse(): MockFlowResponse {
    return {
      body: {
        id: RandomString(20),
        expires_at: new Date().toISOString(),
        issued_at: new Date().toISOString(),
        type: "browser",
        request_url: this.pageUrl.href,
        refresh: false,
        requested_aal: "aal1",
        updated_at: new Date().toISOString(),
        ui: {
          action: new URL(this.loginActionPath, this.oryProjectUrl).href,
          method: "POST",
          nodes: traitsToNodes(this.traits, true),
        },
      } as LoginFlow,
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    }
  }

  async registerMockCreateResponse({
    response,
  }: Omit<MockFlow, "flow">): Promise<void> {
    return super.registerMockCreateResponse({
      flow: "login",
      response: merge({}, this.getLoginFlowResponse(), response),
    })
  }

  async registerMockFetchResponse({
    response,
  }: Omit<MockFlow, "flow">): Promise<void> {
    return super.registerMockFetchResponse({
      flow: "login",
      response: merge({}, this.getLoginFlowResponse(), response),
    })
  }

  async registerMockSubmitResponse({
    response,
  }: Omit<MockFlow, "flow">): Promise<void> {
    return super.registerMockSubmitResponse({
      flow: "login",
      response: response || {
        body: {
          id: RandomString(20),
          identity: {
            id: RandomString(20),
            traits: this.traits,
            schema_id: "default",
            schema_url: `${this.oryProjectUrl}/schemas/default`,
          },
        } as Session,
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      },
    })
  }

  async interceptCreateResponse(): Promise<Response> {
    return super.interceptCreateResponse("login")
  }

  async interceptFetchResponse(): Promise<Response> {
    return super.interceptFetchResponse("login")
  }

  async interceptSubmitResponse(): Promise<Response> {
    return super.interceptSubmitResponse("login")
  }
}

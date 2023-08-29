// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { defaultLoginTraits } from "../traits"
import { MockFlow, MockFlowResponse, Traits } from "../types"
import { traitsToNodes, UUIDv4 } from "../utils"
import { AuthPage } from "./AuthPage"
import { LoginFlow, Session } from "@ory/client"
import { Page, Response } from "@playwright/test"
import { merge } from "lodash"

export class LoginPage extends AuthPage {
  readonly pageUrl: URL
  readonly oryProjectUrl: URL
  readonly page: Page

  readonly loginActionPath = "/self-service/login?flow="

  constructor(
    page: Page,
    baseUrl: string,
    oryProjectUrl: string,
    opts?: {
      traits?: Record<string, Traits>
      path?: string
      ssr?: boolean
    },
  ) {
    super(
      opts?.traits || defaultLoginTraits,
      page.getByTestId("login-auth-card"),
      opts?.ssr,
    )
    this.page = page
    this.pageUrl = new URL(opts?.path || "/login", baseUrl)
    this.oryProjectUrl = new URL(oryProjectUrl)
  }

  async goto() {
    await this.page.goto(this.pageUrl.href)
  }

  getLoginFlowResponse(): MockFlowResponse {
    return {
      body: {
        id: UUIDv4(),
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
      headers: this.ssr
        ? { Location: new URL("?flow=" + UUIDv4(), this.pageUrl).href }
        : {
          "Content-Type": "application/json",
        },
      status: this.ssr ? 303 : 200,
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
          id: UUIDv4(),
          identity: {
            id: UUIDv4(),
            traits: this.traits,
            schema_id: "default",
            schema_url: `${this.oryProjectUrl}/schemas/default`,
          },
        } as Session,
        headers: this.ssr
          ? { Location: new URL("?flow=" + UUIDv4(), this.page.url()).href }
          : { "Content-Type": "application/json" },
        status: this.ssr ? 303 : 200,
      },
    })
  }

  async interceptCreateResponse(
    flow = "login",
    ssrOverride?: boolean,
  ): Promise<Response> {
    return super.interceptCreateResponse(flow, ssrOverride)
  }

  async interceptFetchResponse(
    flow = "login",
    ssrOverride?: boolean,
  ): Promise<Response> {
    return super.interceptFetchResponse(flow, ssrOverride)
  }

  async interceptSubmitResponse(
    flow = "login",
    ssrOverride?: boolean,
  ): Promise<Response> {
    return super.interceptSubmitResponse(flow, ssrOverride)
  }
}

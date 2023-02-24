// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { RecoveryFlow, RecoveryFlowState } from "@ory/client"
import { Page, Response } from "@playwright/test"
import { merge } from "lodash"
import { RandomString, traitsToNodes } from "../utils"
import {
  AuthPage,
  defaultRecoveryTraits,
  defaultRecoveryTraitsWithCode,
  MockFlow,
} from "./AuthPage"
import { MockFlowResponse, Traits } from "./types"

export class RecoveryPage extends AuthPage {
  readonly pageUrl: URL
  readonly oryProjectUrl: URL
  readonly page: Page

  readonly recoveryActionPath = "/self-service/recovery?flow="

  constructor(
    page: Page,
    baseUrl: string,
    oryProjectUrl: string,
    traits?: Record<string, Traits>,
    path?: string,
  ) {
    super(
      traits || defaultRecoveryTraits,
      page.locator("*[data-testid='recovery-auth-card']"),
    )
    this.page = page
    this.pageUrl = new URL(path || "/recovery", baseUrl)
    this.oryProjectUrl = new URL(oryProjectUrl)
  }

  async goto() {
    await this.page.goto(this.pageUrl.href)
  }

  getRecoveryFlowResponse(
    state: RecoveryFlowState = "choose_method",
  ): MockFlowResponse {
    return {
      body: {
        id: RandomString(20),
        type: "browser",
        state: state,
        expires_at: new Date().toISOString(),
        issued_at: new Date().toISOString(),
        request_url: this.oryProjectUrl.href,
        ui: {
          action: new URL(this.recoveryActionPath, this.oryProjectUrl).href,
          method: "POST",
          nodes: traitsToNodes(
            state === "choose_method"
              ? this.traits
              : defaultRecoveryTraitsWithCode,
            true,
          ),
          messages: [],
        },
      } as RecoveryFlow,
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
      flow: "recovery",
      response: merge({}, this.getRecoveryFlowResponse(), response),
    })
  }

  registerMockFetchResponse({
    response,
  }: Omit<MockFlow, "flow">): Promise<void> {
    return super.registerMockFetchResponse({
      flow: "recovery",
      response: merge({}, this.getRecoveryFlowResponse(), response),
    })
  }

  registerMockSubmitResponse({
    response,
  }: Omit<MockFlow, "flow">): Promise<void> {
    return super.registerMockSubmitResponse({
      flow: "recovery",
      response: merge({}, this.getRecoveryFlowResponse(), response),
    })
  }

  interceptCreateResponse(): Promise<Response> {
    return super.interceptCreateResponse("recovery")
  }

  interceptFetchResponse(): Promise<Response> {
    return super.interceptFetchResponse("recovery")
  }

  interceptSubmitResponse(): Promise<Response> {
    return super.interceptSubmitResponse("recovery")
  }
}

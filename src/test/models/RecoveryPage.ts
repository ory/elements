// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { RecoveryFlow, RecoveryFlowState } from "@ory/client"
import { Page, Response } from "@playwright/test"
import { merge } from "lodash"
import { recoverySubmitCodeFixture } from "../fixtures"
import { traitsToNodes, UUIDv4 } from "../utils"
import {
  AuthPage,
  defaultMockFlowResponse,
  defaultRecoveryTraits,
  defaultRecoveryTraitsWithCode,
  MockFlow,
} from "./AuthPage"
import {
  ErrorBrowserLocationChangeRequired,
  MockFlowResponse,
  Traits,
} from "./types"

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
    if (state === "passed_challenge") {
      return {
        ...defaultMockFlowResponse,
        status: 422,
        body: recoverySubmitCodeFixture as ErrorBrowserLocationChangeRequired,
      }
    } else if (state === "choose_method") {
      return {
        ...defaultMockFlowResponse,
        body: {
          id: UUIDv4(),
          type: "browser",
          state: state,
          expires_at: new Date().toISOString(),
          issued_at: new Date().toISOString(),
          request_url: this.pageUrl.href,
          ui: {
            action: new URL(this.recoveryActionPath, this.oryProjectUrl).href,
            method: "POST",
            nodes: traitsToNodes(this.traits, true),
            messages: [],
          },
        } as RecoveryFlow,
      }
    }
    return {
      ...defaultMockFlowResponse,
      body: {
        id: UUIDv4(),
        type: "browser",
        state: state,
        expires_at: new Date().toISOString(),
        issued_at: new Date().toISOString(),
        request_url: this.pageUrl.href,
        ui: {
          action: new URL(this.recoveryActionPath, this.oryProjectUrl).href,
          method: "POST",
          nodes: traitsToNodes(defaultRecoveryTraitsWithCode, true),
          messages: [],
        },
      } as RecoveryFlow,
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
    state,
  }: Omit<MockFlow, "flow">): Promise<void> {
    return super.registerMockSubmitResponse({
      flow: "recovery",
      response: merge(
        {},
        this.getRecoveryFlowResponse(
          state && state === "recovery_submit_email"
            ? "sent_email"
            : "passed_challenge" || "choose_method",
        ),
        response,
      ),
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

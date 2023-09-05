// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { recoverySubmitCodeFixture } from "../fixtures"
import { defaultMockFlowResponse } from "../mock"
import { defaultRecoveryTraits, defaultRecoveryTraitsWithCode } from "../traits"
import {
  ErrorBrowserLocationChangeRequired,
  getFlowState,
  MockFlow,
  MockFlowResponse,
} from "../types"
import { traitsToNodes, UUIDv4 } from "../utils"
import { AuthPage } from "./AuthPage"
import { RecoveryFlow, RecoveryFlowState } from "@ory/client"
import { Page, Response } from "@playwright/test"
import { merge } from "lodash"

export class RecoveryPage extends AuthPage {
  readonly pageUrl: URL
  readonly page: Page

  readonly recoveryActionPath = "/self-service/recovery?flow="

  constructor(
    page: Page,
    baseUrl: string,
    oryProjectUrl: string,
    opts?: {
      path?: string
      ssr?: boolean
    },
  ) {
    super(
      defaultRecoveryTraits,
      page.getByTestId("recovery-auth-card"),
      oryProjectUrl,
      opts?.ssr,
    )
    this.page = page
    this.pageUrl = new URL(opts?.path || "/recovery", baseUrl)
  }

  async goto() {
    await this.page.goto(this.pageUrl.href)
  }

  getRecoveryFlowResponse(
    state: RecoveryFlowState = "choose_method",
  ): MockFlowResponse {
    const body: RecoveryFlow = {
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
    }

    switch (state) {
      case "choose_method":
        return {
          ...defaultMockFlowResponse,
          body,
          ...(this.ssr
            ? {
                status: 303,
                headers: {
                  Location: new URL("?flow=" + UUIDv4(), this.pageUrl).href,
                },
              }
            : {}),
        }
      case "sent_email":
        return {
          ...defaultMockFlowResponse,
          body: {
            ...body,
            ui: {
              ...body.ui,
              nodes: traitsToNodes(defaultRecoveryTraitsWithCode, true),
            },
          },
          ...(this.ssr
            ? {
                status: 303,
                headers: {
                  Location: new URL("?flow=" + UUIDv4(), this.pageUrl).href,
                },
              }
            : {}),
        }
      case "passed_challenge":
        return {
          ...defaultMockFlowResponse,
          status: 422,
          body: recoverySubmitCodeFixture as ErrorBrowserLocationChangeRequired,
          ...(this.ssr
            ? {
                status: 303,
                headers: {
                  Location: new URL("?flow=" + UUIDv4(), this.pageUrl).href,
                },
              }
            : {}),
        }
      default:
        return {
          ...defaultMockFlowResponse,
          body,
        }
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
          state ? getFlowState(state, "recovery") : "choose_method",
        ),
        response,
      ),
    })
  }

  interceptCreateResponse(
    flow = "recovery",
    ssrOverride?: boolean,
  ): Promise<Response> {
    return super.interceptCreateResponse(flow, ssrOverride)
  }

  interceptFetchResponse(
    flow = "recovery",
    ssrOverride?: boolean,
  ): Promise<Response> {
    return super.interceptFetchResponse(flow, ssrOverride)
  }

  interceptSubmitResponse(
    flow = "recovery",
    ssrOverride?: boolean,
  ): Promise<Response> {
    return super.interceptSubmitResponse(flow, ssrOverride)
  }
}

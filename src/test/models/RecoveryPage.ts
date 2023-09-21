// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { RecoveryFlow, RecoveryFlowState } from "@ory/client"
import { Page, Response } from "@playwright/test"
import { merge } from "lodash"
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

export class RecoveryPage extends AuthPage {
  readonly pageUrl: URL
  readonly oryProjectUrl: URL
  readonly page: Page

  readonly recoveryActionPath = "/self-service/recovery?flow="

  constructor(
    page: Page,
    baseUrl: string,
    oryProjectUrl: string,
    path?: string,
  ) {
    super(defaultRecoveryTraits, page.getByTestId("recovery-auth-card"))
    this.page = page
    this.pageUrl = new URL(path ?? "/recovery", baseUrl)
    this.oryProjectUrl = new URL(oryProjectUrl)
  }

  async goto() {
    await this.page.goto(this.pageUrl.href)
  }

  getRecoveryFlowResponse(
    state: RecoveryFlowState = "choose_method",
  ): MockFlowResponse {
    const body = (includeValues = false): RecoveryFlow => {
      return {
        id: UUIDv4(),
        type: "browser",
        state: state,
        expires_at: new Date().toISOString(),
        issued_at: new Date().toISOString(),
        request_url: this.pageUrl.href,
        ui: {
          action: new URL(this.recoveryActionPath, this.oryProjectUrl).href,
          method: "POST",
          nodes: traitsToNodes(this.traits, true, includeValues),
          messages: [],
        },
      }
    }

    switch (state) {
      case "choose_method":
        return {
          ...defaultMockFlowResponse,
          body: body(),
        }
      case "sent_email":
        return {
          ...defaultMockFlowResponse,
          body: {
            ...body(),
            ui: {
              ...body().ui,
              nodes: traitsToNodes(defaultRecoveryTraitsWithCode, true, false),
              messages: [
                {
                  id: 1060003,
                  text: "An email containing a recovery code has been sent to the email address you provided. If you have not received an email, check the spelling of the address and make sure to use the address you registered with.",
                  type: "info",
                },
              ],
            },
          },
        }
      case "passed_challenge":
        return {
          ...defaultMockFlowResponse,
          status: 422,
          body: recoverySubmitCodeFixture as ErrorBrowserLocationChangeRequired,
        }
      default:
        return {
          ...defaultMockFlowResponse,
          body: body(),
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

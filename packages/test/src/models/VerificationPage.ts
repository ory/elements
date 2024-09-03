// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { VerificationFlow, VerificationFlowState } from "@ory/client"
import { Page, Response } from "@playwright/test"
import { merge } from "lodash"
import { verificationSubmitCodeFixture } from "../fixtures"
import { defaultMockFlowResponse } from "../mock"
import {
  defaultVerificationEmailTraits,
  defaultVerificationTraitsWithCode,
} from "../traits"
import { getFlowState, MockFlow, MockFlowResponse } from "../types"
import { traitsToNodes, UUIDv4 } from "../utils"
import { AuthPage } from "./AuthPage"

export class VerificationPage extends AuthPage {
  readonly pageUrl: URL
  readonly page: Page
  readonly oryProjectUrl: URL

  readonly verificationActionPath = "/self-service/verification?flow="

  constructor(
    page: Page,
    baseUrl: string,
    oryProjectUrl: string,
    path?: string,
  ) {
    super(
      defaultVerificationEmailTraits,
      page.getByTestId("verification-auth-card"),
    )
    this.page = page
    this.pageUrl = new URL(path ?? "/verification", baseUrl)
    this.oryProjectUrl = new URL(oryProjectUrl)
  }

  async goto() {
    await this.page.goto(this.pageUrl.href)
  }

  getVerificationFlowResponse(
    state: VerificationFlowState = "choose_method",
  ): MockFlowResponse {
    const body: VerificationFlow = {
      id: UUIDv4(),
      expires_at: new Date().toISOString(),
      issued_at: new Date().toISOString(),
      state: state,
      type: "browser",
      request_url: this.pageUrl.href,
      ui: {
        action: new URL(this.verificationActionPath, this.oryProjectUrl).href,
        method: "POST",
        nodes: traitsToNodes(this.traits, true, false),
        messages: [],
      },
    }

    switch (state) {
      case "choose_method":
        return {
          ...defaultMockFlowResponse,
          body,
        }
      case "sent_email":
        return {
          ...defaultMockFlowResponse,
          body: {
            ...body,
            ui: {
              ...body.ui,
              nodes: traitsToNodes(defaultVerificationTraitsWithCode, false),
            },
          },
        }
      case "passed_challenge":
        return {
          ...defaultMockFlowResponse,
          body: verificationSubmitCodeFixture,
        }
      default:
        return {
          ...defaultMockFlowResponse,
          body,
        }
    }
  }

  async registerMockCreateResponse({
    response,
  }: Omit<MockFlow, "flow">): Promise<void> {
    return super.registerMockCreateResponse({
      flow: "verification",
      response: merge({}, this.getVerificationFlowResponse(), response),
    })
  }

  async registerMockFetchResponse({
    response,
  }: Omit<MockFlow, "flow">): Promise<void> {
    return super.registerMockFetchResponse({
      flow: "verification",
      response: merge({}, this.getVerificationFlowResponse(), response),
    })
  }

  async registerMockSubmitResponse({
    response,
    state,
  }: Omit<MockFlow, "flow">): Promise<void> {
    return super.registerMockSubmitResponse({
      flow: "verification",
      response: merge(
        {},
        this.getVerificationFlowResponse(
          state ? getFlowState(state, "verification") : "choose_method",
        ),
        response,
      ),
    })
  }

  async interceptCreateResponse(): Promise<Response> {
    return super.interceptCreateResponse("verification")
  }

  async interceptFetchResponse(): Promise<Response> {
    return super.interceptFetchResponse("verification")
  }

  async interceptSubmitResponse(): Promise<Response> {
    return super.interceptSubmitResponse("verification")
  }
}

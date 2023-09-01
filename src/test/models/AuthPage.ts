// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { sessionForbiddenFixture } from "../fixtures"
import { MockFlow, MockFlowResponse, Traits } from "../types"
import { inputNodesToRecord, isUiNode, RandomEmail, UUIDv4 } from "../utils"
import { Session, UiNode } from "@ory/client"
import { expect, Locator, Response } from "@playwright/test"
import { merge } from "lodash"
import { rest } from "msw"
import { setupServer, SetupServer } from "msw/node"

export class AuthPage {
  readonly locator: Locator
  readonly traits: Record<string, Traits>
  readonly formFields: Record<string, Locator> = {}
  readonly flowMessage: Locator
  readonly oryProjectUrl: URL
  readonly ssr?: boolean
  readonly server?: SetupServer

  constructor(
    traits: Record<string, Traits> | UiNode[],
    locator: Locator,
    oryProjectUrl: string,
    ssr?: boolean,
  ) {
    this.locator = locator
    this.traits = isUiNode(traits) ? inputNodesToRecord(traits) : traits
    this.ssr = ssr
    this.oryProjectUrl = new URL(oryProjectUrl)

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

    if (this.ssr) {
      this.server = setupServer()
    }
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

  async registerMockCreateResponse({
    flow,
    response,
    ssrOverride = false,
  }: MockFlow) {
    const resp = {
      ...response,
      body: JSON.stringify(response?.body),
    }

    console.log(
      `registerMockCreateResponse ${flow}. Is Server-side rendering: ${
        this.server !== undefined
      }. Override Server-side rendering: ${ssrOverride}`,
    )

    return this.server && !ssrOverride
      ? this.server.use(
          rest.get(
            `${this.oryProjectUrl.href}/self-service/${flow}/browser`,
            async (_, res, ctx) => {
              return res.once(ctx.json(resp))
            },
          ),
        )
      : this.locator
          .page()
          .route(`**/self-service/${flow}/browser**`, async (route) => {
            route.fulfill(resp)
          })
  }

  async registerMockFetchResponse({
    flow,
    response,
    ssrOverride = false,
  }: MockFlow) {
    const resp = {
      ...response,
      body: JSON.stringify(response?.body),
    }

    console.log(
      `registerMockFetchResponse ${flow}. Is Server-side rendering: ${
        this.server !== undefined
      }. Override Server-side rendering: ${ssrOverride}`,
    )

    return this.server && !ssrOverride
      ? this.server.use(
          rest.get(
            `${this.oryProjectUrl}/self-service/${flow}/flows`,
            async (_, res, ctx) => {
              return res.once(ctx.json(resp))
            },
          ),
        )
      : this.locator
          .page()
          .route(`**/self-service/${flow}/flows**`, async (route) => {
            route.fulfill(resp)
          })
  }

  async registerMockSubmitResponse({
    flow,
    response,
    ssrOverride = false,
  }: MockFlow) {
    const resp = {
      ...response,
      body: JSON.stringify(response?.body),
    }

    console.log(
      `registerMockSubmitResponse ${flow}. Is Server-side rendering: ${
        this.server !== undefined
      }. Override Server-side rendering: ${ssrOverride}`,
    )

    return this.server && !ssrOverride
      ? this.server.use(
          rest.post(
            `${this.oryProjectUrl.href}/self-service/${flow}?flow**`,
            async (_, res, ctx) => {
              return res.once(ctx.json(resp))
            },
          ),
        )
      : this.locator
          .page()
          .route(`**/self-service/${flow}?flow**`, async (route) => {
            route.fulfill(resp)
          })
  }

  async registerMockWhoamiResponse({
    response,
    state,
    ssrOverride = false,
  }: Omit<MockFlow, "flow">) {
    !state && (state = "session_forbidden")
    const resp = {
      ...merge(
        {},
        state === "session_active"
          ? this.sessionSuccessResponse
          : this.sessionForbiddenResponse(),
        response,
      ),
      body: JSON.stringify(response?.body),
    }

    console.log(
      `registerMockWhoamiResponse. Is Server-side rendering: ${
        this.server !== undefined
      }. Override Server-side rendering: ${ssrOverride}`,
    )

    return this.server && !ssrOverride
      ? this.server.use(
          rest.get(
            `${this.oryProjectUrl.href}/sessions/whoami`,
            async (_, res, ctx) => {
              return res.once(ctx.json(resp))
            },
          ),
        )
      : this.locator.page().route("**/sessions/whoami", async (route) => {
          await route.fulfill(resp)
        })
  }

  async interceptCreateResponse(
    flow: string,
    ssrOverride = false,
  ): Promise<Response> {
    console.log(
      `interceptCreateResponse. Is Server-side rendering: ${
        this.server !== undefined
      }. Override Server-side rendering: ${ssrOverride}`,
    )
    if (this.server && !ssrOverride) {
      console.log("interceptCreateResponse server-side")
      return new Promise<Response>((resolve, reject) => {
        const requests = new Map()

        this.server?.events.on("request:start", (req) => {
          if (
            req.url.toString().includes(`/self-service/${flow}/browser`) &&
            req.method === "GET"
          ) {
            requests.set(req.id, req)
          }
        })
        this.server?.events.on("response:mocked", (res, reqId) => {
          const req = requests.get(reqId)
          if (req) {
            resolve(res as unknown as Response)
          } else {
            reject(new Error("Response not found"))
          }
        })
      })
    } else {
      return this.locator
        .page()
        .waitForResponse(`**/self-service/${flow}/browser**`)
    }
  }

  async interceptFetchResponse(
    flow: string,
    ssrOverride = false,
  ): Promise<Response> {
    console.log(
      `interceptFetchResponse. Is Server-side rendering: ${
        this.server !== undefined
      }. Override Server-side rendering: ${ssrOverride}`,
    )
    if (this.server && !ssrOverride) {
      console.log("interceptFetchResponse server-side")
      return new Promise<Response>((resolve, reject) => {
        console.log("interceptFetchResponse server-side promise")
        const requests = new Map()

        this.server?.events.on("request:start", (req) => {
          console.log(
            "interceptFetchResponse server-side request:start: ",
            req.id,
          )
          if (
            req.url.toString().includes(`/self-service/${flow}/flows`) &&
            req.method === "GET"
          ) {
            requests.set(req.id, req)
          }
        })
        this.server?.events.on("response:mocked", (res, reqId) => {
          console.log(
            "interceptFetchResponse server-side response:mocked: ",
            reqId,
          )

          const req = requests.get(reqId)
          if (req) {
            resolve(res as unknown as Response)
          } else {
            reject(new Error("Response not found"))
          }
        })
      })
    } else {
      return this.locator
        .page()
        .waitForResponse(`**/self-service/${flow}/flows?id=**`)
    }
  }

  async interceptSubmitResponse(
    flow: string,
    ssrOverride = false,
  ): Promise<Response> {
    console.log(
      `interceptSubmitResponse. Is Server-side rendering: ${
        this.server !== undefined
      }. Override Server-side rendering: ${ssrOverride}`,
    )
    if (this.server && !ssrOverride) {
      console.log("interceptSubmitResponse server-side")
      return new Promise<Response>((resolve, reject) => {
        const requests = new Map()

        this.server?.events.on("request:start", (req) => {
          if (
            req.url.toString().includes(`/self-service/${flow}/flow`) &&
            req.method === "POST"
          ) {
            requests.set(req.id, req)
          }
        })
        this.server?.events.on("response:mocked", (res, reqId) => {
          const req = requests.get(reqId)
          if (req) {
            resolve(res as unknown as Response)
          } else {
            reject(new Error("Response not found"))
          }
        })
      })
    } else {
      return this.locator
        .page()
        .waitForResponse(`**/self-service/${flow}?flow=**`)
    }
  }
}

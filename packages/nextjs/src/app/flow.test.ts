/* eslint-disable @typescript-eslint/unbound-method */
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  AccountExperienceConfiguration,
  FlowType,
  handleFlowError,
} from "@ory/client-fetch"
import { redirect } from "next/navigation"
import {
  getLoginFlow,
  getRecoveryFlow,
  getRegistrationFlow,
  getVerificationFlow,
} from "."
import { QueryParams } from "../types"
import { serverSideFrontendClient } from "./client"
import { getPublicUrl } from "./utils"

jest.mock("./utils", () => ({
  getPublicUrl: jest.fn(),
  toFlowParams: jest.fn().mockImplementation((params: QueryParams) => params),
  startNewFlow: jest.requireActual("./utils").startNewFlow,
  toGetFlowParameter: jest
    .fn()
    .mockImplementation((params: QueryParams) => params),
}))

jest.mock("./client", () => ({
  serverSideFrontendClient: jest.fn().mockReturnValue({
    getLoginFlowRaw: jest.fn(),
    getRegistrationFlowRaw: jest.fn(),
    getRecoveryFlowRaw: jest.fn(),
    getVerificationFlowRaw: jest.fn(),
  }),
}))

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
  RedirectType: {
    replace: "replace",
  },
}))

jest.mock("@ory/client-fetch", () => {
  const original = jest.requireActual("@ory/client-fetch")

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    ...original,
    handleFlowError: jest.fn(),
  }
})
const config = {
  name: "string",
  sdk: {
    url: "string",
  },
  project: {
    registration_enabled: true,
    verification_enabled: true,
    recovery_enabled: true,
    recovery_ui_url: "string",
    registration_ui_url: "string",
    verification_ui_url: "string",
    login_ui_url: "string",
    settings_ui_url: "string",
    default_redirect_url: "string",
    logo_light_url: "string",
    logo_dark_url: "string",
    error_ui_url: "string",
    name: "string",
    default_locale: "en",
    locale_behavior: "force_default",
  } satisfies AccountExperienceConfiguration,
}

beforeEach(() => {
  ;(getPublicUrl as jest.Mock).mockResolvedValue("https://example.com")
  jest.clearAllMocks()
  process.env["NEXT_PUBLIC_ORY_SDK_URL"] = "https://ory.sh/"
  ;(handleFlowError as jest.Mock).mockReturnValue(async () => {})
})

const testCases = [
  {
    fn: getLoginFlow,
    flowType: FlowType.Login,
    m: serverSideFrontendClient().getLoginFlowRaw,
  },
  {
    fn: getRegistrationFlow,
    flowType: FlowType.Registration,
    m: serverSideFrontendClient().getRegistrationFlowRaw,
  },
  {
    fn: getRecoveryFlow,
    flowType: FlowType.Recovery,
    m: serverSideFrontendClient().getRecoveryFlowRaw,
  },
  {
    fn: getVerificationFlow,
    flowType: FlowType.Verification,
    m: serverSideFrontendClient().getVerificationFlowRaw,
  },
]

for (const tc of testCases) {
  describe(`flowtype=${tc.flowType}`, () => {
    test("restarts flow if no id given", async () => {
      const queryParams = {}
      await tc.fn(config, queryParams)
      expect(redirect).toHaveBeenCalledWith(
        `https://example.com/self-service/${tc.flowType}/browser?`,
        "replace",
      )
    })

    test("restarts flow if no id is given with query params", async () => {
      const queryParams = {
        refresh: "true",
      }
      await tc.fn(config, queryParams)
      expect(redirect).toHaveBeenCalledWith(
        `https://example.com/self-service/${tc.flowType}/browser?refresh=true`,
        "replace",
      )
    })

    test("fetches flow and rewrite json response", async () => {
      const queryParams = {
        flow: "1234",
      }
      ;(tc.m as jest.Mock).mockResolvedValue({
        value: jest.fn().mockResolvedValue({
          foo: "https://ory.sh/a",
          bar: "https://ory.sh/",
        }),
      } as any)
      const result = await tc.fn(config, queryParams)
      expect(result).toEqual({
        foo: "https://example.com/a",
        bar: "https://example.com/",
      })
    })

    test("fetches flow and calls error handler on error", async () => {
      const queryParams = {
        flow: "1234",
      }
      ;(tc.m as jest.Mock).mockRejectedValue(new Error("error"))
      const result = await tc.fn(config, queryParams)
      expect(result).toBeUndefined()
      expect(handleFlowError).toHaveBeenCalled()
    })
  })
}

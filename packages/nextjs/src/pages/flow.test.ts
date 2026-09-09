// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, handleFlowError } from "@ory/client-fetch"
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation"
import { createUseFlowFactory } from "./flow"

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn().mockReturnValue([undefined, jest.fn()]),
  useEffect: jest.fn(),
}))
jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({ isReady: true }),
}))
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useSearchParams: jest.fn(),
}))
jest.mock("@ory/client-fetch", () => ({
  ...jest.requireActual("@ory/client-fetch"),
  handleFlowError: jest.fn(),
}))

it.each([FlowType.Settings, FlowType.Login])(
  "passes %s to the SDK and preserves return_to when restarting",
  (flowType) => {
    jest.clearAllMocks()
    const params = new URLSearchParams({
      flow: "existing-flow",
      return_to: "https://app.example.com/account",
    })
    jest
      .mocked(useSearchParams)
      .mockReturnValue(new ReadonlyURLSearchParams(params))
    const assign = jest.fn()
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { location: { origin: "https://app.example.com", assign } },
    })
    try {
      const useFlow = createUseFlowFactory(flowType, jest.fn(), jest.fn())
      useFlow()
      expect(handleFlowError).toHaveBeenLastCalledWith(
        expect.objectContaining({ flowType }),
      )
      const options = jest.mocked(handleFlowError).mock.calls[0][0]
      options.onRestartFlow()
      const target = new URL(assign.mock.calls[0][0])
      expect(target.pathname).toBe(`/self-service/${flowType}/browser`)
      expect(target.searchParams.get("return_to")).toBe(params.get("return_to"))
    } finally {
      Reflect.deleteProperty(globalThis, "window")
    }
  },
)

// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { restartFlowUrl, initFlowUrl } from "../url"

describe("url utils", () => {
  describe("restartFlowUrl", () => {
    it("should return request_url if present", () => {
      const flow = { id: "fake-id", request_url: "http://example.com/request" }
      const fallback = "http://example.com/fallback"
      expect(restartFlowUrl(flow, fallback)).toBe(flow.request_url)
    })

    it("should return fallback with return_to if request_url is not present", () => {
      const flow = { id: "fake-id", return_to: "http://example.com/return" }
      const fallback = "http://example.com/fallback"
      expect(restartFlowUrl(flow, fallback)).toBe(
        "http://example.com/fallback?return_to=http%3A%2F%2Fexample.com%2Freturn",
      )
    })

    it("should return fallback if neither request_url nor return_to are present", () => {
      const flow = { id: "fake-id" }
      const fallback = "http://example.com/fallback"
      expect(restartFlowUrl(flow, fallback)).toBe(fallback)
    })
  })

  describe("initFlowUrl", () => {
    it("should return sdkUrl with flowType and return_to if present in flow", () => {
      const sdkUrl = "http://example.com"
      const flowType = "login"
      const flow = { id: "fake-id", return_to: "http://example.com/return" }
      expect(initFlowUrl(sdkUrl, flowType, flow)).toBe(
        "http://example.com/self-service/login/browser?return_to=http%3A%2F%2Fexample.com%2Freturn",
      )
    })

    xit("should return sdkUrl with flowType and return_to if present in window location", () => {
      const sdkUrl = "http://example.com"
      const flowType = "login"
      const flow = { id: "fake-id" }

      // Not sure how to mock this.
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      ;(window.location.href =
        "http://example.com?return_to=http://example.com/return"),
        expect(initFlowUrl(sdkUrl, flowType, flow)).toBe(
          "http://example.com/self-service/login/browser?return_to=http%3A%2F%2Fexample.com%2Freturn",
        )
    })

    xit("should return sdkUrl with flowType if return_to is not present", () => {
      const sdkUrl = "http://example.com"
      const flowType = "login"
      const flow = { id: "fake-id" }

      // Not sure how to mock this.
      window.location.href = "http://example.com"
      expect(initFlowUrl(sdkUrl, flowType, flow)).toBe(
        "http://example.com/self-service/login/browser",
      )
    })
  })
})

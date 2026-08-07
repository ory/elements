// SPDX-License-Identifier: Apache-2.0

import { rewriteJsonResponse, rewriteUrls } from "./rewrite"

describe("URL rewriting", () => {
  it("rewrites configured UI routes before replacing the SDK origin", () => {
    expect(
      rewriteUrls(
        "https://auth.example.net/ui/login?flow=flow-123",
        "https://auth.example.net",
        "https://docs.example.com",
        {
          sdkUrl: "https://auth.example.net",
          project: { login_ui_url: "/auth/login" },
        },
      ),
    ).toBe("https://docs.example.com/auth/login?flow=flow-123")
  })

  it("rewrites nested SDK URLs and removes undefined object properties", () => {
    expect(
      rewriteJsonResponse(
        {
          action: "https://auth.example.net/self-service/login",
          omitted: undefined,
          nested: {
            sdk: "https://auth.example.net",
            omitted: undefined,
          },
        },
        "https://auth.example.net",
        "https://docs.example.com",
      ),
    ).toEqual({
      action: "https://docs.example.com/self-service/login",
      nested: { sdk: "https://docs.example.com" },
    })
  })

  it("removes undefined array entries while preserving nested values", () => {
    expect(
      rewriteJsonResponse(
        {
          items: [
            "https://auth.example.net/one",
            undefined,
            { url: "https://auth.example.net/two" },
          ],
        },
        "https://auth.example.net",
        "https://docs.example.com",
      ),
    ).toEqual({
      items: [
        "https://docs.example.com/one",
        { url: "https://docs.example.com/two" },
      ],
    })
  })
})

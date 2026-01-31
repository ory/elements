// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryMiddlewareOptions } from "src/middleware/middleware"
import { rewriteUrls, rewriteJsonResponse } from "./rewrite"
import { orySdkUrl } from "./sdk"

jest.mock("./sdk", () => ({
  orySdkUrl: jest.fn(),
}))

describe("rewriteUrls", () => {
  const config: OryMiddlewareOptions = {
    project: {
      recovery_ui_url: "/custom/recovery",
      registration_ui_url: "/custom/registration",
      login_ui_url: "/custom/login",
      verification_ui_url: "/custom/verification",
      settings_ui_url: "/custom/settings",
      error_ui_url: "/custom/error",
      default_locale: "en",
      default_redirect_url: "/",
      locale_behavior: "force_default",
      name: "Ory Next.js App Router Example",
      registration_enabled: true,
      verification_enabled: true,
      recovery_enabled: true,
    },
  }

  it("should rewrite URLs based on config overrides", () => {
    const source = "https://example.com/ui/login"
    const matchBaseUrl = "https://example.com"
    const selfUrl = "https://self.com"
    const result = rewriteUrls(source, matchBaseUrl, selfUrl, config)
    expect(result).toBe("https://self.com/custom/login")
  })

  it("should replace base URL with self URL", () => {
    const source = "https://example.com/some/path"
    const matchBaseUrl = "https://example.com"
    const selfUrl = "https://self.com"
    const result = rewriteUrls(source, matchBaseUrl, selfUrl, config)
    expect(result).toBe("https://self.com/some/path")
  })

  it("should NOT rewrite OAuth2 paths", () => {
    const matchBaseUrl = "https://example.com"
    const selfUrl = "https://self.com"

    const oauth2Paths = [
      "/oauth2/auth",
      "/oauth2/token",
      "/userinfo",
      "/.well-known/openid-configuration",
      "/.well-known/jwks.json",
    ]

    for (const path of oauth2Paths) {
      const source = `https://example.com${path}`
      const result = rewriteUrls(source, matchBaseUrl, selfUrl, config)
      expect(result).toBe(source)
    }
  })

  it("should rewrite non-OAuth2 paths while preserving OAuth2 paths in same source", () => {
    const source =
      '{"login":"https://example.com/login","oauth":"https://example.com/oauth2/auth"}'
    const matchBaseUrl = "https://example.com"
    const selfUrl = "https://self.com"
    const result = rewriteUrls(source, matchBaseUrl, selfUrl, config)
    expect(result).toBe(
      '{"login":"https://self.com/custom/login","oauth":"https://example.com/oauth2/auth"}',
    )
  })
})

describe("rewriteJsonResponse", () => {
  beforeEach(() => {
    ;(orySdkUrl as jest.Mock).mockReturnValue("https://ory-sdk-url.com")
  })

  it("should rewrite URLs in JSON response", () => {
    const obj = {
      url: "https://ory-sdk-url.com/path",
      nested: {
        url: "https://ory-sdk-url.com/nested/path",
      },
    }
    const proxyUrl = "https://proxy-url.com"
    const result = rewriteJsonResponse(obj, proxyUrl)
    expect(result).toEqual({
      url: "https://proxy-url.com/path",
      nested: {
        url: "https://proxy-url.com/nested/path",
      },
    })
  })

  it("should remove undefined values from JSON response", () => {
    const obj = {
      key1: "value1",
      key2: undefined,
      nested: {
        key3: "value3",
        key4: undefined,
      },
    }
    const result = rewriteJsonResponse(obj)
    expect(result).toEqual({
      key1: "value1",
      nested: {
        key3: "value3",
      },
    })
  })

  it("should handle arrays in JSON response", () => {
    const obj = {
      array: [
        "https://ory-sdk-url.com/item1",
        undefined,
        {
          url: "https://ory-sdk-url.com/item2",
        },
      ],
    }
    const proxyUrl = "https://proxy-url.com"
    const result = rewriteJsonResponse(obj, proxyUrl)
    expect(result).toEqual({
      array: [
        "https://proxy-url.com/item1",
        {
          url: "https://proxy-url.com/item2",
        },
      ],
    })
  })

  it("should handle null input gracefully", () => {
    const result = rewriteJsonResponse(null as unknown as object)
    expect(result).toBeNull()
  })

  it("should handle undefined input gracefully", () => {
    const result = rewriteJsonResponse(undefined as unknown as object)
    expect(result).toBeUndefined()
  })
})

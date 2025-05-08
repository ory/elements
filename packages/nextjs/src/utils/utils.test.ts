// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

// utils.test.ts

import { OryMiddlewareOptions } from "src/middleware/middleware"
import {
  onValidationError,
  toFlowParams,
  processSetCookieHeaders,
  filterRequestHeaders,
  joinUrlPaths,
} from "./utils"

type QueryParams = { [key: string]: string | string[] | undefined }

describe("onValidationError", () => {
  it("should return the same value passed to it", () => {
    const value = { key: "value" }
    expect(onValidationError(value)).toBe(value)
  })
})

describe("toFlowParams", () => {
  it("should return FlowParams with id, cookie, and return_to", async () => {
    const params: QueryParams = {
      ["flow"]: "some-flow-id",
      ["return_to"]: "https://example.com/return",
    }
    const getCookieHeader = jest.fn().mockResolvedValue("some-cookie-value")

    const result = await toFlowParams(params, getCookieHeader)

    expect(result).toEqual({
      id: "some-flow-id",
      cookie: "some-cookie-value",
      return_to: "https://example.com/return",
    })
    expect(getCookieHeader).toHaveBeenCalled()
  })
})

describe("processSetCookieHeaders", () => {
  ;[
    {
      name: "should respect forwarded headers",
      protocol: "http",
      forwardedProtocol: "https",
      host: "console.ory.sh",
      forwardedHost: "api.console.ory.sh",
      headers: new Headers([
        ["Set-Cookie", "sessionid=abc123; Path=/; HttpOnly"],
      ]),
    },
    {
      name: "should respect regular headers",
      protocol: "https",
      host: "console.ory.sh",
      headers: new Headers([
        ["set-cookie", "sessionid=abc123; Path=/; HttpOnly"],
      ]),
    },
    {
      name: "supports insecure",
      protocol: "http",
      host: "console.ory.sh",
      headers: new Headers([
        ["set-cookie", "sessionid=abc123; Path=/; HttpOnly"],
      ]),
    },
    {
      name: "supports multiple cookies comma separated",
      protocol: "http",
      host: "console.ory.sh",
      headers: new Headers([
        [
          "set-cookie",
          "sessionid1=abc123; Path=/; HttpOnly, sessionid2=123abc; Path=/abc; HttpOnly",
        ],
      ]),
    },
    {
      name: "supports multiple cookies in record",
      protocol: "http",
      host: "console.ory.sh",
      headers: new Headers([
        ["set-cookie", "sessionid1=abc123; Path=/; HttpOnly"],
        ["set-cookiE", "sessionid2=123abc; Path=/abc; HttpOnly"],
      ]),
    },
  ].forEach(
    ({
      name,
      protocol,
      forwardedProtocol,
      host,
      forwardedHost,
      headers,
      forceCookieDomain,
    }: {
      name: string
      protocol: string
      forwardedProtocol?: string
      host: string
      forwardedHost?: string
      headers: Headers
      forceCookieDomain?: string
    }) => {
      test(name, () => {
        const options: OryMiddlewareOptions = {
          forceCookieDomain,
        }
        const requestHeaders = new Headers()
        requestHeaders.set("host", host)
        if (forwardedProtocol) {
          requestHeaders.set("x-forwarded-proto", forwardedProtocol)
        }
        if (forwardedHost) {
          requestHeaders.set("x-forwarded-host", forwardedHost)
        }

        const fetchResponse = new Response(null, {
          headers,
        })

        const result = processSetCookieHeaders(
          protocol,
          fetchResponse,
          options,
          requestHeaders,
        )

        expect(result).toMatchSnapshot()
      })
    },
  )
})

describe("filterRequestHeaders", () => {
  it("should filter headers based on default and additional headers", () => {
    const headers = new Headers()
    headers.set("authorization", "Bearer token")
    headers.set("content-type", "application/json")
    headers.set("cookie", "sessionid=abc123")
    headers.set("x-custom-header", "custom-value")
    headers.set("x-ignore-header", "custom-value")

    const forwardAdditionalHeaders = ["x-custom-header"]

    const result = filterRequestHeaders(headers, forwardAdditionalHeaders)

    expect(result.get("authorization")).toBe("Bearer token")
    expect(result.get("content-type")).toBe("application/json")
    expect(result.get("x-custom-header")).toBe("custom-value")
    expect(result.has("x-ignore-header")).toBe(false)
  })

  it("should filter headers based on default headers only when additional headers are not provided", () => {
    const headers = new Headers()
    headers.set("authorization", "Bearer token")
    headers.set("content-type", "application/json")
    headers.set("cookie", "sessionid=abc123")
    headers.set("x-custom-header", "custom-value")

    const result = filterRequestHeaders(headers)

    expect(result.get("authorization")).toBe("Bearer token")
    expect(result.get("content-type")).toBe("application/json")
    expect(result.has("x-custom-header")).toBe(false)
  })
})

describe("joinUrlPaths", () => {
  it("should correctly join base URL and relative URL", () => {
    const baseUrl = "https://example.com/api"
    const relativeUrl = "/v1/resource"

    const result = joinUrlPaths(baseUrl, relativeUrl)

    expect(result).toBe("https://example.com/api/v1/resource")
  })

  it("should handle base URL without trailing slash", () => {
    const baseUrl = "https://example.com/"
    const relativeUrl = "v1/resource"

    const result = joinUrlPaths(baseUrl, relativeUrl)

    expect(result).toBe("https://example.com/v1/resource")
  })

  it("should handle relative URL with full URL", () => {
    const baseUrl = "https://example.com/api"
    const relativeUrl = "https://another.com/resource"

    const result = joinUrlPaths(baseUrl, relativeUrl)

    expect(result).toBe("https://another.com/api/resource")
  })
})

// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect } from "vitest"
import { filterRequestHeaders, defaultOmitHeaders } from "./headers"

describe("filterRequestHeaders", () => {
  it("allows standard safe headers", () => {
    const headers = new Headers({
      accept: "application/json",
      "accept-language": "en-US",
      "content-type": "application/json",
      cookie: "session=abc123",
      "user-agent": "Mozilla/5.0",
    })

    const filtered = filterRequestHeaders(headers)

    expect(filtered.get("accept")).toBe("application/json")
    expect(filtered.get("accept-language")).toBe("en-US")
    expect(filtered.get("content-type")).toBe("application/json")
    expect(filtered.get("cookie")).toBe("session=abc123")
    expect(filtered.get("user-agent")).toBe("Mozilla/5.0")
  })

  it("allows forwarding headers", () => {
    const headers = new Headers({
      "x-forwarded-for": "192.168.1.1",
      "x-forwarded-host": "example.com",
      "x-forwarded-proto": "https",
      "x-real-ip": "10.0.0.1",
    })

    const filtered = filterRequestHeaders(headers)

    expect(filtered.get("x-forwarded-for")).toBe("192.168.1.1")
    expect(filtered.get("x-forwarded-host")).toBe("example.com")
    expect(filtered.get("x-forwarded-proto")).toBe("https")
    expect(filtered.get("x-real-ip")).toBe("10.0.0.1")
  })

  it("filters out dangerous headers", () => {
    const headers = new Headers({
      accept: "application/json",
      host: "evil.com",
      authorization: "Bearer secret-token",
      origin: "https://attacker.com",
      referer: "https://attacker.com/phishing",
    })

    const filtered = filterRequestHeaders(headers)

    expect(filtered.get("accept")).toBe("application/json")
    expect(filtered.get("host")).toBeNull()
    expect(filtered.get("authorization")).toBeNull()
    expect(filtered.get("origin")).toBeNull()
    expect(filtered.get("referer")).toBeNull()
  })

  it("filters internal headers", () => {
    const headers = new Headers({
      accept: "application/json",
      connection: "keep-alive",
      "keep-alive": "timeout=5",
      "proxy-authorization": "Basic xyz",
      "proxy-connection": "keep-alive",
      te: "trailers",
      trailer: "Max-Forwards",
      "transfer-encoding": "chunked",
      upgrade: "websocket",
    })

    const filtered = filterRequestHeaders(headers)

    expect(filtered.get("accept")).toBe("application/json")
    expect(filtered.get("connection")).toBeNull()
    expect(filtered.get("keep-alive")).toBeNull()
    expect(filtered.get("proxy-authorization")).toBeNull()
    expect(filtered.get("transfer-encoding")).toBeNull()
  })

  it("allows additional custom headers when specified", () => {
    const headers = new Headers({
      accept: "application/json",
      "x-custom-header": "custom-value",
      "x-another-header": "another-value",
    })

    const filtered = filterRequestHeaders(headers, [
      "x-custom-header",
      "x-another-header",
    ])

    expect(filtered.get("accept")).toBe("application/json")
    expect(filtered.get("x-custom-header")).toBe("custom-value")
    expect(filtered.get("x-another-header")).toBe("another-value")
  })

  it("handles case-insensitive header matching", () => {
    const headers = new Headers({
      Accept: "application/json",
      "Content-Type": "text/html",
      COOKIE: "session=abc",
    })

    const filtered = filterRequestHeaders(headers)

    // Headers API normalizes to lowercase
    expect(filtered.get("accept")).toBe("application/json")
    expect(filtered.get("content-type")).toBe("text/html")
    expect(filtered.get("cookie")).toBe("session=abc")
  })

  it("returns empty headers when no allowed headers present", () => {
    const headers = new Headers({
      host: "evil.com",
      authorization: "Bearer token",
    })

    const filtered = filterRequestHeaders(headers)

    // Iterate over filtered headers to check it's empty
    let count = 0
    filtered.forEach(() => count++)
    expect(count).toBe(0)
  })

  it("handles empty headers input", () => {
    const headers = new Headers()
    const filtered = filterRequestHeaders(headers)

    let count = 0
    filtered.forEach(() => count++)
    expect(count).toBe(0)
  })

  it("handles undefined additionalHeaders", () => {
    const headers = new Headers({
      accept: "application/json",
    })

    const filtered = filterRequestHeaders(headers, undefined)

    expect(filtered.get("accept")).toBe("application/json")
  })

  it("handles empty additionalHeaders array", () => {
    const headers = new Headers({
      accept: "application/json",
      "x-custom": "value",
    })

    const filtered = filterRequestHeaders(headers, [])

    expect(filtered.get("accept")).toBe("application/json")
    expect(filtered.get("x-custom")).toBeNull()
  })
})

describe("defaultOmitHeaders", () => {
  it("contains expected headers to omit from responses", () => {
    expect(defaultOmitHeaders).toContain("transfer-encoding")
    expect(defaultOmitHeaders).toContain("content-encoding")
    expect(defaultOmitHeaders).toContain("content-length")
  })

  it("is an array of lowercase header names", () => {
    expect(Array.isArray(defaultOmitHeaders)).toBe(true)
    defaultOmitHeaders.forEach((header) => {
      expect(header).toBe(header.toLowerCase())
    })
  })
})

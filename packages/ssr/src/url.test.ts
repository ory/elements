// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { isSameSite, parseOrigin, requestOrigin } from "./url"

describe("isSameSite", () => {
  it.each([
    ["https://app.example.com", "https://app.example.com:8443"],
    ["https://app.example.com", "https://auth.example.com"],
    ["http://localhost:3000", "http://localhost:4433"],
  ])("treats %s and %s as the same site", (a, b) => {
    expect(isSameSite(a, b)).toBe(true)
  })

  it.each([
    ["https://app.example.com", "https://example.org"],
    ["https://a.vercel.app", "https://b.vercel.app"],
    ["https://127.0.0.1", "https://127.0.0.2"],
    ["not a url", "https://example.com"],
  ])("treats %s and %s as different sites", (a, b) => {
    expect(isSameSite(a, b)).toBe(false)
  })
})

describe("requestOrigin", () => {
  it("uses the Host header", () => {
    expect(
      requestOrigin({
        url: "http://0.0.0.0:3000/login",
        headers: new Headers({ host: "localhost:3000" }),
      }),
    ).toBe("http://localhost:3000")
  })

  it("falls back to the URL host", () => {
    expect(
      requestOrigin({
        url: new URL("https://app.example.com/login?flow=1"),
        headers: new Headers(),
      }),
    ).toBe("https://app.example.com")
  })
})

describe("parseOrigin", () => {
  it.each([
    ["http://localhost:3000", "http://localhost:3000"],
    ["http://localhost:3000/", "http://localhost:3000"],
    ["https://app.example.com", "https://app.example.com"],
    ["https://app.example.com:8443", "https://app.example.com:8443"],
    ["http://127.0.0.1:4000", "http://127.0.0.1:4000"],
    ["http://[::1]:3000", "http://[::1]:3000"],
  ])("accepts %s", (value, origin) => {
    expect(parseOrigin(value)).toBe(origin)
  })

  it.each([
    ["no scheme", "localhost:3000"],
    ["user info", "http://localhost:3000@example.org"],
    ["user and password", "http://user:pass@localhost:3000"],
    ["path", "http://example.org/?x=localhost:3000"],
    ["path segment", "https://app.example.com/login"],
    ["query", "https://app.example.com?x=1"],
    ["fragment", "https://app.example.com#x"],
    ["default port", "https://app.example.com:443"],
    ["upper case host", "https://APP.example.com"],
    ["space in host", "http://ex ample.com"],
    ["non-HTTP scheme", "ftp://app.example.com"],
    ["empty", ""],
    ["two trailing slashes", "https://app.example.com//"],
  ])("rejects %s (%s)", (_name, value) => {
    expect(parseOrigin(value)).toBeNull()
  })
})

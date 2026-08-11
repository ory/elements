// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { isTrustedOrigin } from "./trusted-origin"

describe("isTrustedOrigin", () => {
  it("matches an exact string origin", () => {
    expect(
      isTrustedOrigin("https://app.example.com", ["https://app.example.com"]),
    ).toBe(true)
  })

  it("rejects an origin not in the list", () => {
    expect(
      isTrustedOrigin("https://attacker.example", ["https://app.example.com"]),
    ).toBe(false)
  })

  it("normalizes a trailing slash on the configured entry", () => {
    expect(
      isTrustedOrigin("https://app.example.com", ["https://app.example.com/"]),
    ).toBe(true)
  })

  it("normalizes a trailing slash on the request origin", () => {
    expect(
      isTrustedOrigin("https://app.example.com/", ["https://app.example.com"]),
    ).toBe(true)
  })

  it("is case-sensitive for string entries", () => {
    expect(
      isTrustedOrigin("https://APP.example.com", ["https://app.example.com"]),
    ).toBe(false)
  })

  it("distinguishes ports", () => {
    expect(
      isTrustedOrigin("https://app.example.com:8443", [
        "https://app.example.com",
      ]),
    ).toBe(false)
  })

  it("matches a RegExp entry", () => {
    expect(
      isTrustedOrigin("https://pr-42.myapp.vercel.app", [
        /^https:\/\/[a-z0-9-]+\.myapp\.vercel\.app$/,
      ]),
    ).toBe(true)
  })

  it("rejects an origin that no RegExp entry matches", () => {
    expect(
      isTrustedOrigin("https://attacker.example", [
        /^https:\/\/[a-z0-9-]+\.myapp\.vercel\.app$/,
      ]),
    ).toBe(false)
  })

  it("returns false for an empty list", () => {
    expect(isTrustedOrigin("https://app.example.com", [])).toBe(false)
  })

  it("matches deterministically when a RegExp entry has the g flag", () => {
    const entry = /^https:\/\/app\.example\.com$/g
    expect(isTrustedOrigin("https://app.example.com", [entry])).toBe(true)
    expect(isTrustedOrigin("https://app.example.com", [entry])).toBe(true)
  })

  it("matches deterministically when a RegExp entry has the y flag", () => {
    const entry = /^https:\/\/app\.example\.com$/y
    expect(isTrustedOrigin("https://app.example.com", [entry])).toBe(true)
    expect(isTrustedOrigin("https://app.example.com", [entry])).toBe(true)
  })

  it("matches when any entry in a mixed list matches", () => {
    expect(
      isTrustedOrigin("http://localhost:3000", [
        "https://app.example.com",
        /^http:\/\/localhost(:\d+)?$/,
      ]),
    ).toBe(true)
  })
})

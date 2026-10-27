// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { checkTrustedOrigins, isTrustedOrigin } from "./trusted-origin"

describe("isTrustedOrigin", () => {
  it("matches an exact string origin", () => {
    expect(
      isTrustedOrigin("https://app.example.com", ["https://app.example.com"]),
    ).toBe(true)
  })

  it("rejects an origin not in the list", () => {
    expect(
      isTrustedOrigin("https://other.example.org", ["https://app.example.com"]),
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

  it("distinguishes ports", () => {
    expect(
      isTrustedOrigin("https://app.example.com:8443", [
        "https://app.example.com",
      ]),
    ).toBe(false)
  })

  it("returns false for an empty list", () => {
    expect(isTrustedOrigin("https://app.example.com", [])).toBe(false)
  })

  it("matches when any entry in the list matches", () => {
    expect(
      isTrustedOrigin("http://localhost:3000", [
        "https://app.example.com",
        "http://localhost:3000",
      ]),
    ).toBe(true)
  })

  it.each([
    ["user info", "http://localhost:3000@example.org"],
    ["a path", "http://example.org/?x=localhost:3000"],
    ["upper case", "https://APP.example.com"],
    ["a space", "https://app.example .com"],
  ])("trusts only valid origins, not one with %s", (_name, origin) => {
    expect(
      isTrustedOrigin(origin, [
        "http://localhost:3000",
        "https://app.example.com",
        "https://*.example.com",
        "https://app.example.*",
      ]),
    ).toBe(false)
  })

  describe("globs", () => {
    it.each([
      [
        "https://my-app-*-my-team.vercel.app",
        "https://my-app-git-main-my-team.vercel.app",
      ],
      [
        "https://my-app-*-my-team.vercel.app",
        "https://my-app-abc123-my-team.vercel.app",
      ],
      ["https://pr-*.preview.example.com", "https://pr-42.preview.example.com"],
      ["https://*.example.com", "https://app.example.com"],
      ["http://*.example.com:3000", "http://app.example.com:3000"],
    ])("%s matches %s", (pattern, origin) => {
      expect(isTrustedOrigin(origin, [pattern])).toBe(true)
    })

    it.each([
      ["https://pr-*.preview.example.com", "https://pr-1-preview-example.com"],
      [
        "https://pr-*.preview.example.com",
        "https://pr-1.x.preview.example.com",
      ],
      ["https://*.example.com", "https://a.b.example.com"],
      ["https://*.example.com", "https://example.com"],
      ["https://*.example.com", "http://app.example.com"],
      ["https://*.example.com", "https://app.example.com:8443"],
      ["http://*.example.com:3000", "http://app.example.com"],
      [
        "https://my-app-*-my-team.vercel.app",
        "https://other-app-git-main-my-team.vercel.app",
      ],
      [
        "https://my-app-*-my-team.vercel.app",
        "https://my-app-git-main-my-team.vercel.app.example.org",
      ],
    ])("%s does not match %s", (pattern, origin) => {
      expect(isTrustedOrigin(origin, [pattern])).toBe(false)
    })
  })
})

describe("checkTrustedOrigins", () => {
  it.each([
    [["http://localhost:3000"]],
    [["http://localhost:3000/"]],
    [["http://127.0.0.1:3000", "http://[::1]:3000"]],
    [["https://my-app-*-my-team.vercel.app"]],
    [["https://pr-*.preview.example.com", "https://*.example.com"]],
    [["http://*.example.com:3000"]],
  ])("accepts %j", (entries) => {
    expect(() => checkTrustedOrigins(entries, "@ory/test")).not.toThrow()
  })

  it.each([undefined, []])("throws for %j", (entries) => {
    expect(() => checkTrustedOrigins(entries, "@ory/test")).toThrow(
      /^\[@ory\/test\] `trustedOrigins` is not configured\./,
    )
  })

  it.each([
    ["no scheme", "localhost:3000"],
    ["a path", "http://localhost:3000/login"],
    ["user info", "http://user@localhost:3000"],
    ["a default port", "https://app.example.com:443"],
    ["upper case", "https://App.example.com"],
    ["a non-HTTP scheme", "ftp://app.example.com"],
    ["a wildcard in the scheme", "*://app.example.com"],
    ["a wildcard in the port", "http://localhost:*"],
    ["a wildcard in a path", "https://app.example.com/*"],
    ["only a wildcard", "https://*"],
    ["a wildcard host without a registrable domain", "http://*:3000"],
    ["a wildcard registrable-domain label", "https://*.vercel.app"],
    ["a wildcard registrable-domain label", "https://*.com"],
    ["a wildcard registrable-domain label", "https://app.*.com"],
    ["a wildcard in the public suffix", "https://app.example.*"],
    ["a dot next to the wildcard", "https://*..example.com"],
  ])("rejects an entry with %s (%s)", (_name, entry) => {
    expect(() => checkTrustedOrigins([entry], "@ory/test")).toThrow(TypeError)
    expect(() => checkTrustedOrigins([entry], "@ory/test")).toThrow(
      /^\[@ory\/test\] /,
    )
  })

  it("names the rejected entry", () => {
    expect(() =>
      checkTrustedOrigins(
        ["http://localhost:3000", "localhost:4000"],
        "@ory/test",
      ),
    ).toThrow(/"localhost:4000"/)
  })

  it("rejects a RegExp entry", () => {
    expect(() =>
      checkTrustedOrigins(
        [/^http:\/\/localhost:3000$/] as unknown as string[],
        "@ory/test",
      ),
    ).toThrow(/^\[@ory\/test\] `trustedOrigins` accepts only strings\./)
  })
})

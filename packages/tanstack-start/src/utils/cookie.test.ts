// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { guessCookieDomain } from "./cookie"

describe("cookie domain selection", () => {
  it.each([
    ["https://localhost", "localhost"],
    ["https://123.123.123.123", "123.123.123.123"],
    ["https://www.example.org", "example.org"],
    ["https://www.example.org:1234", "example.org"],
    ["https://foo.localhost/flow", "foo.localhost"],
    [
      "https://spark-public.s3.amazonaws.com/self-service/login",
      "spark-public.s3.amazonaws.com",
    ],
    ["docs-gamma-seven.vercel.app", "docs-gamma-seven.vercel.app"],
  ])("selects the cookie domain for %s", (input, expected) => {
    expect(guessCookieDomain(input)).toBe(expected)
  })

  it.each([
    "https://123.123.123.123.123",
    "https://2001:0000:130F:0000:0000:09C0:876A:130B",
  ])("does not invent a domain for invalid URL %s", (input) => {
    expect(guessCookieDomain(input)).toBeUndefined()
  })
})

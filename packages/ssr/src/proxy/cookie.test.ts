// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { guessCookieDomain } from "./cookie"

describe("cookie guesser", () => {
  test("does not use any guessing domain", () => {
    expect(guessCookieDomain("https://localhost")).toEqual("localhost")
  })

  test("is not confused by invalid data", () => {
    expect(guessCookieDomain("https://123.123.123.123.123")).toEqual(undefined)
  })

  test("is not confused by IPv4", () => {
    expect(guessCookieDomain("https://123.123.123.123")).toEqual(
      "123.123.123.123",
    )
  })

  test("is not confused by IPv6", () => {
    expect(
      guessCookieDomain("https://2001:0000:130F:0000:0000:09C0:876A:130B"),
    ).toEqual(undefined)
  })

  test("uses TLD", () => {
    expect(guessCookieDomain("https://www.example.org")).toEqual("example.org")

    expect(guessCookieDomain("https://www.example.org:1234")).toEqual(
      "example.org",
    )
    expect(guessCookieDomain("https://localhost/123")).toEqual("localhost")
    expect(guessCookieDomain("https://foo.localhost/123")).toEqual(
      "foo.localhost",
    )
    expect(guessCookieDomain("https://localhost:1234/123")).toEqual("localhost")
  })

  test("understands public suffix list", () => {
    expect(
      guessCookieDomain(
        "https://spark-public.s3.amazonaws.com/self-service/login",
      ),
    ).toEqual("spark-public.s3.amazonaws.com")

    expect(guessCookieDomain("spark-public.s3.amazonaws.com")).toEqual(
      "spark-public.s3.amazonaws.com",
    )
    expect(guessCookieDomain("https://docs-gamma-seven.vercel.app")).toEqual(
      "docs-gamma-seven.vercel.app",
    )
  })
})

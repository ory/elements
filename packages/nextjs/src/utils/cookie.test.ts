// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { guessCookieDomain } from "./cookie"

describe("cookie guesser", () => {
  test("uses force domain", () => {
    expect(
      guessCookieDomain("https://localhost", {
        forceCookieDomain: "some-domain",
      }),
    ).toEqual("some-domain")
  })

  test("does not use any guessing domain", () => {
    expect(guessCookieDomain("https://localhost", {})).toEqual(undefined)
  })

  test("is not confused by invalid data", () => {
    expect(guessCookieDomain("5qw5tare4g", {})).toEqual(undefined)
    expect(guessCookieDomain("https://123.123.123.123.123", {})).toEqual(
      undefined,
    )
  })

  test("is not confused by IP", () => {
    expect(guessCookieDomain("https://123.123.123.123", {})).toEqual(undefined)
    expect(
      guessCookieDomain("https://2001:0db8:0000:0000:0000:ff00:0042:8329", {}),
    ).toEqual(undefined)
  })

  test("returns undefined for public suffix", () => {
    expect(guessCookieDomain("https://asdf.vercel.app", {})).toEqual(undefined)
  })

  test("uses TLD", () => {
    expect(guessCookieDomain("https://foo.localhost", {})).toEqual(
      "foo.localhost",
    )

    expect(guessCookieDomain("https://foo.localhost:1234", {})).toEqual(
      "foo.localhost",
    )

    expect(
      guessCookieDomain(
        "https://spark-public.s3.amazonaws.com/dataanalysis/loansData.csv",
        {},
      ),
    ).toEqual("spark-public.s3.amazonaws.com")

    expect(guessCookieDomain("spark-public.s3.amazonaws.com", {})).toEqual(
      "spark-public.s3.amazonaws.com",
    )

    expect(guessCookieDomain("https://localhost/123", {})).toEqual("localhost")
    expect(guessCookieDomain("https://localhost:1234/123", {})).toEqual(
      "localhost",
    )
  })
})

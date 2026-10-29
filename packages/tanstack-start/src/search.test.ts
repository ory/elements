// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, test } from "vitest"
import { validateOrySearch } from "./search"

describe("validateOrySearch", () => {
  test("keeps string values", () => {
    expect(
      validateOrySearch({ flow: "abc", return_to: "https://example.org/" }),
    ).toEqual({ flow: "abc", return_to: "https://example.org/" })
  })

  test("turns values TanStack Router parsed as JSON back into strings", () => {
    expect(validateOrySearch({ flow: 123, refresh: true })).toEqual({
      flow: "123",
      refresh: "true",
    })
  })

  test("keeps repeated values", () => {
    expect(validateOrySearch({ scope: ["openid", 1] })).toEqual({
      scope: ["openid", "1"],
    })
  })

  test("drops values without a query string form", () => {
    expect(
      validateOrySearch({ a: { nested: true }, b: null, c: undefined, d: [] }),
    ).toEqual({})
  })

  test("parses a query string", () => {
    expect(validateOrySearch("?flow=abc&scope=openid&scope=email")).toEqual({
      flow: "abc",
      scope: ["openid", "email"],
    })
  })

  test("keeps query keys named like Object.prototype properties", () => {
    const fromString = validateOrySearch("?constructor=abc&__proto__=def")
    expect(Object.entries(fromString)).toEqual([
      ["constructor", "abc"],
      ["__proto__", "def"],
    ])

    const fromObject = validateOrySearch(
      JSON.parse('{"__proto__":"def","toString":"ghi"}'),
    )
    expect(Object.entries(fromObject)).toEqual([
      ["__proto__", "def"],
      ["toString", "ghi"],
    ])
  })

  test.each([[undefined], [null], [42], [["flow"]]])(
    "returns no params for %p",
    (input) => {
      expect(validateOrySearch(input)).toEqual({})
    },
  )
})

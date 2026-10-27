// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { rewriteJsonResponse } from "./rewrite"

describe("rewriteJsonResponse", () => {
  const urls = { from: "https://ory-sdk-url.com", to: "https://proxy-url.com" }

  it("should rewrite URLs in JSON response", () => {
    const obj = {
      url: "https://ory-sdk-url.com/path",
      nested: {
        url: "https://ory-sdk-url.com/nested/path",
      },
    }
    expect(rewriteJsonResponse(obj, urls)).toEqual({
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
    expect(rewriteJsonResponse(obj)).toEqual({
      key1: "value1",
      nested: {
        key3: "value3",
      },
    })
  })

  it("leaves URLs alone without a rewrite", () => {
    const obj = { url: "https://ory-sdk-url.com/path" }
    expect(rewriteJsonResponse(obj)).toEqual(obj)
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
    expect(rewriteJsonResponse(obj, urls)).toEqual({
      array: [
        "https://proxy-url.com/item1",
        {
          url: "https://proxy-url.com/item2",
        },
      ],
    })
  })

  it("keeps Date values in objects and arrays", () => {
    const date = new Date("2026-01-01T00:00:00Z")
    const result = rewriteJsonResponse(
      { expires_at: date, nested: { issued_at: date }, dates: [date] },
      urls,
    )

    for (const value of [
      result.expires_at,
      result.nested.issued_at,
      result.dates[0],
    ]) {
      expect(value).toBeInstanceOf(Date)
      expect(value.getTime()).toBe(date.getTime())
    }
  })
})

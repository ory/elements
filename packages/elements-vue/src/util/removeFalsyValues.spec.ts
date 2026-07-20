// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect } from "vitest"
import { expandDotNotation, removeEmptyStrings } from "./removeFalsyValues"

describe("expandDotNotation", () => {
  it("expands dot-notation keys into nested objects", () => {
    const input = {
      "traits.email": "foo@bar.com",
      "traits.name.first": "John",
      "traits.name.last": "Doe",
    }

    const result = expandDotNotation(input)

    expect(result).toEqual({
      traits: {
        email: "foo@bar.com",
        name: {
          first: "John",
          last: "Doe",
        },
      },
    })
  })

  it("handles mixed dot-notation and regular keys", () => {
    const input = {
      identifier: "test@example.com",
      "traits.email": "test@example.com",
      password: "secret",
    }

    const result = expandDotNotation(input)

    expect(result).toEqual({
      identifier: "test@example.com",
      traits: {
        email: "test@example.com",
      },
      password: "secret",
    })
  })

  it("handles keys without dots", () => {
    const input = {
      email: "test@example.com",
      password: "secret",
    }

    const result = expandDotNotation(input)

    expect(result).toEqual({
      email: "test@example.com",
      password: "secret",
    })
  })

  it("handles empty object", () => {
    const result = expandDotNotation({})
    expect(result).toEqual({})
  })

  it("handles deeply nested dot notation", () => {
    const input = {
      "a.b.c.d.e": "value",
    }

    const result = expandDotNotation(input)

    expect(result).toEqual({
      a: {
        b: {
          c: {
            d: {
              e: "value",
            },
          },
        },
      },
    })
  })

  it("handles multiple keys in same nested path", () => {
    const input = {
      "user.profile.firstName": "John",
      "user.profile.lastName": "Doe",
      "user.email": "john@example.com",
    }

    const result = expandDotNotation(input)

    expect(result).toEqual({
      user: {
        profile: {
          firstName: "John",
          lastName: "Doe",
        },
        email: "john@example.com",
      },
    })
  })
})

describe("removeEmptyStrings", () => {
  it("removes empty strings from object", () => {
    const input = {
      name: "John",
      email: "",
      password: "secret",
    }

    const result = removeEmptyStrings(input)

    expect(result).toEqual({
      name: "John",
      password: "secret",
    })
  })

  it("removes undefined values from object", () => {
    const input = {
      name: "John",
      email: undefined,
      password: "secret",
    }

    const result = removeEmptyStrings(input)

    expect(result).toEqual({
      name: "John",
      password: "secret",
    })
  })

  it("preserves boolean false values", () => {
    const input = {
      name: "John",
      active: false,
      verified: true,
    }

    const result = removeEmptyStrings(input)

    expect(result).toEqual({
      name: "John",
      active: false,
      verified: true,
    })
  })

  it("preserves number zero values", () => {
    const input = {
      name: "John",
      count: 0,
      total: 100,
    }

    const result = removeEmptyStrings(input)

    expect(result).toEqual({
      name: "John",
      count: 0,
      total: 100,
    })
  })

  it("handles nested objects", () => {
    const input = {
      user: {
        name: "John",
        email: "",
        profile: {
          bio: "",
          website: "https://example.com",
        },
      },
    }

    const result = removeEmptyStrings(input)

    expect(result).toEqual({
      user: {
        name: "John",
        profile: {
          website: "https://example.com",
        },
      },
    })
  })

  it("removes empty nested objects", () => {
    const input = {
      user: {
        name: "John",
        profile: {
          bio: "",
          website: "",
        },
      },
    }

    const result = removeEmptyStrings(input)

    expect(result).toEqual({
      user: {
        name: "John",
      },
    })
  })

  it("handles arrays", () => {
    const input = {
      tags: ["vue", "", "typescript", ""],
    }

    const result = removeEmptyStrings(input)

    expect(result).toEqual({
      tags: ["vue", "typescript"],
    })
  })

  it("removes empty arrays", () => {
    const input = {
      name: "John",
      tags: ["", ""],
    }

    const result = removeEmptyStrings(input)

    expect(result).toEqual({
      name: "John",
    })
  })

  it("handles arrays with objects", () => {
    const input = {
      users: [
        { name: "John", email: "" },
        { name: "", email: "jane@example.com" },
      ],
    }

    const result = removeEmptyStrings(input)

    expect(result).toEqual({
      users: [{ name: "John" }, { email: "jane@example.com" }],
    })
  })

  it("returns primitive values as-is", () => {
    expect(removeEmptyStrings("hello")).toBe("hello")
    expect(removeEmptyStrings(42)).toBe(42)
    expect(removeEmptyStrings(true)).toBe(true)
    expect(removeEmptyStrings(null)).toBe(null)
  })

  it("handles empty object", () => {
    const result = removeEmptyStrings({})
    expect(result).toEqual({})
  })
})

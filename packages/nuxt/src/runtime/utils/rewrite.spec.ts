// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect } from "vitest"
import { rewriteUrls, rewriteJsonResponse } from "./rewrite"

describe("rewriteUrls", () => {
  it("replaces SDK URL with local URL in content", () => {
    const content = "Visit https://ory.example.com/login for authentication"
    const result = rewriteUrls(
      content,
      "https://ory.example.com",
      "https://localhost:3000",
    )
    expect(result).toBe("Visit https://localhost:3000/login for authentication")
  })

  it("handles multiple occurrences", () => {
    const content =
      "URL1: https://sdk.ory.sh/api URL2: https://sdk.ory.sh/session"
    const result = rewriteUrls(
      content,
      "https://sdk.ory.sh",
      "http://localhost:3000",
    )
    expect(result).toBe(
      "URL1: http://localhost:3000/api URL2: http://localhost:3000/session",
    )
  })

  it("handles trailing slashes in match URL", () => {
    const content = "https://ory.example.com/login"
    const result = rewriteUrls(
      content,
      "https://ory.example.com/",
      "https://localhost:3000/",
    )
    expect(result).toBe("https://localhost:3000/login")
  })

  it("handles trailing slashes in self URL", () => {
    const content = "https://ory.example.com/login"
    const result = rewriteUrls(
      content,
      "https://ory.example.com",
      "https://localhost:3000/",
    )
    expect(result).toBe("https://localhost:3000/login")
  })

  it("returns unchanged content when no match", () => {
    const content = "No URLs here"
    const result = rewriteUrls(
      content,
      "https://ory.example.com",
      "https://localhost:3000",
    )
    expect(result).toBe("No URLs here")
  })

  it("handles empty content", () => {
    const result = rewriteUrls(
      "",
      "https://ory.example.com",
      "https://localhost:3000",
    )
    expect(result).toBe("")
  })
})

describe("rewriteJsonResponse", () => {
  it("rewrites string values in flat object", () => {
    const obj = {
      url: "https://sdk.ory.sh/api/login",
      name: "test",
    }
    const result = rewriteJsonResponse(
      obj,
      "https://sdk.ory.sh",
      "http://localhost:3000",
    )
    expect(result.url).toBe("http://localhost:3000/api/login")
    expect(result.name).toBe("test")
  })

  it("rewrites nested objects", () => {
    const obj = {
      data: {
        redirect_url: "https://sdk.ory.sh/callback",
        nested: {
          another_url: "https://sdk.ory.sh/session",
        },
      },
    }
    const result = rewriteJsonResponse(
      obj,
      "https://sdk.ory.sh",
      "http://localhost:3000",
    )
    expect(result.data.redirect_url).toBe("http://localhost:3000/callback")
    expect(result.data.nested.another_url).toBe("http://localhost:3000/session")
  })

  it("rewrites arrays of strings", () => {
    const obj = {
      urls: ["https://sdk.ory.sh/one", "https://sdk.ory.sh/two", "other"],
    }
    const result = rewriteJsonResponse(
      obj,
      "https://sdk.ory.sh",
      "http://localhost:3000",
    )
    expect(result.urls).toEqual([
      "http://localhost:3000/one",
      "http://localhost:3000/two",
      "other",
    ])
  })

  it("rewrites arrays of objects", () => {
    const obj = {
      items: [
        { url: "https://sdk.ory.sh/item1" },
        { url: "https://sdk.ory.sh/item2" },
      ],
    }
    const result = rewriteJsonResponse(
      obj,
      "https://sdk.ory.sh",
      "http://localhost:3000",
    )
    expect(result.items[0].url).toBe("http://localhost:3000/item1")
    expect(result.items[1].url).toBe("http://localhost:3000/item2")
  })

  it("preserves non-string values", () => {
    const obj = {
      count: 42,
      active: true,
      nullable: null,
      url: "https://sdk.ory.sh/test",
    }
    const result = rewriteJsonResponse(
      obj,
      "https://sdk.ory.sh",
      "http://localhost:3000",
    )
    expect(result.count).toBe(42)
    expect(result.active).toBe(true)
    expect(result.nullable).toBe(null)
    expect(result.url).toBe("http://localhost:3000/test")
  })

  it("filters out undefined values", () => {
    const obj = {
      defined: "value",
      undef: undefined,
    }
    const result = rewriteJsonResponse(
      obj,
      "https://sdk.ory.sh",
      "http://localhost:3000",
    )
    expect(result.defined).toBe("value")
    expect("undef" in result).toBe(false)
  })

  it("handles deeply nested structures", () => {
    const obj = {
      level1: {
        level2: {
          level3: {
            url: "https://sdk.ory.sh/deep",
          },
        },
      },
    }
    const result = rewriteJsonResponse(
      obj,
      "https://sdk.ory.sh",
      "http://localhost:3000",
    )
    expect(result.level1.level2.level3.url).toBe("http://localhost:3000/deep")
  })

  it("handles mixed array types", () => {
    const obj = {
      mixed: [
        "https://sdk.ory.sh/string",
        42,
        { url: "https://sdk.ory.sh/object" },
        null,
        true,
      ],
    }
    const result = rewriteJsonResponse(
      obj,
      "https://sdk.ory.sh",
      "http://localhost:3000",
    )
    expect(result.mixed[0]).toBe("http://localhost:3000/string")
    expect(result.mixed[1]).toBe(42)
    expect((result.mixed[2] as { url: string }).url).toBe(
      "http://localhost:3000/object",
    )
    expect(result.mixed[3]).toBe(null)
    expect(result.mixed[4]).toBe(true)
  })

  it("handles empty objects", () => {
    const result = rewriteJsonResponse(
      {},
      "https://sdk.ory.sh",
      "http://localhost:3000",
    )
    expect(result).toEqual({})
  })

  it("handles empty arrays in objects", () => {
    const obj = { items: [] }
    const result = rewriteJsonResponse(
      obj,
      "https://sdk.ory.sh",
      "http://localhost:3000",
    )
    expect(result.items).toEqual([])
  })

  it("handles typical Ory flow response", () => {
    const flowResponse = {
      id: "flow-123",
      request_url: "https://sdk.ory.sh/self-service/login/browser",
      ui: {
        action: "https://sdk.ory.sh/self-service/login",
        method: "POST",
        nodes: [
          {
            type: "input",
            attributes: {
              name: "identifier",
              action: "https://sdk.ory.sh/self-service/methods/password",
            },
          },
        ],
      },
    }

    const result = rewriteJsonResponse(
      flowResponse,
      "https://sdk.ory.sh",
      "http://localhost:3000",
    )

    expect(result.id).toBe("flow-123")
    expect(result.request_url).toBe(
      "http://localhost:3000/self-service/login/browser",
    )
    expect(result.ui.action).toBe("http://localhost:3000/self-service/login")
    expect(result.ui.method).toBe("POST")
    expect(result.ui.nodes[0].attributes.action).toBe(
      "http://localhost:3000/self-service/methods/password",
    )
  })
})

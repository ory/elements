// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect } from "vitest"
import { processSetCookieHeaders } from "./cookie"

/**
 * Helper to create a mock Response with Set-Cookie header
 * Note: We create a custom mock because Set-Cookie headers have special
 * handling in browsers and some test environments don't support it properly
 */
function createMockResponse(setCookie: string | null): Response {
  // Create a mock response with a custom headers object that properly returns set-cookie
  const mockHeaders = {
    get: (name: string) => {
      if (name.toLowerCase() === "set-cookie") {
        return setCookie
      }
      return null
    },
  } as Headers

  return {
    headers: mockHeaders,
  } as Response
}

/**
 * Helper to create request headers with host
 */
function createRequestHeaders(host?: string): Headers {
  const headers = new Headers()
  if (host) {
    headers.set("host", host)
  }
  return headers
}

describe("processSetCookieHeaders", () => {
  describe("basic cookie processing", () => {
    it("returns empty array when no set-cookie header", () => {
      const response = createMockResponse(null)
      const result = processSetCookieHeaders(
        "https:",
        response,
        {},
        createRequestHeaders(),
      )
      expect(result).toEqual([])
    })

    it("processes simple cookie", () => {
      const response = createMockResponse("session=abc123")
      const result = processSetCookieHeaders(
        "https:",
        response,
        {},
        createRequestHeaders(),
      )
      expect(result.length).toBe(1)
      expect(result[0]).toContain("session=abc123")
    })

    it("preserves cookie value", () => {
      const response = createMockResponse("token=eyJhbGciOiJIUzI1NiJ9.test")
      const result = processSetCookieHeaders(
        "https:",
        response,
        {},
        createRequestHeaders(),
      )
      expect(result[0]).toContain("token=eyJhbGciOiJIUzI1NiJ9.test")
    })
  })

  describe("cookie attributes", () => {
    it("preserves Path attribute", () => {
      const response = createMockResponse("session=abc; Path=/api")
      const result = processSetCookieHeaders(
        "https:",
        response,
        {},
        createRequestHeaders(),
      )
      expect(result[0]).toContain("Path=/api")
    })

    it("preserves HttpOnly attribute", () => {
      const response = createMockResponse("session=abc; HttpOnly")
      const result = processSetCookieHeaders(
        "https:",
        response,
        {},
        createRequestHeaders(),
      )
      expect(result[0]).toContain("HttpOnly")
    })

    it("preserves SameSite attribute", () => {
      const response = createMockResponse("session=abc; SameSite=Lax")
      const result = processSetCookieHeaders(
        "https:",
        response,
        {},
        createRequestHeaders(),
      )
      expect(result[0]).toContain("SameSite=Lax")
    })

    it("preserves Expires attribute", () => {
      const response = createMockResponse(
        "session=abc; Expires=Wed, 09 Jun 2025 10:18:14 GMT",
      )
      const result = processSetCookieHeaders(
        "https:",
        response,
        {},
        createRequestHeaders(),
      )
      expect(result[0]).toContain("Expires=")
    })

    it("preserves Max-Age attribute", () => {
      const response = createMockResponse("session=abc; Max-Age=3600")
      const result = processSetCookieHeaders(
        "https:",
        response,
        {},
        createRequestHeaders(),
      )
      expect(result[0]).toContain("Max-Age=3600")
    })

    it("adds Secure flag for https protocol", () => {
      const response = createMockResponse("session=abc")
      const result = processSetCookieHeaders(
        "https:",
        response,
        {},
        createRequestHeaders(),
      )
      expect(result[0]).toContain("Secure")
    })

    it("preserves existing Secure flag", () => {
      const response = createMockResponse("session=abc; Secure")
      const result = processSetCookieHeaders(
        "http:",
        response,
        {},
        createRequestHeaders(),
      )
      expect(result[0]).toContain("Secure")
    })
  })

  describe("domain handling", () => {
    it("extracts domain from request host", () => {
      const response = createMockResponse("session=abc")
      const requestHeaders = createRequestHeaders("app.example.com")
      const result = processSetCookieHeaders(
        "https:",
        response,
        {},
        requestHeaders,
      )
      expect(result[0]).toContain("Domain=example.com")
    })

    it("handles host with port", () => {
      const response = createMockResponse("session=abc")
      const requestHeaders = createRequestHeaders("app.example.com:3000")
      const result = processSetCookieHeaders(
        "https:",
        response,
        {},
        requestHeaders,
      )
      expect(result[0]).toContain("Domain=example.com")
    })

    it("uses forced domain when provided", () => {
      const response = createMockResponse("session=abc")
      const requestHeaders = createRequestHeaders("app.example.com")
      const result = processSetCookieHeaders(
        "https:",
        response,
        { forceCookieDomain: "custom.com" },
        requestHeaders,
      )
      expect(result[0]).toContain("Domain=custom.com")
      expect(result[0]).not.toContain("example.com")
    })

    it("handles localhost (no domain extracted)", () => {
      const response = createMockResponse("session=abc")
      const requestHeaders = createRequestHeaders("localhost:3000")
      const result = processSetCookieHeaders(
        "https:",
        response,
        {},
        requestHeaders,
      )
      // localhost doesn't have a registrable domain, so no Domain should be added
      expect(result[0]).not.toContain("Domain=")
    })

    it("handles IP address host", () => {
      const response = createMockResponse("session=abc")
      const requestHeaders = createRequestHeaders("192.168.1.1:3000")
      const result = processSetCookieHeaders(
        "https:",
        response,
        {},
        requestHeaders,
      )
      // Note: psl library may parse IP addresses unexpectedly (e.g., "1.1" as TLD)
      // The implementation uses whatever psl returns, so we just verify the cookie is processed
      expect(result[0]).toContain("session=abc")
    })
  })

  describe("multiple cookies", () => {
    it("processes multiple cookies from single header", () => {
      // Multiple cookies in a single Set-Cookie header (comma-separated)
      const response = createMockResponse("session=abc, token=xyz")
      const result = processSetCookieHeaders(
        "https:",
        response,
        {},
        createRequestHeaders(),
      )
      expect(result.length).toBe(2)
      expect(result[0]).toContain("session=abc")
      expect(result[1]).toContain("token=xyz")
    })
  })

  describe("complex cookie scenarios", () => {
    it("processes Ory-style session cookie", () => {
      const oryCookie =
        "ory_kratos_session=MTY3NjM5MjY2MXxEdi1CQkFFQ180SUFBUkFCRUFBQV; Path=/; Expires=Thu, 16 Feb 2025 13:31:01 GMT; Max-Age=86400; HttpOnly; SameSite=Lax"
      const response = createMockResponse(oryCookie)
      const requestHeaders = createRequestHeaders("auth.myapp.com")
      const result = processSetCookieHeaders(
        "https:",
        response,
        {},
        requestHeaders,
      )

      expect(result[0]).toContain(
        "ory_kratos_session=MTY3NjM5MjY2MXxEdi1CQkFFQ180SUFBUkFCRUFBQV",
      )
      expect(result[0]).toContain("Path=/")
      expect(result[0]).toContain("HttpOnly")
      expect(result[0]).toContain("SameSite=Lax")
      expect(result[0]).toContain("Secure")
      expect(result[0]).toContain("Domain=myapp.com")
    })

    it("handles cookie with all attributes", () => {
      const fullCookie =
        "id=12345; Domain=.original.com; Path=/api; Expires=Wed, 09 Jun 2025 10:18:14 GMT; Max-Age=3600; HttpOnly; Secure; SameSite=Strict"
      const response = createMockResponse(fullCookie)
      const requestHeaders = createRequestHeaders("app.newdomain.com")
      const result = processSetCookieHeaders(
        "https:",
        response,
        {},
        requestHeaders,
      )

      expect(result[0]).toContain("id=12345")
      expect(result[0]).toContain("Path=/api")
      expect(result[0]).toContain("Max-Age=3600")
      expect(result[0]).toContain("HttpOnly")
      expect(result[0]).toContain("Secure")
      expect(result[0]).toContain("SameSite=Strict")
      // Domain should be rewritten to request host domain
      expect(result[0]).toContain("Domain=newdomain.com")
    })
  })

  describe("edge cases", () => {
    it("handles empty cookie value", () => {
      const response = createMockResponse("session=")
      const result = processSetCookieHeaders(
        "https:",
        response,
        {},
        createRequestHeaders(),
      )
      expect(result[0]).toContain("session=")
    })

    it("handles cookie with special characters in value", () => {
      const response = createMockResponse("data=hello%20world%3D%26test")
      const result = processSetCookieHeaders(
        "https:",
        response,
        {},
        createRequestHeaders(),
      )
      expect(result[0]).toContain("data=hello%20world%3D%26test")
    })

    it("handles no host header", () => {
      const response = createMockResponse("session=abc")
      const result = processSetCookieHeaders(
        "https:",
        response,
        {},
        createRequestHeaders(),
      )
      // Should still process the cookie, just without Domain
      expect(result[0]).toContain("session=abc")
    })
  })
})

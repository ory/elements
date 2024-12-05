// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { headers } from "next/headers"

import { getCookieHeader, getPublicUrl } from "./utils"

// Mocking dependencies
jest.mock("next/headers", () => ({
  headers: jest.fn(),
}))

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}))

jest.mock("../utils/utils", () => ({
  toFlowParams: jest.fn(),
}))

describe("getCookieHeader", () => {
  it("should return the 'cookie' header if present", async () => {
    const headersMock = {
      get: jest.fn().mockReturnValue("cookie-value"),
    }
    ;(headers as jest.Mock).mockResolvedValue(headersMock)

    const result = await getCookieHeader()
    expect(headersMock.get).toHaveBeenCalledWith("cookie")
    expect(result).toBe("cookie-value")
  })

  it("should return undefined if the 'cookie' header is not present", async () => {
    const headersMock = {
      get: jest.fn().mockReturnValue(undefined),
    }
    ;(headers as jest.Mock).mockResolvedValue(headersMock)

    const result = await getCookieHeader()
    expect(headersMock.get).toHaveBeenCalledWith("cookie")
    expect(result).toBeUndefined()
  })
})

describe("getPublicUrl", () => {
  it("should construct the URL with the x-forwarded-proto header when available", async () => {
    const headersMock = {
      get: jest.fn((key: string) => {
        if (key === "host") return "example.com"
        if (key === "x-forwarded-proto") return "https"
        return undefined
      }),
    }
    ;(headers as jest.Mock).mockResolvedValue(headersMock)

    const result = await getPublicUrl()
    expect(result).toBe("https://example.com")
  })

  it("should default to http if x-forwarded-proto is not present", async () => {
    const headersMock = {
      get: jest.fn((key: string) => {
        if (key === "host") return "example.com"
        return undefined
      }),
    }
    ;(headers as jest.Mock).mockResolvedValue(headersMock)

    const result = await getPublicUrl()
    expect(result).toBe("http://example.com")
  })

  it("should handle missing host header gracefully", async () => {
    const headersMock = {
      get: jest.fn().mockReturnValue(undefined),
    }
    ;(headers as jest.Mock).mockResolvedValue(headersMock)

    const result = await getPublicUrl()
    expect(result).toBe("http://undefined")
  })
})

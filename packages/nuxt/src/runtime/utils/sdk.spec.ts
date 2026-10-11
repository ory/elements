// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { isProduction, guessPotentiallyProxiedOrySdkUrl } from "./sdk"

// Mock #imports module
vi.mock("#imports", () => ({
  useRuntimeConfig: vi.fn(() => ({
    public: {
      ory: {
        sdkUrl: "",
      },
    },
  })),
}))

describe("isProduction", () => {
  const originalEnv = process.env.NODE_ENV

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
  })

  it("returns true for 'production'", () => {
    process.env.NODE_ENV = "production"
    expect(isProduction()).toBe(true)
  })

  it("returns true for 'prod'", () => {
    process.env.NODE_ENV = "prod"
    expect(isProduction()).toBe(true)
  })

  it("returns false for 'development'", () => {
    process.env.NODE_ENV = "development"
    expect(isProduction()).toBe(false)
  })

  it("returns false for 'test'", () => {
    process.env.NODE_ENV = "test"
    expect(isProduction()).toBe(false)
  })

  it("returns false for empty string", () => {
    process.env.NODE_ENV = ""
    expect(isProduction()).toBe(false)
  })

  it("returns false for undefined", () => {
    delete process.env.NODE_ENV
    expect(isProduction()).toBe(false)
  })
})

describe("guessPotentiallyProxiedOrySdkUrl", () => {
  const originalWindow = global.window
  const originalEnv = { ...process.env }

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset window
    // @ts-expect-error - intentionally setting window for tests
    delete global.window
    // Reset env
    delete process.env.NUXT_PUBLIC_ORY_SDK_URL
    delete process.env.ORY_SDK_URL
  })

  afterEach(() => {
    global.window = originalWindow
    process.env = originalEnv
  })

  it("returns window.location.origin when in browser", () => {
    // @ts-expect-error - mocking window for test
    global.window = {
      location: {
        origin: "https://myapp.com",
      },
    }

    const result = guessPotentiallyProxiedOrySdkUrl()
    expect(result).toBe("https://myapp.com")
  })

  it("returns knownProxiedUrl when provided and not in browser", () => {
    const result = guessPotentiallyProxiedOrySdkUrl({
      knownProxiedUrl: "https://proxy.example.com",
    })
    expect(result).toBe("https://proxy.example.com")
  })

  it("prefers window.location.origin over knownProxiedUrl", () => {
    // @ts-expect-error - mocking window for test
    global.window = {
      location: {
        origin: "https://browser.com",
      },
    }

    const result = guessPotentiallyProxiedOrySdkUrl({
      knownProxiedUrl: "https://proxy.example.com",
    })
    expect(result).toBe("https://browser.com")
  })
})

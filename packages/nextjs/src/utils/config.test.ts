// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { enhanceOryConfig } from "./config"
import { isProduction } from "./sdk"
import { OryConfig } from "../types"

jest.mock("./sdk", () => ({
  isProduction: jest.fn(),
}))

describe("enhanceConfig", () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it("should use forceSdkUrl if provided", () => {
    const config: Partial<OryConfig> = {}
    const result = enhanceOryConfig(config, "https://forced-url.com")
    expect(result.sdk.url).toBe("https://forced-url.com")
  })

  it("should use NEXT_PUBLIC_ORY_SDK_URL if forceSdkUrl is not provided", () => {
    process.env["NEXT_PUBLIC_ORY_SDK_URL"] = "https://public-sdk-url.com"
    const config: Partial<OryConfig> = {}
    const result = enhanceOryConfig(config)
    expect(result.sdk.url).toBe("https://public-sdk-url.com")
  })

  it("should use ORY_SDK_URL if NEXT_PUBLIC_ORY_SDK_URL is not provided", () => {
    process.env["ORY_SDK_URL"] = "https://sdk-url.com"
    const config: Partial<OryConfig> = {}
    const result = enhanceOryConfig(config)
    expect(result.sdk.url).toBe("https://sdk-url.com")
  })

  it("should use __NEXT_PRIVATE_ORIGIN if not in production and forceSdkUrl is not provided", () => {
    ;(isProduction as jest.Mock).mockReturnValue(false)
    process.env["__NEXT_PRIVATE_ORIGIN"] = "https://private-origin.com/"
    const config: Partial<OryConfig> = {}
    const result = enhanceOryConfig(config)
    expect(result.sdk.url).toBe("https://private-origin.com")
  })

  it("should use VERCEL_URL if __NEXT_PRIVATE_ORIGIN is not provided", () => {
    ;(isProduction as jest.Mock).mockReturnValue(false)
    process.env["VERCEL_URL"] = "vercel-url.com"
    const config: Partial<OryConfig> = {}
    const result = enhanceOryConfig(config)
    expect(result.sdk.url).toBe("https://vercel-url.com")
  })

  xit("should use window.location.origin if VERCEL_URL is not provided", () => {
    // Not sure if this works
    ;(isProduction as jest.Mock).mockReturnValue(false)
    delete process.env["VERCEL_URL"]
    const config: Partial<OryConfig> = {}
    const windowSpy = jest.spyOn(global, "window", "get")
    windowSpy.mockImplementation(
      () =>
        ({
          location: {
            origin: "https://window-origin.com",
          },
        }) as unknown as Window & typeof globalThis,
    )
    const result = enhanceOryConfig(config)
    expect(result.sdk.url).toBe("https://window-origin.com")
    windowSpy.mockRestore()
  })

  it("should throw an error if no SDK URL can be determined", () => {
    ;(isProduction as jest.Mock).mockReturnValue(false)
    delete process.env["NEXT_PUBLIC_ORY_SDK_URL"]
    delete process.env["ORY_SDK_URL"]
    delete process.env["__NEXT_PRIVATE_ORIGIN"]
    delete process.env["VERCEL_URL"]
    const config: Partial<OryConfig> = {}
    expect(() => enhanceOryConfig(config)).toThrow(
      "Unable to determine SDK URL. Please set NEXT_PUBLIC_ORY_SDK_URL and/or ORY_SDK_URL or force the SDK URL using `useOryConfig(config, 'https://my-ory-sdk-url.com')`.",
    )
  })
})

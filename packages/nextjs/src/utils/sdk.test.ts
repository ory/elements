// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

// sdk.test.ts

import {
  orySdkUrl,
  isProduction,
  guessPotentiallyProxiedOrySdkUrl,
} from "./sdk"

describe("orySdkUrl", () => {
  beforeEach(() => {
    delete process.env["NEXT_PUBLIC_ORY_SDK_URL"]
    delete process.env["ORY_SDK_URL"]
  })

  it("should return NEXT_PUBLIC_ORY_SDK_URL without trailing slash", () => {
    process.env["NEXT_PUBLIC_ORY_SDK_URL"] = "https://example.com/"
    expect(orySdkUrl()).toBe("https://example.com")
  })

  it("should prioritize NEXT_PUBLIC_ORY_SDK_URL over ORY_SDK_URL", () => {
    process.env["NEXT_PUBLIC_ORY_SDK_URL"] = "https://next-public.com/"
    process.env["ORY_SDK_URL"] = "https://regular.com/"
    expect(orySdkUrl()).toBe("https://next-public.com")
  })

  it("should use ORY_SDK_URL when NEXT_PUBLIC_ORY_SDK_URL is not set", () => {
    process.env["ORY_SDK_URL"] = "https://regular.com/"
    expect(orySdkUrl()).toBe("https://regular.com")
  })

  it("should throw error when neither NEXT_PUBLIC_ORY_SDK_URL nor ORY_SDK_URL is set", () => {
    expect(() => orySdkUrl()).toThrow(
      "You need to set environment variable `NEXT_PUBLIC_ORY_SDK_URL` to your Ory Network SDK URL.",
    )
  })
})

describe("isProduction", () => {
  beforeEach(() => {
    delete process.env["NEXT_PUBLIC_VERCEL_ENV"]
    delete process.env["VERCEL_ENV"]
    delete process.env["NEXT_PUBLIC_NODE_ENV"]
    delete process.env["NODE_ENV"]
  })

  it("should return true when NEXT_PUBLIC_VERCEL_ENV is production", () => {
    process.env["NEXT_PUBLIC_VERCEL_ENV"] = "production"
    expect(isProduction()).toBe(true)
  })

  it("should return true when VERCEL_ENV is production", () => {
    process.env["VERCEL_ENV"] = "production"
    expect(isProduction()).toBe(true)
  })

  it("should return true when NEXT_PUBLIC_NODE_ENV is production", () => {
    process.env["NEXT_PUBLIC_NODE_ENV"] = "production"
    expect(isProduction()).toBe(true)
  })

  it("should return true when NODE_ENV is production", () => {
    process.env["NODE_ENV"] = "production"
    expect(isProduction()).toBe(true)
  })

  it("should return true when VERCEL_ENV is prod", () => {
    process.env["VERCEL_ENV"] = "prod"
    expect(isProduction()).toBe(true)
  })

  it("should return false when VERCEL_ENV and NODE_ENV are not production", () => {
    process.env["VERCEL_ENV"] = "development"
    process.env["NODE_ENV"] = "test"
    expect(isProduction()).toBe(false)
  })

  it("should return false when VERCEL_ENV and NODE_ENV are undefined", () => {
    expect(isProduction()).toBe(false)
  })
})

describe("guessPotentiallyProxiedOrySdkUrl", () => {
  beforeEach(() => {
    delete process.env["NEXT_PUBLIC_ORY_SDK_URL"]
    delete process.env["ORY_SDK_URL"]
    delete process.env["NEXT_PUBLIC_VERCEL_ENV"]
    delete process.env["VERCEL_ENV"]
    delete process.env["NEXT_PUBLIC_NODE_ENV"]
    delete process.env["NODE_ENV"]
    delete process.env["NEXT_PUBLIC_VERCEL_URL"]
    delete process.env["VERCEL_URL"]
    delete process.env["NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL"]
    delete process.env["VERCEL_PROJECT_PRODUCTION_URL"]
    delete process.env["__NEXT_PRIVATE_ORIGIN"]
  })

  it("should return orySdkUrl when in production", () => {
    process.env["NEXT_PUBLIC_ORY_SDK_URL"] = "https://example.com/"
    process.env["VERCEL_ENV"] = "production"
    expect(guessPotentiallyProxiedOrySdkUrl()).toBe("https://example.com")
  })

  it("should return https://VERCEL_URL when VERCEL_ENV is set and VERCEL_URL is set", () => {
    process.env["VERCEL_ENV"] = "preview"
    process.env["VERCEL_URL"] = "myapp.vercel.app"
    expect(guessPotentiallyProxiedOrySdkUrl()).toBe("https://myapp.vercel.app")
  })

  it("should use NEXT_PUBLIC_VERCEL_URL when available", () => {
    process.env["VERCEL_ENV"] = "preview"
    process.env["NEXT_PUBLIC_VERCEL_URL"] = "public-myapp.vercel.app"
    expect(guessPotentiallyProxiedOrySdkUrl()).toBe(
      "https://public-myapp.vercel.app",
    )
  })

  it("should use VERCEL_PROJECT_PRODUCTION_URL in production for vercel.app domains", () => {
    process.env["VERCEL_ENV"] = "production"
    process.env["NEXT_PUBLIC_ORY_SDK_URL"] = "https://example.com/"
    process.env["VERCEL_PROJECT_PRODUCTION_URL"] = "myapp.vercel.app"
    expect(guessPotentiallyProxiedOrySdkUrl()).toBe("https://myapp.vercel.app")
  })

  it("should prioritize NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL", () => {
    process.env["VERCEL_ENV"] = "production"
    process.env["NEXT_PUBLIC_ORY_SDK_URL"] = "https://example.com/"
    process.env["NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL"] =
      "public-myapp.vercel.app"
    process.env["VERCEL_PROJECT_PRODUCTION_URL"] = "myapp.vercel.app"
    expect(guessPotentiallyProxiedOrySdkUrl()).toBe(
      "https://public-myapp.vercel.app",
    )
  })

  it("should ignore VERCEL_PROJECT_PRODUCTION_URL in production for non-vercel.app domains", () => {
    process.env["VERCEL_ENV"] = "production"
    process.env["NEXT_PUBLIC_ORY_SDK_URL"] = "https://example.com/"
    process.env["VERCEL_PROJECT_PRODUCTION_URL"] = "custom-domain.com"
    expect(guessPotentiallyProxiedOrySdkUrl()).toBe("https://example.com")
  })

  it("should return __NEXT_PRIVATE_ORIGIN when __NEXT_PRIVATE_ORIGIN is set", () => {
    process.env["VERCEL_ENV"] = "preview"
    process.env["__NEXT_PRIVATE_ORIGIN"] = "https://private-origin/"
    expect(guessPotentiallyProxiedOrySdkUrl()).toBe("https://private-origin")
  })

  it("should return window.location.origin when window is defined", () => {
    const originalWindow = global.window
    global.window = {
      location: { origin: "https://window-origin" },
    } as Window & typeof globalThis
    expect(guessPotentiallyProxiedOrySdkUrl()).toBe("https://window-origin")
    global.window = originalWindow
  })

  it("should return knownProxiedUrl when provided", () => {
    expect(
      guessPotentiallyProxiedOrySdkUrl({
        knownProxiedUrl: "https://known-proxied-url",
      }),
    ).toBe("https://known-proxied-url")
  })

  it("should return orySdkUrl and log warning when unable to determine SDK URL", () => {
    process.env["NEXT_PUBLIC_ORY_SDK_URL"] = "https://example.com/"
    const consoleWarnMock = jest.spyOn(console, "warn").mockImplementation()
    expect(guessPotentiallyProxiedOrySdkUrl()).toBe("https://example.com")
    expect(consoleWarnMock).toHaveBeenCalledWith(
      'Unable to determine a suitable SDK URL for setting up the Next.js integration of Ory Elements. Will proceed using default Ory SDK URL "https://example.com". This is likely not what you want for local development and your authentication and login may not work.',
    )
    consoleWarnMock.mockRestore()
  })
})

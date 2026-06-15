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

  describe("with a known visited origin", () => {
    it("should return the SDK URL directly when the visited origin is same-site with it, even on Vercel previews", () => {
      // A stable custom domain on a preview deployment, next to an Ory custom
      // domain on the same registrable domain. Cookies are first-party either
      // way, so no proxying is needed and VERCEL_URL must not win.
      process.env["VERCEL_ENV"] = "preview"
      process.env["VERCEL_URL"] = "web-eaa8ghtnm.vercel.app"
      process.env["NEXT_PUBLIC_ORY_SDK_URL"] = "https://auth.e2b-staging.dev"
      expect(
        guessPotentiallyProxiedOrySdkUrl({
          knownProxiedUrl: "https://e2b-staging.dev",
        }),
      ).toBe("https://auth.e2b-staging.dev")
    })

    it("should prefer the visited origin over VERCEL_URL when cross-site with the SDK URL", () => {
      // A stable custom domain on a preview deployment without an Ory custom
      // domain: proxy via the origin the user is actually on, not the
      // deployment's generated URL.
      process.env["VERCEL_ENV"] = "preview"
      process.env["VERCEL_URL"] = "web-eaa8ghtnm.vercel.app"
      process.env["NEXT_PUBLIC_ORY_SDK_URL"] =
        "https://project.projects.oryapis.com"
      expect(
        guessPotentiallyProxiedOrySdkUrl({
          knownProxiedUrl: "https://e2b-staging.dev",
        }),
      ).toBe("https://e2b-staging.dev")
    })

    it("should use window.location.origin for the same-site check in the browser", () => {
      process.env["VERCEL_ENV"] = "preview"
      process.env["VERCEL_URL"] = "web-eaa8ghtnm.vercel.app"
      process.env["NEXT_PUBLIC_ORY_SDK_URL"] = "https://auth.e2b-staging.dev"
      const originalWindow = global.window
      global.window = {
        location: { origin: "https://e2b-staging.dev" },
      } as Window & typeof globalThis
      try {
        expect(guessPotentiallyProxiedOrySdkUrl()).toBe(
          "https://auth.e2b-staging.dev",
        )
      } finally {
        global.window = originalWindow
      }
    })

    it("should respect multi-label public suffixes when comparing sites", () => {
      process.env["NEXT_PUBLIC_ORY_SDK_URL"] = "https://auth.example.co.uk"
      expect(
        guessPotentiallyProxiedOrySdkUrl({
          knownProxiedUrl: "https://app.example.co.uk",
        }),
      ).toBe("https://auth.example.co.uk")
    })

    it("should not treat two vercel.app deployments as same-site", () => {
      // vercel.app is on the Public Suffix List, so myapp.vercel.app and
      // other.vercel.app are different sites and cookies cannot be shared.
      process.env["VERCEL_ENV"] = "preview"
      process.env["NEXT_PUBLIC_ORY_SDK_URL"] = "https://other.vercel.app"
      expect(
        guessPotentiallyProxiedOrySdkUrl({
          knownProxiedUrl: "https://myapp.vercel.app",
        }),
      ).toBe("https://myapp.vercel.app")
    })

    it("should treat equal hostnames on different ports as same-site", () => {
      // Ory Tunnel on another localhost port: cookies ignore ports, so the
      // tunnel can be used directly.
      process.env["NEXT_PUBLIC_ORY_SDK_URL"] = "http://localhost:4000"
      expect(
        guessPotentiallyProxiedOrySdkUrl({
          knownProxiedUrl: "http://localhost:3000",
        }),
      ).toBe("http://localhost:4000")
    })

    it("should return the SDK URL directly for same-site origins in production", () => {
      process.env["VERCEL_ENV"] = "production"
      process.env["NEXT_PUBLIC_ORY_SDK_URL"] = "https://auth.example.com"
      expect(
        guessPotentiallyProxiedOrySdkUrl({
          knownProxiedUrl: "https://example.com",
        }),
      ).toBe("https://auth.example.com")
    })

    it("should keep returning the SDK URL for cross-site origins in production", () => {
      process.env["VERCEL_ENV"] = "production"
      process.env["NEXT_PUBLIC_ORY_SDK_URL"] =
        "https://project.projects.oryapis.com"
      expect(
        guessPotentiallyProxiedOrySdkUrl({
          knownProxiedUrl: "https://example.com",
        }),
      ).toBe("https://project.projects.oryapis.com")
    })

    it("should return the visited origin when no SDK URL is configured", () => {
      expect(
        guessPotentiallyProxiedOrySdkUrl({
          knownProxiedUrl: "http://localhost:3000",
        }),
      ).toBe("http://localhost:3000")
    })

    it("should strip a trailing slash from the visited origin", () => {
      process.env["NEXT_PUBLIC_ORY_SDK_URL"] =
        "https://project.projects.oryapis.com"
      expect(
        guessPotentiallyProxiedOrySdkUrl({
          knownProxiedUrl: "https://e2b-staging.dev/",
        }),
      ).toBe("https://e2b-staging.dev")
    })
  })
})

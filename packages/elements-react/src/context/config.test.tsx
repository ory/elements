// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { render, renderHook } from "@testing-library/react"
import { OryConfigurationProvider, useOryConfiguration } from "./config"

describe("test config provider", () => {
  it("should be possible to pass SDK url", () => {
    const sdkUrl = "http://localhost:4455"
    const { result } = renderHook(() => useOryConfiguration(), {
      wrapper: ({ children }) => (
        <OryConfigurationProvider
          sdk={{ url: sdkUrl }}
          project={{ name: "test" }}
        >
          {children}
        </OryConfigurationProvider>
      ),
    })

    expect(result.current.sdk.url).toBe(sdkUrl)
  })

  describe("browser env", () => {
    it("should guess browser env", () => {
      const { result } = renderHook(() => useOryConfiguration(), {
        wrapper: ({ children }) => (
          <OryConfigurationProvider project={{ name: "test" }}>
            {children}
          </OryConfigurationProvider>
        ),
      })

      // Default jsdom url is http://localhost/
      expect(result.current.sdk.url).toBe("http://localhost")
    })
  })

  describe("node env", () => {
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

    describe("in production", () => {
      for (const [variable, value] of [
        ["VERCEL_ENV", "production"],
        ["VERCEL_ENV", "prod"],
        ["NODE_ENV", "production"],
        ["NODE_ENV", "prod"],
      ]) {
        describe("with " + variable + "=" + value, () => {
          beforeEach(() => {
            process.env[variable] = value
            delete process.env["ORY_SDK_URL"]
            delete process.env["NEXT_PUBLIC_ORY_SDK_URL"]
          })
          afterEach(() => {
            delete process.env[variable]
          })

          it("should use the sdk url from the environment variable NEXT_PUBLIC_ORY_SDK_URL", () => {
            process.env["NEXT_PUBLIC_ORY_SDK_URL"] = "https://example.com/"
            const { result } = renderHook(() => useOryConfiguration(), {
              wrapper: ({ children }) => (
                <OryConfigurationProvider project={{ name: "test" }}>
                  {children}
                </OryConfigurationProvider>
              ),
            })

            expect(result.current.sdk.url).toBe("https://example.com")
          })

          it("should use the sdk url from the environment variable ORY_SDK_URL", () => {
            process.env["ORY_SDK_URL"] = "https://example.com/"
            const { result } = renderHook(() => useOryConfiguration(), {
              wrapper: ({ children }) => (
                <OryConfigurationProvider project={{ name: "test" }}>
                  {children}
                </OryConfigurationProvider>
              ),
            })

            expect(result.current.sdk.url).toBe("https://example.com")
          })

          it("should throw if unset", () => {
            const consoleErrorSpy = jest
              .spyOn(console, "error")
              .mockImplementation(() => {})

            expect(() =>
              render(<OryConfigurationProvider project={{ name: "test" }} />),
            ).toThrow(
              "Unable to determine SDK URL. Please set NEXT_PUBLIC_ORY_SDK_URL and/or ORY_SDK_URL in production environments.",
            )

            consoleErrorSpy.mockRestore()
          })
        })
      }
    })

    it("uses __NEXT_PRIVATE_ORIGIN if set", () => {
      process.env["__NEXT_PRIVATE_ORIGIN"] = "https://example.com/"
      const { result } = renderHook(() => useOryConfiguration(), {
        wrapper: ({ children }) => (
          <OryConfigurationProvider project={{ name: "test" }}>
            {children}
          </OryConfigurationProvider>
        ),
      })

      expect(result.current.sdk.url).toBe("https://example.com")
    })

    it("uses VERCEL_URL if set", () => {
      process.env["VERCEL_URL"] = "example.com"
      const { result } = renderHook(() => useOryConfiguration(), {
        wrapper: ({ children }) => (
          <OryConfigurationProvider project={{ name: "test" }}>
            {children}
          </OryConfigurationProvider>
        ),
      })

      expect(result.current.sdk.url).toBe("https://example.com")
    })
  })
})

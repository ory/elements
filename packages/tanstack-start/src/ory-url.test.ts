// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { getGlobalStartContext } from "@tanstack/react-start"
import { getRequest, setResponseHeader } from "@tanstack/react-start/server"
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
  type MockInstance,
} from "vitest"

vi.mock("@tanstack/react-start", () => ({
  getGlobalStartContext: vi.fn(),
}))

vi.mock("@tanstack/react-start/server", () => ({
  getRequest: vi.fn(),
  setResponseHeader: vi.fn(),
}))

const globalStartContext = vi.mocked(getGlobalStartContext as () => unknown)
const sdkUrl = "https://example.projects.oryapis.com"

// Each test loads a fresh module, so the warn-once state starts empty.
async function load() {
  vi.resetModules()
  return import("./ory-url")
}

describe("getOryBaseUrl", () => {
  const env = process.env
  let warn: MockInstance<typeof console.warn>

  beforeEach(() => {
    vi.resetAllMocks()
    process.env = { ...env, ORY_SDK_URL: sdkUrl + "/" }
    warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)
  })

  afterEach(() => {
    warn.mockRestore()
    process.env = env
  })

  function setRequest(origin: string, headers?: HeadersInit) {
    vi.mocked(getRequest).mockReturnValue(
      new Request(`${origin}/_serverFn/abc`, { headers }),
    )
  }

  test("returns the app origin when the proxy marked a trusted origin", async () => {
    const { getOryBaseUrl } = await load()
    globalStartContext.mockReturnValue({ oryProxy: "trusted-origin" })
    setRequest("https://my-app-git-x-my-team.vercel.app")

    expect(getOryBaseUrl()).toBe("https://my-app-git-x-my-team.vercel.app")
    expect(warn).not.toHaveBeenCalled()
  })

  test("returns the SDK URL and warns when the proxy marked an untrusted origin", async () => {
    const { getOryBaseUrl } = await load()
    globalStartContext.mockReturnValue({ oryProxy: "untrusted-origin" })
    setRequest("http://127.0.0.1:3000")

    expect(getOryBaseUrl()).toBe(sdkUrl)
    expect(warn).toHaveBeenCalledExactlyOnceWith(
      expect.stringMatching(
        /^\[@ory\/tanstack-start\] The Ory proxy handled a request for http:\/\/127\.0\.0\.1:3000, which is not in `trustedOrigins`/,
      ),
    )
  })

  test("returns the SDK URL and warns once per reason without the proxy", async () => {
    const { getOryBaseUrl } = await load()
    globalStartContext.mockReturnValue({})
    setRequest("http://localhost:3000")

    expect(getOryBaseUrl()).toBe(sdkUrl)
    expect(getOryBaseUrl()).toBe(sdkUrl)
    expect(warn).toHaveBeenCalledExactlyOnceWith(
      expect.stringMatching(/^\[@ory\/tanstack-start\] The app/),
    )

    globalStartContext.mockReturnValue({ oryProxy: "untrusted-origin" })
    getOryBaseUrl()
    expect(warn).toHaveBeenCalledTimes(2)
  })

  test.each([
    ["a missing context", undefined],
    ["a context without the marker", {}],
    ["a boolean marker", { oryProxy: true }],
    ["a different string", { oryProxy: "trusted" }],
    [
      "an object marker",
      { oryProxy: { toString: (): string => "trusted-origin" } },
    ],
  ])("treats %s as no proxy", async (_, context) => {
    const { getOryBaseUrl } = await load()
    globalStartContext.mockReturnValue(context)
    setRequest("http://localhost:3000")

    expect(getOryBaseUrl()).toBe(sdkUrl)
    expect(warn).toHaveBeenCalledExactlyOnceWith(
      expect.stringMatching(/^\[@ory\/tanstack-start\] The app /),
    )
  })

  test("returns the SDK URL when the app and Ory share a site", async () => {
    const { getOryBaseUrl } = await load()
    process.env["ORY_SDK_URL"] = "https://auth.example.com"
    globalStartContext.mockReturnValue({ oryProxy: "trusted-origin" })
    setRequest("https://app.example.com")

    expect(getOryBaseUrl()).toBe("https://auth.example.com")
    expect(warn).not.toHaveBeenCalled()
  })

  test("returns the SDK URL and warns when the Host header is not a valid origin", async () => {
    const { getOryBaseUrl } = await load()
    globalStartContext.mockReturnValue({ oryProxy: "trusted-origin" })
    setRequest("http://localhost:3000", {
      host: "localhost:3000@other.example",
    })

    expect(getOryBaseUrl()).toBe(sdkUrl)
    expect(warn).toHaveBeenCalledExactlyOnceWith(
      expect.stringMatching(
        /^\[@ory\/tanstack-start\] The request's `Host` header is not a valid origin/,
      ),
    )
  })

  test("marks the response as private and not storable", async () => {
    const { getOryBaseUrl } = await load()
    globalStartContext.mockReturnValue({})
    setRequest("http://localhost:3000")

    getOryBaseUrl()

    expect(setResponseHeader).toHaveBeenCalledWith(
      "Cache-Control",
      "private, no-store",
    )
  })

  test("does not read NODE_ENV", async () => {
    const { getOryBaseUrl } = await load()
    globalStartContext.mockReturnValue({})
    setRequest("http://localhost:3000")

    for (const nodeEnv of ["development", "production", "test"]) {
      process.env["NODE_ENV"] = nodeEnv
      expect(getOryBaseUrl()).toBe(sdkUrl)
    }
  })
})

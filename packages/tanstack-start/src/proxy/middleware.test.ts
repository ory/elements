// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { handleOryProxy } from "@ory/ssr/proxy"
import { getResponseHeader } from "@tanstack/react-start/server"
import { afterAll, beforeEach, describe, expect, test, vi } from "vitest"
import { oryProxyMiddleware } from "./middleware"

vi.mock("@ory/ssr/proxy", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@ory/ssr/proxy")>()),
  handleOryProxy: vi.fn(),
}))

vi.mock("@tanstack/react-start/server", () => ({
  getResponseHeader: vi.fn(),
}))

const mockHandleOryProxy = vi.mocked(handleOryProxy)
const mockGetResponseHeader = vi.mocked(getResponseHeader)

type ServerFn = (opts: {
  request: Request
  next: (opts?: unknown) => Promise<unknown>
}) => Promise<unknown>

function serverFn(middleware: ReturnType<typeof oryProxyMiddleware>) {
  return (middleware.options as unknown as { server: ServerFn }).server
}

function appNext() {
  return vi.fn().mockResolvedValue({ response: new Response("app") })
}

describe("oryProxyMiddleware", () => {
  const env = process.env

  beforeEach(() => {
    vi.resetAllMocks()
    process.env = {
      ...env,
      ORY_SDK_URL: "https://example.projects.oryapis.com/",
      ORY_PROJECT_API_TOKEN: "ory_pat_123",
    }
  })

  afterAll(() => {
    process.env = env
  })

  test("requires trustedOrigins", () => {
    // @ts-expect-error trustedOrigins is required.
    expect(() => oryProxyMiddleware({})).toThrow(
      "[@ory/tanstack-start] `trustedOrigins` is not configured",
    )
    expect(() => oryProxyMiddleware({ trustedOrigins: [] })).toThrow(
      "[@ory/tanstack-start] `trustedOrigins` is not configured",
    )
  })

  test.each([
    ["a RegExp", /^http:\/\/localhost:3000$/],
    ["an origin with a path", "http://localhost:3000/app"],
    ["an origin without a scheme", "localhost:3000"],
    ["a glob for a whole public suffix", "https://*.vercel.app"],
  ])("throws at creation for %s", (_, entry) => {
    expect(() =>
      oryProxyMiddleware({ trustedOrigins: [entry as string] }),
    ).toThrow(/^\[@ory\/tanstack-start\] /)
  })

  test("returns the proxied response for Ory paths", async () => {
    const proxied = new Response("ok")
    mockHandleOryProxy.mockResolvedValue(proxied)
    const next = vi.fn()
    const request = new Request("http://localhost:3000/self-service/login")

    const result = await serverFn(
      oryProxyMiddleware({ trustedOrigins: ["http://localhost:3000"] }),
    )({ request, next })

    expect(result).toBe(proxied)
    expect(next).not.toHaveBeenCalled()
    expect(mockHandleOryProxy).toHaveBeenCalledWith(request, {
      trustedOrigins: ["http://localhost:3000"],
      sdkUrl: "https://example.projects.oryapis.com",
      projectApiKey: "ory_pat_123",
    })
  })

  test("marks other paths from a trusted origin and calls next", async () => {
    mockHandleOryProxy.mockResolvedValue(null)
    const nextResult = { response: new Response("app") }
    const next = vi.fn().mockResolvedValue(nextResult)

    const result = await serverFn(
      oryProxyMiddleware({ trustedOrigins: ["http://localhost:3000"] }),
    )({ request: new Request("http://localhost:3000/"), next })

    expect(result).toBe(nextResult)
    expect(next).toHaveBeenCalledExactlyOnceWith({
      context: { oryProxy: "trusted-origin" },
    })
  })

  test.each([
    ["a 404", new Response("not found", { status: 404 })],
    ["a 500", new Response("error", { status: 500 })],
    [
      "a redirect with immutable headers",
      Response.redirect("http://localhost:3000/login", 302),
    ],
  ])(
    "keeps a helper's Cache-Control on %s from the app",
    async (_, response) => {
      mockHandleOryProxy.mockResolvedValue(null)
      mockGetResponseHeader.mockReturnValue("private, no-store")
      const next = vi.fn().mockResolvedValue({ response })

      const result = (await serverFn(
        oryProxyMiddleware({ trustedOrigins: ["http://localhost:3000"] }),
      )({ request: new Request("http://localhost:3000/"), next })) as {
        response: Response
      }

      expect(mockGetResponseHeader).toHaveBeenCalledWith("Cache-Control")
      expect(result.response.status).toBe(response.status)
      expect(result.response.headers.get("Cache-Control")).toBe(
        "private, no-store",
      )
    },
  )

  test("leaves an error response alone when no helper ran", async () => {
    mockHandleOryProxy.mockResolvedValue(null)
    mockGetResponseHeader.mockReturnValue(undefined)
    const response = new Response("not found", { status: 404 })
    const nextResult = { response }
    const next = vi.fn().mockResolvedValue(nextResult)

    const result = await serverFn(
      oryProxyMiddleware({ trustedOrigins: ["http://localhost:3000"] }),
    )({ request: new Request("http://localhost:3000/"), next })

    expect(result).toBe(nextResult)
    expect(response.headers.has("Cache-Control")).toBe(false)
  })

  test.each([
    ["an exact origin", "trusted-origin", "http://localhost:3000/"],
    ["a glob", "trusted-origin", "https://my-app-git-x-my-team.vercel.app/"],
    ["an unlisted origin", "untrusted-origin", "http://127.0.0.1:3000/"],
    ["a different scheme", "untrusted-origin", "https://localhost:3000/"],
    [
      "another team's preview",
      "untrusted-origin",
      "https://my-app-git-x-other-team.vercel.app/",
    ],
  ])("marks %s as %s", async (_, oryProxy, url) => {
    mockHandleOryProxy.mockResolvedValue(null)
    const next = appNext()

    await serverFn(
      oryProxyMiddleware({
        trustedOrigins: [
          "http://localhost:3000",
          "https://my-app-*-my-team.vercel.app",
        ],
      }),
    )({ request: new Request(url), next })

    expect(next).toHaveBeenCalledExactlyOnceWith({ context: { oryProxy } })
  })

  test("marks a Host header that is not a valid origin as untrusted", async () => {
    mockHandleOryProxy.mockResolvedValue(null)
    const next = appNext()

    await serverFn(
      oryProxyMiddleware({ trustedOrigins: ["http://localhost:3000"] }),
    )({
      request: new Request("http://localhost:3000/", {
        headers: { host: "localhost:3000@other.example" },
      }),
      next,
    })

    expect(next).toHaveBeenCalledExactlyOnceWith({
      context: { oryProxy: "untrusted-origin" },
    })
  })

  test("reads the environment per request", async () => {
    mockHandleOryProxy.mockResolvedValue(null)
    const middleware = oryProxyMiddleware({
      trustedOrigins: ["http://localhost:3000"],
    })
    process.env["ORY_SDK_URL"] = "https://other.projects.oryapis.com"
    delete process.env["ORY_PROJECT_API_TOKEN"]

    await serverFn(middleware)({
      request: new Request("http://localhost:3000/"),
      next: appNext(),
    })

    expect(mockHandleOryProxy).toHaveBeenCalledWith(expect.any(Request), {
      trustedOrigins: ["http://localhost:3000"],
      sdkUrl: "https://other.projects.oryapis.com",
      projectApiKey: undefined,
    })
  })

  test("fails the request with a clear error when ORY_SDK_URL is missing", async () => {
    delete process.env["ORY_SDK_URL"]

    await expect(
      serverFn(
        oryProxyMiddleware({ trustedOrigins: ["http://localhost:3000"] }),
      )({ request: new Request("http://localhost:3000/"), next: vi.fn() }),
    ).rejects.toThrow("[@ory/tanstack-start] The Ory SDK URL is not set.")
    expect(mockHandleOryProxy).not.toHaveBeenCalled()
  })
})

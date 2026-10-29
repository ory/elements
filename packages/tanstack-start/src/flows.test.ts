// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  type AnyRedirect,
  createRootRoute,
  createRouter,
  isRedirect,
} from "@tanstack/react-router"
import { getGlobalStartContext } from "@tanstack/react-start"
import { getRequest, setResponseHeader } from "@tanstack/react-start/server"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import loginFlowJson from "./fixtures/login-flow.json"
import {
  getLoginFlow,
  getRecoveryFlow,
  getRegistrationFlow,
  getSettingsFlow,
  getVerificationFlow,
} from "./flows"

vi.mock("@tanstack/react-start", () => ({
  getGlobalStartContext: vi.fn(),
}))

vi.mock("@tanstack/react-start/server", () => ({
  getRequest: vi.fn(),
  setResponseHeader: vi.fn(),
}))

const globalStartContext = vi.mocked(getGlobalStartContext as () => unknown)

const sdkUrl = "https://example.projects.oryapis.com"
const config = {
  project: {
    login_ui_url: "/login",
    registration_ui_url: "/registration",
    recovery_ui_url: "/recovery",
    verification_ui_url: "/verification",
    settings_ui_url: "/settings",
  },
}

const fetchMock = vi.fn<typeof fetch>()

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  })
}

function setRequest(url: string, headers: Record<string, string> = {}) {
  vi.mocked(getRequest).mockReturnValue(
    new Request(url, { headers: { cookie: "ory_session=abc", ...headers } }),
  )
}

async function redirectHref(promise: Promise<unknown>): Promise<string> {
  const error: unknown = await promise.then(
    () => {
      throw new Error("expected a redirect")
    },
    (e: unknown) => e,
  )
  expect(isRedirect(error)).toBe(true)
  return (error as { options: { href: string } }).options.href
}

function requestedUrl(call = 0): URL {
  const input = fetchMock.mock.calls[call]?.[0]
  return new URL(input instanceof Request ? input.url : String(input))
}

function requestedCookie(call = 0): string | null {
  const [input, init] = fetchMock.mock.calls[call] ?? []
  if (input instanceof Request) {
    return input.headers.get("cookie")
  }
  return new Headers(init?.headers).get("cookie")
}

describe("flow helpers", () => {
  const env = process.env

  beforeEach(() => {
    vi.mocked(setResponseHeader).mockReset()
    fetchMock.mockReset()
    vi.stubGlobal("fetch", fetchMock)
    process.env = { ...env, ORY_SDK_URL: sdkUrl }
    globalStartContext.mockReturnValue({ oryProxy: "trusted-origin" })
    setRequest("http://localhost:3000/_serverFn/abc")
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    process.env = env
  })

  test.each([
    ["login", getLoginFlow],
    ["registration", getRegistrationFlow],
    ["recovery", getRecoveryFlow],
    ["verification", getVerificationFlow],
    ["settings", getSettingsFlow],
  ] as const)(
    "fetches the %s flow with the browser's cookie",
    async (flowType, getFlow) => {
      fetchMock.mockResolvedValue(jsonResponse(loginFlowJson))

      const flow = await getFlow(config, { flow: loginFlowJson.id })

      expect(flow.id).toBe(loginFlowJson.id)
      expect(requestedUrl().origin).toBe(sdkUrl)
      expect(requestedUrl().pathname).toBe(`/self-service/${flowType}/flows`)
      expect(requestedUrl().searchParams.get("id")).toBe(loginFlowJson.id)
      expect(requestedCookie()).toBe("ory_session=abc")
    },
  )

  test.each([
    ["login", getLoginFlow],
    ["registration", getRegistrationFlow],
    ["recovery", getRecoveryFlow],
    ["verification", getVerificationFlow],
    ["settings", getSettingsFlow],
  ] as const)(
    "redirects to create a %s flow when the flow param is missing",
    async (flowType, getFlow) => {
      const href = await redirectHref(
        getFlow(config, { return_to: "http://localhost:3000/dashboard" }),
      )

      const url = new URL(href)
      expect(url.origin).toBe("http://localhost:3000")
      expect(url.pathname).toBe(`/self-service/${flowType}/browser`)
      expect(url.searchParams.get("return_to")).toBe(
        "http://localhost:3000/dashboard",
      )
      expect(fetchMock).not.toHaveBeenCalled()
    },
  )

  test("redirects with a full-document navigation, as the browser route is not an app route", async () => {
    const error: unknown = await getLoginFlow(config, {}).catch(
      (e: unknown) => e,
    )
    expect(isRedirect(error)).toBe(true)
    const redirect = error as AnyRedirect

    const router = createRouter({
      routeTree: createRootRoute(),
      origin: "http://localhost:3000",
    })
    router.resolveRedirect(redirect)

    expect(redirect.options.reloadDocument).toBe(true)
    expect(redirect.options.href).toBe("/self-service/login/browser")
  })

  test("uses the Host header for the app origin", async () => {
    setRequest("http://127.0.0.1:3000/_serverFn/abc", {
      host: "localhost:3000",
    })

    const href = await redirectHref(getLoginFlow(config, {}))

    expect(new URL(href).origin).toBe("http://localhost:3000")
  })

  test("redirects to the SDK URL without the proxy", async () => {
    globalStartContext.mockReturnValue({})
    setRequest("https://app.example.org/_serverFn/abc")

    const href = await redirectHref(getLoginFlow(config, {}))

    expect(href).toBe(`${sdkUrl}/self-service/login/browser?`)
  })

  test("redirects to the SDK URL when the proxy marked an untrusted origin", async () => {
    globalStartContext.mockReturnValue({ oryProxy: "untrusted-origin" })
    vi.spyOn(console, "warn").mockImplementation(() => undefined)
    setRequest("http://127.0.0.1:3000/_serverFn/abc")

    const href = await redirectHref(getLoginFlow(config, {}))

    expect(href).toBe(`${sdkUrl}/self-service/login/browser?`)
  })

  test("marks a flow response as private and not storable", async () => {
    fetchMock.mockResolvedValue(jsonResponse(loginFlowJson))

    await getLoginFlow(config, { flow: loginFlowJson.id })

    expect(setResponseHeader).toHaveBeenCalledExactlyOnceWith(
      "Cache-Control",
      "private, no-store",
    )
  })

  test("marks the redirect as private and not storable", async () => {
    const error: unknown = await getLoginFlow(config, {}).catch(
      (e: unknown) => e,
    )

    expect(isRedirect(error)).toBe(true)
    expect((error as Response).headers.get("cache-control")).toBe(
      "private, no-store",
    )
  })

  test("uses the SDK URL when the app and Ory share a site", async () => {
    process.env["ORY_SDK_URL"] = "https://auth.example.com"
    setRequest("https://app.example.com/_serverFn/abc")

    const href = await redirectHref(getLoginFlow(config, {}))

    expect(new URL(href).origin).toBe("https://auth.example.com")
  })

  test("rewrites SDK URLs in the flow to the app origin behind the proxy", async () => {
    fetchMock.mockResolvedValue(jsonResponse(loginFlowJson))

    const flow = await getLoginFlow(config, { flow: loginFlowJson.id })

    expect(flow.ui.action).toBe(
      `http://localhost:3000/self-service/login?flow=${loginFlowJson.id}`,
    )
    expect(flow).toHaveProperty("ory_base_url", "http://localhost:3000")
  })

  test("restarts an expired flow with the flow ID Ory returns", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        {
          error: {
            id: "self_service_flow_expired",
            code: 410,
            status: "Gone",
            message: "The flow has expired.",
          },
          use_flow_id: "new-flow-id",
        },
        410,
      ),
    )

    const href = await redirectHref(
      getLoginFlow(config, { flow: "old-flow-id", return_to: "/dashboard" }),
    )

    const url = new URL(href)
    expect(url.origin + url.pathname).toBe("http://localhost:3000/login")
    expect(url.searchParams.get("flow")).toBe("new-flow-id")
    expect(url.searchParams.get("return_to")).toBe("/dashboard")
  })

  test("creates a new flow when Ory does not know the flow", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ error: { code: 404, message: "Not Found" } }, 404),
    )

    const href = await redirectHref(getLoginFlow(config, { flow: "unknown" }))

    expect(new URL(href).pathname).toBe("/self-service/login/browser")
  })

  test("follows the browser redirect Ory asks for", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        {
          error: { id: "browser_location_change_required", code: 422 },
          redirect_browser_to: "https://example.org/after",
        },
        422,
      ),
    )

    const href = await redirectHref(getSettingsFlow(config, { flow: "abc" }))

    expect(href).toBe("https://example.org/after")
  })

  test("throws a clear error when ORY_SDK_URL is not set", async () => {
    delete process.env["ORY_SDK_URL"]

    await expect(getLoginFlow(config, {})).rejects.toThrow(
      "[@ory/tanstack-start] The Ory SDK URL is not set.",
    )
  })

  test("ignores the query of the server function request", async () => {
    setRequest(
      "http://localhost:3000/_serverFn/abc?payload=%7B%22flow%22%3A1%7D&createServerFn",
    )

    const href = await redirectHref(getLoginFlow(config, { return_to: "/" }))

    expect([...new URL(href).searchParams.keys()]).toEqual(["return_to"])
  })

  test("forwards repeated search params", async () => {
    const href = await redirectHref(
      getLoginFlow(config, { scope: ["openid", "email"] }),
    )

    expect(new URL(href).searchParams.getAll("scope")).toEqual([
      "openid",
      "email",
    ])
  })
})

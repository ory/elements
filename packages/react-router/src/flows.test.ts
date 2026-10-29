// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  getError,
  getLoginFlow,
  getLogoutFlow,
  getOryBaseUrl,
  getRecoveryFlow,
  getRegistrationFlow,
  getServerSession,
  getSettingsFlow,
  getVerificationFlow,
} from "."
import { createOryProxyHandler } from "./proxy"

const proxyKey = Symbol.for("@ory/react-router/proxy")

const sdkUrl = "https://example.projects.oryapis.com"

const config = {
  project: {
    login_ui_url: "/auth/login",
    registration_ui_url: "/auth/registration",
    recovery_ui_url: "/auth/recovery",
    verification_ui_url: "/auth/verification",
    settings_ui_url: "/settings",
  },
}

const helpers = [
  ["login", getLoginFlow, "/auth/login"],
  ["registration", getRegistrationFlow, "/auth/registration"],
  ["recovery", getRecoveryFlow, "/auth/recovery"],
  ["verification", getVerificationFlow, "/auth/verification"],
  ["settings", getSettingsFlow, "/settings"],
] as const

function flowBody(type: string, id: string) {
  return {
    id,
    type: "browser",
    expires_at: "2099-01-01T00:00:00Z",
    issued_at: "2026-01-01T00:00:00Z",
    request_url: `${sdkUrl}/self-service/${type}/browser`,
    state: "choose_method",
    ui: {
      action: `${sdkUrl}/self-service/${type}?flow=${id}`,
      method: "POST",
      nodes: [],
    },
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  })
}

async function thrown(promise: Promise<unknown>): Promise<Response> {
  try {
    await promise
  } catch (e) {
    if (e instanceof Response) {
      return e
    }
    throw e
  }
  throw new Error("expected the helper to throw a redirect")
}

function registerProxy() {
  createOryProxyHandler({ trustedOrigins: ["http://localhost:5173"] })
}

let fetchMock: jest.SpyInstance
let warn: jest.SpyInstance

beforeEach(() => {
  process.env["ORY_SDK_URL"] = sdkUrl
  fetchMock = jest.spyOn(global, "fetch")
  warn = jest.spyOn(console, "warn").mockImplementation(() => undefined)
  registerProxy()
})

afterEach(() => {
  fetchMock.mockRestore()
  warn.mockRestore()
  delete process.env["ORY_SDK_URL"]
  delete (globalThis as Record<symbol, unknown>)[proxyKey]
})

describe.each(helpers)("get %s flow", (type, getFlow, route) => {
  test("returns the flow and forwards the cookie", async () => {
    fetchMock.mockResolvedValueOnce(json(flowBody(type, "flow-1")))

    const flow = await getFlow(
      new Request(`http://localhost:5173${route}?flow=flow-1`, {
        headers: { cookie: "ory_session=abc" },
      }),
      config,
    )

    expect(flow.id).toBe("flow-1")
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe(`${sdkUrl}/self-service/${type}/flows?id=flow-1`)
    expect(new Headers(init.headers).get("cookie")).toBe("ory_session=abc")
  })

  test("rewrites SDK URLs to the request origin with the proxy", async () => {
    fetchMock.mockResolvedValueOnce(json(flowBody(type, "flow-1")))

    const flow = await getFlow(
      new Request(`http://localhost:5173${route}?flow=flow-1`),
      config,
    )

    expect(flow.ui.action).toBe(
      `http://localhost:5173/self-service/${type}?flow=flow-1`,
    )
    expect(flow).toHaveProperty("ory_base_url", "http://localhost:5173")
  })

  test("keeps SDK URLs without the proxy", async () => {
    delete (globalThis as Record<symbol, unknown>)[proxyKey]
    fetchMock.mockResolvedValueOnce(json(flowBody(type, "flow-1")))

    const flow = await getFlow(
      new Request(`http://localhost:5173${route}?flow=flow-1`),
      config,
    )

    expect(flow.ui.action).toBe(`${sdkUrl}/self-service/${type}?flow=flow-1`)
    expect(flow).toHaveProperty("ory_base_url", sdkUrl)
  })

  test("keeps SDK URLs for an origin the proxy does not trust", async () => {
    fetchMock.mockResolvedValueOnce(json(flowBody(type, "flow-1")))

    const flow = await getFlow(
      new Request(`http://127.0.0.1:5173${route}?flow=flow-1`),
      config,
    )

    expect(flow.ui.action).toBe(`${sdkUrl}/self-service/${type}?flow=flow-1`)
  })

  test("redirects to Ory at the SDK URL without the proxy", async () => {
    delete (globalThis as Record<symbol, unknown>)[proxyKey]

    const response = await thrown(
      getFlow(
        new Request(`http://localhost:5173${route}?return_to=%2Fdone`),
        config,
      ),
    )

    expect(response.headers.get("location")).toBe(
      `${sdkUrl}/self-service/${type}/browser?return_to=%2Fdone`,
    )
  })

  test("redirects to the browser endpoint when the flow ID is missing", async () => {
    const response = await thrown(
      getFlow(
        new Request(`http://localhost:5173${route}?return_to=%2Fdone`),
        config,
      ),
    )

    expect(response.status).toBe(302)
    expect(response.headers.get("location")).toBe(
      `http://localhost:5173/self-service/${type}/browser?return_to=%2Fdone`,
    )
    expect(response.headers.get("X-Remix-Reload-Document")).toBe("true")
    expect(response.headers.get("Cache-Control")).toBe("private, no-store")
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test("drops React Router data request parameters from the redirect", async () => {
    const response = await thrown(
      getFlow(
        new Request(
          `http://localhost:5173${route}.data?return_to=%2Fdone&_routes=routes%2Fx`,
        ),
        config,
      ),
    )

    expect(response.headers.get("location")).toBe(
      `http://localhost:5173/self-service/${type}/browser?return_to=%2Fdone`,
    )
  })

  test("restarts an expired flow", async () => {
    fetchMock.mockResolvedValueOnce(
      json(
        {
          error: {
            id: "self_service_flow_expired",
            code: 410,
            status: "Gone",
            message: "flow expired",
          },
        },
        410,
      ),
    )

    const response = await thrown(
      getFlow(
        new Request(`http://localhost:5173${route}?flow=expired`),
        config,
      ),
    )

    expect(response.status).toBe(302)
    expect(response.headers.get("location")).toMatch(
      new RegExp(`^http://localhost:5173/self-service/${type}/browser`),
    )
  })

  test("loads the replacement of an expired flow on the app's own page", async () => {
    fetchMock.mockResolvedValueOnce(
      json(
        {
          error: {
            id: "self_service_flow_expired",
            code: 410,
            status: "Gone",
            message: "flow expired",
          },
          use_flow_id: "flow-2",
        },
        410,
      ),
    )

    const response = await thrown(
      getFlow(
        new Request(`http://localhost:5173${route}?flow=expired`),
        config,
      ),
    )

    expect(response.status).toBe(302)
    expect(response.headers.get("location")).toBe(
      `http://localhost:5173${route}?flow=flow-2`,
    )
    expect(response.headers.get("X-Remix-Replace")).toBe("true")
    expect(response.headers.get("X-Remix-Reload-Document")).toBeNull()
    expect(response.headers.get("Cache-Control")).toBe("private, no-store")
  })

  test("loads the replacement of an expired flow on the app's own page when the app and Ory share a site", async () => {
    process.env["ORY_SDK_URL"] = "https://auth.example.org"
    fetchMock.mockResolvedValueOnce(
      json(
        {
          error: {
            id: "self_service_flow_expired",
            code: 410,
            status: "Gone",
            message: "flow expired",
          },
          use_flow_id: "flow-2",
        },
        410,
      ),
    )

    const response = await thrown(
      getFlow(
        new Request(`http://app.example.org${route}?flow=expired`),
        config,
      ),
    )

    expect(response.headers.get("location")).toBe(
      `http://app.example.org${route}?flow=flow-2`,
    )
    expect(response.headers.get("X-Remix-Replace")).toBe("true")
    expect(response.headers.get("X-Remix-Reload-Document")).toBeNull()
  })

  test("keeps SDK URLs when the app and Ory share a site", async () => {
    process.env["ORY_SDK_URL"] = "https://auth.example.org"
    fetchMock.mockResolvedValueOnce(
      json({
        ...flowBody(type, "flow-1"),
        ui: {
          action: `https://auth.example.org/self-service/${type}?flow=flow-1`,
          method: "POST",
          nodes: [],
        },
      }),
    )

    const flow = await getFlow(
      new Request(`http://app.example.org${route}?flow=flow-1`),
      config,
    )

    expect(flow.ui.action).toBe(
      `https://auth.example.org/self-service/${type}?flow=flow-1`,
    )
  })

  test("reports a missing SDK URL", async () => {
    delete process.env["ORY_SDK_URL"]

    await expect(
      getFlow(new Request(`http://localhost:5173${route}?flow=flow-1`), config),
    ).rejects.toThrow(/\[@ory\/react-router\].*ORY_SDK_URL/)
  })
})

describe("getServerSession", () => {
  test("returns the session for the request cookie", async () => {
    fetchMock.mockResolvedValueOnce(
      json({ id: "session-1", identity: { id: "identity-1" } }),
    )

    const session = await getServerSession(
      new Request("http://localhost:5173/", {
        headers: { cookie: "ory_session=abc" },
      }),
    )

    expect(session?.id).toBe("session-1")
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe(`${sdkUrl}/sessions/whoami`)
    expect(new Headers(init.headers).get("cookie")).toBe("ory_session=abc")
  })

  test("returns null without a session", async () => {
    fetchMock.mockResolvedValueOnce(
      json({ error: { code: 401, message: "no session" } }, 401),
    )

    const session = await getServerSession(
      new Request("http://localhost:5173/"),
    )

    expect(session).toBeNull()
  })
})

describe("getLogoutFlow", () => {
  test("rewrites the logout URL to the request origin with the proxy", async () => {
    fetchMock.mockResolvedValueOnce(
      json({
        logout_token: "token",
        logout_url: `${sdkUrl}/self-service/logout?token=token`,
      }),
    )

    const flow = await getLogoutFlow(
      new Request("http://localhost:5173/", {
        headers: { cookie: "ory_session=abc" },
      }),
      { returnTo: "/bye" },
    )

    expect(flow.logout_url).toBe(
      "http://localhost:5173/self-service/logout?token=token",
    )
    const [url] = fetchMock.mock.calls[0] as [string]
    expect(url).toBe(`${sdkUrl}/self-service/logout/browser?return_to=%2Fbye`)
  })

  test("keeps the SDK logout URL without the proxy", async () => {
    delete (globalThis as Record<symbol, unknown>)[proxyKey]
    fetchMock.mockResolvedValueOnce(
      json({
        logout_token: "token",
        logout_url: `${sdkUrl}/self-service/logout?token=token`,
      }),
    )

    const flow = await getLogoutFlow(new Request("http://localhost:5173/"))

    expect(flow.logout_url).toBe(`${sdkUrl}/self-service/logout?token=token`)
  })
})

describe("getError", () => {
  test("returns the error from the query", async () => {
    const error = await getError(
      new Request(
        "http://localhost:5173/auth/error?error=access_denied&error_description=nope",
      ),
    )

    expect(error).toEqual({
      error: "access_denied",
      error_description: "nope",
      ory_base_url: "http://localhost:5173",
    })
  })

  test("fetches the flow error by ID", async () => {
    fetchMock.mockResolvedValueOnce(
      json({ id: "error-1", error: { message: "boom" } }),
    )

    const error = await getError(
      new Request("http://localhost:5173/auth/error?id=error-1"),
    )

    expect(error).toMatchObject({
      id: "error-1",
      ory_base_url: "http://localhost:5173",
    })
  })
})

function freshGetOryBaseUrl(): typeof getOryBaseUrl {
  let fresh: typeof import(".") | undefined
  jest.isolateModules(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    fresh = require(".") as typeof import(".")
  })
  return fresh!.getOryBaseUrl
}

const warnings = {
  untrusted:
    /^\[@ory\/react-router\] The Ory proxy handled a request for http:\/\/127\.0\.0\.1:5173, which is not in `trustedOrigins`/,
  crossSite:
    /^\[@ory\/react-router\] The app \(http:\/\/localhost:5173\) and Ory \(https:\/\/example\.projects\.oryapis\.com\) are on different sites/,
  invalidOrigin:
    /^\[@ory\/react-router\] The request's `Host` header is not a valid origin/,
}

describe("getOryBaseUrl", () => {
  test("is the request origin for a trusted origin with the proxy", () => {
    const url = freshGetOryBaseUrl()(
      new Request("http://localhost:5173/auth/login"),
    )

    expect(url).toBe("http://localhost:5173")
    expect(warn).not.toHaveBeenCalled()
  })

  test("is the SDK URL and warns for an origin the proxy does not trust", () => {
    const url = freshGetOryBaseUrl()(new Request("http://127.0.0.1:5173/"))

    expect(url).toBe(sdkUrl)
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(warnings.untrusted))
  })

  test("is the SDK URL and warns without the proxy", () => {
    delete (globalThis as Record<symbol, unknown>)[proxyKey]
    const url = freshGetOryBaseUrl()(new Request("http://localhost:5173/"))

    expect(url).toBe(sdkUrl)
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(warnings.crossSite))
  })

  test.each([
    ["with", true],
    ["without", false],
  ])(
    "is the SDK URL when the app and Ory share a site, %s the proxy",
    (_, proxy) => {
      if (!proxy) {
        delete (globalThis as Record<symbol, unknown>)[proxyKey]
      }
      process.env["ORY_SDK_URL"] = "https://auth.example.org/"

      const url = freshGetOryBaseUrl()(new Request("http://app.example.org/"))

      expect(url).toBe("https://auth.example.org")
      expect(warn).not.toHaveBeenCalled()
    },
  )

  test("is the SDK URL and warns for a Host header that is not an origin", () => {
    const url = freshGetOryBaseUrl()(
      new Request("http://localhost:5173/", {
        headers: { host: "localhost:5173@example.org" },
      }),
    )

    expect(url).toBe(sdkUrl)
    expect(warn).toHaveBeenCalledWith(
      expect.stringMatching(warnings.invalidOrigin),
    )
  })

  test("ignores client-sent proxy headers", () => {
    const request = new Request("http://127.0.0.1:5173/", {
      headers: {
        "x-ory-proxy": "1",
        "Ory-Base-URL-Rewrite": "http://127.0.0.1:5173",
      },
    })

    expect(freshGetOryBaseUrl()(request)).toBe(sdkUrl)
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(warnings.untrusted))
  })

  test("treats a value that is not a proxy registration as no proxy", () => {
    ;(globalThis as Record<symbol, unknown>)[proxyKey] = {
      trustedOrigins: "http://localhost:5173",
    }

    expect(freshGetOryBaseUrl()(new Request("http://localhost:5173/"))).toBe(
      sdkUrl,
    )
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(warnings.crossSite))
  })

  test("warns once per warning", () => {
    const getUrl = freshGetOryBaseUrl()
    delete (globalThis as Record<symbol, unknown>)[proxyKey]
    getUrl(new Request("http://localhost:5173/"))
    getUrl(new Request("http://localhost:5174/"))
    registerProxy()
    getUrl(new Request("http://127.0.0.1:5173/"))

    expect(warn).toHaveBeenCalledTimes(2)
    expect(warn.mock.calls[0][0]).toMatch(warnings.crossSite)
    expect(warn.mock.calls[1][0]).toMatch(warnings.untrusted)
  })
})

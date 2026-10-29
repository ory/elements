// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { isOryProxyPath, oryProxyPaths } from "@ory/ssr/proxy"
import { matchPath } from "react-router"
import { createOryProxyHandler, oryProxyRoutes } from "."

const proxyKey = Symbol.for("@ory/react-router/proxy")

const sdkUrl = "https://example.projects.oryapis.com"

let fetchMock: jest.SpyInstance

beforeEach(() => {
  process.env["ORY_SDK_URL"] = sdkUrl
  process.env["ORY_PROJECT_API_TOKEN"] = "ory_pat_test"
  fetchMock = jest.spyOn(global, "fetch")
})

afterEach(() => {
  fetchMock.mockRestore()
  delete process.env["ORY_SDK_URL"]
  delete process.env["ORY_PROJECT_API_TOKEN"]
  delete (globalThis as Record<symbol, unknown>)[proxyKey]
})

describe("oryProxyRoutes", () => {
  test("registers every Ory path on the given route module", () => {
    expect(oryProxyRoutes("routes/ory-proxy.ts")).toEqual([
      {
        id: "ory-proxy-self-service",
        path: "self-service/*",
        file: "routes/ory-proxy.ts",
      },
      {
        id: "ory-proxy-sessions-whoami",
        path: "sessions/whoami/*",
        file: "routes/ory-proxy.ts",
      },
      { id: "ory-proxy-ui", path: "ui/*", file: "routes/ory-proxy.ts" },
      {
        id: "ory-proxy-well-known-ory",
        path: ".well-known/ory/*",
        file: "routes/ory-proxy.ts",
      },
      { id: "ory-proxy-ory", path: ".ory/*", file: "routes/ory-proxy.ts" },
    ])
  })

  test.each(oryProxyPaths.flatMap((prefix) => [prefix, `${prefix}/x/y`]))(
    "routes %s to the proxy",
    (pathname) => {
      expect(isOryProxyPath(pathname)).toBe(true)
      expect(
        oryProxyRoutes("routes/ory-proxy.ts").some((r) =>
          matchPath(`/${r.path}`, pathname),
        ),
      ).toBe(true)
    },
  )
})

describe("createOryProxyHandler", () => {
  test("requires trusted origins", () => {
    // @ts-expect-error trustedOrigins is required.
    expect(() => createOryProxyHandler({})).toThrow(
      /\[@ory\/react-router\].*trustedOrigins/,
    )
    expect(() => createOryProxyHandler({ trustedOrigins: [] })).toThrow(
      /\[@ory\/react-router\].*trustedOrigins/,
    )
    expect((globalThis as Record<symbol, unknown>)[proxyKey]).toBeUndefined()
  })

  test.each([
    "localhost:5173",
    "http://localhost:5173/path",
    "https://*.vercel.app",
    "https://my-app-.*\\.vercel\\.app",
  ])("rejects the trusted origin %s", (entry) => {
    expect(() => createOryProxyHandler({ trustedOrigins: [entry] })).toThrow(
      /\[@ory\/react-router\].*trustedOrigins/,
    )
    expect((globalThis as Record<symbol, unknown>)[proxyKey]).toBeUndefined()
  })

  test("rejects trusted origins that are not strings", () => {
    expect(() =>
      createOryProxyHandler({
        trustedOrigins: [/^http:\/\/localhost:5173$/ as unknown as string],
      }),
    ).toThrow(/\[@ory\/react-router\].*trustedOrigins/)
  })

  test("registers a frozen copy of the trusted origins", () => {
    const trustedOrigins = ["http://localhost:5173"]
    createOryProxyHandler({
      trustedOrigins,
      project: { login_ui_url: "/auth/login" },
    })
    trustedOrigins.push("http://example.org")

    const registered = (globalThis as Record<symbol, unknown>)[proxyKey]
    expect(registered).toEqual({ trustedOrigins: ["http://localhost:5173"] })
    expect(Object.isFrozen(registered)).toBe(true)
    expect(
      Object.isFrozen(
        (registered as { trustedOrigins: string[] }).trustedOrigins,
      ),
    ).toBe(true)
  })

  test("proxies a GET to the SDK URL", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    )
    const proxy = createOryProxyHandler({
      trustedOrigins: ["http://localhost:5173"],
    })

    const response = await proxy({
      request: new Request("http://localhost:5173/sessions/whoami"),
    })

    expect(response.status).toBe(200)
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe(`${sdkUrl}/sessions/whoami`)
    const headers = new Headers(init.headers)
    expect(headers.get("Ory-Base-URL-Rewrite")).toBe("http://localhost:5173")
    expect(headers.get("Ory-Base-URL-Rewrite-Token")).toBe("ory_pat_test")
  })

  test("proxies with the trusted origins it was created with", async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }))
    const trustedOrigins = ["http://localhost:5173"]
    const proxy = createOryProxyHandler({ trustedOrigins })
    trustedOrigins.push("http://example.org")

    await proxy({ request: new Request("http://example.org/sessions/whoami") })

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(
      new Headers(init.headers).get("Ory-Base-URL-Rewrite-Token"),
    ).toBeNull()
  })

  test("proxies a POST to the SDK URL", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(null, {
        status: 303,
        headers: { location: `${sdkUrl}/ui/login?flow=1` },
      }),
    )
    const proxy = createOryProxyHandler({
      trustedOrigins: ["http://localhost:5173"],
      project: { login_ui_url: "/auth/login" },
    })

    const response = await proxy({
      request: new Request("http://localhost:5173/self-service/login?flow=1", {
        method: "POST",
        body: "identifier=a",
      }),
    })

    expect(response.status).toBe(303)
    expect(response.headers.get("location")).toBe(
      "http://localhost:5173/auth/login?flow=1",
    )
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(init.method).toBe("POST")
  })

  test("answers 404 for paths that are not Ory paths", async () => {
    const proxy = createOryProxyHandler({
      trustedOrigins: ["http://localhost:5173"],
    })

    const response = await proxy({
      request: new Request("http://localhost:5173/auth/login"),
    })

    expect(response.status).toBe(404)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test("reports a missing SDK URL", async () => {
    delete process.env["ORY_SDK_URL"]
    const proxy = createOryProxyHandler({
      trustedOrigins: ["http://localhost:5173"],
    })

    await expect(
      proxy({
        request: new Request(
          "http://localhost:5173/self-service/login/browser",
        ),
      }),
    ).rejects.toThrow(/\[@ory\/react-router\].*ORY_SDK_URL/)
  })
})

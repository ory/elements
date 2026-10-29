// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { createDefaultSerovalPlugins } from "@tanstack/router-core/ssr/client"
import { fromCrossJSON, type SerovalNode, toJSONAsync } from "seroval"
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  type MockInstance,
  test,
  vi,
} from "vitest"
import {
  expiresAt,
  flowId,
  issuedAt,
  type MockOry,
  startMockOry,
} from "./mock-ory"

type ServerEntry = { fetch: (request: Request) => Promise<Response> }

const appOrigin = "http://localhost:3000"
const untrustedOrigin = "http://app.internal:3000"

const distServer = join(import.meta.dirname, "../dist/server")

function serverFnId(name: string): string {
  const assets = readdirSync(join(distServer, "assets"))
    .map((file) => readFileSync(join(distServer, "assets", file), "utf8"))
    .join("\n")
  const id = new RegExp(`id: "([0-9a-f]+)",\\s*name: "${name}"`).exec(
    assets,
  )?.[1]
  if (!id) {
    throw new Error(`Server function ${name} not found in the build`)
  }
  return id
}

describe("built server", () => {
  let ory: MockOry
  let server: ServerEntry
  let warn: MockInstance<typeof console.warn>

  beforeAll(async () => {
    warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)
    ory = await startMockOry()
    process.env["ORY_SDK_URL"] = ory.url
    server = (
      (await import(join(distServer, "server.js"))) as { default: ServerEntry }
    ).default
  })

  afterAll(async () => {
    warn.mockRestore()
    await ory.close()
  })

  function renderPage(origin: string, path: string) {
    return server.fetch(
      new Request(`${origin}${path}`, { headers: { accept: "text/html" } }),
    )
  }

  function registrationLink(baseUrl: string) {
    return `href="${baseUrl}/self-service/registration/browser"`
  }

  async function serverFnResult(response: Response): Promise<unknown> {
    const { result } = fromCrossJSON<{ result: unknown }>(
      (await response.json()) as SerovalNode,
      { refs: new Map(), plugins: createDefaultSerovalPlugins() },
    )
    return result
  }

  async function callServerFn(
    origin: string,
    name: string,
    data: unknown,
    secFetchSite = "same-origin",
  ) {
    const payload = JSON.stringify(await toJSONAsync({ data }))
    return server.fetch(
      new Request(
        `${origin}/_serverFn/${serverFnId(name)}?${new URLSearchParams({ payload })}`,
        {
          headers: {
            "x-tsr-serverFn": "true",
            accept: "application/json",
            "sec-fetch-site": secFetchSite,
          },
        },
      ),
    )
  }

  test("rejects cross-site server function calls", async () => {
    const response = await callServerFn(
      appOrigin,
      "sessionFn",
      undefined,
      "cross-site",
    )

    expect(response.status).toBe(403)
  })

  test("a flow keeps its dates as Date objects through a server function call", async () => {
    const response = await callServerFn(appOrigin, "loginFlowFn", {
      flow: flowId,
    })

    expect(response.headers.get("x-tss-serialized")).toBe("true")
    const { result } = fromCrossJSON<{
      result: { id: string; expires_at: Date; issued_at: Date }
    }>((await response.json()) as SerovalNode, {
      refs: new Map(),
      plugins: createDefaultSerovalPlugins(),
    })
    expect(result.id).toBe(flowId)
    expect(result.expires_at).toBeInstanceOf(Date)
    expect(result.expires_at.toISOString()).toBe(expiresAt)
    expect(result.issued_at).toBeInstanceOf(Date)
    expect(result.issued_at.toISOString()).toBe(issuedAt)
  })

  test("a server-rendered flow page hydrates its dates as Date objects", async () => {
    const response = await renderPage(appOrigin, `/login?flow=${flowId}`)

    expect(response.status).toBe(200)
    const html = await response.text()
    expect(html).toContain(`new Date("${expiresAt}")`)
    expect(html).toContain(`new Date("${issuedAt}")`)
  })

  test("a server-rendered page on a trusted origin gives Ory Elements the app origin", async () => {
    const response = await renderPage(appOrigin, `/login?flow=${flowId}`)

    expect(await response.text()).toContain(registrationLink(appOrigin))
  })

  test("a server-rendered page on an untrusted origin gives Ory Elements the SDK URL and warns", async () => {
    const response = await renderPage(untrustedOrigin, `/login?flow=${flowId}`)

    expect(await response.text()).toContain(registrationLink(ory.url))
    expect(warn).toHaveBeenCalledWith(
      expect.stringMatching(
        /^\[@ory\/tanstack-start\] The Ory proxy handled a request for http:\/\/app\.internal:3000, which is not in `trustedOrigins`/,
      ),
    )
  })

  test("a flow page is private and not storable", async () => {
    const response = await renderPage(appOrigin, `/login?flow=${flowId}`)

    expect(response.headers.get("cache-control")).toBe("private, no-store")
  })

  test("a server function that returns the base URL is private and not storable", async () => {
    const response = await callServerFn(appOrigin, "oryBaseUrlFn", undefined)

    expect(response.headers.get("cache-control")).toBe("private, no-store")
    expect(await serverFnResult(response)).toBe(appOrigin)
  })

  test("a page without a flow redirects the browser to create one through the proxy", async () => {
    const response = await renderPage(
      appOrigin,
      "/login?return_to=%2Fdashboard",
    )

    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toBe(
      "/self-service/login/browser?return_to=%2Fdashboard",
    )
    expect(response.headers.get("cache-control")).toBe("private, no-store")
  })

  test("a server function redirect is a full-document navigation without server function params", async () => {
    const response = await callServerFn(ory.url, "loginFlowFn", {
      return_to: "/dashboard",
    })

    expect(response.headers.get("cache-control")).toBe("private, no-store")
    const redirect = (await response.json()) as {
      isSerializedRedirect: boolean
      reloadDocument: boolean
      href: string
    }
    expect(redirect.isSerializedRedirect).toBe(true)
    expect(redirect.reloadDocument).toBe(true)
    const href = new URL(redirect.href, ory.url)
    expect(href.pathname).toBe("/self-service/login/browser")
    expect([...href.searchParams]).toEqual([["return_to", "/dashboard"]])
  })
})

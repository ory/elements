// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { AddressInfo } from "node:net"
import { join } from "node:path"
import { createServer, type ViteDevServer } from "vite"
import { afterAll, beforeAll, describe, expect, test } from "vitest"
import { httpGet } from "./http-get"
import { flowId, type MockOry, startMockOry } from "./mock-ory"

describe("dev server", () => {
  let ory: MockOry
  let vite: ViteDevServer
  let appUrl: string

  beforeAll(async () => {
    ory = await startMockOry()
    process.env["ORY_SDK_URL"] = ory.url
    vite = await createServer({
      root: join(import.meta.dirname, ".."),
      logLevel: "error",
      server: { host: "127.0.0.1", port: 0 },
    })
    await vite.listen()
    const { port } = vite.httpServer?.address() as AddressInfo
    appUrl = `http://127.0.0.1:${port}`
  })

  afterAll(async () => {
    await vite.close()
    await ory.close()
  })

  test("proxies Ory paths that no app route matches", async () => {
    const response = await fetch(
      `${appUrl}/self-service/login/browser?return_to=%2Fdashboard`,
      { redirect: "manual", headers: { accept: "text/html" } },
    )

    const upstream = ory.requests.at(-1)
    expect(upstream?.pathname).toBe("/self-service/login/browser")
    expect(upstream?.searchParams.get("return_to")).toBe("/dashboard")
    expect(response.status).toBe(303)
    expect(response.headers.get("location")).toBe(
      `${appUrl}/login?flow=${flowId}`,
    )
  })

  test("a server-rendered page on a trusted origin gives Ory Elements the app origin", async () => {
    const response = await httpGet(`${appUrl}/login?flow=${flowId}`, {
      accept: "text/html",
      host: "localhost:3000",
    })

    expect(await response.text()).toContain(
      'href="http://localhost:3000/self-service/registration/browser"',
    )
  })

  test("leaves app routes to the router", async () => {
    const before = ory.requests.length

    const response = await fetch(`${appUrl}/does-not-exist`, {
      headers: { accept: "text/html" },
    })

    expect(response.status).toBe(404)
    expect(ory.requests.length).toBe(before)
  })
})

// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { AddressInfo } from "node:net"
import { join } from "node:path"
import { createDefaultSerovalPlugins } from "@tanstack/router-core/ssr/client"
import { fromCrossJSON, type SerovalNode, toJSONAsync } from "seroval"
import { createServer, type Plugin, type ViteDevServer } from "vite"
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  type MockInstance,
  test,
  vi,
} from "vitest"
import { httpGet } from "./http-get"
import { flowId, type MockOry, startMockOry } from "./mock-ory"

const startWithoutProxy: Plugin = {
  name: "start-without-ory-proxy",
  enforce: "pre",
  load(id) {
    if (id.split("?")[0].endsWith("/src/start.ts")) {
      return `
        import { createCsrfMiddleware, createStart } from "@tanstack/react-start"
        export const startInstance = createStart(() => ({
          requestMiddleware: [
            createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" }),
          ],
        }))
      `
    }
  },
}

describe("dev server without the proxy", () => {
  let ory: MockOry
  let vite: ViteDevServer
  let appUrl: string
  let host: string
  let warn: MockInstance<typeof console.warn>

  beforeAll(async () => {
    warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)
    ory = await startMockOry()
    process.env["ORY_SDK_URL"] = ory.url
    vite = await createServer({
      root: join(import.meta.dirname, ".."),
      logLevel: "error",
      plugins: [startWithoutProxy],
      server: { host: "127.0.0.1", port: 0 },
    })
    await vite.listen()
    const { port } = vite.httpServer?.address() as AddressInfo
    appUrl = `http://127.0.0.1:${port}`
    host = `localhost:${port}`
  })

  afterAll(async () => {
    await vite.close()
    await ory.close()
    warn.mockRestore()
  })

  async function serverFnId(name: string): Promise<string> {
    const result = await vite.environments["client"]?.transformRequest(
      "/src/ory.functions.ts",
    )
    const id = new RegExp(
      `${name} = createServerFn\\(.*?createClientRpc\\("([^"]+)"\\)`,
    ).exec(result?.code ?? "")?.[1]
    if (!id) {
      throw new Error(`Server function ${name} not found`)
    }
    return id
  }

  test("does not proxy Ory paths", async () => {
    const before = ory.requests.length

    const response = await httpGet(`${appUrl}/self-service/login/browser`, {
      accept: "text/html",
      host,
    })

    expect(response.status).toBe(404)
    expect(ory.requests.length).toBe(before)
  })

  test("a server-rendered page gives Ory Elements the SDK URL and warns", async () => {
    const response = await httpGet(`${appUrl}/login?flow=${flowId}`, {
      accept: "text/html",
      host,
    })

    expect(await response.text()).toContain(
      `href="${ory.url}/self-service/registration/browser"`,
    )
    expect(warn).toHaveBeenCalledWith(
      expect.stringMatching(
        /^\[@ory\/tanstack-start\] The app \(http:\/\/localhost:\d+\) and Ory/,
      ),
    )
  })

  test("the server function context does not set the proxy state", async () => {
    const payload = JSON.stringify(
      await toJSONAsync({
        data: undefined,
        context: { oryProxy: "trusted-origin" },
      }),
    )
    const response = await httpGet(
      `${appUrl}/_serverFn/${await serverFnId("oryBaseUrlFn")}?${new URLSearchParams({ payload })}`,
      {
        host,
        "x-tsr-serverFn": "true",
        accept: "application/json",
        "sec-fetch-site": "same-origin",
      },
    )

    expect(response.status).toBe(200)
    const { result } = fromCrossJSON<{ result: string }>(
      (await response.json()) as SerovalNode,
      { refs: new Map(), plugins: createDefaultSerovalPlugins() },
    )
    expect(result).toBe(ory.url)
  })
})

// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LoginFlowFromJSON } from "@ory/client-fetch"
import { createDefaultSerovalPlugins } from "@tanstack/router-core/ssr/client"
import { getGlobalStartContext } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { fromCrossJSON, toCrossJSONAsync } from "seroval"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import loginFlowJson from "./fixtures/login-flow.json"
import { getLoginFlow } from "./flows"

vi.mock("@tanstack/react-start", () => ({
  getGlobalStartContext: vi.fn(),
}))

vi.mock("@tanstack/react-start/server", () => ({
  getRequest: vi.fn(),
  setResponseHeader: vi.fn(),
}))

const globalStartContext = vi.mocked(getGlobalStartContext as () => unknown)

async function throughServerFunction<T>(value: T): Promise<T> {
  const plugins = createDefaultSerovalPlugins()
  const wire = JSON.stringify(
    await toCrossJSONAsync(value, { refs: new Map(), plugins }),
  )
  return fromCrossJSON(JSON.parse(wire) as never, {
    refs: new Map(),
    plugins,
  })
}

describe("server function serialization", () => {
  const env = process.env

  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(JSON.stringify(loginFlowJson), {
          headers: { "content-type": "application/json" },
        }),
      ),
    )
    process.env = {
      ...env,
      ORY_SDK_URL: "https://example.projects.oryapis.com",
    }
    globalStartContext.mockReturnValue({})
    vi.mocked(getRequest).mockReturnValue(
      new Request("https://app.example.org/_serverFn/abc"),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    process.env = env
  })

  test("a login flow keeps its dates as Date objects", async () => {
    const flow = await getLoginFlow(
      { project: { login_ui_url: "/login" } },
      { flow: loginFlowJson.id },
    )
    expect(flow.expires_at).toBeInstanceOf(Date)
    expect(flow.issued_at).toBeInstanceOf(Date)

    const received = await throughServerFunction(flow)

    expect(received.expires_at).toBeInstanceOf(Date)
    expect(received.issued_at).toBeInstanceOf(Date)
    expect(received.expires_at.toISOString()).toBe("2026-10-16T15:30:00.123Z")
    expect(received.issued_at.toISOString()).toBe("2026-10-16T15:00:00.123Z")
  })

  test("a login flow arrives unchanged", async () => {
    const flow = await getLoginFlow(
      { project: { login_ui_url: "/login" } },
      { flow: loginFlowJson.id },
    )

    const received = await throughServerFunction(flow)

    expect(received).toEqual(flow)
    expect(received).toEqual({
      ...(JSON.parse(
        JSON.stringify(LoginFlowFromJSON(loginFlowJson)),
        (k, v) =>
          ["expires_at", "issued_at", "created_at", "updated_at"].includes(k)
            ? new Date(v as string)
            : (v as unknown),
      ) as object),
      ory_base_url: "https://example.projects.oryapis.com",
    })
  })
})

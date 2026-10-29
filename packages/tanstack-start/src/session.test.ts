// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { getGlobalStartContext } from "@tanstack/react-start"
import { getRequest, setResponseHeader } from "@tanstack/react-start/server"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { getError, getLogoutFlow, getServerSession } from "./session"

vi.mock("@tanstack/react-start", () => ({
  getGlobalStartContext: vi.fn(),
}))

vi.mock("@tanstack/react-start/server", () => ({
  getRequest: vi.fn(),
  setResponseHeader: vi.fn(),
}))

const globalStartContext = vi.mocked(getGlobalStartContext as () => unknown)

const sdkUrl = "https://example.projects.oryapis.com"
const fetchMock = vi.fn<typeof fetch>()

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  })
}

function requested(call = 0): { url: URL; cookie: string | null } {
  const [input, init] = fetchMock.mock.calls[call] ?? []
  if (input instanceof Request) {
    return { url: new URL(input.url), cookie: input.headers.get("cookie") }
  }
  return {
    url: new URL(String(input)),
    cookie: new Headers(init?.headers).get("cookie"),
  }
}

describe("session helpers", () => {
  const env = process.env

  beforeEach(() => {
    vi.mocked(setResponseHeader).mockReset()
    fetchMock.mockReset()
    vi.stubGlobal("fetch", fetchMock)
    process.env = { ...env, ORY_SDK_URL: sdkUrl }
    globalStartContext.mockReturnValue({ oryProxy: "trusted-origin" })
    vi.mocked(getRequest).mockReturnValue(
      new Request("http://localhost:3000/_serverFn/abc", {
        headers: { cookie: "ory_session=abc" },
      }),
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    process.env = env
  })

  test("getServerSession returns the session for the browser's cookie", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        id: "session-id",
        active: true,
        identity: { id: "identity-id", schema_id: "default", traits: {} },
      }),
    )

    const session = await getServerSession()

    expect(session?.id).toBe("session-id")
    expect(requested().url.toString()).toBe(`${sdkUrl}/sessions/whoami`)
    expect(requested().cookie).toBe("ory_session=abc")
  })

  test("getServerSession returns null without a session", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ error: { code: 401, message: "Unauthorized" } }, 401),
    )

    await expect(getServerSession()).resolves.toBeNull()
  })

  test("getLogoutFlow points the logout URL at the app origin behind the proxy", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        logout_token: "token",
        logout_url: `${sdkUrl}/self-service/logout?token=token`,
      }),
    )

    const flow = await getLogoutFlow({ returnTo: "http://localhost:3000/" })

    expect(flow.logout_url).toBe(
      "http://localhost:3000/self-service/logout?token=token",
    )
    expect(requested().url.pathname).toBe("/self-service/logout/browser")
    expect(requested().url.searchParams.get("return_to")).toBe(
      "http://localhost:3000/",
    )
    expect(requested().cookie).toBe("ory_session=abc")
  })

  test("getLogoutFlow keeps the SDK URL without the proxy", async () => {
    globalStartContext.mockReturnValue({})
    vi.spyOn(console, "warn").mockImplementation(() => undefined)
    fetchMock.mockResolvedValue(
      jsonResponse({
        logout_token: "token",
        logout_url: `${sdkUrl}/self-service/logout?token=token`,
      }),
    )

    const flow = await getLogoutFlow()

    expect(flow.logout_url).toBe(`${sdkUrl}/self-service/logout?token=token`)
  })

  test.each([
    [
      "getServerSession",
      () => {
        fetchMock.mockResolvedValue(jsonResponse({ id: "session-id" }))
        return getServerSession()
      },
    ],
    [
      "getLogoutFlow",
      () => {
        fetchMock.mockResolvedValue(
          jsonResponse({ logout_token: "t", logout_url: `${sdkUrl}/x` }),
        )
        return getLogoutFlow()
      },
    ],
    ["getError", () => getError({ error: "e", error_description: "d" })],
  ])("%s marks the response as private and not storable", async (_, call) => {
    await call()

    expect(setResponseHeader).toHaveBeenCalledExactlyOnceWith(
      "Cache-Control",
      "private, no-store",
    )
  })

  test("getError returns the error from the search params", async () => {
    await expect(
      getError({ error: "access_denied", error_description: "Denied." }),
    ).resolves.toEqual({
      error: "access_denied",
      error_description: "Denied.",
      ory_base_url: "http://localhost:3000",
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test("getError fetches the flow error by ID", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ id: "error-id", error: { code: 500, message: "Boom" } }),
    )

    const error = await getError({ id: "error-id" })

    expect(error).toMatchObject({
      id: "error-id",
      ory_base_url: "http://localhost:3000",
    })
    expect(requested().url.pathname).toBe("/self-service/errors")
    expect(requested().url.searchParams.get("id")).toBe("error-id")
  })
})

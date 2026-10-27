// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { createLogoutFlow, getSession } from "./session"

function mockFetch(status: number, body: unknown) {
  const fetch = jest.fn().mockImplementation(() =>
    Promise.resolve(
      new Response(JSON.stringify(body), {
        status,
        headers: { "content-type": "application/json" },
      }),
    ),
  )
  global.fetch = fetch
  return fetch
}

const sdkUrl = "https://project.oryapis.com"

describe("getSession", () => {
  test("returns the session for the request cookie", async () => {
    const fetch = mockFetch(200, {
      id: "session-1",
      identity: { id: "identity-1", schema_id: "default", schema_url: "" },
    })

    const session = await getSession(
      { headers: new Headers({ cookie: "ory_session=abc" }) },
      { sdkUrl },
    )

    const [url, init] = fetch.mock.calls[0] as [string, RequestInit]
    expect(url).toBe("https://project.oryapis.com/sessions/whoami")
    expect(new Headers(init.headers).get("cookie")).toBe("ory_session=abc")
    expect(session?.id).toBe("session-1")
  })

  test("returns null without a session", async () => {
    mockFetch(401, { error: { code: 401, message: "unauthorized" } })

    expect(await getSession({ headers: new Headers() }, { sdkUrl })).toBeNull()
  })
})

describe("createLogoutFlow", () => {
  const logoutFlow = {
    logout_token: "token",
    logout_url: "https://project.oryapis.com/self-service/logout?token=token",
  }

  test("creates a logout flow and rewrites its URL to the browser URL", async () => {
    const fetch = mockFetch(200, logoutFlow)

    const flow = await createLogoutFlow(
      new Request("http://localhost:3000/", {
        headers: { cookie: "ory_session=abc" },
      }),
      {
        sdkUrl: sdkUrl + "/",
        baseUrl: "http://localhost:3000/",
        returnTo: "http://localhost:3000/bye",
      },
    )

    const [url, init] = fetch.mock.calls[0] as [string, RequestInit]
    expect(url).toBe(
      "https://project.oryapis.com/self-service/logout/browser?return_to=http%3A%2F%2Flocalhost%3A3000%2Fbye",
    )
    expect(new Headers(init.headers).get("cookie")).toBe("ory_session=abc")
    expect(flow.logout_url).toBe(
      "http://localhost:3000/self-service/logout?token=token",
    )
  })

  test("keeps the SDK URL when it is the browser URL", async () => {
    mockFetch(200, logoutFlow)

    const flow = await createLogoutFlow(
      { headers: new Headers() },
      { sdkUrl, baseUrl: sdkUrl },
    )

    expect(flow.logout_url).toBe(logoutFlow.logout_url)
  })

  test("requires the browser URL", async () => {
    mockFetch(200, logoutFlow)

    await createLogoutFlow(
      { headers: new Headers() },
      // @ts-expect-error baseUrl is required.
      { sdkUrl },
    ).catch(() => undefined)
  })
})

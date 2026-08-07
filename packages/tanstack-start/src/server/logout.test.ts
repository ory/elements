// SPDX-License-Identifier: Apache-2.0

import { createOry } from "./index"

describe("logout", () => {
  it("creates a browser logout flow with returnTo and a browser-facing URL", async () => {
    const fetchApi = jest.fn<typeof fetch>().mockResolvedValue(
      Response.json({
        logout_token: "logout-token",
        logout_url:
          "https://auth.example.net/self-service/logout?token=logout-token",
      }),
    )
    const ory = createOry({
      sdkUrl: "https://auth.example.net",
      project: {},
      fetchApi,
    })

    const flow = await ory.getLogoutFlow({
      request: new Request("https://docs.example.com/logout", {
        headers: { cookie: "ory_session=secret" },
      }),
      returnTo: "https://docs.example.com/",
    })

    expect(flow.logout_url).toBe(
      "https://docs.example.com/self-service/logout?token=logout-token",
    )
    expect(fetchApi.mock.calls[0]?.[0]).toBe(
      "https://auth.example.net/self-service/logout/browser?return_to=https%3A%2F%2Fdocs.example.com%2F",
    )
    const capturedHeaders: unknown = fetchApi.mock.calls[0]?.[1]?.headers
    expect(capturedHeaders).toEqual(
      expect.objectContaining({ cookie: "ory_session=secret" }),
    )
  })

  it("does not send return_to when the application does not opt into it", async () => {
    const fetchApi = jest.fn<typeof fetch>().mockResolvedValue(
      Response.json({
        logout_token: "logout-token",
        logout_url:
          "https://auth.example.net/self-service/logout?token=logout-token",
      }),
    )
    const ory = createOry({
      sdkUrl: "https://auth.example.net",
      project: {},
      fetchApi,
    })

    await ory.getLogoutFlow({
      request: new Request("http://localhost:3000/", {
        headers: { cookie: "ory_session=secret" },
      }),
    })

    expect(fetchApi.mock.calls[0]?.[0]).toBe(
      "https://auth.example.net/self-service/logout/browser",
    )
  })
})

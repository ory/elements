// SPDX-License-Identifier: Apache-2.0

import { createOry } from "./index"

describe("sessions", () => {
  it("loads the current session with the incoming cookie", async () => {
    const fetchApi = jest
      .fn()
      .mockResolvedValue(Response.json({ id: "session-123", active: true }))
    const ory = createOry({
      sdkUrl: "https://auth.example.net",
      project: {},
      fetchApi,
    })

    const session = await ory.getSession({
      request: new Request("https://docs.example.com", {
        headers: { cookie: "ory_session=secret" },
      }),
    })

    expect(session?.id).toBe("session-123")
    expect(fetchApi).toHaveBeenCalledWith(
      "https://auth.example.net/sessions/whoami",
      expect.objectContaining({
        headers: expect.objectContaining({ Cookie: "ory_session=secret" }),
      }),
    )
  })

  it("returns null when Ory reports that no session is active", async () => {
    const ory = createOry({
      sdkUrl: "https://auth.example.net",
      project: {},
      fetchApi: jest
        .fn()
        .mockResolvedValue(
          Response.json(
            { error: { id: "session_inactive", message: "No active session" } },
            { status: 401 },
          ),
        ),
    })

    await expect(
      ory.getSession({
        request: new Request("https://docs.example.com"),
      }),
    ).resolves.toBeNull()
  })

  it("does not disguise upstream failures as anonymous sessions", async () => {
    const ory = createOry({
      sdkUrl: "https://auth.example.net",
      project: {},
      fetchApi: jest
        .fn()
        .mockResolvedValue(
          Response.json({ error: "unavailable" }, { status: 503 }),
        ),
    })

    await expect(
      ory.getSession({ request: new Request("https://docs.example.com") }),
    ).rejects.toMatchObject({ response: { status: 503 } })
  })
})

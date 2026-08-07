// SPDX-License-Identifier: Apache-2.0

import { createOry } from "./index"

describe("flow errors", () => {
  it("returns OAuth errors supplied in the callback query", async () => {
    const ory = createOry({
      sdkUrl: "https://auth.example.net",
      project: {},
    })

    await expect(
      ory.getError({
        params: {
          error: "access_denied",
          error_description: "The user denied the request.",
        },
      }),
    ).resolves.toEqual({
      error: "access_denied",
      error_description: "The user denied the request.",
    })
  })

  it("loads an Ory flow error by id", async () => {
    const fetchApi = jest.fn().mockResolvedValue(
      Response.json({
        id: "error-123",
        error: { message: "The flow expired" },
      }),
    )
    const ory = createOry({
      sdkUrl: "https://auth.example.net",
      project: {},
      fetchApi,
    })

    await expect(
      ory.getError({ params: { id: "error-123" } }),
    ).resolves.toEqual({
      id: "error-123",
      error: { message: "The flow expired" },
    })
    expect(fetchApi).toHaveBeenCalledWith(
      "https://auth.example.net/self-service/errors?id=error-123",
      expect.any(Object),
    )
  })

  it("returns a stable unknown error when no error id is present", async () => {
    const ory = createOry({
      sdkUrl: "https://auth.example.net",
      project: {},
    })

    await expect(ory.getError({ params: {} })).resolves.toEqual({
      error: "unknown_error",
      error_description: "An unknown error occurred.",
    })
  })
})

// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowError } from "@ory/client-fetch"
import { getError, resolveError } from "./error"

describe("resolveError", () => {
  const opts = { baseUrl: "https://example.com" }
  const fetchFlowError = jest.fn()

  beforeEach(() => {
    fetchFlowError.mockReset()
  })

  test("returns error and error_description from the query", async () => {
    expect(
      await resolveError(
        {
          error: "access_denied",
          error_description: "The user denied the request.",
        },
        fetchFlowError,
        opts,
      ),
    ).toEqual({
      ory_base_url: "https://example.com",
      error: "access_denied",
      error_description: "The user denied the request.",
    })
    expect(fetchFlowError).not.toHaveBeenCalled()
  })

  test("returns a default error_description when not provided", async () => {
    expect(
      await resolveError({ error: "access_denied" }, fetchFlowError, opts),
    ).toEqual({
      ory_base_url: "https://example.com",
      error: "access_denied",
      error_description: "An unknown error occurred.",
    })
  })

  test.each([{}, { id: "" }])(
    "returns unknown_error for the query %j",
    async (query) => {
      expect(await resolveError(query, fetchFlowError, opts)).toEqual({
        ory_base_url: "https://example.com",
        error: "unknown_error",
        error_description: "An unknown error occurred.",
      })
      expect(fetchFlowError).not.toHaveBeenCalled()
    },
  )

  test("fetches the flow error by ID", async () => {
    const flowError: FlowError = {
      id: "err-1234",
      error: { message: "Something went wrong" },
    }
    fetchFlowError.mockResolvedValue(flowError)

    expect(
      await resolveError({ id: "err-1234" }, fetchFlowError, opts),
    ).toEqual({
      ...flowError,
      ory_base_url: "https://example.com",
    })
    expect(fetchFlowError).toHaveBeenCalledWith({ id: "err-1234" })
  })

  test("returns the message of an Error thrown while fetching", async () => {
    fetchFlowError.mockRejectedValue(new Error("Network failure"))

    expect(
      await resolveError({ id: "err-1234" }, fetchFlowError, opts),
    ).toEqual({
      ory_base_url: "https://example.com",
      error: "unknown_error",
      error_description: "Network failure",
    })
  })

  test("returns a default message for a non-Error thrown while fetching", async () => {
    fetchFlowError.mockRejectedValue("some string error")

    expect(
      await resolveError({ id: "err-1234" }, fetchFlowError, opts),
    ).toEqual({
      ory_base_url: "https://example.com",
      error: "unknown_error",
      error_description: "An unknown error occurred.",
    })
  })

  test("returns unknown_error when the fetch callback throws synchronously", async () => {
    fetchFlowError.mockImplementation(() => {
      throw new Error("no SDK URL")
    })

    expect(
      await resolveError({ id: "err-1234" }, fetchFlowError, opts),
    ).toEqual({
      ory_base_url: "https://example.com",
      error: "unknown_error",
      error_description: "no SDK URL",
    })
  })
})

describe("getError", () => {
  test("reads the error from the request URL", async () => {
    expect(
      await getError(
        new Request(
          "http://localhost/error?error=access_denied&error_description=Denied",
        ),
        { sdkUrl: "https://project.oryapis.com", baseUrl: "http://localhost" },
      ),
    ).toEqual({
      error: "access_denied",
      error_description: "Denied",
      ory_base_url: "http://localhost",
    })
  })

  test("fetches the flow error from the SDK URL", async () => {
    const flowError = { id: "err-1234", error: { message: "boom" } }
    const fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify(flowError), {
        headers: { "content-type": "application/json" },
      }),
    )
    global.fetch = fetch

    const result = await getError(
      { url: "http://localhost/error?id=err-1234", headers: new Headers() },
      { sdkUrl: "https://project.oryapis.com/", baseUrl: "http://localhost" },
    )

    expect(fetch.mock.calls[0][0]).toBe(
      "https://project.oryapis.com/self-service/errors?id=err-1234",
    )
    expect(result).toEqual({ ...flowError, ory_base_url: "http://localhost" })
  })
})

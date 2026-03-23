/* eslint-disable @typescript-eslint/unbound-method */
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowError } from "@ory/client-fetch"
import { getError } from "./error"
import { serverSideFrontendClient } from "./client"

jest.mock("./client", () => ({
  serverSideFrontendClient: jest.fn().mockReturnValue({
    getFlowError: jest.fn(),
  }),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

describe("getError", () => {
  describe("when search params contain an error", () => {
    test("returns error and error_description from query params", async () => {
      const searchParams = {
        error: "access_denied",
        error_description: "The user denied the request.",
      }

      const result = await getError(searchParams)

      expect(result).toEqual({
        error: "access_denied",
        error_description: "The user denied the request.",
      })
    })

    test("returns default error_description when not provided", async () => {
      const searchParams = {
        error: "access_denied",
      }

      const result = await getError(searchParams)

      expect(result).toEqual({
        error: "access_denied",
        error_description: "An unknown error occurred.",
      })
    })
  })

  describe("when search params do not contain an error or id", () => {
    test("returns unknown_error when params are empty", async () => {
      const searchParams = {}

      const result = await getError(searchParams)

      expect(result).toEqual({
        error: "unknown_error",
        error_description: "An unknown error occurred.",
      })
    })

    test("returns unknown_error when id is empty string", async () => {
      const searchParams = { id: "" }

      const result = await getError(searchParams)

      expect(result).toEqual({
        error: "unknown_error",
        error_description: "An unknown error occurred.",
      })
    })
  })

  describe("when search params contain an id", () => {
    test("fetches the flow error from the SDK", async () => {
      const flowError: FlowError = {
        id: "err-1234",
        error: { message: "Something went wrong" },
      }

      ;(serverSideFrontendClient().getFlowError as jest.Mock).mockResolvedValue(
        flowError,
      )

      const searchParams = { id: "err-1234" }

      const result = await getError(searchParams)

      expect(serverSideFrontendClient().getFlowError).toHaveBeenCalledWith({
        id: "err-1234",
      })
      expect(result).toEqual(flowError)
    })

    test("returns unknown_error with error message when SDK call throws an Error", async () => {
      ;(serverSideFrontendClient().getFlowError as jest.Mock).mockRejectedValue(
        new Error("Network failure"),
      )

      const searchParams = { id: "err-1234" }

      const result = await getError(searchParams)

      expect(result).toEqual({
        error: "unknown_error",
        error_description: "Network failure",
      })
    })

    test("returns unknown_error with default message when SDK call throws a non-Error", async () => {
      ;(serverSideFrontendClient().getFlowError as jest.Mock).mockRejectedValue(
        "some string error",
      )

      const searchParams = { id: "err-1234" }

      const result = await getError(searchParams)

      expect(result).toEqual({
        error: "unknown_error",
        error_description: "An unknown error occurred.",
      })
    })
  })

  describe("when searchParams is a promise", () => {
    test("resolves the promise and returns error from query params", async () => {
      const searchParams = Promise.resolve({
        error: "session_expired",
        error_description: "Your session has expired.",
      })

      const result = await getError(searchParams)

      expect(result).toEqual({
        error: "session_expired",
        error_description: "Your session has expired.",
      })
    })

    test("resolves the promise and fetches flow error by id", async () => {
      const flowError: FlowError = {
        id: "err-5678",
        error: { message: "Flow expired" },
      }

      ;(serverSideFrontendClient().getFlowError as jest.Mock).mockResolvedValue(
        flowError,
      )

      const searchParams = Promise.resolve({ id: "err-5678" })

      const result = await getError(searchParams)

      expect(serverSideFrontendClient().getFlowError).toHaveBeenCalledWith({
        id: "err-5678",
      })
      expect(result).toEqual(flowError)
    })

    test("resolves the promise and returns unknown_error when empty", async () => {
      const searchParams = Promise.resolve({})

      const result = await getError(searchParams)

      expect(result).toEqual({
        error: "unknown_error",
        error_description: "An unknown error occurred.",
      })
    })
  })
})

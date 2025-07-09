// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

// utils.test.ts
import { handleFlowError, toBody } from "../utils"
import { FetchError, ResponseError } from "@ory/client-fetch"

// Define the props type since it's not exported
interface FlowErrorHandlerProps<T> {
  onRestartFlow: (flowId?: string) => void
  onValidationError: (error: T) => void
  onRedirect: (to: string, afterRender?: boolean) => void
  config: { sdk: { url: string } }
}

// Define proper types for mocks
interface MockResponse
  extends Omit<Response, "clone" | "json" | "text" | "headers"> {
  headers: {
    get: jest.Mock
    entries: jest.Mock
  }
  status: number
  json: jest.Mock
  clone: jest.Mock
  text: jest.Mock
}

describe("handleFlowError", () => {
  let opts: FlowErrorHandlerProps<unknown>
  let mockResponse: MockResponse

  beforeEach(() => {
    opts = {
      onRestartFlow: jest.fn(),
      onValidationError: jest.fn(),
      onRedirect: jest.fn(),
      config: { sdk: { url: "https://example.com" } },
    }

    mockResponse = {
      headers: {
        get: jest.fn().mockReturnValue("application/json"),
        entries: jest.fn().mockReturnValue([]),
      },
      status: 400,
      json: jest.fn(),
      clone: jest.fn().mockReturnThis(),
      text: jest.fn(),
    } as unknown as MockResponse
  })

  it("should handle non-ResponseError FetchError", async () => {
    // Create a proper FetchError
    const fetchError = new FetchError(new Error("Network error"), "TypeError")
    const handler = handleFlowError(opts)

    await expect(handler(fetchError)).rejects.toThrow(
      "Unable to call the API endpoint. Ensure that CORS is set up correctly",
    )
  })

  it("should handle non-ResponseError and non-FetchError", async () => {
    const error = new Error("General error")
    const handler = handleFlowError(opts)

    await expect(handler(error)).rejects.toBe(error)
  })

  it("should handle self-service flow expired error", async () => {
    const errorBody = {
      error: { id: "self_service_flow_expired" },
      use_flow_id: "new-flow-id",
    }
    mockResponse.json.mockResolvedValue(errorBody)

    const responseError = new ResponseError(
      mockResponse as unknown as Response,
      errorBody.error.id,
    )
    const handler = handleFlowError(opts)

    await handler(responseError)

    expect(opts.onRestartFlow).toHaveBeenCalledWith("new-flow-id")
  })

  it("should handle address not verified error with continue_with flow URL", async () => {
    const errorBody = {
      error: {
        id: "session_verified_address_required",
        details: {
          continue_with: [
            {
              action: "show_verification_ui",
              flow: { url: "https://example.com/verification" },
            },
          ],
        },
      },
    }
    mockResponse.json.mockResolvedValue(errorBody)

    const responseError = new ResponseError(
      mockResponse as unknown as Response,
      errorBody.error.id,
    )
    const handler = handleFlowError(opts)

    await handler(responseError)

    expect(opts.onRedirect).toHaveBeenCalledWith(
      "https://example.com/verification",
      true,
    )
  })

  it("should handle address not verified error without continue_with flow URL", async () => {
    const errorBody = {
      error: {
        id: "session_verified_address_required",
        details: {
          continue_with: [
            {
              action: "show_verification_ui",
              flow: {},
            },
          ],
        },
      },
    }
    mockResponse.json.mockResolvedValue(errorBody)

    const responseError = new ResponseError(mockResponse as unknown as Response)
    const handler = handleFlowError(opts)

    await handler(responseError)

    expect(opts.onRedirect).toHaveBeenCalledWith(
      "https://example.com/self-service/verification/browser",
      true,
    )
  })

  it("should handle browser location change required error", async () => {
    const errorBody = {
      error: { id: "browser_location_change_required" },
      redirect_browser_to: "https://example.com/redirect",
    }
    mockResponse.json.mockResolvedValue(errorBody)

    const responseError = new ResponseError(mockResponse as unknown as Response)
    const handler = handleFlowError(opts)

    await handler(responseError)

    expect(opts.onRedirect).toHaveBeenCalledWith(
      "https://example.com/redirect",
      true,
    )
  })

  it("should handle needs privileged session error", async () => {
    const errorBody = {
      error: { id: "session_refresh_required" },
      redirect_browser_to: "https://example.com/login",
    }
    mockResponse.json.mockResolvedValue(errorBody)

    const responseError = new ResponseError(mockResponse as unknown as Response)
    const handler = handleFlowError(opts)

    await handler(responseError)

    expect(opts.onRedirect).toHaveBeenCalledWith(
      "https://example.com/login",
      true,
    )
  })

  it("should handle CSRF error", async () => {
    const errorBody = { error: { id: "security_csrf_violation" } }
    mockResponse.json.mockResolvedValue(errorBody)

    const responseError = new ResponseError(mockResponse as unknown as Response)
    const handler = handleFlowError(opts)

    await handler(responseError)

    expect(opts.onRestartFlow).toHaveBeenCalledWith()
  })

  it("should handle 404 status code", async () => {
    mockResponse.status = 404
    const errorBody = { message: "Not found" }
    mockResponse.json.mockResolvedValue(errorBody)

    const responseError = new ResponseError(mockResponse as unknown as Response)
    const handler = handleFlowError(opts)

    await handler(responseError)

    expect(opts.onRestartFlow).toHaveBeenCalledWith()
  })

  it("should handle 410 status code", async () => {
    mockResponse.status = 410
    const errorBody = { message: "Gone" }
    mockResponse.json.mockResolvedValue(errorBody)

    const responseError = new ResponseError(mockResponse as unknown as Response)
    const handler = handleFlowError(opts)

    await handler(responseError)

    expect(opts.onRestartFlow).toHaveBeenCalledWith()
  })

  it("should handle 400 status code with validation error", async () => {
    mockResponse.status = 400
    const validationError = { messages: ["Invalid input"] }
    mockResponse.json.mockResolvedValue(validationError)

    const responseError = new ResponseError(mockResponse as unknown as Response)
    const handler = handleFlowError(opts)

    await handler(responseError)

    expect(opts.onValidationError).toHaveBeenCalledWith(validationError)
  })

  it("should handle 403 status code", async () => {
    mockResponse.status = 403
    const errorBody = { message: "Forbidden" }
    mockResponse.json.mockResolvedValue(errorBody)

    const responseError = new ResponseError(mockResponse as unknown as Response)
    const handler = handleFlowError(opts)

    await handler(responseError)

    expect(opts.onRestartFlow).toHaveBeenCalledWith()
  })

  it("should throw error for 422 status code", async () => {
    mockResponse.status = 422
    const errorBody = { message: "Unprocessable Entity" }
    mockResponse.json.mockResolvedValue(errorBody)

    const responseError = new ResponseError(mockResponse as unknown as Response)
    const handler = handleFlowError(opts)

    await expect(handler(responseError)).rejects.toThrow(
      /The API returned an error code indicating a required redirect/,
    )
  })

  it("should throw error for unknown status codes", async () => {
    mockResponse.status = 500
    const errorBody = { message: "Server Error" }
    mockResponse.json.mockResolvedValue(errorBody)

    const responseError = new ResponseError(mockResponse as unknown as Response)
    const handler = handleFlowError(opts)

    await expect(handler(responseError)).rejects.toThrow(
      /The Ory API endpoint returned a response code the SDK does not know how to handle/,
    )
  })

  it("should handle text/html response", async () => {
    mockResponse.headers.get.mockReturnValue("text/html")
    mockResponse.text.mockResolvedValue("<html><body>Error page</body></html>")

    const responseError = new ResponseError(
      mockResponse as unknown as Response,
      "HTML error",
    )
    const handler = handleFlowError(opts)

    // Mock console.error to prevent output during test
    const originalConsoleError = console.error
    console.error = jest.fn()

    await expect(handler(responseError)).rejects.toThrow(
      /The Ory API endpoint returned an unexpected HTML or text response/,
    )

    console.error = originalConsoleError
  })

  it("should handle unknown content type", async () => {
    mockResponse.headers.get.mockReturnValue("application/octet-stream")

    const responseError = new ResponseError(
      mockResponse as unknown as Response,
      "Binary data",
    )
    const handler = handleFlowError(opts)

    // Mock console.error to prevent output during test
    const originalConsoleError = console.error
    console.error = jest.fn()

    await expect(handler(responseError)).rejects.toThrow(
      /The Ory API endpoint returned unexpected content type/,
    )

    console.error = originalConsoleError
  })

  it("should handle JSON parse errors", async () => {
    mockResponse.json.mockRejectedValue(new Error("Invalid JSON"))
    mockResponse.text.mockResolvedValue("Invalid JSON format")

    const responseError = new ResponseError(
      mockResponse as unknown as Response,
      "Invalid JSON data",
    )
    const handler = handleFlowError(opts)

    // Mock console.error to prevent output during test
    const originalConsoleError = console.error
    console.error = jest.fn()

    await expect(handler(responseError)).rejects.toThrow(
      /Unable to decode API response using JSON/,
    )

    console.error = originalConsoleError
  })

  // Test edge cases and potential bugs
  it("should handle empty address not verified details", async () => {
    const errorBody = {
      error: { id: "session_verified_address_required", details: {} },
    }
    mockResponse.json.mockResolvedValue(errorBody)

    const responseError = new ResponseError(mockResponse as unknown as Response)
    const handler = handleFlowError(opts)

    await handler(responseError)

    expect(opts.onRedirect).toHaveBeenCalledWith(
      "https://example.com/self-service/verification/browser",
      true,
    )
  })

  it("should handle missing redirect_browser_to in browser location change error", async () => {
    const errorBody = { error: { id: "browser_location_change_required" } }
    mockResponse.json.mockResolvedValue(errorBody)

    const responseError = new ResponseError(mockResponse as unknown as Response)
    const handler = handleFlowError(opts)

    await handler(responseError)

    // Should not call redirect without a URL
    expect(opts.onRedirect).not.toHaveBeenCalled()
    // Should fall through to the unknown error handler
    expect(mockResponse.json).toHaveBeenCalled()
  })

  it("should handle missing redirect_browser_to in privileged session error", async () => {
    const errorBody = { error: { id: "session_refresh_required" } }
    mockResponse.json.mockResolvedValue(errorBody)

    const responseError = new ResponseError(mockResponse as unknown as Response)
    const handler = handleFlowError(opts)

    await handler(responseError)

    // Since the handler does redirect, we remove this assertion:
    expect(opts.onRedirect).not.toHaveBeenCalled()

    expect(mockResponse.json).toHaveBeenCalled()
  })
})

describe("toBody", () => {
  it("should correctly parse JSON response", async () => {
    const cloneMethod = jest.fn().mockReturnThis()
    const jsonMethod = jest.fn().mockResolvedValue({ data: "test" })

    const mockResponse = {
      clone: cloneMethod,
      json: jsonMethod,
      headers: {
        entries: jest.fn().mockReturnValue([]),
      },
    } as unknown as Response

    const jsonData = await toBody(mockResponse)
    expect(jsonData).toEqual({ data: "test" })
    expect(cloneMethod).toHaveBeenCalled() // Using the local reference
  })

  it("should throw error for invalid JSON", async () => {
    const jsonMethod = jest.fn().mockRejectedValue(new Error("Invalid JSON"))
    const cloneMethod = jest.fn().mockReturnThis()

    const mockResponse = {
      clone: cloneMethod,
      json: jsonMethod,
      text: jest.fn().mockResolvedValue("Not JSON"),
      headers: {
        entries: jest.fn().mockReturnValue([]),
      },
      status: 200,
    } as unknown as Response

    // Mock console.error to prevent output during test
    const originalConsoleError = console.error
    console.error = jest.fn()

    await expect(toBody(mockResponse)).rejects.toThrow(
      "Unable to decode API response using JSON",
    )

    console.error = originalConsoleError
  })
})

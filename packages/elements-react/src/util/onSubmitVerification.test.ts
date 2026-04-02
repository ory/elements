// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, VerificationFlow } from "@ory/client-fetch"
import { OryElementsConfiguration } from "../context"
import { onSubmitVerification } from "./onSubmitVerification"
import { OrySuccessEvent, OryValidationErrorEvent } from "./events"
import { OryFlowContainer } from "./flowContainer"

beforeEach(() => {
  jest.clearAllMocks()
  console.warn = jest.fn()
  console.error = jest.fn()
})

const mockFlow: OryFlowContainer = {
  flowType: FlowType.Verification,
  flow: {
    id: "test-flow-id",
    ui: { action: "", method: "POST", nodes: [] },
  } as unknown as VerificationFlow,
}

const mockConfig = {
  sdk: {
    url: "http://localhost:4455",
    options: {},
    frontend: {
      updateVerificationFlowRaw: jest.fn(),
    },
  },
  project: {
    name: "test",
    login_ui_url: "http://localhost:4455/login",
    recovery_ui_url: "http://localhost:4455/recovery",
    registration_ui_url: "http://localhost:4455/registration",
    verification_ui_url: "http://localhost:4455/verification",
    recovery_enabled: true,
    registration_enabled: true,
    verification_enabled: true,
    default_redirect_url: "http://localhost:4455",
    error_ui_url: "http://localhost:4455/error",
    settings_ui_url: "http://localhost:4455/settings",
  },
}

describe("onSubmitVerification", () => {
  test("should fire verification success event on successful submission", async () => {
    const events: OrySuccessEvent[] = []
    const onSuccess = (event: OrySuccessEvent) => {
      events.push(event)
    }
    const onRedirect = jest.fn()
    const setFlowContainer = jest.fn()

    const successFlow = {
      id: "test-flow-id",
      state: "passed_challenge",
      ui: { action: "", method: "POST", nodes: [] },
    }

    mockConfig.sdk.frontend.updateVerificationFlowRaw.mockResolvedValue({
      value: () => Promise.resolve(successFlow),
    })

    await onSubmitVerification(
      mockFlow,
      mockConfig as unknown as OryElementsConfiguration,
      {
        body: { method: "code", code: "123456" } as any,
        onRedirect,
        setFlowContainer,
        onSuccess,
      },
    )

    expect(events).toHaveLength(1)
    expect(events[0]).toEqual({
      flowType: FlowType.Verification,
      method: "code",
      flow: successFlow,
    })
    expect(setFlowContainer).toHaveBeenCalled()
  })

  test("should fire validation error event on validation failure", async () => {
    const events: OryValidationErrorEvent[] = []
    const onValidationError = (event: OryValidationErrorEvent) => {
      events.push(event)
    }
    const onRedirect = jest.fn()
    const setFlowContainer = jest.fn()

    const errorFlow = {
      id: "test-flow-id",
      ui: {
        action: "",
        method: "POST",
        nodes: [
          {
            messages: [
              { id: 4000002, text: "Code is required", type: "error" },
            ],
            attributes: {},
            type: "input",
            group: "default",
          },
        ],
        messages: [{ id: 4000001, text: "Invalid code", type: "error" }],
      },
    }

    const mockResponse = {
      status: 400,
      json: () => Promise.resolve(errorFlow),
      clone: () => mockResponse,
      text: () => Promise.resolve(JSON.stringify(errorFlow)),
      headers: {
        get: (name: string) =>
          name === "content-type" ? "application/json" : null,
        entries: () => [["content-type", "application/json"]],
      },
    }
    const error = Object.assign(new Error("Validation error"), {
      name: "ResponseError",
      response: mockResponse,
    })

    mockConfig.sdk.frontend.updateVerificationFlowRaw.mockRejectedValue(error)

    await onSubmitVerification(
      mockFlow,
      mockConfig as unknown as OryElementsConfiguration,
      {
        body: { method: "code", code: "wrong" } as any,
        onRedirect,
        setFlowContainer,
        onValidationError,
      },
    )

    expect(events).toHaveLength(1)
    expect(events[0]).toEqual({
      flowType: FlowType.Verification,
      flow: errorFlow,
    })
    expect(setFlowContainer).toHaveBeenCalled()
  })

  test("should not fire validation error event on step transition without errors", async () => {
    const events: OryValidationErrorEvent[] = []
    const onValidationError = (event: OryValidationErrorEvent) => {
      events.push(event)
    }
    const onRedirect = jest.fn()
    const setFlowContainer = jest.fn()

    const stepTransitionFlow = {
      id: "test-flow-id",
      ui: {
        action: "",
        method: "POST",
        nodes: [
          {
            messages: [],
            attributes: {},
            type: "input",
            group: "default",
          },
        ],
        messages: [],
      },
    }

    const mockResponse = {
      status: 400,
      json: () => Promise.resolve(stepTransitionFlow),
      clone: () => mockResponse,
      text: () => Promise.resolve(JSON.stringify(stepTransitionFlow)),
      headers: {
        get: (name: string) =>
          name === "content-type" ? "application/json" : null,
        entries: () => [["content-type", "application/json"]],
      },
    }
    const error = Object.assign(new Error("Bad request"), {
      name: "ResponseError",
      response: mockResponse,
    })

    mockConfig.sdk.frontend.updateVerificationFlowRaw.mockRejectedValue(error)

    await onSubmitVerification(
      mockFlow,
      mockConfig as unknown as OryElementsConfiguration,
      {
        body: { method: "code", email: "user@example.com" } as any,
        onRedirect,
        setFlowContainer,
        onValidationError,
      },
    )

    expect(events).toHaveLength(0)
    expect(setFlowContainer).toHaveBeenCalled()
  })

  test("should await async onSuccess before setFlowContainer", async () => {
    const order: string[] = []
    const onSuccess = async () => {
      await new Promise((resolve) => setTimeout(resolve, 10))
      order.push("onSuccess")
    }
    const setFlowContainer = jest.fn().mockImplementation(() => {
      order.push("setFlowContainer")
    })
    const onRedirect = jest.fn()

    const successFlow = {
      id: "test-flow-id",
      state: "passed_challenge",
      ui: { action: "", method: "POST", nodes: [] },
    }

    mockConfig.sdk.frontend.updateVerificationFlowRaw.mockResolvedValue({
      value: () => Promise.resolve(successFlow),
    })

    await onSubmitVerification(
      mockFlow,
      mockConfig as unknown as OryElementsConfiguration,
      {
        body: { method: "code", code: "123456" } as any,
        onRedirect,
        setFlowContainer,
        onSuccess,
      },
    )

    expect(order).toEqual(["onSuccess", "setFlowContainer"])
  })

  test("should not throw when callbacks are omitted", async () => {
    const onRedirect = jest.fn()
    const setFlowContainer = jest.fn()

    const successFlow = {
      id: "test-flow-id",
      state: "passed_challenge",
      ui: { action: "", method: "POST", nodes: [] },
    }

    mockConfig.sdk.frontend.updateVerificationFlowRaw.mockResolvedValue({
      value: () => Promise.resolve(successFlow),
    })

    await expect(
      onSubmitVerification(
        mockFlow,
        mockConfig as unknown as OryElementsConfiguration,
        {
          body: { method: "code", code: "123456" } as any,
          onRedirect,
          setFlowContainer,
        },
      ),
    ).resolves.not.toThrow()
  })
})

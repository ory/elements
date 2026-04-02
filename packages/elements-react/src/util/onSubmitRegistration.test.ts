// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, RegistrationFlow } from "@ory/client-fetch"
import { OryElementsConfiguration } from "../context"
import { onSubmitRegistration } from "./onSubmitRegistration"
import { OrySuccessEvent, OryValidationErrorEvent } from "./events"
import { OryFlowContainer } from "./flowContainer"

beforeEach(() => {
  jest.clearAllMocks()
  console.warn = jest.fn()
  console.error = jest.fn()
})

const mockFlow: OryFlowContainer = {
  flowType: FlowType.Registration,
  flow: {
    id: "test-flow-id",
    ui: { action: "", method: "POST", nodes: [] },
  } as unknown as RegistrationFlow,
}

const mockConfig = {
  sdk: {
    url: "http://localhost:4455",
    options: {},
    frontend: {
      updateRegistrationFlowRaw: jest.fn(),
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

describe("onSubmitRegistration", () => {
  test("should fire registration success event before redirect on successful registration", async () => {
    const events: OrySuccessEvent[] = []
    const onSuccess = (event: OrySuccessEvent) => {
      events.push(event)
    }
    const onRedirect = jest.fn()
    const setFlowContainer = jest.fn()

    const mockIdentity = {
      id: "identity-id",
      schema_id: "default",
      schema_url: "",
      traits: {},
    }
    const mockSession = { id: "session-id", identity: mockIdentity }

    mockConfig.sdk.frontend.updateRegistrationFlowRaw.mockResolvedValue({
      value: () =>
        Promise.resolve({
          identity: mockIdentity,
          session: mockSession,
          continue_with: [
            {
              action: "redirect_browser_to",
              redirect_browser_to: "https://example.com/welcome",
            },
          ],
        }),
    })

    await onSubmitRegistration(
      mockFlow,
      mockConfig as unknown as OryElementsConfiguration,
      {
        body: {
          method: "password",
          traits: { email: "user@example.com" },
          password: "secret",
        } as any,
        onRedirect,
        setFlowContainer,
        onSuccess,
      },
    )

    expect(events).toHaveLength(1)
    expect(events[0]).toEqual({
      flowType: FlowType.Registration,
      method: "password",
      identity: mockIdentity,
      session: mockSession,
      flow: mockFlow.flow,
    })
    expect(onRedirect).toHaveBeenCalled()
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
              { id: 4000002, text: "Password too weak", type: "error" },
            ],
            attributes: {},
            type: "input",
            group: "default",
          },
        ],
        messages: [
          { id: 4000001, text: "Email already exists", type: "error" },
        ],
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

    mockConfig.sdk.frontend.updateRegistrationFlowRaw.mockRejectedValue(error)

    await onSubmitRegistration(
      mockFlow,
      mockConfig as unknown as OryElementsConfiguration,
      {
        body: {
          method: "password",
          traits: { email: "user@example.com" },
          password: "weak",
        } as any,
        onRedirect,
        setFlowContainer,
        onValidationError,
      },
    )

    expect(events).toHaveLength(1)
    expect(events[0]).toEqual({
      flowType: FlowType.Registration,
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

    mockConfig.sdk.frontend.updateRegistrationFlowRaw.mockRejectedValue(error)

    await onSubmitRegistration(
      mockFlow,
      mockConfig as unknown as OryElementsConfiguration,
      {
        body: {
          method: "password",
          traits: { email: "user@example.com" },
          password: "",
        } as any,
        onRedirect,
        setFlowContainer,
        onValidationError,
      },
    )

    expect(events).toHaveLength(0)
    expect(setFlowContainer).toHaveBeenCalled()
  })

  test("should await async onSuccess before redirect", async () => {
    const order: string[] = []
    const onSuccess = async () => {
      await new Promise((resolve) => setTimeout(resolve, 10))
      order.push("onSuccess")
    }
    const onRedirect = jest.fn().mockImplementation(() => {
      order.push("onRedirect")
    })
    const setFlowContainer = jest.fn()

    mockConfig.sdk.frontend.updateRegistrationFlowRaw.mockResolvedValue({
      value: () =>
        Promise.resolve({
          identity: { id: "i" },
          session: { id: "s" },
          continue_with: [
            {
              action: "redirect_browser_to",
              redirect_browser_to: "https://example.com/welcome",
            },
          ],
        }),
    })

    await onSubmitRegistration(
      mockFlow,
      mockConfig as unknown as OryElementsConfiguration,
      {
        body: {
          method: "password",
          traits: { email: "a@b.com" },
          password: "secret",
        } as any,
        onRedirect,
        setFlowContainer,
        onSuccess,
      },
    )

    expect(order).toEqual(["onSuccess", "onRedirect"])
  })

  test("should not throw when callbacks are omitted", async () => {
    const onRedirect = jest.fn()
    const setFlowContainer = jest.fn()

    mockConfig.sdk.frontend.updateRegistrationFlowRaw.mockResolvedValue({
      value: () =>
        Promise.resolve({
          identity: { id: "i" },
          session: { id: "s" },
          continue_with: [
            {
              action: "redirect_browser_to",
              redirect_browser_to: "https://example.com/welcome",
            },
          ],
        }),
    })

    await expect(
      onSubmitRegistration(
        mockFlow,
        mockConfig as unknown as OryElementsConfiguration,
        {
          body: {
            method: "password",
            traits: { email: "a@b.com" },
            password: "secret",
          } as any,
          onRedirect,
          setFlowContainer,
        },
      ),
    ).resolves.not.toThrow()
  })
})

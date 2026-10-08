// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, LoginFlow } from "@ory/client-fetch"
import { OryElementsConfiguration } from "../context"
import { onSubmitLogin } from "./onSubmitLogin"
import { OrySuccessEvent, OryValidationErrorEvent } from "./events"
import { LoginFlowContainer } from "./flowContainer"
import { readLastIdentifier } from "./lastIdentifier"

beforeEach(() => {
  jest.clearAllMocks()
  window.sessionStorage.clear()
  console.warn = jest.fn()
  console.error = jest.fn()
})

afterEach(() => {
  jest.restoreAllMocks()
})

const mockFlow: LoginFlowContainer = {
  flowType: FlowType.Login,
  flow: {
    id: "test-flow-id",
    ui: { action: "", method: "POST", nodes: [] },
  } as unknown as LoginFlow,
}

const mockConfig = {
  sdk: {
    url: "http://localhost:4455",
    options: {},
    frontend: {
      updateLoginFlowRaw: jest.fn(),
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
} as unknown as OryElementsConfiguration

describe("onSubmitLogin", () => {
  test("should fire login success event before redirect on successful login", async () => {
    const events: OrySuccessEvent[] = []
    const onSuccess = (event: OrySuccessEvent) => {
      events.push(event)
    }
    const onRedirect = jest.fn()
    const setFlowContainer = jest.fn()

    const mockSession = {
      id: "session-id",
      identity: {
        id: "identity-id",
        schema_id: "default",
        schema_url: "",
        traits: {},
      },
    }

    jest
      .spyOn(await import("./client"), "frontendClient")
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .mockReturnValue({
        updateLoginFlowRaw: jest.fn().mockResolvedValue({
          value: () =>
            Promise.resolve({
              session: mockSession,
              continue_with: [
                {
                  action: "redirect_browser_to",
                  redirect_browser_to: "https://example.com/callback",
                },
              ],
            }),
        }),
      } as any)

    await onSubmitLogin(mockFlow, mockConfig, {
      body: {
        method: "password",
        identifier: "user@example.com",
        password: "secret",
      } as any,
      onRedirect,
      setFlowContainer,
      onSuccess,
    })

    expect(events).toHaveLength(1)
    expect(events[0]).toEqual({
      flowType: FlowType.Login,
      method: "password",
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
              { id: 4000002, text: "Field is required", type: "error" },
            ],
            attributes: {},
            type: "input",
            group: "default",
          },
        ],
        messages: [{ id: 4000001, text: "Invalid credentials", type: "error" }],
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

    jest
      .spyOn(await import("./client"), "frontendClient")
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .mockReturnValue({
        updateLoginFlowRaw: jest.fn().mockRejectedValue(error),
      } as any)

    await onSubmitLogin(mockFlow, mockConfig, {
      body: {
        method: "password",
        identifier: "user@example.com",
        password: "wrong",
      } as any,
      onRedirect,
      setFlowContainer,
      onValidationError,
    })

    expect(events).toHaveLength(1)
    expect(events[0]).toEqual({
      flowType: FlowType.Login,
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

    // A step-transition flow has no error messages — Kratos returns 400 but
    // the flow simply moved to the next step (e.g. identifier_first).
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

    jest
      .spyOn(await import("./client"), "frontendClient")
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .mockReturnValue({
        updateLoginFlowRaw: jest.fn().mockRejectedValue(error),
      } as any)

    await onSubmitLogin(mockFlow, mockConfig, {
      body: {
        method: "password",
        identifier: "user@example.com",
        password: "",
      } as any,
      onRedirect,
      setFlowContainer,
      onValidationError,
    })

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

    jest
      .spyOn(await import("./client"), "frontendClient")
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .mockReturnValue({
        updateLoginFlowRaw: jest.fn().mockResolvedValue({
          value: () =>
            Promise.resolve({
              session: { id: "s" },
              continue_with: [
                {
                  action: "redirect_browser_to",
                  redirect_browser_to: "https://example.com/callback",
                },
              ],
            }),
        }),
      } as any)

    await onSubmitLogin(mockFlow, mockConfig, {
      body: { method: "password", identifier: "a", password: "b" } as any,
      onRedirect,
      setFlowContainer,
      onSuccess,
    })

    expect(order).toEqual(["onSuccess", "onRedirect"])
  })

  test("should not throw when callbacks are omitted", async () => {
    const onRedirect = jest.fn()
    const setFlowContainer = jest.fn()

    jest
      .spyOn(await import("./client"), "frontendClient")
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .mockReturnValue({
        updateLoginFlowRaw: jest.fn().mockResolvedValue({
          value: () =>
            Promise.resolve({
              session: { id: "s" },
              continue_with: [
                {
                  action: "redirect_browser_to",
                  redirect_browser_to: "https://example.com/callback",
                },
              ],
            }),
        }),
      } as any)

    await expect(
      onSubmitLogin(mockFlow, mockConfig, {
        body: { method: "password", identifier: "a", password: "b" } as any,
        onRedirect,
        setFlowContainer,
      }),
    ).resolves.not.toThrow()
  })

  describe("last typed identifier", () => {
    async function submit(body: Record<string, unknown>) {
      jest
        .spyOn(await import("./client"), "frontendClient")
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        .mockReturnValue({
          updateLoginFlowRaw: jest.fn().mockResolvedValue({
            value: () => Promise.resolve({ continue_with: [] }),
          }),
        } as any)

      await onSubmitLogin(mockFlow, mockConfig, {
        body: body as any,
        onRedirect: jest.fn(),
        setFlowContainer: jest.fn(),
      })
    }

    test("should remember the identifier submitted in the identifier step", async () => {
      await submit({ method: "identifier_first", identifier: "a@example.com" })

      expect(readLastIdentifier()).toBe("a@example.com")
    })

    test("should overwrite the remembered identifier on the next identifier step", async () => {
      await submit({ method: "identifier_first", identifier: "a@example.com" })
      await submit({ method: "identifier_first", identifier: "b@example.com" })

      expect(readLastIdentifier()).toBe("b@example.com")
    })

    test("should remember the identifier even when the submission is rejected", async () => {
      jest
        .spyOn(await import("./client"), "frontendClient")
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        .mockReturnValue({
          updateLoginFlowRaw: jest.fn().mockRejectedValue(new Error("boom")),
        } as any)

      await onSubmitLogin(mockFlow, mockConfig, {
        body: {
          method: "identifier_first",
          identifier: "a@example.com",
        } as any,
        onRedirect: jest.fn(),
        setFlowContainer: jest.fn(),
      }).catch(() => undefined)

      expect(readLastIdentifier()).toBe("a@example.com")
    })

    const otherMethods = ["password", "code", "oidc", "passkey", "webauthn"]
    otherMethods.forEach((method) => {
      test(`should not remember the identifier of a ${method} submission`, async () => {
        await submit({ method, identifier: "a@example.com" })

        expect(readLastIdentifier()).toBeUndefined()
      })
    })

    test("should not remember anything when the identifier step carries no identifier", async () => {
      await submit({ method: "identifier_first" })

      expect(readLastIdentifier()).toBeUndefined()
    })
  })
})

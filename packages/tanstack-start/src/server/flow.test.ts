// SPDX-License-Identifier: Apache-2.0

import {
  type ApiResponse,
  FrontendApi,
  type LoginFlow,
} from "@ory/client-fetch"
import { isRedirect } from "@tanstack/react-router"
import { createOry } from "./index"

describe("login flows", () => {
  it("starts a cross-site browser flow through the application origin", async () => {
    const ory = createOry({
      sdkUrl: "https://auth.example.net",
      project: {
        login_ui_url: "/auth/login",
      },
    })

    try {
      await ory.getLoginFlow({
        request: new Request("https://docs.example.com/auth/login"),
        params: {},
      })
      throw new Error("Expected getLoginFlow to redirect")
    } catch (error) {
      expect(isRedirect(error)).toBe(true)
      expect(error).toBeInstanceOf(Response)
      expect((error as Response).status).toBe(303)
      expect((error as Response).headers.get("location")).toBe(
        "https://docs.example.com/self-service/login/browser",
      )
    }
  })

  it("fetches an existing flow with the request cookie and rewrites it for the browser", async () => {
    const fetchApi = jest.fn().mockResolvedValue(
      Response.json({
        expires_at: "2026-08-07T12:00:00Z",
        id: "flow-123",
        issued_at: "2026-08-07T11:00:00Z",
        request_url: "https://auth.example.net/self-service/login/browser",
        state: "choose_method",
        type: "browser",
        ui: {
          action: "https://auth.example.net/self-service/login?flow=flow-123",
          method: "POST",
          nodes: [],
        },
      }),
    )
    const ory = createOry({
      sdkUrl: "https://auth.example.net",
      project: { login_ui_url: "/auth/login" },
      fetchApi,
    })

    const flow = await ory.getLoginFlow({
      request: new Request(
        "https://docs.example.com/auth/login?flow=flow-123",
        {
          headers: { cookie: "ory_session=secret" },
        },
      ),
      params: { flow: "flow-123" },
    })

    expect(flow.id).toBe("flow-123")
    expect(flow.ui.action).toBe(
      "https://docs.example.com/self-service/login?flow=flow-123",
    )
    expect(fetchApi).toHaveBeenCalledWith(
      "https://auth.example.net/self-service/login/flows?id=flow-123",
      expect.objectContaining({
        headers: expect.objectContaining({ Cookie: "ory_session=secret" }),
      }),
    )
  })

  it("preserves schema input options through generated SDK parsing", async () => {
    const fetchApi = jest.fn().mockResolvedValue(
      Response.json({
        expires_at: "2026-08-07T12:00:00Z",
        id: "flow-123",
        issued_at: "2026-08-07T11:00:00Z",
        request_url: "https://auth.example.net/self-service/login/browser",
        state: "choose_method",
        type: "browser",
        ui: {
          action: "https://auth.example.net/self-service/login?flow=flow-123",
          method: "POST",
          messages: [],
          nodes: [
            {
              attributes: {
                name: "traits.country",
                node_type: "input",
                options: [{ value: "US" }, { value: "DE" }],
                type: "text",
              },
              group: "default",
              messages: [],
              meta: {},
              type: "input",
            },
          ],
        },
      }),
    )
    const ory = createOry({
      sdkUrl: "https://auth.example.net",
      project: { login_ui_url: "/auth/login" },
      fetchApi,
    })

    const flow = await ory.getLoginFlow({
      request: new Request("https://docs.example.com/auth/login"),
      params: { flow: "flow-123" },
    })

    expect(
      (flow.ui.nodes[0]?.attributes as unknown as Record<string, unknown>)[
        "options"
      ],
    ).toEqual([{ value: "US" }, { value: "DE" }])
  })

  it("recovers schema input options when SDK parsing drops them", async () => {
    const parsedFlow = {
      id: "flow-123",
      ui: {
        nodes: [
          {
            attributes: {
              name: "traits.country",
              node_type: "input",
              type: "text",
            },
          },
        ],
      },
    } as unknown as LoginFlow
    const rawFlow = {
      id: "flow-123",
      ui: {
        nodes: [
          {
            attributes: {
              name: "traits.country",
              node_type: "input",
              options: [{ value: "US" }, { value: "DE" }],
              type: "text",
            },
          },
        ],
      },
    }
    const getLoginFlowRaw = jest
      .spyOn(FrontendApi.prototype, "getLoginFlowRaw")
      .mockResolvedValue({
        raw: Response.json(rawFlow),
        value: jest.fn().mockResolvedValue(parsedFlow),
      } as unknown as ApiResponse<LoginFlow>)
    const ory = createOry({
      sdkUrl: "https://auth.example.net",
      project: { login_ui_url: "/auth/login" },
    })

    try {
      const flow = await ory.getLoginFlow({
        request: new Request("https://docs.example.com/auth/login"),
        params: { flow: "flow-123" },
      })

      expect(
        (flow.ui.nodes[0]?.attributes as unknown as Record<string, unknown>)[
          "options"
        ],
      ).toEqual([{ value: "US" }, { value: "DE" }])
    } finally {
      getLoginFlowRaw.mockRestore()
    }
  })

  it("returns the parsed flow when a mocked SDK response has no raw body", async () => {
    const parsedFlow = {
      id: "flow-123",
      ui: { nodes: [] },
    } as unknown as LoginFlow
    const getLoginFlowRaw = jest
      .spyOn(FrontendApi.prototype, "getLoginFlowRaw")
      .mockResolvedValue({
        value: jest.fn().mockResolvedValue(parsedFlow),
      } as unknown as ApiResponse<LoginFlow>)
    const ory = createOry({
      sdkUrl: "https://auth.example.net",
      project: { login_ui_url: "/auth/login" },
    })

    try {
      const flow = await ory.getLoginFlow({
        request: new Request("https://docs.example.com/auth/login"),
        params: { flow: "flow-123" },
      })

      expect(flow).toEqual(parsedFlow)
    } finally {
      getLoginFlowRaw.mockRestore()
    }
  })

  it("matches recovered options by node name instead of node position", async () => {
    const parsedFlow = {
      id: "flow-123",
      ui: {
        nodes: [
          { attributes: { name: "traits.country", node_type: "input" } },
          { attributes: { name: "traits.email", node_type: "input" } },
        ],
      },
    } as unknown as LoginFlow
    const rawFlow = {
      id: "flow-123",
      ui: {
        nodes: [
          { attributes: { name: "traits.email", node_type: "input" } },
          {
            attributes: {
              name: "traits.country",
              node_type: "input",
              options: [{ value: "US" }, { value: "DE" }],
            },
          },
        ],
      },
    }
    const getLoginFlowRaw = jest
      .spyOn(FrontendApi.prototype, "getLoginFlowRaw")
      .mockResolvedValue({
        raw: Response.json(rawFlow),
        value: jest.fn().mockResolvedValue(parsedFlow),
      } as unknown as ApiResponse<LoginFlow>)
    const ory = createOry({
      sdkUrl: "https://auth.example.net",
      project: { login_ui_url: "/auth/login" },
    })

    try {
      const flow = await ory.getLoginFlow({
        request: new Request("https://docs.example.com/auth/login"),
        params: { flow: "flow-123" },
      })
      const country = flow.ui.nodes[0]?.attributes as unknown as Record<
        string,
        unknown
      >
      const email = flow.ui.nodes[1]?.attributes as unknown as Record<
        string,
        unknown
      >

      expect(country["options"]).toEqual([{ value: "US" }, { value: "DE" }])
      expect(email).not.toHaveProperty("options")
    } finally {
      getLoginFlowRaw.mockRestore()
    }
  })

  it("does not recover malformed input options", async () => {
    const parsedFlow = {
      id: "flow-123",
      ui: {
        nodes: [{ attributes: { name: "traits.country", node_type: "input" } }],
      },
    } as unknown as LoginFlow
    const rawFlow = {
      id: "flow-123",
      ui: {
        nodes: [
          {
            attributes: {
              name: "traits.country",
              node_type: "input",
              options: ["US", null, 42],
            },
          },
        ],
      },
    }
    const getLoginFlowRaw = jest
      .spyOn(FrontendApi.prototype, "getLoginFlowRaw")
      .mockResolvedValue({
        raw: Response.json(rawFlow),
        value: jest.fn().mockResolvedValue(parsedFlow),
      } as unknown as ApiResponse<LoginFlow>)
    const ory = createOry({
      sdkUrl: "https://auth.example.net",
      project: { login_ui_url: "/auth/login" },
    })

    try {
      const flow = await ory.getLoginFlow({
        request: new Request("https://docs.example.com/auth/login"),
        params: { flow: "flow-123" },
      })

      expect(flow.ui.nodes[0]?.attributes).not.toHaveProperty("options")
    } finally {
      getLoginFlowRaw.mockRestore()
    }
  })

  it("keeps the parsed flow and warns when the raw body is unreadable", async () => {
    const parsedFlow = {
      id: "flow-123",
      ui: { nodes: [] },
    } as unknown as LoginFlow
    const getLoginFlowRaw = jest
      .spyOn(FrontendApi.prototype, "getLoginFlowRaw")
      .mockResolvedValue({
        raw: {
          clone: () => ({
            json: jest.fn().mockRejectedValue(new Error("not json")),
          }),
        },
        value: jest.fn().mockResolvedValue(parsedFlow),
      } as unknown as ApiResponse<LoginFlow>)
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {})
    const ory = createOry({
      sdkUrl: "https://auth.example.net",
      project: { login_ui_url: "/auth/login" },
    })

    try {
      const flow = await ory.getLoginFlow({
        request: new Request("https://docs.example.com/auth/login"),
        params: { flow: "flow-123" },
      })

      expect(flow).toEqual(parsedFlow)
      expect(warn).toHaveBeenCalled()
    } finally {
      warn.mockRestore()
      getLoginFlowRaw.mockRestore()
    }
  })

  it("recovers options when parsed and raw node counts differ", async () => {
    const parsedFlow = {
      id: "flow-123",
      ui: {
        nodes: [{ attributes: { name: "traits.country", node_type: "input" } }],
      },
    } as unknown as LoginFlow
    const rawFlow = {
      id: "flow-123",
      ui: {
        nodes: [
          { attributes: { name: "traits.email", node_type: "input" } },
          {
            attributes: {
              name: "traits.country",
              node_type: "input",
              options: [{ value: "US" }],
            },
          },
        ],
      },
    }
    const getLoginFlowRaw = jest
      .spyOn(FrontendApi.prototype, "getLoginFlowRaw")
      .mockResolvedValue({
        raw: Response.json(rawFlow),
        value: jest.fn().mockResolvedValue(parsedFlow),
      } as unknown as ApiResponse<LoginFlow>)
    const ory = createOry({
      sdkUrl: "https://auth.example.net",
      project: { login_ui_url: "/auth/login" },
    })

    try {
      const flow = await ory.getLoginFlow({
        request: new Request("https://docs.example.com/auth/login"),
        params: { flow: "flow-123" },
      })

      expect(
        (flow.ui.nodes[0]?.attributes as unknown as Record<string, unknown>)[
          "options"
        ],
      ).toEqual([{ value: "US" }])
    } finally {
      getLoginFlowRaw.mockRestore()
    }
  })

  it.each([
    ["getRegistrationFlow", "registration"],
    ["getRecoveryFlow", "recovery"],
    ["getVerificationFlow", "verification"],
    ["getSettingsFlow", "settings"],
  ] as const)("starts a %s browser flow", async (method, flowType) => {
    const ory = createOry({
      sdkUrl: "https://auth.example.net",
      project: {
        registration_ui_url: "/auth/registration",
        recovery_ui_url: "/auth/recovery",
        verification_ui_url: "/auth/verification",
        settings_ui_url: "/settings",
      },
    })

    try {
      await ory[method]({
        request: new Request(`https://docs.example.com/auth/${flowType}`),
        params: { return_to: "https://docs.example.com/docs" },
      })
      throw new Error(`Expected ${method} to redirect`)
    } catch (error) {
      expect(isRedirect(error)).toBe(true)
      expect((error as Response).headers.get("location")).toBe(
        `https://docs.example.com/self-service/${flowType}/browser?return_to=https%3A%2F%2Fdocs.example.com%2Fdocs`,
      )
    }
  })

  it("exposes the browser SDK URL selected for a request", () => {
    const ory = createOry({
      sdkUrl: "https://auth.example.com",
      project: {},
    })

    expect(
      ory.getBrowserSdkUrl({
        request: new Request("https://docs.example.com/auth/login"),
      }),
    ).toBe("https://auth.example.com")
    expect(
      ory.getBrowserSdkUrl({
        request: new Request("https://preview.vercel.app/auth/login"),
      }),
    ).toBe("https://preview.vercel.app")
  })

  it("restarts an expired flow with Ory's replacement flow id", async () => {
    const ory = createOry({
      sdkUrl: "https://auth.example.net",
      project: { login_ui_url: "/auth/login" },
      fetchApi: jest.fn().mockResolvedValue(
        Response.json(
          {
            error: { id: "self_service_flow_expired" },
            use_flow_id: "replacement-flow",
          },
          { status: 410 },
        ),
      ),
    })

    try {
      await ory.getLoginFlow({
        request: new Request("https://docs.example.com/auth/login"),
        params: {
          flow: "expired-flow",
          return_to: "https://docs.example.com/docs",
        },
      })
      throw new Error("Expected the expired flow to redirect")
    } catch (error) {
      expect(isRedirect(error)).toBe(true)
      expect((error as Response).headers.get("location")).toBe(
        "https://docs.example.com/auth/login?flow=replacement-flow&return_to=https%3A%2F%2Fdocs.example.com%2Fdocs",
      )
    }
  })

  it("can use a private server SDK URL without exposing it to the browser", async () => {
    const fetchApi = jest.fn().mockResolvedValue(
      Response.json({
        expires_at: "2026-08-07T12:00:00Z",
        id: "flow-123",
        issued_at: "2026-08-07T11:00:00Z",
        request_url: "https://auth.example.com/self-service/login/browser",
        state: "choose_method",
        type: "browser",
        ui: {
          action: "https://auth.example.com/self-service/login?flow=flow-123",
          method: "POST",
          nodes: [],
        },
      }),
    )
    const ory = createOry({
      sdkUrl: "https://auth.example.com",
      serverSdkUrl: "http://ory.internal:4433",
      project: { login_ui_url: "/auth/login" },
      fetchApi,
    })

    const flow = await ory.getLoginFlow({
      request: new Request("https://docs.example.com/auth/login"),
      params: { flow: "flow-123" },
    })

    expect(fetchApi.mock.calls[0]?.[0]).toBe(
      "http://ory.internal:4433/self-service/login/flows?id=flow-123",
    )
    expect(flow.ui.action).toBe(
      "https://auth.example.com/self-service/login?flow=flow-123",
    )
  })

  it("proxies when otherwise related origins use different schemes", () => {
    const ory = createOry({
      sdkUrl: "https://auth.example.com",
      project: {},
    })

    expect(
      ory.getBrowserSdkUrl({
        request: new Request("http://docs.example.com/auth/login"),
      }),
    ).toBe("http://docs.example.com")
  })
})

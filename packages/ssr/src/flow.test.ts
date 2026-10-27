// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  ApiResponse,
  FlowType,
  LoginFlow,
  ResponseError,
} from "@ory/client-fetch"
import { getFlow, resolveFlow } from "./flow"

const options = {
  baseUrl: "https://example.com",
  route: "/auth/login",
}

function parsedOnly<T>(value: T): () => Promise<ApiResponse<T>> {
  return () =>
    Promise.resolve({ value: () => Promise.resolve(value) } as ApiResponse<T>)
}

function withRawJson<T>(value: T, raw: Promise<unknown>) {
  return () =>
    Promise.resolve({
      raw: { clone: () => ({ json: () => raw }) },
      value: () => Promise.resolve(value),
    } as unknown as ApiResponse<T>)
}

function failingWith(status: number, body: unknown) {
  return () =>
    Promise.reject(
      new ResponseError(
        new Response(JSON.stringify(body), {
          status,
          headers: { "content-type": "application/json" },
        }),
      ),
    )
}

describe("resolveFlow", () => {
  test("restarts the flow when no flow ID is given", async () => {
    const fetchFlowRaw = jest.fn()

    expect(
      await resolveFlow(FlowType.Login, {}, fetchFlowRaw, options),
    ).toEqual({
      redirectTo: "https://example.com/self-service/login/browser?",
      restart: true,
    })
    expect(fetchFlowRaw).not.toHaveBeenCalled()
  })

  test("keeps the query parameters when restarting the flow", async () => {
    expect(
      await resolveFlow(
        FlowType.Settings,
        { refresh: "true", return_to: ["/a", "/b"] },
        jest.fn(),
        options,
      ),
    ).toEqual({
      redirectTo:
        "https://example.com/self-service/settings/browser?refresh=true&return_to=%2Fa&return_to=%2Fb",
      restart: true,
    })
  })

  test("returns the flow and applies the transform", async () => {
    const result = await resolveFlow(
      FlowType.Login,
      { flow: "1234" },
      parsedOnly({ id: "1234", url: "https://ory.sh/a", gone: undefined }),
      {
        ...options,
        transform: (flow) => ({ ...flow, url: flow.url.toUpperCase() }),
      },
    )

    expect(result).toEqual({
      flow: {
        id: "1234",
        url: "HTTPS://ORY.SH/A",
        gone: undefined,
        ory_base_url: "https://example.com",
      },
    })
  })

  test("returns the parsed flow without a transform", async () => {
    const flow = { id: "1234", gone: undefined }

    const result = await resolveFlow(
      FlowType.Login,
      { flow: "1234" },
      parsedOnly(flow),
      options,
    )

    expect(result).toEqual({
      flow: { ...flow, ory_base_url: "https://example.com" },
    })
  })

  test("attaches the base URL to the flow", async () => {
    const result = await resolveFlow(
      FlowType.Login,
      { flow: "1234" },
      parsedOnly({ id: "1234" }),
      options,
    )

    expect(result).toEqual({
      flow: { id: "1234", ory_base_url: "https://example.com" },
    })
  })

  describe("reattaching input options", () => {
    const node = (name: string, extra: object = {}) => ({
      attributes: { name, node_type: "input", type: "text", ...extra },
    })

    test("reattaches options stripped by the SDK FromJSON step", async () => {
      const parsed = {
        id: "1234",
        ui: { nodes: [node("traits.country"), node("traits.email")] },
      }
      const raw = {
        id: "1234",
        ui: {
          nodes: [
            node("traits.country", {
              options: [{ value: "US" }, { value: "DE" }],
            }),
            node("traits.email"),
          ],
        },
      }

      const result = await resolveFlow(
        FlowType.Registration,
        { flow: "1234" },
        withRawJson(parsed, Promise.resolve(raw)),
        options,
      )

      const nodes = ("flow" in result && result.flow?.ui.nodes) || []
      expect(nodes[0].attributes).toMatchObject({
        name: "traits.country",
        options: [{ value: "US" }, { value: "DE" }],
      })
      expect(nodes[1].attributes).not.toHaveProperty("options")
    })

    test("matches reattached options by node name, not position", async () => {
      const parsed = {
        id: "1234",
        ui: { nodes: [node("traits.country"), node("traits.email")] },
      }
      const raw = {
        id: "1234",
        ui: {
          nodes: [
            node("traits.email"),
            node("traits.country", { options: [{ value: "US" }] }),
          ],
        },
      }

      const result = await resolveFlow(
        FlowType.Registration,
        { flow: "1234" },
        withRawJson(parsed, Promise.resolve(raw)),
        options,
      )

      const nodes = ("flow" in result && result.flow?.ui.nodes) || []
      expect(nodes[0].attributes).toMatchObject({
        name: "traits.country",
        options: [{ value: "US" }],
      })
      expect(nodes[1].attributes).not.toHaveProperty("options")
    })

    test("drops raw options with non-object entries", async () => {
      const parsed = { id: "1234", ui: { nodes: [node("traits.country")] } }
      const raw = {
        id: "1234",
        ui: {
          nodes: [node("traits.country", { options: ["US", null, 42] })],
        },
      }

      const result = await resolveFlow(
        FlowType.Registration,
        { flow: "1234" },
        withRawJson(parsed, Promise.resolve(raw)),
        options,
      )

      const nodes = ("flow" in result && result.flow?.ui.nodes) || []
      expect(nodes[0].attributes).not.toHaveProperty("options")
    })

    test("reports a raw body that cannot be read and returns the parsed flow", async () => {
      const parsed = { id: "1234", ui: { nodes: [node("traits.country")] } }
      const onRawResponseError = jest.fn()
      const error = new Error("not json")

      const result = await resolveFlow(
        FlowType.Registration,
        { flow: "1234" },
        withRawJson(parsed, Promise.reject(error)),
        { ...options, onRawResponseError },
      )

      expect(result).toEqual({
        flow: { ...parsed, ory_base_url: "https://example.com" },
      })
      expect(onRawResponseError).toHaveBeenCalledWith(error)
    })

    test("warns about a raw body that cannot be read by default", async () => {
      const warn = jest.spyOn(console, "warn").mockImplementation(() => {})
      try {
        await resolveFlow(
          FlowType.Registration,
          { flow: "1234" },
          withRawJson({ id: "1234" }, Promise.reject(new Error("not json"))),
          options,
        )

        expect(warn).toHaveBeenCalledWith(
          expect.stringMatching(/^\[@ory\/ssr\] Failed to read the raw flow/),
          expect.any(Error),
        )
      } finally {
        warn.mockRestore()
      }
    })
  })

  describe("when fetching the flow fails", () => {
    test("restarts the flow when it does not exist", async () => {
      expect(
        await resolveFlow(
          FlowType.Login,
          { flow: "1234", return_to: "/done" },
          failingWith(404, { error: { id: "not_found", code: 404 } }),
          options,
        ),
      ).toEqual({
        redirectTo:
          "https://example.com/self-service/login/browser?flow=1234&return_to=%2Fdone",
        restart: true,
      })
    })

    test("continues with the replacement flow when the flow expired", async () => {
      expect(
        await resolveFlow(
          FlowType.Login,
          { flow: "1234", return_to: "/done" },
          failingWith(410, {
            error: { id: "self_service_flow_expired", code: 410 },
            use_flow_id: "5678",
          }),
          options,
        ),
      ).toEqual({
        redirectTo:
          "https://example.com/auth/login?flow=5678&return_to=%2Fdone",
        restart: true,
      })
    })

    test("redirects where Ory sends the browser", async () => {
      expect(
        await resolveFlow(
          FlowType.Settings,
          { flow: "1234" },
          failingWith(403, {
            error: { id: "browser_location_change_required", code: 422 },
            redirect_browser_to: "https://example.com/auth/login?refresh=true",
          }),
          options,
        ),
      ).toEqual({
        redirectTo: "https://example.com/auth/login?refresh=true",
        restart: false,
      })
    })

    test("returns the body of a validation error as the flow", async () => {
      const body = { id: "1234", ui: { messages: [{ id: 4000001 }] } }

      expect(
        await resolveFlow(
          FlowType.Login,
          { flow: "1234" },
          failingWith(400, body),
          options,
        ),
      ).toEqual({ flow: { ...body, ory_base_url: "https://example.com" } })
    })

    test("rethrows errors it cannot handle", async () => {
      const error = new Error("network down")

      await expect(
        resolveFlow(
          FlowType.Login,
          { flow: "1234" },
          () => Promise.reject(error),
          options,
        ),
      ).rejects.toBe(error)
    })
  })
})

describe("getFlow", () => {
  const sdkUrl = "https://project.oryapis.com/"
  const flow = {
    id: "1234",
    type: "browser",
    expires_at: "2026-01-01T00:00:00Z",
    issued_at: "2026-01-01T00:00:00Z",
    request_url: "https://project.oryapis.com/self-service/login/browser",
    state: "choose_method",
    ui: {
      action: "https://project.oryapis.com/self-service/login?flow=1234",
      method: "POST",
      nodes: [],
    },
  }

  function mockFetch(status: number, body: unknown) {
    const fetch = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify(body), {
          status,
          headers: { "content-type": "application/json" },
        }),
      ),
    )
    global.fetch = fetch
    return fetch
  }

  function request(path: string) {
    return new Request(`http://localhost:3000${path}`, {
      headers: { cookie: "csrf=abc" },
    })
  }

  test("fetches the flow with the request cookie and rewrites Ory URLs to the browser URL", async () => {
    const fetch = mockFetch(200, flow)

    const result = await getFlow(FlowType.Login, request("/login?flow=1234"), {
      sdkUrl,
      route: "/login",
      baseUrl: "http://localhost:3000",
    })

    const [url, init] = fetch.mock.calls[0] as [string, RequestInit]
    expect(url).toBe(
      "https://project.oryapis.com/self-service/login/flows?id=1234",
    )
    expect(new Headers(init.headers).get("cookie")).toBe("csrf=abc")
    expect(result).toMatchObject({
      flow: {
        id: "1234",
        ui: { action: "http://localhost:3000/self-service/login?flow=1234" },
        ory_base_url: "http://localhost:3000",
      },
    })
  })

  test("keeps the flow's dates as Date values", async () => {
    mockFetch(200, flow)

    const result = await getFlow<LoginFlow>(
      FlowType.Login,
      request("/login?flow=1234"),
      { sdkUrl, route: "/login", baseUrl: "http://localhost:3000" },
    )

    if (!("flow" in result)) {
      throw new Error("expected a flow")
    }
    const { expires_at, issued_at } = result.flow
    expect(expires_at).toBeInstanceOf(Date)
    expect(expires_at.getTime()).toBe(Date.parse(flow.expires_at))
    expect(issued_at).toBeInstanceOf(Date)
    expect(issued_at.getTime()).toBe(Date.parse(flow.issued_at))
  })

  test("keeps Ory URLs when the browser URL is the SDK URL", async () => {
    mockFetch(200, flow)

    const result = await getFlow(FlowType.Login, request("/login?flow=1234"), {
      sdkUrl,
      route: "/login",
      baseUrl: sdkUrl,
    })

    expect(result).toMatchObject({
      flow: { ui: { action: flow.ui.action } },
    })
  })

  test.each([
    [FlowType.Registration, "registration"],
    [FlowType.Recovery, "recovery"],
    [FlowType.Verification, "verification"],
    [FlowType.Settings, "settings"],
  ])("fetches a %s flow", async (flowType, path) => {
    const fetch = mockFetch(200, { ...flow, active: undefined })

    await getFlow(flowType, request("/page?flow=1234"), {
      sdkUrl,
      route: "/page",
      baseUrl: sdkUrl,
    })

    expect(fetch.mock.calls[0][0]).toBe(
      `https://project.oryapis.com/self-service/${path}/flows?id=1234`,
    )
  })

  test("returns a redirect to start a new flow", async () => {
    const fetch = mockFetch(200, flow)

    const result = await getFlow(
      FlowType.Login,
      request("/login?return_to=%2Fdone"),
      { sdkUrl, route: "/login", baseUrl: "http://localhost:3000/" },
    )

    expect(result).toEqual({
      redirectTo:
        "http://localhost:3000/self-service/login/browser?return_to=%2Fdone",
    })
    expect(fetch).not.toHaveBeenCalled()
  })

  test("returns a redirect to the replacement of an expired flow", async () => {
    mockFetch(410, {
      error: { id: "self_service_flow_expired", code: 410 },
      use_flow_id: "5678",
    })

    const result = await getFlow(FlowType.Login, request("/login?flow=1234"), {
      sdkUrl,
      route: "/login",
      baseUrl: "http://localhost:3000",
    })

    expect(result).toEqual({
      redirectTo: "http://localhost:3000/login?flow=5678",
    })
  })

  test("keeps repeated query parameters on the redirect to a replacement flow", async () => {
    mockFetch(410, {
      error: { id: "self_service_flow_expired", code: 410 },
      use_flow_id: "5678",
    })

    const result = await getFlow(
      FlowType.Login,
      request("/login?flow=1234&return_to=%2Fa&return_to=%2Fb"),
      { sdkUrl, route: "/login", baseUrl: "http://localhost:3000" },
    )

    expect(result).toEqual({
      redirectTo:
        "http://localhost:3000/login?flow=5678&return_to=%2Fa&return_to=%2Fb",
    })
  })

  test("redirects to the app's route for an expired flow when the browser URL is the SDK URL", async () => {
    mockFetch(410, {
      error: { id: "self_service_flow_expired", code: 410 },
      use_flow_id: "5678",
    })

    const result = await getFlow(FlowType.Login, request("/login?flow=1234"), {
      sdkUrl,
      route: "/login",
      baseUrl: sdkUrl,
    })

    expect(result).toEqual({
      redirectTo: "http://localhost:3000/login?flow=5678",
    })
  })

  test("rejects a flow type it cannot fetch", async () => {
    await expect(
      getFlow(FlowType.Error, request("/error?flow=1234"), {
        sdkUrl,
        route: "/error",
        baseUrl: sdkUrl,
      }),
    ).rejects.toThrow(/^\[@ory\/ssr\] /)
  })

  test("requires the browser URL", async () => {
    mockFetch(200, flow)

    await getFlow(
      FlowType.Login,
      request("/login?flow=1234"),
      // @ts-expect-error baseUrl is required.
      { sdkUrl, route: "/login" },
    ).catch(() => undefined)
  })
})

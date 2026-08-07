// SPDX-License-Identifier: Apache-2.0

import { createOryMiddleware, proxyRequest } from "./index"

jest.mock("@tanstack/react-start", () => ({
  createMiddleware: () => ({
    server: (server: unknown) => ({ options: { server } }),
  }),
}))

describe("Ory proxy", () => {
  it("proxies Ory JSON responses through the application origin", async () => {
    const fetchApi = jest.fn<typeof fetch>().mockResolvedValue(
      Response.json({
        action: "https://auth.example.net/self-service/login",
      }),
    )
    const response = await proxyRequest(
      new Request("http://localhost:3000/self-service/login?refresh=true", {
        headers: {
          cookie: "ory_session=secret",
          "x-custom-header": "forward-me",
        },
      }),
      {
        sdkUrl: "https://auth.example.net",
        project: {},
        fetchApi,
        forwardAdditionalHeaders: ["x-custom-header"],
      },
    )

    expect(response).toBeInstanceOf(Response)
    await expect(response?.json()).resolves.toEqual({
      action: "http://localhost:3000/self-service/login",
    })
    expect(fetchApi.mock.calls[0]?.[0]).toBe(
      "https://auth.example.net/self-service/login?refresh=true",
    )
    const capturedHeaders: unknown = fetchApi.mock.calls[0]?.[1]?.headers
    if (!(capturedHeaders instanceof Headers)) {
      throw new Error("Expected the proxied request headers to be Headers")
    }
    const upstreamHeaders = capturedHeaders
    expect(upstreamHeaders.get("x-custom-header")).toBe("forward-me")
    expect(upstreamHeaders.get("ory-base-url-rewrite")).toBe(
      "http://localhost:3000",
    )
  })

  it("rewrites Ory cookies for the application host and protocol", async () => {
    const response = await proxyRequest(
      new Request("http://localhost:3000/self-service/login"),
      {
        sdkUrl: "https://auth.example.net",
        project: {},
        fetchApi: jest.fn().mockResolvedValue(
          new Response(null, {
            headers: {
              "set-cookie":
                "ory_session=secret; Domain=auth.example.net; Path=/; HttpOnly; Secure",
            },
          }),
        ),
      },
    )

    expect(response?.headers.get("set-cookie")).toBe(
      "ory_session=secret; Domain=localhost; Path=/; HttpOnly",
    )
  })

  it("rewrites redirect locations to configured application routes", async () => {
    const response = await proxyRequest(
      new Request("https://docs.example.com/self-service/login"),
      {
        sdkUrl: "https://auth.example.net",
        project: { login_ui_url: "/auth/login" },
        fetchApi: jest.fn().mockResolvedValue(
          new Response(null, {
            status: 302,
            headers: {
              location: "https://auth.example.net/ui/login?flow=flow-123",
            },
          }),
        ),
      },
    )

    expect(response?.status).toBe(302)
    expect(response?.headers.get("location")).toBe(
      "https://docs.example.com/auth/login?flow=flow-123",
    )
  })

  it("rewrites app-origin welcome redirects emitted after Ory base URL rewriting", async () => {
    const response = await proxyRequest(
      new Request("http://localhost:3000/self-service/registration"),
      {
        sdkUrl: "https://auth.example.net",
        project: { default_redirect_url: "/" },
        fetchApi: jest.fn().mockResolvedValue(
          new Response(null, {
            status: 302,
            headers: {
              location: "http://localhost:3000/ui/welcome",
            },
          }),
        ),
      },
    )

    expect(response?.status).toBe(302)
    expect(response?.headers.get("location")).toBe("http://localhost:3000/")
  })

  it("redirects an incoming legacy welcome route without proxying it to Ory", async () => {
    const fetchApi = jest.fn().mockResolvedValue(
      Response.json(
        {
          error: {
            code: 403,
            status: "Forbidden",
            message:
              "Access credentials are not sufficient to access this resource",
          },
        },
        { status: 403 },
      ),
    )

    const response = await proxyRequest(
      new Request("http://localhost:3000/ui/welcome?from=aal2"),
      {
        sdkUrl: "https://auth.example.net",
        project: { default_redirect_url: "/" },
        fetchApi,
      },
    )

    expect(fetchApi).not.toHaveBeenCalled()
    expect(response?.status).toBe(302)
    expect(response?.headers.get("location")).toBe(
      "http://localhost:3000/?from=aal2",
    )
  })

  it("continues the TanStack request chain for non-Ory paths", async () => {
    const middleware = createOryMiddleware({
      sdkUrl: "https://auth.example.net",
      project: {},
    })
    const nextResult = {
      context: undefined,
      pathname: "/docs",
      request: new Request("https://docs.example.com/docs"),
      response: new Response("next"),
    }
    const next = jest.fn().mockResolvedValue(nextResult)

    const result = await middleware.options.server?.({
      request: nextResult.request,
      pathname: "/docs",
      context: undefined,
      handlerType: "router",
      next,
    })

    expect(next).toHaveBeenCalledTimes(1)
    expect(result).toBe(nextResult)
  })

  it("does not proxy application paths that merely share an Ory prefix", async () => {
    const fetchApi = jest.fn()

    await expect(
      proxyRequest(
        new Request("https://docs.example.com/self-service-worker.js"),
        {
          sdkUrl: "https://auth.example.net",
          project: {},
          fetchApi,
        },
      ),
    ).resolves.toBeUndefined()
    expect(fetchApi).not.toHaveBeenCalled()
  })

  it("applies configured UI routes inside JSON bodies", async () => {
    const response = await proxyRequest(
      new Request("https://docs.example.com/self-service/login"),
      {
        sdkUrl: "https://auth.example.net",
        project: { login_ui_url: "/auth/login" },
        fetchApi: jest.fn().mockResolvedValue(
          Response.json({
            redirect_browser_to:
              "https://auth.example.net/ui/login?flow=flow-123",
          }),
        ),
      },
    )

    await expect(response?.json()).resolves.toEqual({
      redirect_browser_to: "https://docs.example.com/auth/login?flow=flow-123",
    })
  })

  it("forwards request methods and bodies to Ory", async () => {
    const fetchApi = jest
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json({ ok: true }))
    await proxyRequest(
      new Request("https://docs.example.com/self-service/login?flow=flow-123", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ identifier: "person@example.com" }),
      }),
      {
        sdkUrl: "https://auth.example.net",
        project: {},
        fetchApi,
      },
    )

    const upstreamInit = fetchApi.mock.calls[0]?.[1]
    expect(upstreamInit?.method).toBe("POST")
    const upstreamBody = upstreamInit?.body
    expect(upstreamBody).toBeInstanceOf(ArrayBuffer)
    if (!(upstreamBody instanceof ArrayBuffer)) {
      throw new Error("Expected the proxied request body to be an ArrayBuffer")
    }
    expect(new TextDecoder().decode(upstreamBody)).toBe(
      JSON.stringify({ identifier: "person@example.com" }),
    )
  })

  it("normalizes explicitly forwarded header names", async () => {
    const fetchApi = jest
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json({ ok: true }))
    await proxyRequest(
      new Request("https://docs.example.com/self-service/login", {
        headers: { "x-request-id": "request-123" },
      }),
      {
        sdkUrl: "https://auth.example.net",
        project: {},
        fetchApi,
        forwardAdditionalHeaders: ["X-Request-ID"],
      },
    )

    const capturedHeaders: unknown = fetchApi.mock.calls[0]?.[1]?.headers
    if (!(capturedHeaders instanceof Headers)) {
      throw new Error("Expected the proxied request headers to be Headers")
    }
    expect(capturedHeaders.get("x-request-id")).toBe("request-123")
  })

  it("returns bodyless upstream responses without constructing an invalid response", async () => {
    const response = await proxyRequest(
      new Request("https://docs.example.com/self-service/logout"),
      {
        sdkUrl: "https://auth.example.net",
        project: {},
        fetchApi: jest
          .fn()
          .mockResolvedValue(new Response(null, { status: 204 })),
      },
    )

    expect(response?.status).toBe(204)
    await expect(response?.text()).resolves.toBe("")
  })

  it("proxies through a private server SDK URL", async () => {
    const fetchApi = jest.fn().mockResolvedValue(
      Response.json({
        action: "https://auth.example.com/self-service/login",
      }),
    )
    const response = await proxyRequest(
      new Request("https://preview.vercel.app/self-service/login"),
      {
        sdkUrl: "https://auth.example.com",
        serverSdkUrl: "http://ory.internal:4433",
        project: {},
        fetchApi,
      },
    )

    expect(fetchApi.mock.calls[0]?.[0]).toBe(
      "http://ory.internal:4433/self-service/login",
    )
    await expect(response?.json()).resolves.toEqual({
      action: "https://preview.vercel.app/self-service/login",
    })
  })
})

// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryMiddlewareOptions, proxyRequest } from "./middleware"
import { NextRequest, NextResponse } from "next/server"

function stringToReadableStream(input: string): ReadableStream<Uint8Array> {
  return new Blob([input]).stream()
}

// Mocking the NextURL class to simulate the behavior of nextUrl in NextRequest
class MockNextURL {
  public pathname
  public protocol
  public host
  public origin

  constructor(public url: string) {
    const parsed = new URL(url)
    this.pathname = parsed.pathname
    this.protocol = parsed.protocol
    this.host = parsed.host
    this.origin = parsed.origin
  }

  clone() {
    return new MockNextURL(this.url)
  }
}

// Updated createMockRequest function to use MockNextURL
const createMockRequest = (
  url: string,
  options: Partial<NextRequest> = {},
): NextRequest => {
  return {
    nextUrl: new MockNextURL(url) as unknown as NextRequest["nextUrl"], // Cast to NextRequest's nextUrl type
    method: options.method || "GET",
    headers: new Headers(options.headers || {}),
    arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
    ...options,
  } as NextRequest
}

const mockFetch = (responseInit: Partial<Response>) => {
  global.fetch = jest.fn().mockResolvedValue(
    new Response(responseInit.body || "", {
      headers: new Headers(responseInit.headers || {}),
      status: responseInit.status || 200,
    }),
  )
}

const createOptions = (): OryMiddlewareOptions => ({
  forwardAdditionalHeaders: ["x-custom-header"],
  project: {
    default_locale: "en",
    default_redirect_url: "/custom-redirect",
    error_ui_url: "/auth/error",
    locale_behavior: "force_default",
    name: "Ory Next.js App Router Example",
    registration_enabled: true,
    verification_enabled: true,
    recovery_enabled: true,
    registration_ui_url: "/auth/registration",
    verification_ui_url: "/auth/verification",
    recovery_ui_url: "/auth/recovery",
    login_ui_url: "/custom-login",
    settings_ui_url: "/auth/settings",
  },
})

function createMockLoginRequest(
  path: string = "/self-service/login",
  headers: HeadersInit = [],
  protocol: string = "http",
) {
  return createMockRequest(`${protocol}://localhost${path}`, {
    headers: new Headers({
      host: "localhost",
      ...headers,
    }),
  })
}

describe("proxyRequest", () => {
  beforeEach(() => {
    jest.resetAllMocks()
    process.env["NEXT_PUBLIC_ORY_SDK_URL"] =
      "https://playground.projects.oryapis.com"
    process.env["NODE_ENV"] = "development"
  })

  afterAll(() => {
    delete process.env["NEXT_PUBLIC_ORY_SDK_URL"]
    delete process.env["NODE_ENV"]
  })

  it("proxies a request and modifies the set-cookie header", async () => {
    const request = createMockLoginRequest()
    const upstreamResponseHeaders = new Headers({
      "set-cookie":
        "session=a; Domain=playground.projects.oryapis.com; Path=/; HttpOnly",
      "content-type": "application/json",
    })

    mockFetch({
      headers: upstreamResponseHeaders,
    })

    const response = await proxyRequest(request, createOptions())

    expect(response).toBeInstanceOf(NextResponse)
    expect(response?.headers.get("set-cookie")).toEqual(
      "session=a; Domain=localhost; Path=/; HttpOnly",
    )
    expect(response?.headers.get("content-type")).toBe("application/json")
  })

  it("proxies a request and modifies the JSON response", async () => {
    const request = createMockLoginRequest()
    const upstreamResponseHeaders = new Headers({
      "content-type": "application/json",
    })

    mockFetch({
      headers: upstreamResponseHeaders,
      body: stringToReadableStream(
        JSON.stringify({
          action: "https://playground.projects.oryapis.com/self-service/login",
        }),
      ),
    })

    const response = await proxyRequest(request, createOptions())

    expect(response).toBeInstanceOf(NextResponse)
    expect(response?.headers.get("content-type")).toBe("application/json")
    const body = await response?.text()
    expect(body).toEqual(
      JSON.stringify({
        action: "http://localhost/self-service/login",
      }),
    )
  })

  it("proxies a request and modifies the HTML", async () => {
    const request = createMockLoginRequest()

    mockFetch({
      headers: new Headers({
        "content-type": "text/html",
      }),
      body: stringToReadableStream(
        "<html><a href='https://playground.projects.oryapis.com/self-service/logout'>logout</a></html>",
      ),
    })

    const options = createOptions()
    const response = await proxyRequest(request, options)

    expect(response).toBeInstanceOf(NextResponse)
    expect(response?.headers.get("content-type")).toBe("text/html")
    const body = await response?.text()
    expect(body).toEqual(
      "<html><a href='http://localhost/self-service/logout'>logout</a></html>",
    )
  })

  it("modifies location header for redirects", async () => {
    const request = createMockLoginRequest()
    const upstreamResponseHeaders = new Headers({
      location: "https://playground.projects.oryapis.com/self-service/login",
    })

    mockFetch({
      headers: upstreamResponseHeaders,
      status: 302,
    })

    const response = await proxyRequest(request, createOptions())

    expect(response?.headers.get("location")).toBe(
      "http://localhost/self-service/login",
    )
    expect(response?.status).toBe(302)
  })

  it("modifies relative location header for redirects", async () => {
    const request = createMockLoginRequest()
    const upstreamResponseHeaders = new Headers({
      location: "/ui/welcome",
    })

    mockFetch({
      headers: upstreamResponseHeaders,
      status: 302,
    })

    const response = await proxyRequest(request, createOptions())

    expect(response?.headers.get("location")).toBe(
      "http://localhost/custom-redirect",
    )
    expect(response?.status).toBe(302)
  })

  const createTestCase = (
    part: "login" | "registration" | "recovery" | "verification" | "settings",
  ) => ({
    path: `/ui/${part}`,
    project: {
      [`${part}_ui_url`]: `/custom/${part}`,
    },
    expect: `/custom/${part}`,
  })

  it.each([
    createTestCase("login"),
    createTestCase("registration"),
    createTestCase("recovery"),
    createTestCase("verification"),
    createTestCase("settings"),
  ])(
    "modifies location header for redirects with custom ory elements page overrides $path",
    async ({ project, path, expect: expectUrl }) => {
      const request = createMockLoginRequest()
      const upstreamResponseHeaders = new Headers({
        location: "https://playground.projects.oryapis.com" + path,
      })

      mockFetch({
        headers: upstreamResponseHeaders,
        status: 302,
      })

      const response = await proxyRequest(request, {
        project,
      })

      expect(response?.headers.get("location")).toBe(
        "http://localhost" + expectUrl,
      )
      expect(response?.status).toBe(302)
    },
  )

  it("bypasses requests that do not match proxy paths", async () => {
    const request = createMockRequest("http://localhost/non-proxy-path")
    const body =
      "<html><a href='http://localhost/self-service/logout'>logout</a></html>"

    mockFetch({
      body: stringToReadableStream(body),
    })

    const response = await proxyRequest(request, createOptions())
    const got = await response?.text()
    expect(got).toEqual("")
  })

  it("preserves additional forwarded headers", async () => {
    const request = createMockLoginRequest(undefined, {
      "x-custom-header": "test-value",
      authorization: "Bearer token",
    })

    const fetch = jest.fn().mockResolvedValue(
      new Response(
        "https://playground.projects.oryapis.com/self-service/login",
        {
          status: 200,
        },
      ),
    )
    global.fetch = fetch

    const response = await proxyRequest(request, createOptions())

    expect(fetch).toHaveBeenCalled()
    const fetchArgs = fetch.mock.calls[0][1]

    expect(fetchArgs.headers.get("x-custom-header")).toBe("test-value")
    expect(fetchArgs.headers.get("authorization")).toBe("Bearer token")

    const body = await response?.text()
    expect(body).toEqual("http://localhost/self-service/login")
  })
})

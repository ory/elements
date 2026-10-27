// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  handleOryProxy,
  isOryProxyPath,
  OryProxyOptions,
  oryProxyPaths,
} from "./proxy"

const sdkUrl = "https://playground.projects.oryapis.com"

function stringToReadableStream(input: string): ReadableStream<Uint8Array> {
  return new Blob([input]).stream()
}

const mockFetch = (responseInit: {
  body?: ConstructorParameters<typeof Response>[0]
  headers?: ResponseInit["headers"]
  status?: number
}) => {
  const response = new Response(responseInit.body || "", {
    headers: new Headers(responseInit.headers || {}),
    status: responseInit.status || 200,
  })
  // Simulates the immutable headers of a fetch response.
  Object.defineProperty(response.headers, "append", { value: null })
  Object.defineProperty(response.headers, "set", { value: null })
  Object.defineProperty(response.headers, "delete", { value: null })
  const fetch = jest.fn().mockResolvedValue(response)
  global.fetch = fetch
  return fetch
}

const createOptions = (): OryProxyOptions => ({
  sdkUrl,
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

function createLoginRequest(
  path: string = "/self-service/login",
  headers: Record<string, string> = {},
  init: RequestInit = {},
) {
  return new Request(`http://localhost${path}`, {
    ...init,
    headers: new Headers({ host: "localhost", ...headers }),
  })
}

function upstreamRequest(fetch: jest.Mock): [string, RequestInit] {
  return fetch.mock.calls[0] as [string, RequestInit]
}

function upstreamHeaders(fetch: jest.Mock): Headers {
  return upstreamRequest(fetch)[1].headers as Headers
}

describe("handleOryProxy", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("proxies a request and modifies the set-cookie header", async () => {
    mockFetch({
      headers: {
        "set-cookie":
          "session=a; Domain=playground.projects.oryapis.com; Path=/; HttpOnly",
        "content-type": "application/json",
      },
    })

    const response = await handleOryProxy(createLoginRequest(), createOptions())

    expect(response).toBeInstanceOf(Response)
    expect(response?.headers.get("set-cookie")).toEqual(
      "session=a; Domain=localhost; Path=/; HttpOnly",
    )
    expect(response?.headers.get("content-type")).toBe("application/json")
  })

  it("keeps every Set-Cookie header", async () => {
    mockFetch({
      headers: [
        ["set-cookie", "a=1; Path=/; HttpOnly"],
        ["set-cookie", "b=2; Path=/; HttpOnly"],
      ],
    })

    const response = await handleOryProxy(createLoginRequest(), createOptions())

    expect(response?.headers.getSetCookie()).toEqual([
      "a=1; Domain=localhost; Path=/; HttpOnly",
      "b=2; Domain=localhost; Path=/; HttpOnly",
    ])
  })

  it("proxies a request and modifies the JSON response", async () => {
    mockFetch({
      headers: { "content-type": "application/json" },
      body: stringToReadableStream(
        JSON.stringify({
          action: "https://playground.projects.oryapis.com/self-service/login",
        }),
      ),
    })

    const response = await handleOryProxy(createLoginRequest(), createOptions())

    expect(response?.headers.get("content-type")).toBe("application/json")
    expect(await response?.text()).toEqual(
      JSON.stringify({
        action: "http://localhost/self-service/login",
      }),
    )
  })

  it("proxies a request and modifies the HTML", async () => {
    mockFetch({
      headers: { "content-type": "text/html" },
      body: stringToReadableStream(
        "<html><a href='https://playground.projects.oryapis.com/self-service/logout'>logout</a></html>",
      ),
    })

    const response = await handleOryProxy(createLoginRequest(), createOptions())

    expect(response?.headers.get("content-type")).toBe("text/html")
    expect(await response?.text()).toEqual(
      "<html><a href='http://localhost/self-service/logout'>logout</a></html>",
    )
  })

  it("rewrites URLs in a body with non-ASCII UTF-8 text", async () => {
    const body = JSON.stringify({
      text: "Grüße, 世界 😀",
      action: "https://playground.projects.oryapis.com/self-service/login",
    })
    mockFetch({
      headers: { "content-type": "application/json; charset=utf-8" },
      body: new TextEncoder().encode("﻿" + body),
    })

    const response = await handleOryProxy(createLoginRequest(), createOptions())

    const bytes = new Uint8Array(await response!.arrayBuffer())
    expect(Array.from(bytes.slice(0, 3))).toEqual([0xef, 0xbb, 0xbf])
    expect(new TextDecoder().decode(bytes)).toEqual(
      JSON.stringify({
        text: "Grüße, 世界 😀",
        action: "http://localhost/self-service/login",
      }),
    )
  })

  it("leaves a binary body byte-identical", async () => {
    const url = new TextEncoder().encode(sdkUrl)
    const bytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0xff, 0xc3, 0x28])
    const body = new Uint8Array(bytes.length + url.length)
    body.set(bytes)
    body.set(url, bytes.length)
    mockFetch({
      headers: { "content-type": "image/png" },
      body,
    })

    const response = await handleOryProxy(
      createLoginRequest("/.well-known/ory/logo.png"),
      createOptions(),
    )

    expect(new Uint8Array(await response!.arrayBuffer())).toEqual(body)
  })

  it("drops hop-by-hop and encoding headers from the response", async () => {
    mockFetch({
      headers: {
        "content-encoding": "gzip",
        "content-length": "12",
        "transfer-encoding": "chunked",
        "x-kept": "yes",
      },
    })

    const response = await handleOryProxy(createLoginRequest(), createOptions())

    expect(response?.headers.has("content-encoding")).toBe(false)
    expect(response?.headers.has("content-length")).toBe(false)
    expect(response?.headers.has("transfer-encoding")).toBe(false)
    expect(response?.headers.get("x-kept")).toBe("yes")
  })

  it.each([204, 205, 304])(
    "returns a response without a body for status %d",
    async (status) => {
      global.fetch = jest.fn().mockResolvedValue(
        new Response(null, {
          status,
          headers: { "content-type": "text/html", etag: '"abc"' },
        }),
      )

      const response = await handleOryProxy(
        createLoginRequest(),
        createOptions(),
      )

      expect(response?.status).toBe(status)
      expect(response?.body).toBeNull()
      expect(response?.headers.get("etag")).toBe('"abc"')
    },
  )

  it("modifies location header for redirects", async () => {
    mockFetch({
      headers: {
        location: "https://playground.projects.oryapis.com/self-service/login",
      },
      status: 302,
    })

    const response = await handleOryProxy(createLoginRequest(), createOptions())

    expect(response?.headers.get("location")).toBe(
      "http://localhost/self-service/login",
    )
    expect(response?.status).toBe(302)
  })

  it("modifies relative location header for redirects", async () => {
    mockFetch({
      headers: { location: "/ui/welcome" },
      status: 302,
    })

    const response = await handleOryProxy(createLoginRequest(), createOptions())

    expect(response?.headers.get("location")).toBe(
      "http://localhost/custom-redirect",
    )
    expect(response?.status).toBe(302)
  })

  it("rewrites the legacy ../self-service location", async () => {
    mockFetch({
      headers: { location: "../self-service/login/browser" },
      status: 303,
    })

    const response = await handleOryProxy(createLoginRequest(), createOptions())

    expect(response?.headers.get("location")).toBe(
      "http://localhost/self-service/login/browser",
    )
  })

  it("passes a location with a non-HTTP scheme through", async () => {
    mockFetch({
      headers: { location: "com.example.app://callback" },
      status: 303,
    })

    const response = await handleOryProxy(createLoginRequest(), createOptions())

    expect(response?.headers.get("location")).toBe("com.example.app://callback")
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
      mockFetch({
        headers: { location: sdkUrl + path },
        status: 302,
      })

      const response = await handleOryProxy(createLoginRequest(), {
        sdkUrl,
        project,
      })

      expect(response?.headers.get("location")).toBe(
        "http://localhost" + expectUrl,
      )
      expect(response?.status).toBe(302)
    },
  )

  it("returns null for requests that do not match proxy paths", async () => {
    const fetch = mockFetch({ body: "unused" })

    const response = await handleOryProxy(
      new Request("http://localhost/non-proxy-path", { method: "POST" }),
      createOptions(),
    )

    expect(response).toBeNull()
    expect(fetch).not.toHaveBeenCalled()
  })

  it.each(["/uifoo", "/.oryx", "/self-servicex", "/sessions/whoamix"])(
    "returns null for %s, which only shares a prefix with a proxy path",
    async (path) => {
      const fetch = mockFetch({ body: "unused" })

      const response = await handleOryProxy(
        new Request("http://localhost" + path),
        createOptions(),
      )

      expect(response).toBeNull()
      expect(fetch).not.toHaveBeenCalled()
    },
  )

  it("sends the request to the SDK URL with the original path and query", async () => {
    const fetch = mockFetch({})

    await handleOryProxy(
      createLoginRequest("/self-service/login/browser?return_to=%2Fdone"),
      { sdkUrl: "http://127.0.0.1:4433/" },
    )

    const [url, init] = upstreamRequest(fetch)
    expect(url).toBe(
      "http://127.0.0.1:4433/self-service/login/browser?return_to=%2Fdone",
    )
    expect(init.redirect).toBe("manual")
    expect(init.body).toBeNull()
    expect(upstreamHeaders(fetch).get("host")).toBe("127.0.0.1:4433")
    expect(upstreamHeaders(fetch).get("ory-no-custom-domain-redirect")).toBe(
      "true",
    )
  })

  it("forwards the request body", async () => {
    const fetch = mockFetch({})

    await handleOryProxy(
      createLoginRequest(
        "/self-service/login?flow=1",
        { "content-type": "application/json" },
        { method: "POST", body: '{"method":"password"}' },
      ),
      createOptions(),
    )

    const [, init] = upstreamRequest(fetch)
    expect(init.method).toBe("POST")
    expect(new TextDecoder().decode(init.body as ArrayBuffer)).toBe(
      '{"method":"password"}',
    )
  })

  describe("trustedOrigins", () => {
    it("signs the base URL rewrite when the request origin matches a string entry", async () => {
      const fetch = mockFetch({})

      await handleOryProxy(createLoginRequest(), {
        ...createOptions(),
        projectApiKey: "ory_pat_test",
        trustedOrigins: ["http://localhost"],
      })

      expect(upstreamHeaders(fetch).get("Ory-Base-URL-Rewrite")).toBe(
        "http://localhost",
      )
      expect(upstreamHeaders(fetch).get("Ory-Base-URL-Rewrite-Token")).toBe(
        "ory_pat_test",
      )
    })

    it("signs the base URL rewrite when the request origin matches a glob", async () => {
      const fetch = mockFetch({})

      await handleOryProxy(
        createLoginRequest(undefined, { host: "pr-7.preview.example.com" }),
        {
          ...createOptions(),
          trustedOrigins: ["http://pr-*.preview.example.com"],
        },
      )

      expect(upstreamHeaders(fetch).get("Ory-Base-URL-Rewrite")).toBe(
        "http://pr-7.preview.example.com",
      )
    })

    it.each([
      ["user info", "localhost@example.org"],
      ["a path", "example.org/?x=localhost"],
    ])("signs only valid origins, not a Host with %s", async (_name, host) => {
      const fetch = mockFetch({})

      await handleOryProxy(createLoginRequest(undefined, { host }), {
        ...createOptions(),
        projectApiKey: "ory_pat_test",
        trustedOrigins: ["http://localhost", "http://*.example.org"],
      })

      expect(upstreamHeaders(fetch).has("Ory-Base-URL-Rewrite")).toBe(false)
      expect(upstreamHeaders(fetch).has("Ory-Base-URL-Rewrite-Token")).toBe(
        false,
      )
    })

    it.each([[[]], [["localhost:3000"]], [["https://*.vercel.app"]]])(
      "throws for the trustedOrigins %j",
      async (trustedOrigins) => {
        mockFetch({})

        await expect(
          handleOryProxy(createLoginRequest(), {
            ...createOptions(),
            trustedOrigins,
          }),
        ).rejects.toThrow(/^\[@ory\/ssr\] /)
      },
    )

    it("omits both rewrite headers for an untrusted host but still rewrites the response for the requester", async () => {
      const fetch = mockFetch({
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "https://playground.projects.oryapis.com/self-service/login",
        }),
      })

      const response = await handleOryProxy(
        createLoginRequest(undefined, { host: "attacker.example" }),
        {
          ...createOptions(),
          projectApiKey: "ory_pat_test",
          trustedOrigins: ["http://localhost"],
        },
      )

      expect(fetch).toHaveBeenCalled()
      expect(upstreamHeaders(fetch).has("Ory-Base-URL-Rewrite")).toBe(false)
      expect(upstreamHeaders(fetch).has("Ory-Base-URL-Rewrite-Token")).toBe(
        false,
      )
      expect(await response?.text()).toEqual(
        JSON.stringify({
          action: "http://attacker.example/self-service/login",
        }),
      )
    })

    it("omits the rewrite headers when trustedOrigins is unset", async () => {
      const fetch = mockFetch({})

      await handleOryProxy(
        createLoginRequest(undefined, { host: "attacker.example" }),
        { ...createOptions(), projectApiKey: "ory_pat_test" },
      )

      expect(upstreamHeaders(fetch).has("Ory-Base-URL-Rewrite")).toBe(false)
      expect(upstreamHeaders(fetch).has("Ory-Base-URL-Rewrite-Token")).toBe(
        false,
      )
    })
  })

  it("forwards the origin and fetch metadata headers to the upstream request", async () => {
    const fetch = mockFetch({})

    await handleOryProxy(
      createLoginRequest("/self-service/login", {
        origin: "http://localhost",
        "sec-fetch-site": "same-origin",
        "sec-fetch-mode": "cors",
        "sec-fetch-dest": "empty",
        "sec-fetch-user": "?1",
        "sec-ch-ua": '"Chromium";v="130"',
      }),
      createOptions(),
    )

    const headers = upstreamHeaders(fetch)
    expect(headers.get("origin")).toBe("http://localhost")
    expect(headers.get("sec-fetch-site")).toBe("same-origin")
    expect(headers.get("sec-fetch-mode")).toBe("cors")
    expect(headers.get("sec-fetch-dest")).toBe("empty")
    expect(headers.get("sec-fetch-user")).toBe("?1")
    expect(headers.has("sec-ch-ua")).toBe(false)
  })

  it("preserves additional forwarded headers", async () => {
    const fetch = mockFetch({
      body: "https://playground.projects.oryapis.com/self-service/login",
    })

    const response = await handleOryProxy(
      createLoginRequest(undefined, {
        "x-custom-header": "test-value",
        authorization: "Bearer token",
      }),
      createOptions(),
    )

    expect(upstreamHeaders(fetch).get("x-custom-header")).toBe("test-value")
    expect(upstreamHeaders(fetch).get("authorization")).toBe("Bearer token")
    expect(await response?.text()).toEqual(
      "http://localhost/self-service/login",
    )
  })
})

describe("isOryProxyPath", () => {
  it("matches every path in oryProxyPaths", () => {
    expect(oryProxyPaths.length).toBeGreaterThan(0)
    for (const path of oryProxyPaths) {
      expect(isOryProxyPath(path)).toBe(true)
      expect(isOryProxyPath(path + "/x/y")).toBe(true)
    }
  })

  it.each([
    "/self-service/login/browser",
    "/sessions/whoami",
    "/ui/login",
    "/.well-known/ory/webauthn.js",
    "/.ory/proxy",
  ])("matches %s", (path) => {
    expect(isOryProxyPath(path)).toBe(true)
  })

  it.each([
    "/",
    "/login",
    "/api/self-service",
    "/sessions",
    "/uifoo",
    "/.oryx",
    "/self-servicex",
    "/sessions/whoamix",
  ])("does not match %s", (path) => {
    expect(isOryProxyPath(path)).toBe(false)
  })
})

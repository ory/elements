// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  oryBaseUrlWarning,
  resolveOryBaseUrl,
  type OryProxyState,
  type ResolveOryBaseUrlOptions,
} from "./ory-url"

const sdkUrl = "https://slug.projects.oryapis.com"

describe("resolveOryBaseUrl", () => {
  it.each<[string, ResolveOryBaseUrlOptions, string, string]>([
    [
      "equal hosts",
      {
        sdkUrl: "https://auth.example.com",
        origin: "https://auth.example.com",
        proxy: "absent",
      },
      "https://auth.example.com",
      "same-site",
    ],
    [
      "registrable-domain siblings",
      {
        sdkUrl: "https://auth.example.com",
        origin: "https://app.example.com",
        proxy: "absent",
      },
      "https://auth.example.com",
      "same-site",
    ],
    [
      "localhost with different ports",
      {
        sdkUrl: "http://localhost:4000",
        origin: "http://localhost:3000",
        proxy: "absent",
      },
      "http://localhost:4000",
      "same-site",
    ],
    [
      "same site with a trusted proxy",
      {
        sdkUrl: "https://auth.example.com",
        origin: "https://app.example.com",
        proxy: "trusted-origin",
      },
      "https://auth.example.com",
      "same-site",
    ],
    [
      "cross-site with a trusted proxy",
      { sdkUrl, origin: "http://localhost:3000", proxy: "trusted-origin" },
      "http://localhost:3000",
      "proxy",
    ],
    [
      "sibling vercel.app hosts with a trusted proxy",
      {
        sdkUrl: "https://ory.vercel.app",
        origin: "https://my-app-git-x-my-team.vercel.app",
        proxy: "trusted-origin",
      },
      "https://my-app-git-x-my-team.vercel.app",
      "proxy",
    ],
    [
      "IP hosts with a trusted proxy",
      { sdkUrl, origin: "http://127.0.0.1:3000", proxy: "trusted-origin" },
      "http://127.0.0.1:3000",
      "proxy",
    ],
    [
      "cross-site with a proxy for an untrusted origin",
      { sdkUrl, origin: "http://127.0.0.1:3000", proxy: "untrusted-origin" },
      sdkUrl,
      "proxy-untrusted-origin",
    ],
    [
      "cross-site without a proxy",
      { sdkUrl, origin: "http://localhost:3000", proxy: "absent" },
      sdkUrl,
      "cross-site-no-proxy",
    ],
    [
      "sibling vercel.app hosts without a proxy",
      {
        sdkUrl: "https://ory.vercel.app",
        origin: "https://my-app.vercel.app",
        proxy: "absent",
      },
      "https://ory.vercel.app",
      "cross-site-no-proxy",
    ],
    [
      "an origin with a path and a trusted proxy",
      {
        sdkUrl,
        origin: "http://example.org/?x=localhost:3000",
        proxy: "trusted-origin",
      },
      sdkUrl,
      "invalid-origin",
    ],
    [
      "an origin that does not parse",
      { sdkUrl, origin: "http://ex ample.com", proxy: "trusted-origin" },
      sdkUrl,
      "invalid-origin",
    ],
    [
      "trailing slashes",
      {
        sdkUrl: sdkUrl + "/",
        origin: "http://localhost:3000/",
        proxy: "trusted-origin",
      },
      "http://localhost:3000",
      "proxy",
    ],
    [
      "a trailing slash on the SDK URL",
      {
        sdkUrl: sdkUrl + "/",
        origin: "http://localhost:3000",
        proxy: "absent",
      },
      sdkUrl,
      "cross-site-no-proxy",
    ],
  ])("resolves %s", (_name, opts, url, reason) => {
    expect(resolveOryBaseUrl(opts)).toEqual({ url, reason })
  })

  it.each(["", "slug.projects.oryapis.com", "ftp://slug.projects.oryapis.com"])(
    "throws for the SDK URL %j",
    (value) => {
      expect(() =>
        resolveOryBaseUrl({
          sdkUrl: value,
          origin: "http://localhost:3000",
          proxy: "absent",
        }),
      ).toThrow(TypeError)
    },
  )

  it("prefixes the error for an invalid SDK URL", () => {
    expect(() =>
      resolveOryBaseUrl({
        sdkUrl: "not a url",
        origin: "http://localhost:3000",
        proxy: "absent",
      }),
    ).toThrow(/^\[@ory\/ssr\] /)
  })
})

describe("oryBaseUrlWarning", () => {
  const warningFor = (origin: string, proxy: OryProxyState) => {
    const opts = { sdkUrl, origin, proxy }
    return oryBaseUrlWarning(resolveOryBaseUrl(opts), opts)
  }

  it.each<[string, OryProxyState]>([
    ["http://localhost:3000", "trusted-origin"],
    [sdkUrl, "absent"],
  ])("returns null for %s with proxy %s", (origin, proxy) => {
    expect(warningFor(origin, proxy)).toBeNull()
  })

  it("explains a cross-site origin without a proxy", () => {
    expect(warningFor("http://localhost:3000", "absent")).toMatchSnapshot()
  })

  it("explains a proxied origin that is not trusted", () => {
    expect(
      warningFor("http://127.0.0.1:3000", "untrusted-origin"),
    ).toMatchSnapshot()
  })

  it("explains an invalid origin", () => {
    expect(warningFor("http://ex ample.com", "absent")).toMatchSnapshot()
  })

  it.each<[string, OryProxyState]>([
    ["http://localhost:3000", "absent"],
    ["http://127.0.0.1:3000", "untrusted-origin"],
    ["http://ex ample.com", "absent"],
  ])("links the configuration docs for %s", (origin, proxy) => {
    expect(warningFor(origin, proxy)).toMatch(
      / See https:\/\/www\.ory\.com\/docs\/elements\/guides\/configuration#base-url$/,
    )
  })

  it("does not add a package prefix", () => {
    expect(warningFor("http://localhost:3000", "absent")).not.toMatch(/^\[/)
  })
})

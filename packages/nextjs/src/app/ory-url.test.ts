// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

jest.mock("next/headers", () => ({
  headers: jest.fn(),
}))

type OryUrlModule = typeof import("./ory-url")

// Each test loads a fresh module, so the warn-once state starts empty.
function load(init: Record<string, string>): OryUrlModule {
  let mod: OryUrlModule | undefined
  jest.isolateModules(() => {
    const { headers } = jest.requireMock<{ headers: jest.Mock }>("next/headers")
    headers.mockResolvedValue(new Headers(init))
    mod = jest.requireActual<OryUrlModule>("./ory-url")
  })
  return mod!
}

const sdkUrl = "https://slug.projects.oryapis.com"

describe("getOryBaseUrl", () => {
  const env = process.env
  let warn: jest.SpyInstance

  beforeEach(() => {
    process.env = { ...env, NEXT_PUBLIC_ORY_SDK_URL: sdkUrl + "/" }
    warn = jest.spyOn(console, "warn").mockImplementation(() => undefined)
  })

  afterEach(() => {
    warn.mockRestore()
    process.env = env
  })

  it("uses the request's origin when the middleware marked a trusted origin", async () => {
    const { getOryBaseUrl } = load({
      host: "localhost:3000",
      "x-ory-proxy": "1",
    })

    expect(await getOryBaseUrl()).toBe("http://localhost:3000")
    expect(warn).not.toHaveBeenCalled()
  })

  it("uses x-forwarded-proto for the scheme", async () => {
    const { getOryBaseUrl } = load({
      host: "my-app-git-x-my-team.vercel.app",
      "x-forwarded-proto": "https",
      "x-ory-proxy": "1",
    })

    expect(await getOryBaseUrl()).toBe(
      "https://my-app-git-x-my-team.vercel.app",
    )
  })

  it("uses the SDK URL on the same site, with or without the marker", async () => {
    process.env["NEXT_PUBLIC_ORY_SDK_URL"] = "https://auth.example.com"
    const { getOryBaseUrl } = load({
      host: "app.example.com",
      "x-forwarded-proto": "https",
      "x-ory-proxy": "1",
    })

    expect(await getOryBaseUrl()).toBe("https://auth.example.com")
    expect(warn).not.toHaveBeenCalled()
  })

  it("uses the SDK URL and warns once without the marker", async () => {
    const { getOryBaseUrl } = load({ host: "localhost:3000" })

    expect(await getOryBaseUrl()).toBe(sdkUrl)
    await getOryBaseUrl()

    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith(
      expect.stringMatching(
        /^\[@ory\/nextjs\] The app \(http:\/\/localhost:3000\) and Ory .* See https:\/\/www\.ory\.com\/docs\/elements\/guides\/configuration#base-url$/,
      ),
    )
  })

  it("uses the SDK URL and warns when the middleware marked an untrusted origin", async () => {
    const { getOryBaseUrl } = load({
      host: "127.0.0.1:3000",
      "x-ory-proxy": "untrusted-origin",
    })

    expect(await getOryBaseUrl()).toBe(sdkUrl)
    expect(warn).toHaveBeenCalledWith(
      expect.stringMatching(/^\[@ory\/nextjs\] The Ory proxy handled/),
    )
  })

  it.each(["true", "yes", ""])(
    "treats the marker value %j as absent",
    async (value) => {
      const { getOryBaseUrl } = load({
        host: "localhost:3000",
        "x-ory-proxy": value,
      })

      expect(await getOryBaseUrl()).toBe(sdkUrl)
      expect(warn).toHaveBeenCalledWith(
        expect.stringMatching(/^\[@ory\/nextjs\] The app /),
      )
    },
  )

  it.each<[string, Record<string, string>]>([
    ["no Host header", {}],
    ["a Host header with user info", { host: "localhost:3000@example.org" }],
    [
      "a scheme list",
      { host: "localhost:3000", "x-forwarded-proto": "https,http" },
    ],
  ])("uses the SDK URL and warns for %s", async (_name, init) => {
    const { getOryBaseUrl } = load({ ...init, "x-ory-proxy": "1" })

    expect(await getOryBaseUrl()).toBe(sdkUrl)
    expect(warn).toHaveBeenCalledWith(
      expect.stringMatching(/^\[@ory\/nextjs\] The request's `Host` header/),
    )
  })
})

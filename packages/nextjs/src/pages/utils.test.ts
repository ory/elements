// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType } from "@ory/client-fetch"

import { browserOryUrl, toBrowserEndpointRedirect } from "./utils"

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}))

describe("browserOryUrl", () => {
  const env = process.env
  const originalWindow = global.window

  function visit(origin: string) {
    global.window = { location: { origin } } as Window & typeof globalThis
  }

  beforeEach(() => {
    process.env = { ...env }
    delete process.env["NEXT_PUBLIC_ORY_SDK_URL"]
    delete process.env["VERCEL_ENV"]
    delete process.env["VERCEL_URL"]
  })

  afterEach(() => {
    process.env = env
    global.window = originalWindow
  })

  it("uses the SDK URL on the same site", () => {
    process.env["NEXT_PUBLIC_ORY_SDK_URL"] = "https://auth.example.com/"
    visit("https://app.example.com")

    expect(browserOryUrl()).toBe("https://auth.example.com")
  })

  it("uses the page's origin on a different site", () => {
    process.env["NEXT_PUBLIC_ORY_SDK_URL"] = "https://slug.projects.oryapis.com"
    visit("https://my-app-git-x-my-team.vercel.app")

    expect(browserOryUrl()).toBe("https://my-app-git-x-my-team.vercel.app")
  })

  it("uses the page's origin in production on a different site", () => {
    process.env["NEXT_PUBLIC_ORY_SDK_URL"] = "https://slug.projects.oryapis.com"
    process.env["NODE_ENV"] = "production"
    process.env["VERCEL_ENV"] = "production"
    visit("http://localhost:3000")

    expect(browserOryUrl()).toBe("http://localhost:3000")
  })

  it("uses the page's origin without NEXT_PUBLIC_ORY_SDK_URL", () => {
    process.env["VERCEL_ENV"] = "preview"
    process.env["VERCEL_URL"] = "other.vercel.app"
    visit("http://localhost:3000")

    expect(browserOryUrl()).toBe("http://localhost:3000")
  })

  it("builds the browser endpoint of a flow on that URL", () => {
    process.env["NEXT_PUBLIC_ORY_SDK_URL"] = "https://slug.projects.oryapis.com"
    visit("http://localhost:3000")

    expect(
      toBrowserEndpointRedirect(
        new URLSearchParams({ return_to: "/done" }),
        FlowType.Login,
      ),
    ).toBe("http://localhost:3000/self-service/login/browser?return_to=%2Fdone")
  })
})

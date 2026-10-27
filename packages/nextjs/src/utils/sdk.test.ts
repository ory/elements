// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

// sdk.test.ts

import { orySdkUrl } from "./sdk"

describe("orySdkUrl", () => {
  beforeEach(() => {
    delete process.env["NEXT_PUBLIC_ORY_SDK_URL"]
    delete process.env["ORY_SDK_URL"]
  })

  it("should return NEXT_PUBLIC_ORY_SDK_URL without trailing slash", () => {
    process.env["NEXT_PUBLIC_ORY_SDK_URL"] = "https://example.com/"
    expect(orySdkUrl()).toBe("https://example.com")
  })

  it("should prioritize NEXT_PUBLIC_ORY_SDK_URL over ORY_SDK_URL", () => {
    process.env["NEXT_PUBLIC_ORY_SDK_URL"] = "https://next-public.com/"
    process.env["ORY_SDK_URL"] = "https://regular.com/"
    expect(orySdkUrl()).toBe("https://next-public.com")
  })

  it("should use ORY_SDK_URL when NEXT_PUBLIC_ORY_SDK_URL is not set", () => {
    process.env["ORY_SDK_URL"] = "https://regular.com/"
    expect(orySdkUrl()).toBe("https://regular.com")
  })

  it("should throw error when neither NEXT_PUBLIC_ORY_SDK_URL nor ORY_SDK_URL is set", () => {
    expect(() => orySdkUrl()).toThrow(
      "[@ory/nextjs] The Ory SDK URL is not set. Set the environment variable `NEXT_PUBLIC_ORY_SDK_URL` to the URL of your Ory project",
    )
  })
})

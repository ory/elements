// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryProxyOptions } from "./proxy"
import { rewriteUrls } from "./rewrite"

describe("rewriteUrls", () => {
  const config: Pick<OryProxyOptions, "project"> = {
    project: {
      recovery_ui_url: "/custom/recovery",
      registration_ui_url: "/custom/registration",
      login_ui_url: "/custom/login",
      verification_ui_url: "/custom/verification",
      settings_ui_url: "/custom/settings",
      error_ui_url: "/custom/error",
      default_locale: "en",
      default_redirect_url: "/",
      locale_behavior: "force_default",
      name: "Ory Next.js App Router Example",
      registration_enabled: true,
      verification_enabled: true,
      recovery_enabled: true,
    },
  }

  it("should rewrite URLs based on config overrides", () => {
    const source = "https://example.com/ui/login"
    const matchBaseUrl = "https://example.com"
    const selfUrl = "https://self.com"
    const result = rewriteUrls(source, matchBaseUrl, selfUrl, config)
    expect(result).toBe("https://self.com/custom/login")
  })

  it("should replace base URL with self URL", () => {
    const source = "https://example.com/some/path"
    const matchBaseUrl = "https://example.com"
    const selfUrl = "https://self.com"
    const result = rewriteUrls(source, matchBaseUrl, selfUrl, config)
    expect(result).toBe("https://self.com/some/path")
  })
})

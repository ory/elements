// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { OryConfig } from "../types"
import { isProduction } from "./sdk"

export function enhanceConfig(
  config: Partial<OryConfig>,
  forceSdkUrl?: string,
) {
  let sdkUrl =
    forceSdkUrl ??
    process.env["NEXT_PUBLIC_ORY_SDK_URL"] ??
    process.env["ORY_SDK_URL"]

  if (!forceSdkUrl && !isProduction()) {
    if (process.env["__NEXT_PRIVATE_ORIGIN"]) {
      sdkUrl = process.env["__NEXT_PRIVATE_ORIGIN"].replace(/\/$/, "")
    } else if (process.env["VERCEL_URL"]) {
      sdkUrl = `https://${process.env["VERCEL_URL"]}`.replace(/\/$/, "")
    } else if (typeof window !== "undefined") {
      sdkUrl = window.location.origin
    }
  }

  if (!sdkUrl) {
    throw new Error(
      "Unable to determine SDK URL. Please set NEXT_PUBLIC_ORY_SDK_URL and/or ORY_SDK_URL or force the SDK URL using `useOryConfig(config, 'https://my-ory-sdk-url.com')`.",
    )
  }

  return {
    name: config.override?.applicationName ?? "Default name",
    sdk: {
      url: sdkUrl,
    },
    project: {
      registration_enabled: true,
      verification_enabled: true,
      recovery_enabled: true,
      recovery_ui_url: config.override?.recoveryUiPath ?? "/ui/recovery",
      registration_ui_url:
        config.override?.registrationUiPath ?? "/ui/registration",
      verification_ui_url:
        config.override?.verificationUiPath ?? "/ui/verification",
      login_ui_url: config.override?.loginUiPath ?? "/ui/login",
    },
  }
}
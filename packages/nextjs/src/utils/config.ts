// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { AccountExperienceConfiguration } from "@ory/client-fetch"
import { OryConfig } from "../types"
import { isProduction } from "./sdk"

/**
 * Enhances the Ory config with defaults and SDK URL. The SDK URL is determined as follows:
 *
 * 1. If `forceSdkUrl` is provided, it is used.
 * 2. If `forceSdkUrl` is not provided, the following environment variables are checked:
 *   - `NEXT_PUBLIC_ORY_SDK_URL`
 *   - `ORY_SDK_URL`
 *   - `__NEXT_PRIVATE_ORIGIN` (if not in production)
 *   - `VERCEL_URL` (if not in production)
 *   - `window.location.origin` (if not in production)
 *   - If none of the above are set, an error is thrown.
 *
 * @param config - The Ory config to enhance
 * @param forceSdkUrl - An optional URL to override the SDK URL. If not provided, the SDK URL is determined as described above.
 * @public
 */
export function enhanceOryConfig(
  config: Partial<OryConfig>,
  forceSdkUrl?: string,
): OryConfigForNextJS {
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
      settings_ui_url: config.override?.settingsUiPath ?? "/ui/settings",
      default_redirect_url:
        config.override?.defaultRedirectUri ?? "/ui/welcome",
      error_ui_url: config.override?.errorUiPath ?? "/ui/error",
      name: config.override?.applicationName ?? "Default name",
    },
  }
}

export interface OryConfigForNextJS {
  /**
   * @deprecated use project.name instead
   */
  name: string
  sdk: {
    url: string
  }
  project: AccountExperienceConfiguration
}

// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { OryConfig } from "../types"
import { OryClientConfiguration } from "@ory/elements-react"
import { isProduction } from "../utils/sdk"
import { useOryConfig as baseUseOryConfig } from "../utils/config"

export function oryPageRouterConfig(
  config: Partial<OryConfig>,
  forceSdkUrl?: string,
): OryClientConfiguration {
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

  return baseUseOryConfig(sdkUrl, config)
}

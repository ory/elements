// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryClientConfiguration } from "./clientConfiguration"

/**
 * Returns the SDK configuration with its URL replaced by the URL a server-side
 * fetcher attached to the flow, error, or consent request as `ory_base_url`.
 */
export function withAttachedBaseUrl(
  sdk: OryClientConfiguration["sdk"],
  value: unknown,
): OryClientConfiguration["sdk"] {
  if (
    value &&
    typeof value === "object" &&
    "ory_base_url" in value &&
    typeof value.ory_base_url === "string" &&
    value.ory_base_url
  ) {
    return { ...sdk, url: value.ory_base_url }
  }
  return sdk
}

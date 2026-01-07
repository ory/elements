// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryClientConfiguration } from "@ory/elements-react"

/**
 * Returns a config with the logo overridden by the OAuth2 client logo if available.
 *
 * @param config - The original Ory client configuration
 * @param logoUrl - Optional OAuth2 client logo URL to override the default
 * @returns The config with logo_light_url overridden if logoUrl is provided
 */
export function getConfigWithOAuth2Logo(
  config: OryClientConfiguration,
  logoUrl: string | undefined,
): OryClientConfiguration {
  if (!logoUrl) {
    return config
  }

  return {
    ...config,
    project: {
      ...config.project,
      logo_light_url: logoUrl,
    },
  }
}

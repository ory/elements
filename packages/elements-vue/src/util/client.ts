// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  Configuration,
  ConfigurationParameters,
  FrontendApi,
} from "@ory/client-fetch"

/**
 * Creates a FrontendApi client with the given SDK URL and options.
 *
 * @param sdkUrl - The base URL of the Ory SDK
 * @param opts - Additional configuration options
 */
export function frontendClient(
  sdkUrl: string,
  opts: Partial<ConfigurationParameters> = {},
) {
  const config = new Configuration({
    ...opts,
    basePath: sdkUrl,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...opts.headers,
    },
  })
  return new FrontendApi(config)
}

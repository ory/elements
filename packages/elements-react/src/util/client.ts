// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  Configuration,
  ConfigurationParameters,
  FrontendApi,
} from "@ory/client-fetch"

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

// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Configuration, FrontendApi } from "@ory/client-fetch"

export function withoutTrailingSlash(url: string) {
  return url.replace(/\/$/, "")
}

export const frontendClient = (sdkUrl: string) =>
  new FrontendApi(
    new Configuration({
      headers: {
        Accept: "application/json",
      },
      basePath: withoutTrailingSlash(sdkUrl),
    }),
  )

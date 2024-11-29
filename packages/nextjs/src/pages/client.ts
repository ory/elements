// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { Configuration, FrontendApi } from "@ory/client-fetch"

import { guessPotentiallyProxiedOrySdkUrl } from "../utils/sdk"

export const clientSideFrontendClient = () =>
  new FrontendApi(
    new Configuration({
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
      basePath: guessPotentiallyProxiedOrySdkUrl({
        knownProxiedUrl: window.location.origin,
      }),
    }),
  )

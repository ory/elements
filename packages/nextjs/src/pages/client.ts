// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { Configuration, FrontendApi } from "@ory/client-fetch"

import { browserOryUrl } from "./utils"

export const clientSideFrontendClient = () =>
  new FrontendApi(
    new Configuration({
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
      basePath: browserOryUrl(),
    }),
  )

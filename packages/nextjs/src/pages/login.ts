// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { clientSideFrontendClient } from "./client"
import { createUseFlowFactory } from "./flow"
import { FlowType } from "@ory/client-fetch"

/**
 * A client side hook to create a login flow.
 *
 * @returns A login flow
 * @public
 * @function
 * @group Hooks
 */
export const useLoginFlow = createUseFlowFactory(
  FlowType.Login,
  (params: URLSearchParams) => {
    return clientSideFrontendClient().createBrowserLoginFlowRaw({
      refresh: params.get("refresh") === "true",
      aal: params.get("aal") ?? undefined,
      returnTo: params.get("return_to") ?? undefined,
      cookie: params.get("cookie") ?? undefined,
      loginChallenge: params.get("login_challenge") ?? undefined,
      organization: params.get("organization") ?? undefined,
      via: params.get("via") ?? undefined,
    })
  },
  (id) => clientSideFrontendClient().getLoginFlowRaw({ id }),
)

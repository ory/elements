// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { clientSideFrontendClient } from "./client"
import { createUseFlowFactory } from "./flow"
import { FlowType } from "@ory/client-fetch"

/**
 * A client side hook to create a recovery flow.
 *
 * @returns A recovery flow
 * @public
 * @function
 * @group Hooks
 */
export const useRecoveryFlow = createUseFlowFactory(
  FlowType.Recovery,
  (params: URLSearchParams) => {
    return clientSideFrontendClient().createBrowserRecoveryFlowRaw({
      returnTo: params.get("return_to") ?? undefined,
    })
  },
  (id) => clientSideFrontendClient().getRecoveryFlowRaw({ id }),
)

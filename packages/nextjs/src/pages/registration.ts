// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { clientSideFrontendClient } from "./client"
import { createUseFlowFactory } from "./flow"
import { FlowType } from "@ory/client-fetch"

/**
 * A client side hook to create a registration flow.
 *
 * @returns A registration flow
 * @public
 * @function
 * @group Hooks
 */
export const useRegistrationFlow = createUseFlowFactory(
  FlowType.Registration,
  (params: URLSearchParams) => {
    return clientSideFrontendClient().createBrowserRegistrationFlowRaw({
      returnTo: params.get("return_to") ?? undefined,
      loginChallenge: params.get("registration_challenge") ?? undefined,
      afterVerificationReturnTo:
        params.get("after_verification_return_to") ?? undefined,
      organization: params.get("organization") ?? undefined,
    })
  },
  (id) => clientSideFrontendClient().getRegistrationFlowRaw({ id }),
)

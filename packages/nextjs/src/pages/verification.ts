// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { clientSideFrontendClient } from "./client"
import { createUseFlowFactory } from "./flow"
import { FlowType } from "@ory/client-fetch"

export const useVerificationFlow = createUseFlowFactory(
  FlowType.Verification,
  (params: URLSearchParams) => {
    return clientSideFrontendClient().createBrowserVerificationFlowRaw({
      returnTo: params.get("return_to") ?? undefined,
    })
  },
  (id) => clientSideFrontendClient().getVerificationFlowRaw({ id }),
)

// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType } from "@ory/client-fetch"
import { createUseFlowFactory } from "./flow"
import { clientSideFrontendClient } from "./client"

export const useSettingsFlow = createUseFlowFactory(
  FlowType.Settings,
  (params: URLSearchParams) => {
    return clientSideFrontendClient().createBrowserSettingsFlowRaw({
      returnTo: params.get("return_to") ?? undefined,
      cookie: params.get("cookie") ?? undefined,
    })
  },
  (id) => clientSideFrontendClient().getSettingsFlowRaw({ id }),
)

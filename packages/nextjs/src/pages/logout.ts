// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LogoutFlow } from "@ory/client-fetch"
import { clientSideFrontendClient } from "./client"
import { useEffect, useState } from "react"

/**
 * A client side hook to create a logout flow.
 *
 * @returns A logout flow
 * @public
 * @group Hooks
 */
export function useLogoutFlow() {
  const [flow, setFlow] = useState<LogoutFlow | undefined>(undefined)

  const createFlow = async () => {
    const flow = await clientSideFrontendClient().createBrowserLogoutFlow({})
    setFlow(flow)
  }

  useEffect(() => {
    if (!flow) {
      void createFlow()
    }
  }, [])

  return flow
}

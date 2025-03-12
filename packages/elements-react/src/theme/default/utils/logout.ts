// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LogoutFlow } from "@ory/client-fetch"
import { useCallback, useEffect, useState } from "react"
import { frontendClient } from "../../../util/client"

export function useClientLogout(config: { sdk: { url: string } }) {
  const [logoutFlow, setLogoutFlow] = useState<LogoutFlow | undefined>()

  const fetchLogoutFlow = useCallback(async () => {
    const flow = await frontendClient(config.sdk.url).createBrowserLogoutFlow()
    setLogoutFlow(flow)
  }, [config.sdk.url])

  useEffect(() => {
    void fetchLogoutFlow()
  }, [fetchLogoutFlow])

  return logoutFlow
}

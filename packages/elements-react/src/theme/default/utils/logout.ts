// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LogoutFlow } from "@ory/client-fetch"
import { useCallback, useEffect, useState } from "react"
import { frontendClient } from "../../../util/client"

export function useClientLogout(config: { sdk: { url: string } }) {
  const [logoutFlow, setLogoutFlow] = useState<LogoutFlow | undefined>()

  const fetchLogoutFlow = useCallback(async () => {
    const flow = await frontendClient(config.sdk.url)
      .createBrowserLogoutFlow()
      .catch((err) => {
        // We ignore errors that are thrown because the user is not signed in.
        if (err.response?.status !== 401) {
          throw err
        }
        return undefined
      })
    setLogoutFlow(flow)
  }, [config.sdk.url])

  useEffect(() => {
    void fetchLogoutFlow()
  }, [fetchLogoutFlow])

  return logoutFlow
}

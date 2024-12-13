import { LogoutFlow } from "@ory/client-fetch"
import { clientSideFrontendClient } from "./client"
import { useEffect, useState } from "react"

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

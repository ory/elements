import { newFrontendClient } from "./sdk"
import { Session } from "@ory/client-fetch"
import { useEffect, useState } from "react"

export function useSession() {
  const client = newFrontendClient()
  const [session, setSession] = useState<Session | undefined>()

  useEffect(() => {
    client
      .toSession()
      .then((res) => setSession(res))
      .catch(() => setSession(undefined))
  }, [])

  return session
}

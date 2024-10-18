import { handleFlowError, RegistrationFlow } from "@ory/client-fetch"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { newFrontendClient } from "@/nextjs"
import { onValidationError } from "@/nextjs/utils"

const client = newFrontendClient()

export async function useRegistrationFlow(): Promise<RegistrationFlow | null | void> {
  const [flow, setFlow] = useState<RegistrationFlow>()
  const router = useRouter()

  const errorHandler = handleFlowError({
    onValidationError,
    onRestartFlow: () => {},
    onRedirect: (url: string, external: boolean) => {
      if (external) {
        window.location.assign(url)
      } else {
        router.push(url)
      }
    },
  })

  // Convert ParsedUrlQuery to URLSearchParams
  const searchParams = new URLSearchParams()
  Object.entries(router.query).forEach(([key, value]) => {
    if (!value) {
      return
    }

    // Handle array
    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, v))
      return
    }
    searchParams.set(key, value)
  })

  useEffect(() => {
    const id = searchParams.get("flow")

    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || id) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (id) {
      client
        .getRegistrationFlowRaw({ id })
        .then((r) => r.value())
        .then(setFlow)
        .catch(errorHandler)
      return
    }

    // Otherwise we initialize it
    client
      .createBrowserRegistrationFlowRaw({
        returnTo: searchParams.get("return_to") ?? undefined,
        loginChallenge: searchParams.get("login_challenge") ?? undefined,
        afterVerificationReturnTo:
          searchParams.get("after_verification_return_to") ?? undefined,
        organization: searchParams.get("organization") ?? undefined,
      })
      .then((r) => r.value())
      .then(setFlow)
      .catch(errorHandler)
  }, [searchParams, router, router.isReady, flow])
}

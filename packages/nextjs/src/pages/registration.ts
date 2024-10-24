import { FlowType, handleFlowError, RegistrationFlow } from "@ory/client-fetch"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { newOryFrontendClient } from "../sdk"
import { onValidationError, toBrowserEndpointRedirect, toValue } from "../utils"
import { GetServerSidePropsContext } from "next"
import { useSearchParams } from "next/navigation"
import { handleRestartFlow, toSearchParams, useOnRedirect } from "./utils"

const client = newOryFrontendClient()

export interface RegistrationPageProps {
  flow: RegistrationFlow
}

export async function useRegistrationFlow(): Promise<RegistrationFlow | null | void> {
  const [flow, setFlow] = useState<RegistrationFlow>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const onRestartFlow = handleRestartFlow(searchParams, FlowType.Registration)
  const onRedirect = useOnRedirect()

  const errorHandler = handleFlowError({
    onValidationError,
    onRestartFlow,
    onRedirect,
  })

  useEffect(() => {
    const id = searchParams.get("flow")

    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady) {
      return
    }

    if (!id) {
      onRestartFlow()
      return
    }

    client
      .getRegistrationFlowRaw({ id })
      .then((r) => r.value())
      .then(setFlow)
      .catch(errorHandler)
  }, [searchParams, router, router.isReady, flow])

  return flow
}

// This gets called on every request
export async function getRegistrationServerSideProps(
  context: GetServerSidePropsContext,
) {
  // Otherwise we initialize it
  const query = toSearchParams(context.query)
  return await client
    .createBrowserRegistrationFlowRaw({
      returnTo: query.get("return_to") ?? undefined,
      loginChallenge: query.get("login_challenge") ?? undefined,
      afterVerificationReturnTo:
        query.get("after_verification_return_to") ?? undefined,
      organization: query.get("organization") ?? undefined,
    })
    .then(toValue)
    .then((v) => ({ props: { flow: v } }))
    .catch(
      handleFlowError({
        onValidationError,
        onRestartFlow: () => ({
          redirect: {
            destination: toBrowserEndpointRedirect(
              query,
              FlowType.Registration,
            ),
            permanent: false,
          },
        }),
        onRedirect: (url) => ({
          redirect: {
            destination: url,
            permanent: false,
          },
        }),
      }),
    )
}

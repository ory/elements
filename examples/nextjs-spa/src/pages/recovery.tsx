// React
import { useCallback, useEffect, useState } from "react"

// Next.js
import Router, { useRouter } from "next/router"

// Ory SDK & Ory Client
import { RecoveryFlow, UpdateRecoveryFlowBody } from "@ory/client"
import { ory } from "@/pkg/sdk"

// Misc.
import { AxiosError } from "axios"

// Ory Elements
// We will use UserAuthCard from Ory Elements to display the recovery form.
import Layout from "@/components/layout"
import { UserAuthCard } from "@ory/elements"
import { HandleError } from "@/pkg/hooks"
import { SetUriFlow } from "@/pkg/helpers"
import { NextPageWithLayout } from "./_app"

const Recovery: NextPageWithLayout = () => {
  const [flow, setFlow] = useState<RecoveryFlow | null>()

  // Get flow information from the URL
  const router = useRouter()

  const flowId = String(router.query.flow || "")
  const returnTo = String(router.query.return_to || "")

  const getFlow = useCallback(
    (id: string) =>
      ory
        .getRecoveryFlow({ id })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleError),
    [],
  )

  const handleError = useCallback(
    (error: AxiosError) => {
      const handle = HandleError(getFlow, setFlow, "/registration", true)
      return handle(error)
    },
    [getFlow],
  )

  const createFlow = useCallback(
    (returnTo: string) =>
      ory
        .createBrowserRecoveryFlow({
          returnTo: returnTo,
        })
        .then(({ data }) => {
          setFlow(data)
          SetUriFlow(Router, data.id)
        })
        .catch(handleError),
    [handleError],
  )

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      getFlow(flowId).catch(() => createFlow(returnTo))
      // if the flow is expired, we create a new one
      return
    }

    // Otherwise we initialize it
    createFlow(returnTo)
  }, [router.isReady])

  const submitFlow = (values: UpdateRecoveryFlowBody) =>
    ory
      .updateRecoveryFlow({
        flow: String(flow?.id),
        updateRecoveryFlowBody: values,
      })
      .then(({ data }) => {
        // reset the form data completely
        setFlow(null)
        // Form submission was successful, show the message to the user!
        getFlow(data.id)
      })
      .catch(handleError)

  return flow ? (
    // create a recovery form that dynamically renders based on the flow data using Ory Elements
    <UserAuthCard
      cardImage="/ory.svg"
      // This defines what kind of card we want to render.
      flowType={"recovery"}
      // we always need the flow data which populates the form fields and error messages dynamically
      flow={flow}
      // the registration card should allow the user to go to the registration page and the login page
      additionalProps={{
        loginURL: "/login",
      }}
      // we might need webauthn support which requires additional js
      includeScripts={true}
      // we submit the form data to Ory
      onSubmit={({ body }) => submitFlow(body as UpdateRecoveryFlowBody)}
    />
  ) : (
    <div>Loading...</div>
  )
}

Recovery.getLayout = (page) => <Layout>{page}</Layout>

export default Recovery

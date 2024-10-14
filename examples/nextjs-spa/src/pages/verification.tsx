// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

// React
import { useCallback, useEffect, useState } from "react"

// Next.js
import Router, { useRouter } from "next/router"

// Ory SDK & Ory Client
import { UpdateVerificationFlowBody, VerificationFlow } from "@ory/client"
import { ory } from "@/pkg/sdk"

// Misc.
import { AxiosError } from "axios"

// Ory Elements
// We will use UserAuthCard from Ory Elements to display the verification form.
import Layout from "@/components/layout"
import { UserAuthCard } from "@ory/elements"
import { SetUriFlow } from "@/pkg/helpers"
import { HandleError } from "@/pkg/hooks"
import { NextPageWithLayout } from "./_app"

const Verification: NextPageWithLayout = () => {
  const [flow, setFlow] = useState<VerificationFlow | null>(null)

  // Get ?flow=... from the URL
  const router = useRouter()

  const flowId = String(router.query.flow || "")
  const returnTo = String(router.query.return_to || "")

  const getFlow = useCallback(
    (id: string) =>
      ory
        .getVerificationFlow({ id })
        .then(({ data }) => setFlow(data))
        .catch(handleError),
    [],
  )

  const handleError = useCallback(
    (error: AxiosError) => {
      const handle = HandleError(getFlow, setFlow, "/verification", true)
      return handle(error)
    },
    [getFlow],
  )

  const createFlow = useCallback(
    (returnTo: string) =>
      ory
        .createBrowserVerificationFlow({
          returnTo,
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
      getFlow(flowId).catch(() => createFlow(returnTo)) // the flow might be expired, so we create a new one
      return
    }

    // Otherwise we initialize it
    createFlow(returnTo)
  }, [router.isReady])

  const submitFlow = (values: UpdateVerificationFlowBody) =>
    ory
      .updateVerificationFlow({
        flow: String(flow?.id),
        updateVerificationFlowBody: values,
      })
      .then(({ data }) => {
        // Form submission was successful, show the message to the user!
        setFlow(data)
      })
      .catch(handleError)

  return flow ? (
    // create a verification form that dynamically renders based on the flow data using Ory Elements
    <UserAuthCard
      cardImage="/ory.svg"
      flowType={"verification"}
      // we always need the flow data which populates the form fields and error messages dynamically
      flow={flow}
      // the verification card should allow the user to go to the registration page and the login page
      additionalProps={{
        signupURL: "/registration",
      }}
      // we might need webauthn support which requires additional js
      includeScripts={true}
      // we submit the form data to Ory
      onSubmit={({ body }) => submitFlow(body as UpdateVerificationFlowBody)}
    />
  ) : (
    <div>Loading...</div>
  )
}

Verification.getLayout = (page) => <Layout>{page}</Layout>

export default Verification

// React
import { useCallback, useEffect, useState } from "react"

// Next.js
import Router, { useRouter } from "next/router"

// Ory SDK & Ory Client
import { RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/client"
import { ory } from "@/pkg/sdk"

// Misc.
import { AxiosError } from "axios"

// Ory Elements
// We will use UserAuthCard from Ory Elements to display the registration form.
import Layout from "@/components/layout"
import { UserAuthCard } from "@ory/elements"
import { SetUriFlow } from "@/pkg/helpers"
import { HandleError } from "@/pkg/hooks"
import { NextPageWithLayout } from "./_app"

const Registration: NextPageWithLayout = () => {
  const [flow, setFlow] = useState<RegistrationFlow>()

  // Get flow information from the URL
  const router = useRouter()

  const flowId = String(router.query.flow || "")
  const returnTo = String(router.query.return_to || "")

  const getFlow = useCallback(
    (id: string) =>
      ory
        .getRegistrationFlow({ id })
        .then(({ data }) => {
          // We received the flow - let's use its data and render the form!
          setFlow(data)
          SetUriFlow(Router, data.id)
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
        .createBrowserRegistrationFlow({
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
      getFlow(String(flowId || "")).catch(() => createFlow(returnTo))
      return
    }

    // Otherwise we initialize it
    createFlow(returnTo)
  }, [router.isReady])

  const submitFlow = (values: UpdateRegistrationFlowBody) =>
    ory
      .updateRegistrationFlow({
        flow: String(flow?.id),
        updateRegistrationFlowBody: values,
      })
      // We logged in successfully! Let's bring the user home.
      .then(() => {
        if (flow?.return_to) {
          window.location.href = flow?.return_to
          return
        }
        Router.push("/")
      })
      .catch(handleError)

  return flow ? (
    // create a registration form that dynamically renders based on the flow data using Ory Elements
    <UserAuthCard
      cardImage="/ory.svg"
      // This defines what kind of card we want to render.
      flowType={"registration"}
      // we always need to pass the flow to the card since it contains the form fields, error messages and csrf token
      flow={flow}
      // the registration card needs a way to navigate to the login page
      additionalProps={{
        loginURL: "/login",
      }}
      // include the necessary scripts for webauthn to work
      includeScripts={true}
      // submit the registration form data to Ory
      onSubmit={({ body }) => submitFlow(body as UpdateRegistrationFlowBody)}
    />
  ) : (
    <div>Loading...</div>
  )
}

Registration.getLayout = (page) => <Layout>{page}</Layout>

export default Registration

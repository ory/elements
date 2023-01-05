// React
import { useCallback, useEffect, useState } from "react"

// Next.js
import type { NextPage } from "next"
import { useRouter } from "next/router"

// Ory SDK & Ory Client
import { RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/client"
import { ory } from "../pkg/sdk"

// Misc.
import { AxiosError } from "axios"

// Ory Elements
// We will use UserAuthCard from Ory Elements to display the registration form.
import { UserAuthCard } from "@ory/elements"
import { HandleError } from "../pkg/hooks"

const Registration: NextPage = () => {
  const [flow, setFlow] = useState<RegistrationFlow>()

  const handleError = HandleError()

  // Get flow information from the URL
  const router = useRouter()

  const getRegistrationFlow = useCallback(
    (id: string) =>
      ory
        .getRegistrationFlow({ id })
        .then(({ data }) => {
          // We received the flow - let's use its data and render the form!
          setFlow(data)
        })
        .catch((error: AxiosError) => handleError(error)),
    [],
  )

  const createRegistrationFlow = useCallback(
    (returnTo: string) =>
      ory
        .createBrowserRegistrationFlow({
          returnTo,
        })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch((error: AxiosError) => handleError(error)),
    [],
  )

  useEffect(() => {
    const { flow: flowId, return_to: returnTo } = router.query

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      getRegistrationFlow(String(flowId || "")).catch(
        (error: AxiosError) =>
          error.response?.status === 410 ??
          createRegistrationFlow(String(returnTo || "")),
        // if the flow is expired, we create a new one
      )
      return
    }

    // Otherwise we initialize it
    createRegistrationFlow(String(returnTo || ""))
  }, [])

  const submitFlow = (values: UpdateRegistrationFlowBody) => {
    router
      // On submission, add the flow ID to the URL but do not navigate.
      // This prevents the user losing his data when she/he reloads the page.
      .push(`/login?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
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
            router.push("/")
          })
          .catch((error: AxiosError) => handleError(error))
          .catch((err: AxiosError) => {
            // If the previous handler did not catch the error it's most likely a form validation error
            if (err.response?.status === 400) {
              // Yup, it is!
              setFlow(err.response?.data)
              return
            }

            return Promise.reject(err)
          }),
      )
  }

  return flow ? (
    // create a registration form that dynamically renders based on the flow data using Ory Elements
    <UserAuthCard
      title={"Registration"}
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

export default Registration

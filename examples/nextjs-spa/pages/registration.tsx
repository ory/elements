import {
  SelfServiceRegistrationFlow,
  SubmitSelfServiceRegistrationFlowBody,
} from "@ory/client"
import { UserAuthCard } from "@ory/elements"
import { AxiosError } from "axios"
import type { NextPage } from "next"
import Head from "next/head"
import { useRouter, NextRouter } from "next/router"
import { useEffect, useState } from "react"
// Import the SDK
import { ory } from "../components/sdk"

// Renders the registration page
const Registration: NextPage = () => {
  const router = useRouter()

  // The "flow" represents a registration process and contains
  // information about the form we need to render (e.g. username + password)
  const [flow, setFlow] = useState<SelfServiceRegistrationFlow>()

  // Get ?flow=... from the URL
  const { flow: flowId, return_to: returnTo } = router.query

  // In this effect we either initiate a new registration flow, or we fetch an existing registration flow.
  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getSelfServiceRegistrationFlow(String(flowId))
        .then(({ data }) => {
          // We received the flow - let's use its data and render the form!
          setFlow(data)
        })
        .catch(
          (error: AxiosError) =>
            // If the flow was not found, we redirect to the login page
            error.response?.status === 404 && router.push("/login"),
        )
      return
    }

    // Otherwise we initialize it
    ory
      .initializeSelfServiceRegistrationFlowForBrowsers(
        returnTo ? String(returnTo) : undefined,
      )
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(
        (error: AxiosError) =>
          // If the flow was not found, we redirect to the login page
          error.response?.status === 404 && router.push("/login"),
      )
  }, [flowId, router, router.isReady, returnTo, flow])

  const submitFlow = (values: SubmitSelfServiceRegistrationFlowBody) =>
    router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      .push(`/login?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        ory
          .submitSelfServiceRegistrationFlow(String(flow?.id), values, undefined)
          // We logged in successfully! Let's bring the user home.
          .then((res) => {
            if (flow?.return_to) {
              window.location.href = flow?.return_to
              return
            }
            router.push("/")
          })
          .then(() => {})
          .catch(
            (error: AxiosError) =>
              // If the flow was not found, we redirect to the registration page
              error.response?.status === 404 && router.push("/registration"),
          )
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

      return flow ? (
        // create a registration form that dynamically renders based on the flow data using Ory Elements
        <UserAuthCard
          title={"Registration"}
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
          onSubmit={({ body }) =>
            submitFlow(body as SubmitSelfServiceRegistrationFlowBody)
          }
        />
      ) : (
        <div>Loading...</div>
      )
}

export default Registration

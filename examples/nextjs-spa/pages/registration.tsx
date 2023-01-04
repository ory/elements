// React
import React from "react"
import { useEffect, useState } from "react"

// Next.js
import type { NextPage } from "next"
import { useRouter } from "next/router"

// Ory SDK & Ory Client
import { ory } from "../pkg/sdk"
import { RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/client"

// Misc.
import { AxiosError } from "axios"

// Ory Elements
// We will use UserAuthCard from Ory Elements to display the registration form.
import { UserAuthCard } from "@ory/elements"

const Registration: NextPage = () => {
  const [flow, setFlow] = useState<RegistrationFlow>()

  // Get flow information from the URL
  const router = useRouter()
  const { flow: flowId, return_to: returnTo } = router.query

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getRegistrationFlow({ id: String(flowId) })
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
      .createBrowserRegistrationFlow({
        returnTo: returnTo ? String(returnTo) : undefined,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(
        (error: AxiosError) =>
          // If the flow was not found, we redirect to the login page
          error.response?.status === 404 && router.push("/login"),
      )
  }, [flowId, router, router.isReady, returnTo, flow])

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
  }

  return flow ? (
    // create a registration form that dynamically renders based on the flow data using Ory Elements
    <>
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
    </>
  ) : (
    <div>Loading...</div>
  )
}

export default Registration

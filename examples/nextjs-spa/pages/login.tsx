// React
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

// Ory SDK
import { ory } from "../components/sdk"
import {
  SelfServiceLoginFlow,
  SubmitSelfServiceLoginFlowBody,
} from "@ory/client"

import { AxiosError } from "axios"
import type { NextPage } from "next"

import { ThemeProvider, UserAuthCard } from "@ory/elements"
import React from "react"
import Link from "next/link"

const Login: NextPage = () => {
  const [flow, setFlow] = useState<SelfServiceLoginFlow | null>(null)

  // Get ?flow=... from the URL
  const router = useRouter()
  const {
    return_to: returnTo,
    flow: flowId,
    // Refresh means we want to refresh the session. This is needed, for example, when we want to update the password
    // of a user.
    refresh,
    // AAL = Authorization Assurance Level. This implies that we want to upgrade the AAL, meaning that we want
    // to perform two-factor authentication/verification.
    aal,
  } = router.query

  // This might be confusing, but we want to show the user an option
  // to sign out if they are performing two-factor authentication!

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getSelfServiceLoginFlow(String(flowId))
        .then(({ data }) => {
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
      .initializeSelfServiceLoginFlowForBrowsers(
        Boolean(refresh),
        aal ? String(aal) : undefined,
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
  }, [flowId, router, router.isReady, aal, refresh, returnTo, flow])

  const submitFlow = (values: SubmitSelfServiceLoginFlowBody) => {
    router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      .push(`/login?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        ory
          .submitSelfServiceLoginFlow(String(flow?.id), values, undefined)
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
              // If the flow was not found, we redirect to the login page
              error.response?.status === 404 && router.push("/login"),
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
    // create a login form that dynamically renders based on the flow data using Ory Elements
    <>
      <UserAuthCard
        title={"Login"}
        flowType={"login"}
        // we always need the flow data which populates the form fields and error messages dynamically
        flow={flow}
        // the login card should allow the user to go to the registration page and the recovery page
        additionalProps={{
          forgotPasswordURL: "/recovery",
          signupURL: "/registration",
        }}
        // we might need webauthn support which requires additional js
        includeScripts={true}
        // we submit the form data to Ory
        onSubmit={({ body }) =>
          submitFlow(body as SubmitSelfServiceLoginFlowBody)
        }
      />
      <p>
        <Link href="/">
          <a>Home</a>
        </Link>
      </p>
    </>
  ) : (
    <div>Loading...</div>
  )
}

export default Login

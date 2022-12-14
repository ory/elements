// React
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

// Ory SDK
import { ory } from "../components/sdk"
import { RecoveryFlow, UpdateRecoveryFlowBody } from "@ory/client"

import { AxiosError } from "axios"
import type { NextPage } from "next"

import { ThemeProvider, UserAuthCard } from "@ory/elements"
// import Ory elements css
import "@ory/elements/style.css"
import React from "react"
import Link from "next/link"

const Recovery: NextPage = () => {
  const [flow, setFlow] = useState<RecoveryFlow>()

  // Get ?flow=... from the URL
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
        .getRecoveryFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch((err: AxiosError) => {
          switch (err.response?.status) {
            case 410:
            // Status code 410 means the request has expired - so let's load a fresh flow!
            case 403:
              // Status code 403 implies some other issue (e.g. CSRF) - let's reload!
              return router.push("/recovery")
          }

          throw err
        })
      return
    }

    // Otherwise we initialize it
    ory
      .createBrowserRecoveryFlow()
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(
        (error: AxiosError) =>
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
      })
  }, [flowId, router, router.isReady, returnTo, flow])

  const submitFlow = (values: UpdateRecoveryFlowBody) =>
    router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      .push(`/recovery?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        ory
          .updateRecoveryFlow({
            flow: String(flow?.id),
            updateRecoveryFlowBody: values,
          })
          .then(({ data }) => {
            // Form submission was successful, show the message to the user!
            setFlow(data)
          })
          .catch(
            (error: AxiosError) =>
              error.response?.status === 404 && router.push("/recovery"),
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
    // create a recovery form that dynamically renders based on the flow data using Ory Elements
    <React.StrictMode>
      {/* We add the Ory themes here */}
      <ThemeProvider themeOverrides={{}}>
        <UserAuthCard
          title={"Recovery"}
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
        <p>
          <Link href="/">Home</Link>
        </p>
      </ThemeProvider>
    </React.StrictMode>
  ) : (
    <div>Loading...</div>
  )
}

export default Recovery

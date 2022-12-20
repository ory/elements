// React
import React from "react"
import { useEffect, useState } from "react"

// Next.js
import type { NextPage } from "next"
import { useRouter } from "next/router"
import Link from "next/link"

// Ory SDK & Ory Client
import { ory } from "../components/sdk"
import { VerificationFlow, UpdateVerificationFlowBody } from "@ory/client"

// Misc.
import { AxiosError } from "axios"

// Ory Elements
// We will use UserAuthCard from Ory Elements to display the verification form.
import { UserAuthCard } from "@ory/elements"

const Verification: NextPage = () => {
  const [flow, setFlow] = useState<VerificationFlow | null>(null)

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
        .getVerificationFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch((err: AxiosError) => {
          switch (err.response?.status) {
            case 410:
              // Status code 410 means the request has expired - so let's load a fresh flow!
              return router.push("/verification")
            case 403:
              // Status code 403 implies some other issue (e.g. CSRF) - let's reload!
              return router.push("/verification")
          }
          if (err.response?.status === 401) {
            router.push("/login")
          } else {
            router.push({
              pathname: "/error",
              query: {
                error: JSON.stringify(err, null, 2),
                id: err.response?.data.error?.id,
                flowType: router.pathname,
              },
            })
          }
        })
      return
    }

    // Otherwise we initialize it
    ory
      .createBrowserVerificationFlow({
        returnTo: returnTo ? String(returnTo) : undefined,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 400) {
          // Status code 400 implies the user is already signed in
          return router.push("/")
        } else {
          router.push({
            pathname: "/error",
            query: {
              error: JSON.stringify(err, null, 2),
              id: err.response?.data.error?.id,
              flowType: router.pathname,
            },
          })
        }
      })
  }, [flowId, router, router.isReady, returnTo, flow])

  const submitFlow = async (values: UpdateVerificationFlowBody) => {
    await router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user losing
      // their data when they reload the page.
      .push(`/verification?flow=${flow?.id}`, undefined, { shallow: true })

    ory
      .updateVerificationFlow({
        flow: String(flow?.id),
        updateVerificationFlowBody: values,
      })
      .then(({ data }) => {
        // Form submission was successful, show the message to the user!
        setFlow(data)
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 400:
            // Status code 400 implies the form validation had an error
            setFlow(err.response?.data)
            return
          case 410:
            const newFlowID = err.response.data.use_flow_id
            router
              // On submission, add the flow ID to the URL but do not navigate. This prevents the user losing
              // their data when they reload the page.
              .push(`/verification?flow=${newFlowID}`, undefined, {
                shallow: true,
              })

            ory.getVerificationFlow(newFlowID).then(({ data }) => setFlow(data))
            return
          default:
            router.push({
              pathname: "/error",
              query: {
                error: JSON.stringify(err, null, 2),
                id: err.response?.data.error?.id,
                flowType: router.pathname,
              },
            })
        }
      })
  }

  return flow ? (
    // create a verification form that dynamically renders based on the flow data using Ory Elements
    <>
      <h1>
        <Link href="/">Home</Link>
      </h1>
      <UserAuthCard
        title={"Verification"}
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
    </>
  ) : (
    <div>Loading...</div>
  )
}

export default Verification

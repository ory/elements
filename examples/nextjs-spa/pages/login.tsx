// React
import { useEffect, useState } from "react"

// Next.js
import type { NextPage } from "next"
import { useRouter } from "next/router"

// Ory SDK & Ory Client
import { LoginFlow, UpdateLoginFlowBody } from "@ory/client"
import { ory } from "../pkg/sdk"

// Misc.
import { AxiosError } from "axios"

// Ory Elements
// We will use UserAuthCard from Ory Elements to display the login form.
import { UserAuthCard } from "@ory/elements"

const Login: NextPage = () => {
  const [flow, setFlow] = useState<LoginFlow | null>(null)

  // Get flow information from the URL
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

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getLoginFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(
          (error: AxiosError) =>
            // If the flow was not found, we redirect to the login page to start a new flow.
            error.response?.status === 404 && router.push("/login"),
        )
      return
    }

    // Otherwise we initialize it
    ory
      .createBrowserLoginFlow({
        refresh: Boolean(refresh),
        // Check for two-factor authentication
        aal: aal ? String(aal) : undefined,
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
  }, [flowId, router, router.isReady, aal, refresh, returnTo, flow])

  const submitFlow = (values: UpdateLoginFlowBody) => {
    router
      // On submission, add the flow ID to the URL but do not navigate.
      // This prevents the user losing his data when she/he reloads the page.
      .push(`/login?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        ory
          .updateLoginFlow({
            flow: String(flow?.id),
            updateLoginFlowBody: values,
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
        // This defines what kind of card we want to render.
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
        onSubmit={({ body }) => submitFlow(body as UpdateLoginFlowBody)}
      />
    </>
  ) : (
    <div>Loading...</div>
  )
}

export default Login

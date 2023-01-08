// React
import { useCallback, useEffect, useState } from "react"

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
import { HandleError } from "../pkg/hooks"

const Login: NextPage = () => {
  const [flow, setFlow] = useState<LoginFlow | null>(null)
  const handleError = HandleError()
  // Get flow information from the URL
  const router = useRouter()

  const getLoginFlow = useCallback(
    (id: string) =>
      // If ?flow=.. was in the URL, we fetch it
      ory
        .getLoginFlow({ id })
        .then(({ data }) => {
          setFlow(data)
          router.push(`/login?flow=${data.id}`, undefined, { shallow: true })
        })
        .catch((error: AxiosError) => handleError(error)),
    [handleError, router],
)

  const createFlow = useCallback(
    (refresh: boolean, aal: string, returnTo: string) =>
      ory
        .createBrowserLoginFlow({
          refresh: refresh,
          // Check for two-factor authentication
          aal: aal,
          returnTo: returnTo,
        })
        .then(({ data }) => {
          setFlow(data)
          router.push(`/login?flow=${data.id}`, undefined, { shallow: true })
        })
        .catch((error: AxiosError) => handleError(error)),
    [handleError, router],
  )

  useEffect(() => {
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

    if (flowId) {
      getLoginFlow(String(flowId)).catch(
        (err: AxiosError) =>
          err.response?.status === 410 ??
          createFlow(
            Boolean(refresh),
            String(aal || ""),
            String(returnTo || ""),
          ),
      ) // if for some reason the flow has expired, we need to get a new one
      return
    }

    // Otherwise we initialize it
    createFlow(Boolean(refresh), String(aal || ""), String(returnTo || ""))
  }, [createFlow, getLoginFlow, router.query])

  const submitFlow = (values: UpdateLoginFlowBody) => {
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
      .catch((err: AxiosError) => handleError(err))
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          // If the previous handler did not catch the error it's most likely a form validation error
          case 400:
            // Yup, it is!
            setFlow(err.response?.data)
            break
          case 422:
            const u = new URL(err.response.data.redirect_browser_to)
            // get new flow data based on the flow id in the redirect url
            getLoginFlow(u.searchParams.get("flow") || "")
            break
          default:
            return err
        }
      })
  }

  return flow ? (
    // create a login form that dynamically renders based on the flow data using Ory Elements
    <UserAuthCard
      cardImage={"/ory.svg"}
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
  ) : (
    <div>Loading...</div>
  )
}

export default Login

// React
import { useCallback, useEffect, useState } from "react"

// Next.js
import Router, { useRouter } from "next/router"

// Ory SDK & Ory Client
import { LoginFlow, UpdateLoginFlowBody } from "@ory/client"
import { ory } from "@/pkg/sdk"

// Misc.
import { AxiosError } from "axios"

// Ory Elements
// We will use UserAuthCard from Ory Elements to display the login form.
import Layout from "@/components/layout"
import { UserAuthCard } from "@ory/elements"
import { SetUriFlow } from "@/pkg/helpers"
import { HandleError } from "@/pkg/hooks"
import { NextPageWithLayout } from "./_app"

const Login: NextPageWithLayout = () => {
  const [flow, setFlow] = useState<LoginFlow | null>(null)
  const router = useRouter()

  const returnTo = String(router.query.return_to || "")
  const flowId = String(router.query.flow || "")

  // Refresh means we want to refresh the session. This is needed, for example, when we want to update the password
  // of a user.
  const refresh = Boolean(router.query.refresh)

  // AAL = Authorization Assurance Level. This implies that we want to upgrade the AAL, meaning that we want
  // to perform two-factor authentication/verification.
  const aal = String(router.query.aal || "")

  const getFlow = useCallback(
    (id: string) =>
      // If ?flow=.. was in the URL, we fetch it
      ory
        .getLoginFlow({ id })
        .then(({ data }) => setFlow(data))
        .catch(handleError),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const handleError = useCallback(
    (error: AxiosError) => {
      const handle = HandleError(getFlow, setFlow, "/login", true)
      return handle(error)
    },
    [getFlow],
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
          SetUriFlow(Router, data.id)
        })
        .catch(handleError),
    [handleError],
  )

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (flowId) {
      getFlow(flowId).catch(() => {
        createFlow(refresh, aal, returnTo)
      })
      return
    }

    // Otherwise we initialize it
    createFlow(refresh, aal, returnTo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

  const submitFlow = (values: UpdateLoginFlowBody) =>
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
        Router.push("/")
      })
      .catch(handleError)

  return flow ? (
    // create a login form that dynamically renders based on the flow data using Ory Elements
    <UserAuthCard
      cardImage="/ory.svg"
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

Login.getLayout = (page) => <Layout>{page}</Layout>

export default Login

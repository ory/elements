import { LoginFlow, UpdateLoginFlowBody } from "@ory/client"
import { UserAuthCard } from "@ory/elements-preact"
import { useCallback, useEffect, useState } from "preact/hooks"
import sdk from "./sdk"
import { useLocation } from "wouter"

export const Login = () => {
  const [flow, setFlow] = useState<LoginFlow | null>(null)

  const [location, setLocation] = useLocation()

  const createFlow = useCallback(() => {
    const aal2 = new URLSearchParams(
      new URL(window.location.toString()).search,
    ).get("aal2")

    return sdk
      .createBrowserLoginFlow({ refresh: true, aal: aal2 ? "aal2" : "aal1" })
      .then(({ data: flow }) => flow)
      .catch((error) => {
        switch (error.response?.status) {
          case 400:
            // the request could contain invalid parameters which would set error messages in the flow
            setFlow(error.response.data)
            break
          // something went wrong so we redirect to the login page
          case 410:
          case 404:
            return setLocation("/login", { replace: true })
        }
      })
  }, [])

  // Get the flow based on the flowId in the URL (.e.g redirect to this page after flow initialized)
  const getFlow = useCallback(
    (flowId: string) =>
      sdk
        .getLoginFlow({ id: flowId })
        .then(({ data: flow }) => setFlow(flow))
        .catch((err) => {
          console.error(err)
          return err
        }),
    [],
  )

  // submit the login form data to Ory
  const submitFlow = (body: UpdateLoginFlowBody) => {
    // something unexpected went wrong and the flow was not set
    if (!flow) return setLocation("/login", { replace: true })

    sdk
      .updateLoginFlow({
        flow: flow.id,
        updateLoginFlowBody: body as UpdateLoginFlowBody,
      })
      .then(() => {
        // we successfully submitted the login flow, so lets redirect to the dashboard
        setLocation("/", { replace: true })
      })
      .catch((error) => {
        switch (error.response.status) {
          case 400:
            setFlow(error.response.data)
            break
          case 422: {
            // for webauthn we need to reload the flow
            const u = new URL(error.response.data.redirect_browser_to)
            // get new flow data based on the flow id in the redirect url
            getFlow(u.searchParams.get("flow") || "").catch(() => {
              setLocation("/login", { replace: true })
            })
            break
          }
          // other errors we just redirect to the login page
          case 410:
          case 404:
          default:
            setLocation("/login", { replace: true })
        }
      })
  }

  useEffect(() => {
    // we might redirect to this page after the flow is initialized, so we check for the flowId in the URL
    const flowId = new URLSearchParams(
      new URL(window.location.toString()).search,
    ).get("flow")

    // the flow already exists
    if (flowId) {
      getFlow(flowId).catch(createFlow) // if for some reason the flow has expired, we need to get a new one
      return
    }

    // we assume there was no flow, so we create a new one
    createFlow().catch((error) => console.error(error))
  }, [])

  return flow ? (
    <UserAuthCard
      flow={flow}
      flowType={"login"}
      additionalProps={{
        forgotPasswordURL: "/recovery",
        signupURL: "/signup",
      }}
      title={"Login"}
      includeScripts={true}
      onSubmit={({ body }) => submitFlow(body as UpdateLoginFlowBody)}
    />
  ) : (
    <div>Loading...</div>
  )
}

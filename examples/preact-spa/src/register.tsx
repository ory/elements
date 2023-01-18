import { RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/client"
import { UserAuthCard } from "@ory/elements-preact"
import { useCallback, useEffect, useState } from "preact/hooks"
import sdk from "./sdk"
import { useLocation } from "wouter"

export const Register = () => {
  const [flow, setFlow] = useState<RegistrationFlow | null>(null)

  const [/*location*/, setLocation] = useLocation()

  // create a new registration flow
  const createFlow = useCallback(
    () =>
      sdk
        // we don't need to specify the return_to here since we are building an SPA. In server-side browser flows we would need to specify the return_to
        .createBrowserRegistrationFlow()
        .then(({ data: flow }) => {
          setFlow(flow)
        })
        // something serious went wrong so we redirect to the registration page
        .catch((error) => {
          console.error(error)
          setLocation("/signup", { replace: true })
        }),
    [],
  )

  // Get the flow based on the flowId in the URL (.e.g redirect to this page after flow initialized)
  const getFlow = useCallback(
    (flowId: string) =>
      sdk
        // the flow data contains the form fields, error messages and csrf token
        .getRegistrationFlow({ id: flowId })
        .then(({ data: flow }) => setFlow(flow))
        .catch((err) => {
          console.error(err)
          return err
        }),
    [],
  )

  // submit the registration form data to Ory
  const submitFlow = (body: UpdateRegistrationFlowBody) => {
    // something unexpected went wrong and the flow was not set
    if (!flow) return setLocation("/signup", { replace: true })

    sdk
      .updateRegistrationFlow({
        flow: flow.id,
        updateRegistrationFlowBody: body,
      })
      .then(() => {
        // we successfully submitted the login flow, so lets redirect to the dashboard
        setLocation("/", { replace: true })
      })
      .catch((error) => {
        switch (error.response.status) {
          // some user input error occurred, so we update the flow which constains UI error messages
          case 400:
            setFlow(error.response.data)
            break
          case 422: {
            // for webauthn we need to reload the flow
            const u = new URL(error.response.data.redirect_browser_to)
            // get new flow data based on the flow id in the redirect url
            getFlow(u.searchParams.get("flow") || "")
              // something unexpected went wrong and the flow was not set - redirect the user to the login page
              .catch((err) => {
                console.error(err)
                setLocation("/signup", { replace: true })
              })
            break
          }
          // other errors we just redirect to the registration page
          case 410:
          case 404:
          default:
            return setLocation("/signup", { replace: true })
        }
      })
  }

  useEffect(() => {
    // we might redirect to this page after the flow is initialized, so we check for the flowId in the URL
    const flowId = new URLSearchParams(new URL(window.location.toString()).search).get("flow")
    // the flow already exists
    if (flowId) {
      getFlow(flowId).catch(createFlow) // if for some reason the flow has expired, we need to get a new one
      return
    }
    // we assume there was no flow, so we create a new one
    createFlow().catch(error => console.error(error))
  }, [])

  return flow ? (
    <UserAuthCard
      flow={flow}
      flowType={"registration"}
      title={"Registration"}
      additionalProps={{
        loginURL: "/login",
      }}
      includeScripts={true}
      onSubmit={({ body }) => submitFlow(body as UpdateRegistrationFlowBody)}
    />
  ) : (
    <div>Loading...</div>
  )
}

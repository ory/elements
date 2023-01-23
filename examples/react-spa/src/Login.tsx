import { LoginFlow, UpdateLoginFlowBody } from "@ory/client"
import { UserAuthCard } from "@ory/elements"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { sdk, sdkError } from "./sdk"

export const Login = (): JSX.Element => {
  const [flow, setFlow] = useState<LoginFlow | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const navigate = useNavigate()

  // Get the flow based on the flowId in the URL (.e.g redirect to this page after flow initialized)
  const getFlow = useCallback(
    (flowId: string) =>
      sdk
        // the flow data contains the form fields, error messages and csrf token
        .getLoginFlow({ id: flowId })
        .then(({ data: flow }) => setFlow(flow))
        .catch(sdkErrorHandler),
    [],
  )

  // initialize the sdkError for generic handling of errors
  const sdkErrorHandler = sdkError(getFlow, setFlow, "/login", true)

  // Create a new login flow
  const createFlow = () => {
    const aal2 = searchParams.get("aal2")
    sdk
      // aal2 is a query parameter that can be used to request Two-Factor authentication
      // aal1 is the default authentication level (Single-Factor)
      // we always pass refresh (true) on login so that the session can be refreshed when there is already an active session
      .createBrowserLoginFlow({ refresh: true, aal: aal2 ? "aal2" : "aal1" })
      // flow contains the form fields and csrf token
      .then(({ data: flow }) => {
        // Update URI query params to include flow id
        setSearchParams({})
        // Set the flow data
        setFlow(flow)
      })
      .catch(sdkErrorHandler)
  }

  // submit the login form data to Ory
  const submitFlow = (body: UpdateLoginFlowBody) => {
    // something unexpected went wrong and the flow was not set
    if (!flow) return navigate("/login", { replace: true })

    // we submit the flow to Ory with the form data
    sdk
      .updateLoginFlow({ flow: flow.id, updateLoginFlowBody: body })
      .then(() => {
        // we successfully submitted the login flow, so lets redirect to the dashboard
        navigate("/", { replace: true })
      })
      .catch(sdkErrorHandler)
  }

  useEffect(() => {
    // we might redirect to this page after the flow is initialized, so we check for the flowId in the URL
    const flowId = searchParams.get("flow")
    // the flow already exists
    if (flowId) {
      getFlow(flowId).catch(createFlow) // if for some reason the flow has expired, we need to get a new one
      return
    }

    // we assume there was no flow, so we create a new one
    createFlow()
  }, [])

  // we check if the flow is set, if not we show a loading indicator
  return flow ? (
    // we render the login form using Ory Elements
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
      onSubmit={({ body }) => submitFlow(body as UpdateLoginFlowBody)}
    />
  ) : (
    <div>Loading...</div>
  )
}

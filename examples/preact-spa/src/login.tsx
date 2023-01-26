import { LoginFlow, UpdateLoginFlowBody } from "@ory/client"
import { UserAuthCard } from "@ory/elements-preact"
import { useCallback, useEffect, useState } from "preact/hooks"
import { sdk, sdkError, getSearchParam } from "./sdk"
import { useLocation } from "wouter"

export const Login = () => {
  const [flow, setFlow] = useState<LoginFlow | null>(null)

  const [location, setLocation] = useLocation()

  // Get the flow based on the flowId in the URL (.e.g redirect to this page after flow initialized)
  const getFlow = useCallback(
    (flowId: string) =>
      sdk
        .getLoginFlow({ id: flowId })
        .then(({ data: flow }) => setFlow(flow))
        .catch(sdkErrorHandler),
    [],
  )

  // initialize the sdkError for generic handling of errors
  const sdkErrorHandler = sdkError(getFlow, setFlow, "/login", true)

  const createFlow = () => {
    const aal2 = getSearchParam("aal2")

    sdk
      .createBrowserLoginFlow({ refresh: true, aal: aal2 ? "aal2" : "aal1" })
      .then(({ data: flow }) => setFlow(flow))
      .catch(sdkErrorHandler)
  }

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
      .catch(sdkErrorHandler)
  }

  useEffect(() => {
    // we might redirect to this page after the flow is initialized, so we check for the flowId in the URL
    const flowId = getSearchParam("flow")

    // the flow already exists
    if (flowId) {
      getFlow(flowId).catch(createFlow) // if for some reason the flow has expired, we need to get a new one
      return
    }

    // we assume there was no flow, so we create a new one
    createFlow()
  }, [])

  return flow ? (
    <UserAuthCard
      flow={flow}
      flowType={"login"}
      additionalProps={{
        forgotPasswordURL: "/recovery",
        signupURL: "/registration",
      }}
      title={"Login"}
      includeScripts={true}
      onSubmit={({ body }) => submitFlow(body as UpdateLoginFlowBody)}
    />
  ) : (
    <div>Loading...</div>
  )
}

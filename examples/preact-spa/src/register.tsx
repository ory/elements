import { RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/client"
import { UserAuthCard } from "@ory/elements-preact"
import { useCallback, useEffect, useState } from "preact/hooks"
import { getSearchParam, sdk, sdkError } from "./sdk"
import { useLocation } from "wouter"

export const Register = () => {
  const [flow, setFlow] = useState<RegistrationFlow | null>(null)

  const [location, setLocation] = useLocation()

  // Get the flow based on the flowId in the URL (.e.g redirect to this page after flow initialized)
  const getFlow = useCallback(
    (flowId: string) =>
      sdk
        // the flow data contains the form fields, error messages and csrf token
        .getRegistrationFlow({ id: flowId })
        .then(({ data: flow }) => setFlow(flow))
        .catch(sdkErrorHandler),
    [],
  )

  // initialize the sdkError for generic handling of errors
  const sdkErrorHandler = sdkError(getFlow, setFlow, "/registration", true)

  // create a new registration flow
  const createFlow = () => {
    sdk
      // we don't need to specify the return_to here since we are building an SPA. In server-side browser flows we would need to specify the return_to
      .createBrowserRegistrationFlow()
      .then(({ data: flow }) => setFlow(flow))
      .catch(sdkErrorHandler)
  }

  // submit the registration form data to Ory
  const submitFlow = (body: UpdateRegistrationFlowBody) => {
    // something unexpected went wrong and the flow was not set
    if (!flow) return setLocation("/registration", { replace: true })

    sdk
      .updateRegistrationFlow({
        flow: flow.id,
        updateRegistrationFlowBody: body,
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
      flowType={"registration"}
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

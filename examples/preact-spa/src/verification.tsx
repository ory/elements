import { UpdateVerificationFlowBody, VerificationFlow } from "@ory/client"
import { UserAuthCard } from "@ory/elements-preact"
import { useCallback, useEffect, useState } from "preact/hooks"
import { getSearchParam, sdk, sdkError } from "./sdk"
import { useLocation } from "wouter"

export const Verification = () => {
  const [flow, setFlow] = useState<VerificationFlow | null>(null)
  const [location, setLocation] = useLocation()

  // Get the flow based on the flowId in the URL (.e.g redirect to this page after flow initialized)
  const getFlow = useCallback(
    (flowId: string) =>
      sdk
        // the flow data contains the form fields, error messages and csrf token
        .getVerificationFlow({ id: flowId })
        .then(({ data: flow }) => setFlow(flow))
        .catch(sdkErrorHandler),
    [],
  )

  // initialize the sdkError for generic handling of errors
  const sdkErrorHandler = sdkError(getFlow, setFlow, "/verification", true)

  // create a new verification flow
  const createFlow = () => {
    sdk
      .createBrowserVerificationFlow()
      // flow contains the form fields, error messages and csrf token
      .then(({ data: flow }) => setFlow(flow))
      .catch(sdkErrorHandler)
  }

  // submit the verification form data to Ory
  const submitFlow = (body: UpdateVerificationFlowBody) => {
    // something unexpected went wrong and the flow was not set
    if (!flow) return setLocation("/verification", { replace: true })

    sdk
      .updateVerificationFlow({
        flow: flow.id,
        updateVerificationFlowBody: body,
      })
      .then(({ data: flow }) => {
        setFlow(flow)
      })
      .catch(sdkErrorHandler)
  }

  useEffect(() => {
    // it could happen that we are redirected here with an existing flow
    const flowId = getSearchParam("flow")

    if (flowId) {
      // if the flow failed to get since it could be expired or invalid, we create a new one
      getFlow(flowId).catch(createFlow)
      return
    }
    createFlow()
  }, [])

  return flow ? (
    <UserAuthCard
      flow={flow}
      flowType={"verification"}
      additionalProps={{
        signupURL: "/registration",
      }}
      // submit the verification form data to Ory
      onSubmit={({ body }) => submitFlow(body as UpdateVerificationFlowBody)}
    />
  ) : (
    <div>Loading...</div>
  )
}

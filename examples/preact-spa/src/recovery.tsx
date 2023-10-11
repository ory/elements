import { RecoveryFlow, UpdateRecoveryFlowBody } from "@ory/client"
import { UserAuthCard } from "@ory/elements-preact"
import { useCallback, useEffect, useState } from "preact/hooks"
import { useLocation } from "wouter"
import { getSearchParam, sdk, sdkError } from "./sdk"

export const Recovery = () => {
  const [flow, setFlow] = useState<RecoveryFlow | null>(null)

  const [location, setLocation] = useLocation()

  const getFlow = useCallback(
    (flowId: string) =>
      sdk
        .getRecoveryFlow({ id: flowId })
        .then(({ data: flow }) => setFlow(flow))
        .catch(sdkErrorHandler),
    [],
  )

  // initialize the sdkError for generic handling of errors
  const sdkErrorHandler = sdkError(getFlow, setFlow, "/recovery")

  // create a new recovery flow
  const createFlow = () => {
    sdk
      .createBrowserRecoveryFlow()
      // flow contains the form fields, error messages and csrf token
      .then(({ data: flow }) => setFlow(flow))
      // something serious went wrong, so we redirect to the recovery page
      .catch(sdkErrorHandler)
  }

  const submitFlow = (body: UpdateRecoveryFlowBody) => {
    // something unexpected went wrong and the flow was not set
    if (!flow) return setLocation("/login", { replace: true })

    sdk
      .updateRecoveryFlow({
        flow: flow.id,
        updateRecoveryFlowBody: body as UpdateRecoveryFlowBody,
      })
      .then(({ data: flow }) => {
        // Form submission was successful, show the message to the user!
        setFlow(flow)
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
      flowType={"recovery"}
      additionalProps={{ loginURL: "/login" }}
      onSubmit={({ body }) => submitFlow(body as UpdateRecoveryFlowBody)}
    />
  ) : (
    <div>Loading...</div>
  )
}

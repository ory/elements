import { RecoveryFlow, UpdateRecoveryFlowBody } from "@ory/client"
import { UserAuthCard } from "@ory/elements"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { sdk, sdkError } from "./sdk"

export const Recovery = () => {
  const [flow, setFlow] = useState<RecoveryFlow | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const navigate = useNavigate()

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
      .then(({ data: flow }) => {
        // Update URI query params to include flow id
        setSearchParams({ ["flow"]: flow.id })
        // Set the flow data
        setFlow(flow)
      })
      .catch(sdkErrorHandler)
  }

  const submitFlow = (body: UpdateRecoveryFlowBody) => {
    // something unexpected went wrong and the flow was not set
    if (!flow) return navigate("/login", { replace: true })

    sdk
      .updateRecoveryFlow({ flow: flow.id, updateRecoveryFlowBody: body })
      .then(({ data: flow }) => {
        // Form submission was successful, show the message to the user!
        setFlow(flow)
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
    // We create a dynamic Recovery form based on the flow using Ory Elements
    <UserAuthCard
      flowType={"recovery"}
      // the flow is always required since it contains the UI form elements, UI error messages and csrf token
      flow={flow}
      // the recovery form should allow users to navigate to the login page
      additionalProps={{
        loginURL: {
          handler: () => {
            navigate(
              {
                pathname: "/login",
              },
              { replace: true },
            )
          },
        },
      }}
      // submit the form data to Ory
      onSubmit={({ body }) => submitFlow(body as UpdateRecoveryFlowBody)}
    />
  ) : (
    <div>Loading...</div>
  )
}

import { VerificationFlow, UpdateVerificationFlowBody } from "@ory/client"
import { UserAuthCard } from "@ory/elements"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { sdk, sdkError } from "./sdk"

export const Verification = (): JSX.Element => {
  const [flow, setFlow] = useState<VerificationFlow | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const navigate = useNavigate()

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
      .then(({ data: flow }) => {
        // Update URI query params to include flow id
        setSearchParams({ ["flow"]: flow.id })
        // Set the flow data
        setFlow(flow)
      })
      .catch(sdkErrorHandler)
  }

  // submit the verification form data to Ory
  const submitFlow = (body: UpdateVerificationFlowBody) => {
    // something unexpected went wrong and the flow was not set
    if (!flow) return navigate("/verification", { replace: true })

    sdk
      .updateVerificationFlow({
        flow: flow.id,
        updateVerificationFlowBody: body,
      })
      .then(({ data: flow }) => {
        setFlow(null)
        getFlow(flow.id)
      })
      .catch(sdkErrorHandler)
  }

  useEffect(() => {
    // it could happen that we are redirected here with an existing flow
    const flowId = searchParams.get("flow")
    if (flowId) {
      // if the flow failed to get since it could be expired or invalid, we create a new one
      getFlow(flowId).catch(createFlow)
      return
    }
    createFlow()
  }, [])

  // if the flow is not set, we show a loading indicator
  return flow ? (
    // create a new verification form with the flow data using Ory Elements
    <UserAuthCard
      flowType={"verification"}
      // we always need to provide the flow data since it contains the form fields, error messages and csrf token
      flow={flow}
      // we want users to be able to go back to the login page from the verification page
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

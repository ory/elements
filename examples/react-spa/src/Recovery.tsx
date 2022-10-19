import {
  SelfServiceRecoveryFlow,
  SubmitSelfServiceRecoveryFlowBody,
} from "@ory/client"
import { UserAuthCard } from "@ory/elements"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import sdk from "./sdk"

export const Recovery = () => {
  const [flow, setFlow] = useState<SelfServiceRecoveryFlow | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const navigate = useNavigate()

  // create a new recovery flow
  const createFlow = () =>
    useCallback(
      () =>
        sdk
          .initializeSelfServiceRecoveryFlowForBrowsers()
          // flow contains the form fields, error messages and csrf token
          .then(({ data: flow }) => setFlow(flow))
          // something serious went wrong so we redirect to the recovery page
          .catch((err) => {
            console.error(err)
            navigate("/recovery", { replace: true })
          }),
      [],
    )

  const getFlow = () => useCallback(() => {}, [])

  const submitFlow = (body: SubmitSelfServiceRecoveryFlowBody) => {
    // something unexpected went wrong and the flow was not set
    if (!flow) return navigate("/login", { replace: true })

    sdk
      .submitSelfServiceRecoveryFlow(
        flow.id,
        body as SubmitSelfServiceRecoveryFlowBody,
      )
      .then(() => {
        // we successfully submitted the login flow, so lets redirect to the dashboard
        navigate("/", { replace: true })
      })
      .catch((error) => {
        // the flow could contain error messages, so we set the flow again
        setFlow(error.response.data)
      })
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
      title="Recovery"
      flowType={"recovery"}
      // the flow is always required since it contains the UI form elements, UI error messages and csrf token
      flow={flow}
      // the recovery form should allow users to navigate to the login page
      additionalProps={{ loginURL: "/login" }}
      // submit the form data to Ory
      onSubmit={({ body }) =>
        submitFlow(body as SubmitSelfServiceRecoveryFlowBody)
      }
    />
  ) : (
    <div>Loading...</div>
  )
}

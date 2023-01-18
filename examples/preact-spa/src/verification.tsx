import { UpdateVerificationFlowBody, VerificationFlow } from "@ory/client"
import { UserAuthCard } from "@ory/elements-preact"
import { useCallback, useEffect, useState } from "preact/hooks"
import sdk from "./sdk"
import { useLocation } from "wouter"

export const Verification = () => {
  const [flow, setFlow] = useState<VerificationFlow | null>(null)
  const [location, setLocation] = useLocation()

  // create a new verification flow
  const createFlow = useCallback(
    () =>
      sdk
        .createBrowserVerificationFlow()
        // flow contains the form fields, error messages and csrf token
        .then(({ data: flow }) => {
          setFlow(flow)
        })
        // something serious went wrong so we redirect to the verification page
        .catch((error) => {
          console.error(error)
          setLocation("/verification", { replace: true })
        }),
    [],
  )

  // Get the flow based on the flowId in the URL (.e.g redirect to this page after flow initialized)
  const getFlow = useCallback(
    (flowId: string) =>
      sdk
        // the flow data contains the form fields, error messages and csrf token
        .getVerificationFlow({ id: flowId })
        .then(({ data: flow }) => setFlow(flow))
        .catch((err) => {
          console.error(err)
          return err
        }),
    [],
  )

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
      .catch((error) => {
        switch (error.response.status) {
          // some user input error occurred, so we update the flow which constains UI error messages
          case 400:
            setFlow(error.response.data)
            break
          // other errors we just redirect to the registration page
          case 410:
          case 404:
          default:
            return setLocation("/verification", { replace: true })
        }
      })
  }

  useEffect(() => {
    // it could happen that we are redirected here with an existing flow
    const flowId = new URLSearchParams(
      new URL(window.location.toString()).search,
    ).get("flow")

    if (flowId) {
      // if the flow failed to get since it could be expired or invalid, we create a new one
      getFlow(flowId).catch(createFlow)
      return
    }
    createFlow().catch((error) => console.error(error))
  }, [])

  return flow ? (
    <UserAuthCard
      flow={flow}
      flowType={"verification"}
      additionalProps={{
        loginURL: "/login",
      }}
      title="Verification"
      // submit the verification form data to Ory
      onSubmit={({ body }) => submitFlow(body as UpdateVerificationFlowBody)}
    />
  ) : (
    <div>Loading...</div>
  )
}

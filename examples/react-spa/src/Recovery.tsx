import { RecoveryFlow, UpdateRecoveryFlowBody } from "@ory/client"
import { UserAuthCard } from "@ory/elements"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import sdk from "./sdk"

export const Recovery = () => {
  const [flow, setFlow] = useState<RecoveryFlow | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const navigate = useNavigate()

  // create a new recovery flow
  const createFlow = () =>
    useCallback(
      () =>
        sdk
          .createBrowserRecoveryFlow()
          // flow contains the form fields, error messages and csrf token
          .then(({ data: flow }) => setFlow(flow))
          // something serious went wrong so we redirect to the recovery page
          .catch((err) => {
            console.error(err)
            navigate("/recovery", { replace: true })
          }),
      [],
    )

  const getFlow = useCallback(
    (flowId: string) =>
      sdk
        .getRecoveryFlow({ id: flowId })
        .then(({ data: flow }) => setFlow(flow))
        .catch((err) => {
          console.error(err)
          return err
        }),
    [],
  )

  const submitFlow = (body: UpdateRecoveryFlowBody) => {
    // something unexpected went wrong and the flow was not set
    if (!flow) return navigate("/login", { replace: true })

    sdk
      .updateRecoveryFlow({ flow: flow.id, updateRecoveryFlowBody: body })
      .then(() => {
        // we successfully submitted the login flow, so lets redirect to the dashboard
        navigate("/", { replace: true })
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
                navigate("/login", { replace: true })
              })
            break
          }
          // other errors we just redirect to the login page
          case 410:
          default:
            return navigate("/login", { replace: true })
        }
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
      onSubmit={({ body }) => submitFlow(body as UpdateRecoveryFlowBody)}
    />
  ) : (
    <div>Loading...</div>
  )
}

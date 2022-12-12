import { VerificationFlow, UpdateVerificationFlowBody } from "@ory/client"
import { UserAuthCard } from "@ory/elements"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import sdk from "./sdk"

export const Verification = (): JSX.Element => {
  const [flow, setFlow] = useState<VerificationFlow | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const navigate = useNavigate()

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
          navigate("/verification", { replace: true })
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
    if (!flow) return navigate("/verification", { replace: true })

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
          case 422:
            // we might have an expired flow or the verification flow was already submitted,
            // so we refresh it here
            const u = new URL(error.response.data.redirect_browser_to)
            // get new flow data based on the flow id in the redirect url
            getFlow(u.searchParams.get("flow") || "")
              // something unexpected went wrong and the flow was not set - redirect the user to the login page
              .catch((err) => {
                console.error(err)
                navigate("/verification", { replace: true })
              })
            break
          // other errors we just redirect to the registration page
          case 410:
          case 404:
          default:
            return navigate("/verification", { replace: true })
        }
      })
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
      title="Verification"
      flowType={"verification"}
      // we always need to provide the flow data since it contains the form fields, error messages and csrf token
      flow={flow}
      // we want users to be able to go back to the login page from the verification page
      additionalProps={{
        loginURL: "/login",
      }}
      // submit the verification form data to Ory
      onSubmit={({ body }) => submitFlow(body as UpdateVerificationFlowBody)}
    />
  ) : (
    <div>Loading...</div>
  )
}

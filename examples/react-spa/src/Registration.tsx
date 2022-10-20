import {
  SelfServiceRegistrationFlow,
  SubmitSelfServiceRegistrationFlowBody,
} from "@ory/client"
import { UserAuthCard } from "@ory/elements"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import sdk from "./sdk"

export const Registration = () => {
  const [flow, setFlow] = useState<SelfServiceRegistrationFlow | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const navigate = useNavigate()

  // create a new registration flow
  const createFlow = useCallback(
    () =>
      sdk
        // we don't need to specify the return_to here since we are building an SPA. In server-side browser flows we would need to specify the return_to
        .initializeSelfServiceRegistrationFlowForBrowsers()
        .then(({ data: flow }) => {
          setFlow(flow)
        })
        // something serious went wrong so we redirect to the registration page
        .catch((error) => {
          console.error(error)
          navigate("/registration", { replace: true })
        }),
    [],
  )

  // Get the flow based on the flowId in the URL (.e.g redirect to this page after flow initialized)
  const getFlow = useCallback(
    (flowId: string) =>
      sdk
        // the flow data contains the form fields, error messages and csrf token
        .getSelfServiceRegistrationFlow(flowId)
        .then(({ data: flow }) => setFlow(flow))
        .catch((err) => {
          console.error(err)
          return err
        }),
    [],
  )

  // submit the registration form data to Ory
  const submitFlow = (body: SubmitSelfServiceRegistrationFlowBody) => {
    // something unexpected went wrong and the flow was not set
    if (!flow) return navigate("/registration", { replace: true })

    sdk
      .submitSelfServiceRegistrationFlow(flow.id, body)
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
          case 422:
            // for webauthn we need to reload the flow
            const u = new URL(error.response.data.redirect_browser_to)
            // get new flow data based on the flow id in the redirect url
            sdk
              .getSelfServiceLoginFlow(u.searchParams.get("flow") || "")
              .then(({ data: flow }) => {
                setFlow(flow)
              })
              // something unexpected went wrong and the flow was not set - redirect the user to the login page
              .catch((err) => {
                console.error(err)
                navigate("/registration", { replace: true })
              })
            break
          // other errors we just redirect to the registration page
          case 410:
          case 404:
          default:
            return navigate("/registration", { replace: true })
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

  // the flow is not set yet, so we show a loading indicator
  return flow ? (
    // create a registration form that dynamically renders based on the flow data using Ory Elements
    <UserAuthCard
      title={"Registration"}
      flowType={"registration"}
      // we always need to pass the flow to the card since it contains the form fields, error messages and csrf token
      flow={flow}
      // the registration card needs a way to navigate to the login page
      additionalProps={{
        loginURL: "/login",
      }}
      // include the necessary scripts for webauthn to work
      includeScripts={true}
      // submit the registration form data to Ory
      onSubmit={({ body }) =>
        submitFlow(body as SubmitSelfServiceRegistrationFlowBody)
      }
    />
  ) : (
    <div>Loading...</div>
  )
}

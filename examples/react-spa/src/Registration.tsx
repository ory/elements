import { RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/client"
import { UserAuthCard } from "@ory/elements"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { sdk, sdkError } from "./sdk"

/** Registration is a React component that renders the Registration form using Ory Elements.
 * It is used to handle the registration flow for a variety of authentication methods.
 *
 * The Registration component also handles the OAuth2 registration flow (as an OAuth2 provider)
 * For more information regarding OAuth2 registration, please see the following documentation:
 * https://www.ory.sh/docs/oauth2-oidc/custom-login-consent/flow
 *
 */
export const Registration = () => {
  const [flow, setFlow] = useState<RegistrationFlow | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  // The return_to is a query parameter is set by you when you would like to redirect
  // the user back to a specific URL after registration is successful
  // In most cases it is not necessary to set a return_to if the UI business logic is
  // handled by the SPA.
  // In OAuth flows this value might be ignored in favor of keeping the OAuth flow
  // intact between multiple flows (e.g. Login -> Recovery -> Settings -> OAuth2 Consent)
  // https://www.ory.sh/docs/oauth2-oidc/identity-provider-integration-settings
  const returnTo = searchParams.get("return_to")

  // The login_challenge is a query parameter set by the Ory OAuth2 registration flow
  // Switching between pages should keep the login_challenge in the URL so that the
  // OAuth flow can be completed upon completion of another flow (e.g. Login).
  const loginChallenge = searchParams.get("login_challenge")

  const navigate = useNavigate()

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
      .createBrowserRegistrationFlow({
        ...(returnTo && { returnTo: returnTo }),
        ...(loginChallenge && { loginChallenge: loginChallenge }),
      })
      .then(({ data: flow }) => {
        // Update URI query params to include flow id
        setSearchParams({ ["flow"]: flow.id })
        // Set the flow data
        setFlow(flow)
      })
      .catch(sdkErrorHandler)
  }

  // submit the registration form data to Ory
  const submitFlow = (body: UpdateRegistrationFlowBody) => {
    // something unexpected went wrong and the flow was not set
    if (!flow) return navigate("/registration", { replace: true })

    sdk
      .updateRegistrationFlow({
        flow: flow.id,
        updateRegistrationFlowBody: body,
      })
      .then(() => {
        // we successfully submitted the login flow, so lets redirect to the dashboard
        navigate("/", { replace: true })
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
  }, [navigate])

  // the flow is not set yet, so we show a loading indicator
  return flow ? (
    // create a registration form that dynamically renders based on the flow data using Ory Elements
    <UserAuthCard
      flowType={"registration"}
      // we always need to pass the flow to the card since it contains the form fields, error messages and csrf token
      flow={flow}
      // the registration card needs a way to navigate to the login page
      additionalProps={{
        loginURL: {
          handler: () => {
            const search = new URLSearchParams()
            flow.return_to && search.set("return_to", flow.return_to)
            flow.oauth2_login_challenge &&
              search.set("login_challenge", flow.oauth2_login_challenge)
            navigate(
              { pathname: "/login", search: search.toString() },
              { replace: true },
            )
          },
        },
      }}
      // include the necessary scripts for webauthn to work
      includeScripts={true}
      // submit the registration form data to Ory
      onSubmit={({ body }) => submitFlow(body as UpdateRegistrationFlowBody)}
    />
  ) : (
    <div>Loading...</div>
  )
}

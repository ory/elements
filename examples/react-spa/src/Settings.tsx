import {
  SelfServiceSettingsFlow,
  SubmitSelfServiceSettingsFlowBody,
} from "@ory/client"
import {
  gridStyle,
  UserSettingsCard,
  UserSettingsFlowType,
} from "@ory/elements"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import sdk from "./sdk"

export const Settings = () => {
  const [flow, setFlow] = useState<SelfServiceSettingsFlow | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const navigate = useNavigate()

  const createFlow = useCallback(
    () =>
      sdk
        // create a new settings flow
        // the flow contains the form fields, error messages and csrf token
        // depending on the Ory Network project settings, the form fields returned may vary
        .initializeSelfServiceSettingsFlowForBrowsers()
        .then(({ data: flow }) => {
          setFlow(flow)
        })
        // something serious went wrong so we redirect to the settings page
        .catch((err) => {
          console.error(err)
          navigate("/settings", { replace: true })
        }),
    [],
  )

  // Get the flow based on the flowId in the URL (.e.g redirect to this page after flow initialized)
  const getFlow = useCallback(
    (flowId: string) =>
      sdk
        // the flow data contains the form fields, error messages and csrf token
        .getSelfServiceSettingsFlow(flowId)
        .then(({ data: flow }) => setFlow(flow))
        .catch((err) => {
          console.error(err)
          return err
        }),
    [],
  )

  // submit any of the settings form data to Ory
  const onSubmit = (body: SubmitSelfServiceSettingsFlowBody) => {
    // something unexpected went wrong and the flow was not set
    if (!flow) return navigate("/settings", { replace: true })

    sdk
      // submit the form data the user provided to Ory
      .submitSelfServiceSettingsFlow(flow.id, body)
      .then(({ data: flow }) => {
        setFlow(flow)
      })
      // it could happen that we are not signed in and should redirect to the login page
      // privileged endpoints like this one will return a 401 Unauthorized
      .catch((error) => {
        const { status } = error.response
        if (status === 401 || status === 403 || status === 410) {
          return navigate("/login", { replace: true })
        }
        // we need to set the flow data again here since the flow could contain error messages (e.g. status code 400)
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
    createFlow()
  }, [])

  // if the flow is not set, we show a loading indicator
  return flow ? (
    <div className={gridStyle({ gap: 16 })}>
      {/* here we simply map all of the settings flows we could have. These flows won't render if they aren't enabled inside your Ory Network project */}
      {(
        [
          "profile",
          "password",
          "totp",
          "webauthn",
          "lookupSecret",
        ] as UserSettingsFlowType[]
      ).map((flowType: UserSettingsFlowType, index) => (
        // here we render the settings flow using Ory Elements
        <UserSettingsCard
          key={index}
          // we always need to pass the component the flow since it contains the form fields, error messages and csrf token
          flow={flow}
          flowType={flowType}
          // include scripts for webauthn support
          includeScripts={true}
          // submit the form data the user provides to Ory
          onSubmit={({ body }) => onSubmit(body)}
        />
      ))}
    </div>
  ) : (
    <div>Loading...</div>
  )
}

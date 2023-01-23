import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client"
import {
  gridStyle,
  UserSettingsCard,
  UserSettingsFlowType,
  NodeMessages,
} from "@ory/elements"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { sdk, sdkError } from "./sdk"

export const Settings = () => {
  const [flow, setFlow] = useState<SettingsFlow | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const navigate = useNavigate()

  // Get the flow based on the flowId in the URL (.e.g redirect to this page after flow initialized)
  const getFlow = useCallback(
    (flowId: string) =>
      sdk
        // the flow data contains the form fields, error messages and csrf token
        .getSettingsFlow({ id: flowId })
        .then(({ data: flow }) => setFlow(flow))
        .catch(sdkErrorHandler),
    [],
  )

  // initialize the sdkError for generic handling of errors
  const sdkErrorHandler = sdkError(getFlow, setFlow, "/settings", true)

  const createFlow = () => {
    sdk
      // create a new settings flow
      // the flow contains the form fields, error messages and csrf token
      // depending on the Ory Network project settings, the form fields returned may vary
      .createBrowserSettingsFlow()
      .then(({ data: flow }) => {
        // Update URI query params to include flow id
        setSearchParams({ ["flow"]: flow.id })
        // Set the flow data
        setFlow(flow)
      })
      .catch(sdkErrorHandler)
  }

  // submit any of the settings form data to Ory
  const onSubmit = (body: UpdateSettingsFlowBody) => {
    // something unexpected went wrong and the flow was not set
    if (!flow) return navigate("/settings", { replace: true })

    sdk
      // submit the form data the user provided to Ory
      .updateSettingsFlow({ flow: flow.id, updateSettingsFlowBody: body })
      .then(({ data: flow }) => {
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
    createFlow()
  }, [])

  // if the flow is not set, we show a loading indicator
  return flow ? (
    <div className={gridStyle({ gap: 16 })}>
      <NodeMessages uiMessages={flow.ui.messages} />
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

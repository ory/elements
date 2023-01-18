import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client"
import {
  gridStyle,
  UserSettingsCard,
  UserSettingsFlowType,
} from "@ory/elements"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import sdk from "./sdk"

export const Settings = () => {
  const [flow, setFlow] = useState<SettingsFlow | null>(null)
  const [searchParams, /*setSearchParams*/] = useSearchParams()

  const navigate = useNavigate()

  const createFlow = useCallback(
    () =>
      sdk
        // create a new settings flow
        // the flow contains the form fields, error messages and csrf token
        // depending on the Ory Network project settings, the form fields returned may vary
        .createBrowserSettingsFlow()
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
        .getSettingsFlow({ id: flowId })
        .then(({ data: flow }) => setFlow(flow))
        .catch((err) => {
          console.error(err)
          return err
        }),
    [],
  )

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
      // it could happen that we are not signed in and should redirect to the login page
      // privileged endpoints like this one will return a 401 Unauthorized
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
          case 401:
          case 403:
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
    createFlow().catch(error => console.error(error))
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

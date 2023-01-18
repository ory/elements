import {
  gridStyle,
  UserSettingsFlowType,
  UserSettingsCard,
} from "@ory/elements-preact"
import { useCallback, useEffect, useState } from "preact/hooks"
import sdk from "./sdk"
import { useLocation } from "wouter"
import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client"

export const Settings = () => {
  const [flow, setFlow] = useState<SettingsFlow | null>(null)

  const [location, setLocation] = useLocation()

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
          setLocation("/settings", { replace: true })
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

  const onSubmit = (body: UpdateSettingsFlowBody) => {
    // something unexpected went wrong and the flow was not set
    if (!flow) return setLocation("/settings", { replace: true })

    sdk
      .updateSettingsFlow({
        flow: flow.id,
        updateSettingsFlowBody: body as UpdateSettingsFlowBody,
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
          case 422: {
            // for webauthn we need to reload the flow
            const u = new URL(error.response.data.redirect_browser_to)
            // get new flow data based on the flow id in the redirect url
            getFlow(u.searchParams.get("flow") || "")
              // something unexpected went wrong and the flow was not set - redirect the user to the login page
              .catch((err) => {
                console.error(err)
                setLocation("/login", { replace: true })
              })
            break
          }
          // other errors we just redirect to the login page
          case 401:
          case 403:
          case 410:
          default:
            return setLocation("/login", { replace: true })
        }
      })
  }

  useEffect(() => {
    // we might redirect to this page after the flow is initialized, so we check for the flowId in the URL
    const flowId = new URLSearchParams(
      new URL(window.location.toString()).search,
    ).get("flow")

    // the flow already exists
    if (flowId) {
      getFlow(flowId).catch(createFlow) // if for some reason the flow has expired, we need to get a new one
      return
    }
    createFlow().catch((error) => console.error(error))
  }, [])

  return flow ? (
    <div className={gridStyle({ gap: 16 })}>
      {(
        [
          "profile",
          "password",
          "totp",
          "webauthn",
          "lookupSecret",
        ] as UserSettingsFlowType[]
      ).map((flowType: UserSettingsFlowType, index) => (
        <UserSettingsCard
          key={index}
          flow={flow}
          flowType={flowType}
          includeScripts={true}
          onSubmit={({ body }) => onSubmit(body)}
        />
      ))}
    </div>
  ) : (
    <div>Loading...</div>
  )
}

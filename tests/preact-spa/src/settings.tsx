import { UserSettingsPage } from "@ory/elements-preact"
import { useEffect, useState } from "preact/hooks"
import sdk from "./sdk"
import { useLocation } from "wouter"
import {
  SelfServiceSettingsFlow,
  SubmitSelfServiceSettingsFlowBody,
} from "@ory/client"

export const Settings = () => {
  const [flow, setFlow] = useState<SelfServiceSettingsFlow | null>(null)

  const [location, setLocation] = useLocation()

  useEffect(() => {
    sdk
      .initializeSelfServiceSettingsFlowForBrowsers()
      .then(({ data: flow }) => {
        setFlow(flow)
      })
  }, [])

  return flow ? (
    <UserSettingsPage
      flow={flow}
      injectScripts={true}
      onSubmit={({ body }) => {
        console.log(body)
        sdk
          .submitSelfServiceSettingsFlow(
            flow.id,
            body as SubmitSelfServiceSettingsFlowBody,
          )
          .then(({ data: flow }) => {
            setFlow(flow)
          })
          .catch((error) => {
            if (error.response.status === 403) {
              return setLocation("/login", { replace: true })
            }
            setFlow(error.response.data)
          })
      }}
    />
  ) : (
    <div>Loading...</div>
  )
}

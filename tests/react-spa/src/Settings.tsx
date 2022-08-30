import React, { useEffect, useState } from "react"
import {
  SelfServiceSettingsFlow,
  SubmitSelfServiceSettingsFlowBody,
} from "@ory/client"
import { UserSettingsPage } from "@ory/elements"
import sdk from "./sdk"
import { useNavigate } from "react-router-dom"

export const Settings = () => {
  const [flow, setFlow] = useState<SelfServiceSettingsFlow | null>(null)

  const navigator = useNavigate()

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
              return navigator("/login", { replace: true })
            }
            setFlow(error.response.data)
          })
      }}
    />
  ) : (
    <div>Loading...</div>
  )
}

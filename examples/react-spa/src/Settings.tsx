import React, { useCallback, useEffect, useState } from "react"
import {
  SelfServiceSettingsFlow,
  SubmitSelfServiceSettingsFlowBody,
} from "@ory/client"
import {
  gridStyle,
  UserSettingsCard,
  UserSettingsFlowType,
} from "@ory/elements"
import sdk from "./sdk"
import { useNavigate } from "react-router-dom"

export const Settings = () => {
  const [flow, setFlow] = useState<SelfServiceSettingsFlow | null>(null)

  const navigator = useNavigate()

  const onSubmit = useCallback(
    ({
      flow,
      body,
    }: {
      flow: SelfServiceSettingsFlow
      body: SubmitSelfServiceSettingsFlowBody
    }) =>
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
        }),
    [],
  )

  useEffect(() => {
    sdk
      .initializeSelfServiceSettingsFlowForBrowsers()
      .then(({ data: flow }) => {
        setFlow(flow)
      })
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
          onSubmit={({ body }) => {
            onSubmit({ flow, body })
          }}
        />
      ))}
    </div>
  ) : (
    <div>Loading...</div>
  )
}

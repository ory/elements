import {
  gridStyle,
  UserSettingsFlowType,
  UserSettingsCard,
} from "@ory/elements-preact"
import { useCallback, useEffect, useState } from "preact/hooks"
import sdk from "./sdk"
import { useLocation } from "wouter"
import {
  SelfServiceSettingsFlow,
  SubmitSelfServiceSettingsFlowBody,
} from "@ory/client"

export const Settings = () => {
  const [flow, setFlow] = useState<SelfServiceSettingsFlow | null>(null)

  const [location, setLocation] = useLocation()

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
            return setLocation("/login", { replace: true })
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

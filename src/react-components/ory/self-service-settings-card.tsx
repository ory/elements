import React from "react"
import { SelfServiceSettingsFlow } from "@ory/client"
import { gridStyle } from "../../theme"
import { ProfileSettings } from "./profile-settings"
import { PasswordSettings } from "./password-settings"
import { WebAuthnSettings } from "./webauthn-settings"
import { OIDCSettings } from "./oidc-settings"
import { LookupSecretSettings } from "./lookup-secret-settings"
import { TOTPSettings } from "./totp-settings"
import { SelfServiceFlowFormAdditionalProps } from "./selfservice-flow-form"
import { useScriptNodes } from "./node-script"
import { Message } from "../message"

export type SelfServiceSettingsCardProps = {
  flow: SelfServiceSettingsFlow
  title: string
  injectScripts?: boolean
} & SelfServiceFlowFormAdditionalProps

export const SelfServiceSettingsCard = ({
  flow,
  title,
  injectScripts,
  onSubmit,
}: SelfServiceSettingsCardProps): JSX.Element => {
  if (injectScripts) {
    useScriptNodes({ nodes: flow.ui.nodes })
  }

  return (
    <div className={gridStyle({ gap: 16 })}>
      {flow.ui.messages && flow.ui.messages.length > 0 && (
        <Message severity={"error"}>
          {flow.ui.messages.map((m) => m.text).join(" ")}
        </Message>
      )}
      <ProfileSettings onSubmit={onSubmit} flow={flow} />
      <PasswordSettings onSubmit={onSubmit} flow={flow} />
      <OIDCSettings flow={flow} />
      <WebAuthnSettings onSubmit={onSubmit} flow={flow} />
      <LookupSecretSettings onSubmit={onSubmit} flow={flow} />
      <TOTPSettings onSubmit={onSubmit} flow={flow} />
    </div>
  )
}

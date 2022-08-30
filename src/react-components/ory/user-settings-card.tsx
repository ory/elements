import React from "react"
import { SelfServiceSettingsFlow } from "@ory/client"
import { gridStyle } from "../../theme"
import { WebAuthnSettings } from "./sections/webauthn-settings-section"
import { LookupSecretSettings } from "./sections/lookup-secret-settings-section"
import { UserAuthFormAdditionalProps } from "./helpers/user-auth-form"
import { Message } from "../message"
import { ProfileSettings } from "./sections/profile-settings-section"
import { PasswordSettings } from "./sections/password-settings-section"
import { useScriptNodes } from "./helpers/node-script"
import { OIDCSettings } from "./sections/oidc-settings-section"
import { TOTPSettings } from "./sections/totp-settings-section"

export type UserSettingsProps = {
  flow: SelfServiceSettingsFlow
  injectScripts?: boolean
} & UserAuthFormAdditionalProps

export const UserSettingsPage = ({
  flow,
  injectScripts,
  onSubmit,
}: UserSettingsProps): JSX.Element => {
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

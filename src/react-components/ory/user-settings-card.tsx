import React from "react"
import { SelfServiceSettingsFlow } from "@ory/client"
import { gridStyle } from "../../theme"
import { WebAuthnSettingsSection } from "./sections/webauthn-settings-section"
import { LookupSecretSettingsSection } from "./sections/lookup-secret-settings-section"
import {
  UserAuthForm,
  UserAuthFormAdditionalProps,
} from "./helpers/user-auth-form"
import { ProfileSettingsSection } from "./sections/profile-settings-section"
import { PasswordSettingsSection } from "./sections/password-settings-section"
import { useScriptNodes } from "./helpers/node-script"
import { OIDCSettingsSection } from "./sections/oidc-settings-section"
import { TOTPSettingsSection } from "./sections/totp-settings-section"
import { Card } from "../card"
import { Divider } from "../divider"
import { Typography } from "../typography"

export type UserSettingsFlowType =
  | "profile"
  | "password"
  | "totp"
  | "webauthn"
  | "oidc"
  | "lookupSecret"

export type UserSettingsCardProps = {
  flow: SelfServiceSettingsFlow
  flowType: UserSettingsFlowType
  title?: string
  includeScripts?: boolean
} & UserAuthFormAdditionalProps

export const UserSettingsCard = ({
  flow,
  flowType,
  title,
  includeScripts,
  onSubmit,
}: UserSettingsCardProps): JSX.Element | null => {
  if (includeScripts) {
    useScriptNodes({ nodes: flow.ui.nodes })
  }

  let $flow = null
  let cardTitle = ""

  switch (flowType) {
    case "profile":
      cardTitle = title || "Profile Settings"
      $flow = <ProfileSettingsSection flow={flow} />
      break
    case "password":
      cardTitle = title || "Change Password"
      $flow = <PasswordSettingsSection flow={flow} />
      break
    case "webauthn":
      cardTitle = title || "Manage Hardware Tokens"
      $flow = <WebAuthnSettingsSection flow={flow} />
      break
    case "lookupSecret":
      cardTitle = title || "Manage 2FA Backup Recovery Codes"
      $flow = <LookupSecretSettingsSection flow={flow} />
      break
    case "oidc":
      cardTitle = title || "Social Sign In"
      $flow = <OIDCSettingsSection flow={flow} />
      break
    case "totp":
      cardTitle = title || "Manage 2FA TOTP Authenticator App"
      $flow = <TOTPSettingsSection flow={flow} />
      break
    default:
      $flow = null
  }

  return $flow ? (
    <div className={gridStyle({ gap: 32 })}>
      {cardTitle && (
        <Typography size={"headline26"} color={"foregroundDefault"}>
          {cardTitle}
        </Typography>
      )}
      <UserAuthForm flow={flow} onSubmit={onSubmit}>
        {$flow}
      </UserAuthForm>
    </div>
  ) : null
}

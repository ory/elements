// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { SettingsFlow } from "@ory/client"
import cn from "classnames"
import { JSX } from "react"

import { colorSprinkle, gridStyle, typographyStyle } from "../../theme"
import { useScriptNodes } from "./helpers/node-script"
import {
  UserAuthForm,
  UserAuthFormAdditionalProps,
} from "./helpers/user-auth-form"
import {
  hasLookupSecret,
  hasOidc,
  hasPasskey,
  hasPassword,
  hasTotp,
  hasWebauthn,
} from "./helpers/utils"
import { LookupSecretSettingsSection } from "./sections/lookup-secret-settings-section"
import { OIDCSettingsSection } from "./sections/oidc-settings-section"
import { PasswordSettingsSection } from "./sections/password-settings-section"
import { ProfileSettingsSection } from "./sections/profile-section"
import { TOTPSettingsSection } from "./sections/totp-settings-section"
import { WebAuthnSettingsSection } from "./sections/webauthn-settings-section"
import { useIntl } from "react-intl"
import { PasskeySettingsSection } from "./sections/passkey-settings-section"
import { Divider } from "../divider"

export type UserSettingsFlowType =
  | "profile"
  | "password"
  | "totp"
  | "webauthn"
  | "passkey"
  | "oidc"
  | "lookup_secret"

export type UserSettingsCardProps = {
  flow: SettingsFlow
  method: UserSettingsFlowType
  title?: string
  includeScripts?: boolean
  className?: string
  dividerClassName?: string
} & UserAuthFormAdditionalProps

export const UserSettingsCard = ({
  flow,
  method,
  title,
  includeScripts,
  onSubmit,
  className,
  dividerClassName,
}: UserSettingsCardProps): JSX.Element | null => {
  const intl = useIntl()

  if (includeScripts) {
    useScriptNodes({ nodes: flow.ui.nodes })
  }

  let hasFlow = false
  let $flow: JSX.Element | null = null
  let cardTitle = ""

  switch (method) {
    case "profile":
      hasFlow = true
      cardTitle =
        title ??
        intl.formatMessage({
          id: "settings.title-profile",
          defaultMessage: "Profile Settings",
        })
      $flow = <ProfileSettingsSection flow={flow} />
      break
    case "password":
      if (hasPassword(flow.ui.nodes)) {
        hasFlow = true
        cardTitle =
          title ??
          intl.formatMessage({
            id: "settings.title-password",
            defaultMessage: "Change Password",
          })
        $flow = <PasswordSettingsSection flow={flow} />
      }
      break
    case "webauthn":
      if (hasWebauthn(flow.ui.nodes)) {
        hasFlow = true
        cardTitle =
          title ??
          intl.formatMessage({
            id: "settings.title-webauthn",
            defaultMessage: "Manage Hardware Tokens",
          })
        $flow = <WebAuthnSettingsSection flow={flow} />
      }
      break
    case "passkey":
      if (hasPasskey(flow.ui.nodes)) {
        hasFlow = true
        cardTitle =
          title ??
          intl.formatMessage({
            id: "settings.title-passkey",
            defaultMessage: "Manage Passkeys",
          })
        $flow = <PasskeySettingsSection flow={flow} />
      }
      break
    case "lookup_secret":
      if (hasLookupSecret(flow.ui.nodes)) {
        hasFlow = true
        cardTitle =
          title ??
          intl.formatMessage({
            id: "settings.title-lookup-secret",
            defaultMessage: "Manage 2FA Backup Recovery Codes",
          })
        $flow = <LookupSecretSettingsSection flow={flow} />
      }
      break
    case "oidc":
      if (hasOidc(flow.ui.nodes)) {
        hasFlow = true
        cardTitle =
          title ??
          intl.formatMessage({
            id: "settings.title-oidc",
            defaultMessage: "Social Sign In",
          })
        $flow = <OIDCSettingsSection flow={flow} />
      }
      break
    case "totp":
      if (hasTotp(flow.ui.nodes)) {
        hasFlow = true
        cardTitle =
          title ??
          intl.formatMessage({
            id: "settings.title-totp",
            defaultMessage: "Manage 2FA TOTP Authenticator App",
          })
        $flow = <TOTPSettingsSection flow={flow} />
      }
      break
    default:
      $flow = null
  }

  return hasFlow ? (
    <>
      <div className={gridStyle({ gap: 32 })}>
        {cardTitle && (
          <h3
            className={cn(
              typographyStyle({ size: "headline26", type: "regular" }),
              colorSprinkle({ color: "foregroundDefault" }),
            )}
          >
            {cardTitle}
          </h3>
        )}
        <UserAuthForm
          flow={flow}
          onSubmit={onSubmit}
          className={className}
          data-testid={`${method}-settings-card`}
        >
          {$flow}
        </UserAuthForm>
      </div>
      <Divider fullWidth={false} className={dividerClassName} />
    </>
  ) : null
}

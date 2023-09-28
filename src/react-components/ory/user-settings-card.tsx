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
  hasPassword,
  hasTotp,
  hasWebauthn,
} from "./helpers/utils"
import { LookupSecretSettingsSection } from "./sections/lookup-secret-settings-section"
import { OIDCSettingsSection } from "./sections/oidc-settings-section"
import { PasswordSettingsSection } from "./sections/password-settings-section"
import { ProfileSettingsSection } from "./sections/profile-settings-section"
import { TOTPSettingsSection } from "./sections/totp-settings-section"
import { WebAuthnSettingsSection } from "./sections/webauthn-settings-section"
import { useIntl } from "react-intl"

export type UserSettingsFlowType =
  | "profile"
  | "password"
  | "totp"
  | "webauthn"
  | "oidc"
  | "lookupSecret"

export type UserSettingsCardProps = {
  flow: SettingsFlow
  flowType: UserSettingsFlowType
  title?: string
  includeScripts?: boolean
  className?: string
} & UserAuthFormAdditionalProps

export const UserSettingsCard = ({
  flow,
  flowType,
  title,
  includeScripts,
  onSubmit,
  className,
}: UserSettingsCardProps): JSX.Element | null => {
  const intl = useIntl()

  if (includeScripts) {
    useScriptNodes({ nodes: flow.ui.nodes })
  }

  let hasFlow = false
  let $flow: JSX.Element | null = null
  let cardTitle = ""

  switch (flowType) {
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
    case "lookupSecret":
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
        data-testid={`${flowType}-settings-card`}
      >
        {$flow}
      </UserAuthForm>
    </div>
  ) : null
}

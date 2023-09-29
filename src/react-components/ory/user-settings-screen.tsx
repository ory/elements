import { Nav } from "../nav"
import { Typography } from "../typography"
import { FormattedMessage, useIntl } from "react-intl"
import { SettingsFlow } from "@ory/client"
import { NodeMessages } from "./helpers/error-messages"
import { Divider } from "../divider"
import { UserSettingsCard, UserSettingsFlowType } from "./user-settings-card"
import { NavSectionLinks } from "../nav"
import {
  hasOidc,
  hasPassword,
  hasLookupSecret,
  hasTotp,
  hasWebauthn,
} from "./helpers/utils"

/**
 * UserSettingsScreenProps
 * @param navClassName - css class overrides for the Nav
 * @param headerContainerClassName - css class overrides for the header container
 * @param dividerClassName - css class overrides for the divider
 * @param settingsCardContainerClassName - css class overrides for the settings card container
 * @param flow - the Ory Settings flow object
 * @param logoutUrl - the logout url
 */
export interface UserSettingsScreenProps {
  navClassName?: string
  headerContainerClassName?: string
  dividerClassName?: string
  settingsCardContainerClassName?: string
  flow: SettingsFlow
  logoutUrl: string
}

const nav = ({
  navClassName,
  flow,
  logoutUrl,
}: Pick<UserSettingsScreenProps, "navClassName" | "flow" | "logoutUrl">) => {
  const intl = useIntl()
  return (
    <Nav
      className={navClassName}
      navTitle={intl.formatMessage({
        id: "settings.title-navigation",
        defaultMessage: "Account Settings",
      })}
      navSections={[
        {
          links: [
            {
              name: intl.formatMessage({
                id: "settings.navigation-profile",
                defaultMessage: "Profile",
              }),
              href: "#profile",
              iconLeft: "user",
              testId: "profile",
            },
            hasPassword(flow.ui.nodes) && {
              name: intl.formatMessage({
                id: "settings.navigation-password",
                defaultMessage: "Password",
              }),
              href: "#password",
              iconLeft: "lock",
              testId: "password",
            },
            hasOidc(flow.ui.nodes) && {
              name: intl.formatMessage({
                id: "settings.navigation-oidc",
                defaultMessage: "Social Sign In",
              }),
              href: "#oidc",
              iconLeft: "comments",
              testId: "oidc",
            },
            hasLookupSecret(flow.ui.nodes) && {
              name: intl.formatMessage({
                id: "settings.navigation-backup-codes",
                defaultMessage: "2FA Backup Codes",
              }),
              href: "#lookupSecret",
              iconLeft: "shield",
              testId: "backup-codes",
            },
            hasWebauthn(flow.ui.nodes) && {
              name: intl.formatMessage({
                id: "settings.navigation-webauthn",
                defaultMessage: "Hardware Tokens",
              }),
              href: "#webauthn",
              iconLeft: "key",
              testId: "webauthn",
            },
            hasTotp(flow.ui.nodes) && {
              name: intl.formatMessage({
                id: "settings.navigation-totp",
                defaultMessage: "Authenticator App",
              }),
              href: "#totp",
              iconLeft: "mobile",
              testId: "totp",
            },
          ].filter(Boolean) as NavSectionLinks[],
        },
        {
          links: [
            {
              name: intl.formatMessage({
                id: "settings.navigation-logout",
                defaultMessage: "Logout",
              }),
              href: logoutUrl,
              iconLeft: "arrow-right-to-bracket",
              testId: "logout",
            },
          ],
        },
      ]}
    />
  )
}

const body = ({
  headerContainerClassName,
  dividerClassName,
  settingsCardContainerClassName,
  flow,
}: Omit<UserSettingsScreenProps, "navClassName" | "logoutUrl">) => (
  <>
    <div className={headerContainerClassName}>
      <Typography size="headline37" color="foregroundDefault">
        <FormattedMessage
          id="settings.title"
          defaultMessage="Account Settings"
        />
      </Typography>
      <Typography color="foregroundMuted" size="small">
        <FormattedMessage
          id="settings.subtitle-instructions"
          defaultMessage="Here you can manage settings related to your account. Keep in mind that certain actions require you to re-authenticate."
        />
      </Typography>
      <NodeMessages uiMessages={flow.ui.messages} textPosition="start" />
      <Divider fullWidth={false} className={dividerClassName} />
    </div>

    {(
      [
        "profile",
        "password",
        "oidc",
        "lookupSecret",
        "webauthn",
        "totp",
      ] as UserSettingsFlowType[]
    ).map((flowType) => {
      const $card = <UserSettingsCard flowType={flowType} flow={flow} />
      if (!$card) {
        return null
      }
      return (
        <div
          className={settingsCardContainerClassName}
          id={flowType}
          key={flowType}
        >
          {$card}
          <Divider fullWidth={false} className={dividerClassName} />
        </div>
      )
    })}
  </>
)

export const UserSettingsScreen = {
  Nav: nav,
  Body: body,
}

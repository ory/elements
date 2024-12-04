// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { SettingsFlow } from "@ory/client"
import { FormattedMessage, useIntl } from "react-intl"
import { Divider } from "../divider"
import { Nav, NavSectionLinks } from "../nav"
import { Typography } from "../typography"
import { NodeMessages } from "./helpers/error-messages"
import {
  hasLookupSecret,
  hasOidc,
  hasPasskey,
  hasPassword,
  hasTotp,
  hasWebauthn,
} from "./helpers/utils"
import { UserSettingsCard, UserSettingsFlowType } from "./user-settings-card"

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

export interface SettingScreenNavigationProps {
  navClassName?: string
  flow: SettingsFlow
  logoutUrl: string
  backUrl?: string
}

const SettingScreenNavigation = ({
  navClassName,
  flow,
  logoutUrl,
  backUrl,
}: SettingScreenNavigationProps) => {
  const intl = useIntl()
  return (
    <Nav
      className={navClassName}
      navTitle={intl.formatMessage({
        id: "settings.title-navigation",
        defaultMessage: "Account Settings",
      })}
      navSections={[
        ...(backUrl
          ? [
              {
                links: [
                  {
                    name: intl.formatMessage({
                      id: "settings.navigation-back-button",
                      defaultMessage: "Back",
                    }),
                    href: backUrl,
                    iconLeft: "arrow-left",
                    testId: "profile",
                  },
                ],
              },
            ]
          : []),
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
              href: "#lookup_secret",
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
            hasPasskey(flow.ui.nodes) && {
              name: intl.formatMessage({
                id: "settings.navigation-passkey",
                defaultMessage: "Passkeys",
              }),
              href: "#passkey",
              iconLeft: "fingerprint",
              testId: "passkey",
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

const settingsScreenMethods: UserSettingsFlowType[] = [
  "profile",
  "password",
  "oidc",
  "lookup_secret",
  "webauthn",
  "passkey",
  "totp",
]

const SettingsScreenBody = ({
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

    {settingsScreenMethods.map((method) => {
      return (
        <div
          className={settingsCardContainerClassName}
          id={method}
          key={method}
        >
          <UserSettingsCard method={method} flow={flow} />
        </div>
      )
    })}
  </>
)

export const UserSettingsScreen = {
  Nav: SettingScreenNavigation,
  Body: SettingsScreenBody,
}

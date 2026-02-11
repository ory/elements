// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNodeGroupEnum } from "@ory/client-fetch"
import { defineMessages } from "react-intl"

export const settingsCardTitles = defineMessages<string>({
  [UiNodeGroupEnum.Totp]: {
    id: "settings.totp.title",
    defaultMessage: "Authenticator App",
  },
  [UiNodeGroupEnum.LookupSecret]: {
    id: "settings.lookup_secret.title",
    defaultMessage: "Backup Recovery Codes (second factor)",
  },
  [UiNodeGroupEnum.Oidc]: {
    id: "settings.oidc.title",
    defaultMessage: "Connected accounts",
  },
  [UiNodeGroupEnum.Passkey]: {
    id: "settings.passkey.title",
    defaultMessage: "Manage Passkeys",
  },
  [UiNodeGroupEnum.Profile]: {
    id: "settings.profile.title",
    defaultMessage: "Profile Settings",
  },
  [UiNodeGroupEnum.Password]: {
    id: "settings.password.title",
    defaultMessage: "Change Password",
  },
  [UiNodeGroupEnum.Webauthn]: {
    id: "settings.webauthn.title",
    defaultMessage: "Manage Hardware Tokens",
  },
})

export function settingsCardTitleMessage(group: UiNodeGroupEnum) {
  if (group in settingsCardTitles) {
    return settingsCardTitles[group]
  }
  return { id: `settings.${group}.title` }
}

export const settingsCardDescriptions = defineMessages<string>({
  [UiNodeGroupEnum.Totp]: {
    id: "settings.totp.description",
    defaultMessage:
      "Add a TOTP Authenticator App to your account to improve your account security. Popular Authenticator Apps are LastPass and Google Authenticator",
  },
  [UiNodeGroupEnum.LookupSecret]: {
    id: "settings.lookup_secret.description",
    defaultMessage:
      "Recovery codes are a secure backup for 2FA, allowing you to regain access to your account if you lose your 2FA device.",
  },
  [UiNodeGroupEnum.Oidc]: {
    id: "settings.oidc.description",
    defaultMessage: "Connect a social login provider with your account.",
  },
  [UiNodeGroupEnum.Passkey]: {
    id: "settings.passkey.description",
    defaultMessage: "Manage your passkey settings",
  },
  [UiNodeGroupEnum.Profile]: {
    id: "settings.profile.description",
    defaultMessage: "Update your profile information",
  },
  [UiNodeGroupEnum.Password]: {
    id: "settings.password.description",
    defaultMessage: "Modify your password",
  },
  [UiNodeGroupEnum.Webauthn]: {
    id: "settings.webauthn.description",
    defaultMessage: "Manage your hardware token settings",
  },
})

export function settingsCardDescriptionMessage(group: UiNodeGroupEnum) {
  if (group in settingsCardDescriptions) {
    return settingsCardDescriptions[group]
  }
  return {
    id: `settings.${group}.description`,
  }
}

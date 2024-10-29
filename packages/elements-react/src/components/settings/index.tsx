// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from "@ory/client-fetch"

export * from "./settings-card"

export type OrySettingsRecoveryCodesProps = {
  codes: string[]
  regnerateButton?: UiNode
  revealButton?: UiNode
}

export type OrySettingsTotpProps =
  | {
      totpImage: UiNode
      totpSecret: UiNode
      totpInput: UiNode
    }
  | {
      totpUnlink: UiNode
    }

export type OrySettingsOidcProps = {
  linkButtons: UiNode[]
  unlinkButtons: UiNode[]
}

export type OrySettingsWebauthnProps = {
  nameInput: UiNode
  triggerButton: UiNode & { onClick: () => void }
  removeButtons: UiNode[]
}

export type OrySettingsPasskeyProps = {
  triggerButton: UiNode & { onClick: () => void }
  removeButtons: UiNode[]
}

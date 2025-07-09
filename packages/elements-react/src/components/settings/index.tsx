// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from "@ory/client-fetch"

export * from "./settings-card"

export type OrySettingsRecoveryCodesProps = {
  codes: string[]
  regnerateButton: UiNode | undefined
  revealButton: UiNode | undefined
  onRegenerate: () => void
  onReveal: () => void
}

export type OrySettingsTotpProps = {
  totpImage: UiNode | undefined
  totpSecret: UiNode | undefined
  totpInput: UiNode | undefined
  totpUnlink: UiNode | undefined
  onUnlink: () => void
}

export type OrySettingsSsoProps = {
  linkButtons: (UiNode & { onClick: () => void })[]
  unlinkButtons: (UiNode & { onClick: () => void })[]
}

export type OrySettingsWebauthnProps = {
  nameInput: UiNode
  triggerButton: UiNode & { onClick: () => void }
  removeButtons: (UiNode & { onClick: () => void })[]
}

export type OrySettingsPasskeyProps = {
  triggerButton: UiNode & { onClick: () => void }
  removeButtons: (UiNode & { onClick: () => void })[]
}

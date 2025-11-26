// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryNodeButtonButtonProps } from "../../types"
import {
  UiNodeImage,
  UiNodeInput,
  UiNodeText,
} from "../../util/utilFixSDKTypesHelper"

export * from "./settings-card"

export type OrySettingsRecoveryCodesProps = {
  codes: string[]
  regenerateButton: UiNodeInput | undefined
  revealButton: UiNodeInput | undefined
  onRegenerate: () => void
  onReveal: () => void
  isSubmitting: boolean
}

export type OrySettingsTotpProps = {
  totpImage: UiNodeImage | undefined
  totpSecret: UiNodeText | undefined
  totpInput: UiNodeInput | undefined
  totpUnlink: UiNodeInput | undefined
  onUnlink: () => void
  isSubmitting: boolean
}

/**
 * Props for a button used in the settings flow
 */
export type OryNodeSettingsButton = {
  /** @deprecated - use buttonProps.onClick */
  onClick: () => void
  buttonProps: OryNodeButtonButtonProps
} & UiNodeInput

export type OrySettingsSsoProps = {
  linkButtons: OryNodeSettingsButton[]
  unlinkButtons: OryNodeSettingsButton[]
  isSubmitting: boolean
}

export type OrySettingsWebauthnProps = {
  nameInput: UiNodeInput
  triggerButton: OryNodeSettingsButton
  removeButtons: OryNodeSettingsButton[]
  isSubmitting: boolean
}

export type OrySettingsPasskeyProps = {
  triggerButton: OryNodeSettingsButton
  removeButtons: OryNodeSettingsButton[]
  isSubmitting: boolean
}

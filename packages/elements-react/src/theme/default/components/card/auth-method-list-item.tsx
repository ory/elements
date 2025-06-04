// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryCardAuthMethodListItemProps } from "@ory/elements-react"
import { useIntl } from "react-intl"
import code from "../../assets/icons/code.svg"
import passkey from "../../assets/icons/passkey.svg"
import password from "../../assets/icons/password.svg"
import webauthn from "../../assets/icons/webauthn.svg"
import hardware_token from "../../assets/icons/passkey.svg"
import totp from "../../assets/icons/totp.svg"
import lookup_secret from "../../assets/icons/code-asterix.svg"
import logos from "../../provider-logos"
import { isGroupImmediateSubmit } from "../../utils/form"
import { ListItem } from "./list-item"
import { useFormContext } from "react-hook-form"

const iconsMap: Record<string, typeof code> = {
  code,
  passkey,
  password,
  webauthn,
  hardware_token,
  totp,
  lookup_secret,
  ...logos,
}

export function DefaultAuthMethodListItem({
  onClick,
  group,
  title,
}: OryCardAuthMethodListItemProps) {
  const intl = useIntl()
  const Icon = iconsMap[group] || null

  const { formState } = useFormContext()

  return (
    <ListItem
      as="button"
      icon={Icon}
      title={intl.formatMessage(
        { id: title?.id ?? `two-step.${group}.title` },
        title?.values,
      )}
      description={intl.formatMessage({
        id: `two-step.${group}.description`,
      })}
      onClick={onClick}
      type={isGroupImmediateSubmit(group) ? "submit" : "button"}
      data-testid={`ory/form/auth-picker/${group}`}
      disabled={!formState.isReady}
    />
  )
}

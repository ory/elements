// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryCardAuthMethodListItemProps } from "@ory/elements-react"
import { useIntl } from "react-intl"
import code from "../../assets/icons/code.svg"
import passkey from "../../assets/icons/passkey.svg"
import password from "../../assets/icons/password.svg"
import webauthn from "../../assets/icons/webauthn.svg"
import logos from "../../provider-logos"
import { isGroupImmediateSubmit } from "../../utils/form"
import { ListItem } from "./list-item"

const iconsMap: Record<string, typeof code> = {
  code,
  passkey,
  password,
  webauthn,
  ...logos,
}

export function DefaultAuthMethodListItem({
  onClick,
  group,
}: OryCardAuthMethodListItemProps) {
  const intl = useIntl()
  const Icon = iconsMap[group] || null

  return (
    <ListItem
      as="button"
      icon={Icon}
      title={intl.formatMessage({ id: `two-step.${group}.title` })}
      description={intl.formatMessage({
        id: `two-step.${group}.description`,
      })}
      onClick={onClick}
      type={isGroupImmediateSubmit(group) ? "submit" : "button"}
      data-testid={`ory/form/auth-picker/${group}`}
    />
  )
}

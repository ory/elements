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
    <button
      className="flex cursor-pointer gap-3 text-left items-start w-full rounded-buttons p-2 hover:bg-interface-background-default-primary-hover"
      onClick={onClick}
      type={isGroupImmediateSubmit(group) ? "submit" : "button"}
      data-testid={`ory/form/auth-picker/${group}`}
      aria-label={`Authenticate with ${group}`}
    >
      <span className="mt-1">
        {Icon && (
          <Icon size={16} className="text-interface-foreground-brand-primary" />
        )}
      </span>
      <span className="flex-1 leading-normal inline-flex flex-col">
        <span className="text-interface-foreground-default-primary">
          {intl.formatMessage({ id: `two-step.${group}.title` })}
        </span>
        <span className="text-interface-foreground-default-secondary">
          {intl.formatMessage({
            id: `two-step.${group}.description`,
          })}
        </span>
      </span>
    </button>
  )
}

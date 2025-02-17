// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  OryCardAuthMethodListItemProps,
  uiTextToFormattedMessage,
} from "@ory/elements-react"
import { useIntl } from "react-intl"
import code from "../../assets/icons/code.svg"
import passkey from "../../assets/icons/passkey.svg"
import password from "../../assets/icons/password.svg"
import webauthn from "../../assets/icons/webauthn.svg"
import { isGroupImmediateSubmit } from "../../utils/form"
import logos from "../../provider-logos"

const iconsMap: Record<string, typeof code> = {
  code,
  passkey,
  password,
  webauthn,
  ...logos,
}

export function DefaultAuthMethodListItem({
  onClick,
  option,
}: OryCardAuthMethodListItemProps) {
  const intl = useIntl()
  const Icon = iconsMap[option.iconId ?? option.group] || null

  return (
    <div className="w-full rounded px-2 py-1 hover:bg-interface-background-default-primary-hover">
      <button
        className="flex cursor-pointer gap-3 py-2 text-left items-start"
        onClick={onClick}
        type={isGroupImmediateSubmit(option.group) ? "submit" : "button"}
        data-testid={`ory/form/auth-picker/${option.group}`}
        aria-label={`Authenticate with ${option.group}`}
      >
        <span className="mt-1">
          {Icon && (
            <Icon
              size={16}
              className="text-interface-foreground-brand-primary"
            />
          )}
        </span>
        <span className="flex-1 leading-normal inline-flex flex-col">
          <span className="text-interface-foreground-default-primary">
            {option.label ??
              intl.formatMessage({ id: `two-step.${option.group}.title` })}
          </span>
          <span className="text-interface-foreground-default-secondary">
            {option.description
              ? uiTextToFormattedMessage(option.description, intl)
              : intl.formatMessage({
                  id: `two-step.${option.group}.description`,
                })}
          </span>
        </span>
      </button>
    </div>
  )
}

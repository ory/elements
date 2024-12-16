// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryCardAuthMethodListItemProps } from "@ory/elements-react"
import { useIntl } from "react-intl"
import code from "../../assets/icons/code.svg"
import passkey from "../../assets/icons/passkey.svg"
import password from "../../assets/icons/password.svg"
import webauthn from "../../assets/icons/webauthn.svg"
import { isGroupImmediateSubmit } from "../../utils/form"

const iconsMap: Record<string, typeof code> = {
  code,
  passkey,
  password,
  webauthn,
}

// TODO: create a next specific component with Image for this
export function DefaultAuthMethodListItem({
  onClick,
  group,
}: OryCardAuthMethodListItemProps) {
  const intl = useIntl()
  const Icon = iconsMap[group] || null

  return (
    <div className="w-full rounded px-2 py-1 hover:bg-forms-bg-hover">
      <button
        className="flex cursor-pointer gap-3 py-2 text-left"
        onClick={onClick}
        type={isGroupImmediateSubmit(group) ? "submit" : "button"}
        id={`auth-method-list-item-${group}`}
        data-testid="auth-method-list-item"
        aria-label={`Authenticate with ${group}`}
      >
        <div className={"mt-[2px] size-4 flex-none"}>
          {Icon && <Icon size={20} className="text-forms-fg-default" />}
        </div>
        <div className={"flex-1 text-sm leading-normal"}>
          <div className="text-sm text-forms-fg-default">
            {intl.formatMessage({ id: `two-step.${group}.title` })}
          </div>
          <div className="text-sm text-forms-fg-mute">
            {intl.formatMessage({ id: `two-step.${group}.description` })}
          </div>
        </div>
      </button>
    </div>
  )
}

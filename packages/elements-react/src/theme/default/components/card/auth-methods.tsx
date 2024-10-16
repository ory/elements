// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useIntl } from "react-intl"
import { OryCardAuthMethodListItemProps } from "@ory/elements-react"

import code from "../../assets/icons/code.svg"
import passkey from "../../assets/icons/passkey.svg"
import password from "../../assets/icons/password.svg"
import webauthn from "../../assets/icons/webauthn.svg"

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
    <div className="w-full hover:bg-forms-bg-hover px-2 py-1 rounded">
      <button
        className="flex text-left py-2 gap-3 cursor-pointer "
        onClick={onClick}
      >
        <div className={"flex-none w-4 h-4 mt-[2px]"}>
          {Icon && <Icon size={20} className="text-forms-fg-default" />}
        </div>
        <div className={"flex-1 text-sm leading-normal"}>
          <div className="text-forms-fg-default text-sm">
            {intl.formatMessage({ id: `two-step.${group}.title` })}
          </div>
          <div className="text-forms-fg-mute text-sm">
            {intl.formatMessage({ id: `two-step.${group}.description` })}
          </div>
        </div>
      </button>
    </div>
  )
}

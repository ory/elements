// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OrySettingsRecoveryCodesProps } from "@ory/elements-react"
import Download from "../../assets/icons/download.svg"
import Eye from "../../assets/icons/eye.svg"
import Refresh from "../../assets/icons/refresh.svg"
import { UiNode, UiNodeInputAttributes } from "@ory/client-fetch"
import { DefaultHorizontalDivider } from "../form/horizontal-divider"

interface SettingsRecoveryCodesProps extends OrySettingsRecoveryCodesProps {
  codes: string[]
  regenerateButton?: UiNode
  revealButton?: UiNode
}

export function DefaultSettingsRecoveryCodes({
  codes,
  regnerateButton,
  revealButton,
}: SettingsRecoveryCodesProps) {
  const onDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([codes.join("\n")], {
      type: "text/plain",
    })
    element.href = URL.createObjectURL(file)
    element.download = "recovery-codes.txt"
    document.body.appendChild(element)
    element.click()
  }

  const hasCodes = codes.length >= 1

  return (
    <div className="flex flex-col gap-8">
      <DefaultHorizontalDivider />
      <div className="flex justify-end gap-4">
        {regnerateButton && (
          <button
            {...(regnerateButton.attributes as UiNodeInputAttributes)}
            type="submit"
          >
            <Refresh
              size={24}
              className="cursor-pointer text-links-link-mute-default hover:text-links-link-mute-hover"
            />
          </button>
        )}
        {revealButton && (
          <button
            {...(revealButton.attributes as UiNodeInputAttributes)}
            type="submit"
          >
            <Eye
              size={24}
              className="cursor-pointer text-links-link-mute-default hover:text-links-link-mute-hover"
            />
          </button>
        )}
        {hasCodes ? (
          <Download
            size={24}
            onClick={onDownload}
            className="cursor-pointer text-links-link-mute-default hover:text-links-link-mute-hover"
          />
        ) : null}
      </div>
      {hasCodes ? (
        <div className="rounded-border-radius-cards bg-bg-default ring-1 ring-dialog-border-default p-6">
          <div className="grid grid-cols-6 gap-4 flex-wrap text-dialog-fg-default text-sm">
            {codes.map((code) => (
              <p key={code}>{code}</p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

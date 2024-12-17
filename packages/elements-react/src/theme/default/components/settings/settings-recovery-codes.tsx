// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNodeInputAttributes } from "@ory/client-fetch"
import { OrySettingsRecoveryCodesProps } from "@ory/elements-react"
import Download from "../../assets/icons/download.svg"
import Eye from "../../assets/icons/eye.svg"
import Refresh from "../../assets/icons/refresh.svg"
import { DefaultHorizontalDivider } from "../form/horizontal-divider"

export function DefaultSettingsRecoveryCodes({
  codes,
  regnerateButton,
  revealButton,
}: OrySettingsRecoveryCodesProps) {
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
              className="text-button-link-default-secondary hover:text-button-link-default-secondary-hover"
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
              className="text-button-link-default-secondary hover:text-button-link-default-secondary-hover"
            />
          </button>
        )}
        {hasCodes && (
          <button onClick={onDownload} type="button">
            <Download
              size={24}
              className="text-button-link-default-secondary hover:text-button-link-default-secondary-hover"
            />
          </button>
        )}
      </div>
      {hasCodes ? (
        <div className="rounded-general p-6 bg-interface-background-default-secondary border-interface-border-default-primary">
          <div className="grid grid-cols-5 flex-wrap gap-4 text-sm text-interface-foreground-default-primary">
            {codes.map((code) => (
              <p key={code}>{code}</p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

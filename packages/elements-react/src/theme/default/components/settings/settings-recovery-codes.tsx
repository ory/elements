// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNodeInputAttributes } from "@ory/client-fetch"
import { OrySettingsRecoveryCodesProps } from "@ory/elements-react"
import Download from "../../assets/icons/download.svg"
import Eye from "../../assets/icons/eye.svg"
import Refresh from "../../assets/icons/refresh.svg"
import { DefaultHorizontalDivider } from "../form/horizontal-divider"
import { useFormContext } from "react-hook-form"

export function DefaultSettingsRecoveryCodes({
  codes,
  regnerateButton,
  revealButton,
  onRegenerate,
  onReveal,
}: OrySettingsRecoveryCodesProps) {
  const {
    formState: { isSubmitting },
  } = useFormContext()
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
      {codes.length > 0 && <DefaultHorizontalDivider />}
      <div className="flex justify-between gap-4">
        <span className="text-interface-foreground-default-tertiary">
          {revealButton && "Reveal recovery codes"}
        </span>
        <div className="flex gap-2">
          {regnerateButton && codes.length > 0 && (
            <button
              {...(regnerateButton.attributes as UiNodeInputAttributes)}
              type="submit"
              className="ml-auto"
              onClick={onRegenerate}
              disabled={isSubmitting}
              data-loading={isSubmitting}
            >
              <Refresh
                size={24}
                className="text-button-link-default-secondary hover:text-button-link-default-secondary-hover"
              />
            </button>
          )}
          {revealButton && (
            <>
              <button
                {...(revealButton.attributes as UiNodeInputAttributes)}
                type="submit"
                className="ml-auto"
                onClick={onReveal}
                title="Reveal recovery codes"
              >
                <Eye
                  size={24}
                  className="text-button-link-default-secondary hover:text-button-link-default-secondary-hover"
                />
              </button>
            </>
          )}
          {hasCodes && (
            <button
              onClick={onDownload}
              type="button"
              className="ml-auto"
              data-testid="ory/screen/settings/group/recovery_code/download"
              title="Download recovery codes"
            >
              <Download
                size={24}
                className="text-button-link-default-secondary hover:text-button-link-default-secondary-hover"
              />
            </button>
          )}
        </div>
      </div>
      {hasCodes ? (
        <div className="rounded-general border-interface-border-default-primary bg-interface-background-default-secondary p-6">
          <div
            className="grid grid-cols-2 flex-wrap gap-4 text-sm text-interface-foreground-default-primary sm:grid-cols-3 md:grid-cols-5"
            data-testid="ory/screen/settings/group/recovery_code/codes"
          >
            {codes.map((code) => (
              <p key={code}>{code}</p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

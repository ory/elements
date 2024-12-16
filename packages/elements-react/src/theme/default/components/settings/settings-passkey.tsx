// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OrySettingsPasskeyProps } from "@ory/elements-react"
import { UiNodeInputAttributes } from "@ory/client-fetch"
import { DefaultButton } from "../form/button"
import { DefaultHorizontalDivider } from "../form/horizontal-divider"
import Passkey from "../../assets/icons/passkey.svg"
import Trash from "../../assets/icons/trash.svg"

export function DefaultSettingsPasskey({
  triggerButton,
  removeButtons,
}: OrySettingsPasskeyProps) {
  const hasRemoveButtons = removeButtons.length > 0

  return (
    <div className="flex flex-col gap-8">
      <div className="flex max-w-[60%] items-end gap-3">
        {triggerButton ? (
          <DefaultButton
            node={triggerButton}
            attributes={triggerButton.attributes as UiNodeInputAttributes}
            onClick={triggerButton.onClick}
          />
        ) : null}
      </div>
      {hasRemoveButtons ? (
        <div className="flex flex-col gap-8">
          <DefaultHorizontalDivider />
          <div className="flex flex-col gap-2">
            {removeButtons.map((node, i) => {
              const context = node.meta.label?.context ?? {}
              const addedAt =
                "added_at" in context ? (context.added_at as string) : null
              const diaplyName =
                "display_name" in context
                  ? (context.display_name as string)
                  : null
              const keyId =
                "value" in node.attributes ? node.attributes.value : null

              return (
                <div
                  className="flex justify-between gap-6"
                  key={`webauthn-remove-button-${i}`}
                >
                  <Passkey size={32} className="text-dialog-fg-default" />
                  <div className="flex-1 flex-col">
                    <p className="text-sm font-medium text-dialog-fg-subtle">
                      {diaplyName}
                    </p>
                    <span className="text-sm text-dialog-fg-mute">{keyId}</span>
                  </div>
                  {addedAt && (
                    <p className="self-center text-sm text-dialog-fg-mute">
                      {new Date(addedAt).toLocaleDateString()}
                    </p>
                  )}
                  <button
                    {...(node.attributes as UiNodeInputAttributes)}
                    type="submit"
                    className="cursor-pointer text-links-link-mute-default hover:text-links-link-mute-hover"
                  >
                    <Trash size={20} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}

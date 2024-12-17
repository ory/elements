// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNodeInputAttributes } from "@ory/client-fetch"
import { OrySettingsWebauthnProps, useComponents } from "@ory/elements-react"
import Key from "../../assets/icons/key.svg"
import Trash from "../../assets/icons/trash.svg"

export function DefaultSettingsWebauthn({
  nameInput,
  triggerButton,
  removeButtons,
}: OrySettingsWebauthnProps) {
  const { Node, Card } = useComponents()
  const hasRemoveButtons = removeButtons.length > 0

  return (
    <div className="flex flex-col gap-8">
      <div className="flex max-w-[60%] items-end gap-3">
        <div className="flex-1">
          <Node.Label
            node={nameInput}
            attributes={nameInput.attributes as UiNodeInputAttributes}
          >
            <Node.Input
              node={nameInput}
              attributes={nameInput.attributes as UiNodeInputAttributes}
            />
          </Node.Label>
        </div>
        {triggerButton ? (
          <Node.Button
            node={triggerButton}
            attributes={triggerButton.attributes as UiNodeInputAttributes}
            onClick={triggerButton.onClick}
          />
        ) : null}
      </div>
      {hasRemoveButtons ? (
        <div className="flex flex-col gap-8">
          <Card.Divider />
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
                  <Key
                    size={32}
                    className="text-interface-foreground-default-primary"
                  />
                  <div className="flex-1 flex-col">
                    <p className="text-sm font-medium text-interface-foreground-default-secondary">
                      {diaplyName}
                    </p>
                    <span className="text-sm text-interface-foreground-default-tertiary">
                      {keyId}
                    </span>
                  </div>
                  {addedAt && (
                    <p className="self-center text-sm text-interface-foreground-default-tertiary">
                      {new Intl.DateTimeFormat(undefined, {
                        dateStyle: "long",
                      }).format(new Date(addedAt))}
                    </p>
                  )}
                  <button
                    {...(node.attributes as UiNodeInputAttributes)}
                    type="submit"
                  >
                    <Trash
                      className="text-button-link-default-secondary hover:text-button-link-default-secondary-hover"
                      size={24}
                    />
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

// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNodeInputAttributes } from "@ory/client-fetch"
import { OrySettingsWebauthnProps, useComponents } from "@ory/elements-react"
import Key from "../../assets/icons/key.svg"
import Trash from "../../assets/icons/trash.svg"
import { useFormContext } from "react-hook-form"
import { Spinner } from "../form/spinner"

export function DefaultSettingsWebauthn({
  nameInput,
  triggerButton,
  removeButtons,
}: OrySettingsWebauthnProps) {
  const {
    formState: { isSubmitting },
  } = useFormContext()
  const { Node, Card } = useComponents()
  const hasRemoveButtons = removeButtons.length > 0

  return (
    <div className="flex flex-col gap-8">
      <div className="flex md:max-w-96 sm:items-end gap-3 flex-col sm:flex-row">
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
          <div className="flex flex-col gap-4">
            {removeButtons.map((node, i) => {
              const context = node.meta.label?.context ?? {}
              const addedAt =
                "added_at" in context ? (context.added_at as string) : null
              const displayName =
                "display_name" in context
                  ? (context.display_name as string)
                  : null
              const keyId =
                "value" in node.attributes ? node.attributes.value : null

              return (
                <div
                  className="flex justify-between gap-6 md:items-center"
                  key={`webauthn-remove-button-${i}`}
                >
                  <div className="flex gap-2 items-center flex-1 truncate">
                    <Key
                      size={32}
                      className="text-interface-foreground-default-primary"
                    />
                    <div className="flex-1 flex-col md:flex-row md:items-center flex md:justify-between gap-4 truncate">
                      <div className="flex-1 flex-col truncate">
                        <p className="text-sm font-medium text-interface-foreground-default-secondary truncate">
                          {displayName}
                        </p>
                        <span className="text-sm text-interface-foreground-default-tertiary hidden sm:block truncate">
                          {keyId}
                        </span>
                      </div>
                      {addedAt && (
                        <p className="text-sm text-interface-foreground-default-tertiary">
                          {new Intl.DateTimeFormat(undefined, {
                            dateStyle: "long",
                          }).format(new Date(addedAt))}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    {...(node.attributes as UiNodeInputAttributes)}
                    type="submit"
                    onClick={node.onClick}
                    disabled={isSubmitting}
                    className="relative"
                  >
                    {isSubmitting ? (
                      <Spinner className="relative" />
                    ) : (
                      <Trash
                        className="text-button-link-default-secondary hover:text-button-link-default-secondary-hover"
                        size={24}
                      />
                    )}
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

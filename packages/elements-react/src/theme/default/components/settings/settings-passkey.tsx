// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNodeInputAttributes } from "@ory/client-fetch"
import { OrySettingsPasskeyProps, useComponents } from "@ory/elements-react"
import Passkey from "../../assets/icons/passkey.svg"
import Trash from "../../assets/icons/trash.svg"
import { DefaultHorizontalDivider } from "../form/horizontal-divider"
import { useFormContext } from "react-hook-form"
import { Spinner } from "../form/spinner"

export function DefaultSettingsPasskey({
  triggerButton,
  removeButtons,
}: OrySettingsPasskeyProps) {
  const {
    formState: { isSubmitting },
  } = useFormContext()
  const { Node } = useComponents()

  const hasRemoveButtons = removeButtons.length > 0

  return (
    <div className="flex flex-col gap-8">
      <div className="flex max-w-[60%] items-end gap-3">
        {triggerButton && (
          <Node.Button
            node={triggerButton}
            attributes={triggerButton.attributes as UiNodeInputAttributes}
            onClick={triggerButton.onClick}
          />
        )}
      </div>
      {hasRemoveButtons ? (
        <div className="flex flex-col gap-8">
          <DefaultHorizontalDivider />
          <div className="flex flex-col gap-2">
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
                  key={`passkey-remove-button-${i}`}
                >
                  <div className="flex flex-1 items-center gap-2 truncate">
                    <Passkey
                      size={32}
                      className="text-interface-foreground-default-primary"
                    />
                    <div className="flex flex-1 flex-col gap-4 truncate md:flex-row md:items-center md:justify-between">
                      <div className="flex-1 flex-col truncate">
                        <p className="truncate text-sm font-medium text-interface-foreground-default-secondary">
                          {displayName}
                        </p>
                        <span className="hidden truncate text-sm text-interface-foreground-default-tertiary sm:block">
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

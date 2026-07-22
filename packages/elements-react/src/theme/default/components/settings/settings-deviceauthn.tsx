// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OrySettingsDeviceauthnProps, useComponents } from "@ory/elements-react"
import { omitInputAttributes } from "../../../../util/omitAttributes"
import DeviceMobileCheck from "../../assets/icons/device-mobile-check.svg"
import Trash from "../../assets/icons/trash.svg"
import { Spinner } from "../form/spinner"

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "long",
})

export function DefaultSettingsDeviceauthn({
  removeButtons,
  isSubmitting,
}: OrySettingsDeviceauthnProps) {
  const { Card } = useComponents()
  const hasRemoveButtons = removeButtons.length > 0

  if (!hasRemoveButtons) {
    return null
  }

  return (
    <div className="flex flex-col gap-8">
      <Card.Divider />
      <div className="flex flex-col gap-4">
        {removeButtons.map((node, i) => {
          const context = node.meta.label?.context ?? {}
          const createdAt =
            "created_at" in context ? (context.created_at as string) : null
          const deviceName =
            "device_name" in context ? (context.device_name as string) : null
          const deviceType =
            "device_type" in context ? (context.device_type as string) : null
          const keyId =
            "value" in node.attributes ? node.attributes.value : null

          return (
            <div
              className="flex justify-between gap-6 md:items-center"
              key={`deviceauthn-remove-button-${keyId ?? i}`}
            >
              <div className="flex flex-1 items-center gap-2 truncate">
                <DeviceMobileCheck
                  size={32}
                  className="text-interface-foreground-default-primary"
                />
                <div className="flex flex-1 flex-col gap-4 truncate md:flex-row md:items-center md:justify-between">
                  <div className="flex-1 flex-col truncate">
                    <p className="truncate text-sm font-medium text-interface-foreground-default-secondary">
                      {deviceName ?? keyId}
                    </p>
                    <span className="hidden truncate text-sm text-interface-foreground-default-tertiary sm:block">
                      {deviceType ?? keyId}
                    </span>
                  </div>
                  {createdAt && (
                    <p className="text-sm text-interface-foreground-default-tertiary">
                      {dateFormatter.format(new Date(createdAt))}
                    </p>
                  )}
                </div>
              </div>
              <button
                {...omitInputAttributes(node.attributes)}
                type="submit"
                onClick={node.buttonProps.onClick}
                disabled={isSubmitting}
                className="relative cursor-pointer"
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
  )
}

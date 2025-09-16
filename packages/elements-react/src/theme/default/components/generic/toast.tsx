// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  messageTestId,
  OryToastProps,
  uiTextToFormattedMessage,
} from "@ory/elements-react"
import { cn } from "../../utils/cn"
import { useIntl } from "react-intl"

export function DefaultToast({
  message,
  // Id can be used to close the toast later, but we don't use it here
  id: _,
}: OryToastProps) {
  const intl = useIntl()

  const title =
    message.type === "error"
      ? intl.formatMessage({ id: "settings.messages.toast-title.error" })
      : intl.formatMessage({ id: "settings.messages.toast-title.success" })
  const messageText = uiTextToFormattedMessage(message, intl)
  return (
    <div
      className="flex-col rounded-cards border border-interface-border-default-primary bg-interface-background-default-inverted p-5"
      {...messageTestId(message)}
    >
      <p
        className={cn("font-medium", {
          "text-interface-foreground-validation-success":
            message.type === "success",
          "text-interface-foreground-validation-danger":
            message.type === "error",
          "text-interface-foreground-validation-warning":
            // Currently unused from Kratos, but kept for future use
            (message.type as "warning") === "warning",
        })}
      >
        {title}
      </p>
      <p className="text-interface-foreground-default-inverted">
        {messageText}
      </p>
    </div>
  )
}

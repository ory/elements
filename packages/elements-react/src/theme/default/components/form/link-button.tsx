// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { getNodeLabel } from "@ory/client-fetch"
import {
  OryNodeAnchorProps,
  uiTextToFormattedMessage,
} from "@ory/elements-react"
import { forwardRef } from "react"
import { useIntl } from "react-intl"
import { cn } from "../../utils/cn"

export const DefaultLinkButton = forwardRef<
  HTMLAnchorElement,
  OryNodeAnchorProps
>(({ attributes, node }, ref) => {
  const intl = useIntl()
  const label = getNodeLabel(node)
  return (
    <a
      {...attributes}
      ref={ref}
      title={label ? uiTextToFormattedMessage(label, intl) : ""}
      className={cn(
        "antialiased rounded cursor-pointer text-center border border-transparent gap-3 leading-none bg-button-primary-bg-default hover:bg-button-primary-bg-hover transition-colors text-button-primary-fg-default hover:text-button-primary-fg-hover px-4 py-4.5 text-sm font-medium",
      )}
    >
      {label ? uiTextToFormattedMessage(label, intl) : ""}
    </a>
  )
})

DefaultLinkButton.displayName = "DefaultLinkButton"
